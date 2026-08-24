import type { FastifyInstance } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { suggestionCreateSchema } from '@toolkit/shared';

export function registerSuggestionRoutes(app: FastifyInstance, { prisma }: { prisma: PrismaClient }) {
  app.post<{ Body: unknown }>(
    '/suggestions',
    { config: { rateLimit: { max: 5, timeWindow: '1 hour' } } },
    async (req, reply) => {
      const parsed = suggestionCreateSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'invalid_input', details: parsed.error.flatten() });
      }
      const d = parsed.data;
      await prisma.contribution.create({
        data: {
          name: d.name,
          websiteUrl: d.websiteUrl,
          categorySlug: d.categorySlug ?? null,
          operatingSystems: d.operatingSystems,
          wingetId: d.wingetId ?? null,
          brewId: d.brewId ?? null,
          flatpakId: d.flatpakId ?? null,
          notes: d.notes ?? null,
          contact: d.contact ?? null
        }
      });
      return reply.code(201).send({ ok: true, message: 'Recebido! Nossa curadoria vai revisar sua sugestão.' });
    }
  );
}
