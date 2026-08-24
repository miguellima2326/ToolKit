import type { FastifyInstance } from 'fastify';
import type { PrismaClient } from '@prisma/client';

export function registerHealthRoutes(app: FastifyInstance, deps: { prisma: PrismaClient; redis?: { ping(): Promise<string> } | null }) {
  app.get('/health', async () => ({ status: 'ok', uptime: Math.round(process.uptime()) }));

  app.get('/health/detailed', async (_, reply) => {
    const components: Record<string, string> = {};

    try {
      await deps.prisma.$queryRaw`SELECT 1`;
      components.database = 'up';
    } catch {
      components.database = 'down';
    }

    if (deps.redis) {
      try {
        await deps.redis.ping();
        components.redis = 'up';
      } catch {
        components.redis = 'degraded';
      }
    } else {
      components.redis = 'disabled';
    }

    components.search = components.database === 'up' ? 'up' : 'down';
    components.workers = 'planned_phase_2';

    const healthy = components.database === 'up';
    return reply.code(healthy ? 200 : 503).send({
      status: healthy ? 'ok' : 'degraded',
      components,
      version: process.env.npm_package_version ?? '0.1.0',
      timestamp: new Date().toISOString()
    });
  });
}
