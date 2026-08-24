import type { FastifyInstance } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { createToolkitSchema } from '@toolkit/shared';
import { createRepo } from '../repo.js';

export function registerToolkitRoutes(app: FastifyInstance, { prisma }: { prisma: PrismaClient }) {
  const repo = createRepo({ prisma });
  const CODE_ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';

  app.post<{ Body: unknown }>(
    '/toolkits',
    { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } },
    async (req, reply) => {
      const parsed = createToolkitSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'invalid_input', details: parsed.error.flatten() });
      }
      const code = nanoid(8).replace(/[^a-z0-9]/g, () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)] ?? 't').padEnd(8, 't');
      const created = await prisma.sharedToolkit.create({
        data: { code, title: parsed.data.title ?? null, slugs: parsed.data.slugs }
      });
      await repo.audit('anonymous', 'toolkit.shared', code, { apps: parsed.data.slugs.length });
      return reply.code(201).send({ data: { code: created.code, createdAt: created.createdAt.toISOString() } });
    }
  );

  app.get<{ Params: { code: string } }>('/toolkits/:code', async (req, reply) => {
    const code = req.params.code.toLowerCase();
    const kit = await prisma.sharedToolkit.findUnique({ where: { code } });
    if (!kit) return reply.code(404).send({ error: 'not_found' });

    void prisma.sharedToolkit
      .update({ where: { id: kit.id }, data: { views: { increment: 1 } } })
      .catch(() => undefined);

    const apps = await repo.getAppsBySlugs(kit.slugs);
    return {
      data: {
        code: kit.code,
        title: kit.title,
        createdAt: kit.createdAt.toISOString(),
        apps: apps.map((a) => ({
          slug: a.slug,
          name: a.name,
          developer: a.vendor.name,
          tagline: a.tagline,
          category: a.category.slug,
          categorySlug: a.category.slug,
          license: a.license,
          operatingSystems: a.oss,
          iconKey: a.iconKey,
          color: a.color,
          popularity: a.popularity,
          status: a.status
        }))
      }
    };
  });
}
