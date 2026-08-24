import type { FastifyInstance } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { buildInstallScript } from '@toolkit/install-generator';
import { installScriptRequestSchema } from '@toolkit/shared';
import { createRepo, toGeneratorApp } from '../repo.js';

export function registerInstallScriptRoutes(app: FastifyInstance, { prisma }: { prisma: PrismaClient }) {
  const repo = createRepo({ prisma });

  app.post<{ Body: unknown }>(
    '/install-script',
    {
      config: { rateLimit: { max: 30, timeWindow: '1 minute' } }
    },
    async (req, reply) => {
      const parsed = installScriptRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'invalid_input', details: parsed.error.flatten() });
      }
      const { slugs, os, distro, format } = parsed.data;

      const rows = await repo.getAppsBySlugs(slugs);
      if (rows.length === 0) return reply.code(404).send({ error: 'apps_not_found' });

      const generatorApps = rows.map(toGeneratorApp);
      const result = buildInstallScript(generatorApps, { os, distro: os === 'linux' ? (distro ?? null) : null }, format);

      await Promise.all([
        repo.incrementScriptsGenerated(),
        repo.audit('anonymous', 'install_script.generated', `${os}${distro ? `:${distro}` : ''}`, {
          apps: slugs.length,
          auto: result.autoCount
        })
      ]);

      return reply.send({ data: result });
    }
  );
}
