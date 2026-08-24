import type { FastifyInstance } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { createRepo } from '../repo.js';
import { toDetail, toSummary } from '../mapping.js';

export function registerAppRoutes(app: FastifyInstance, { prisma }: { prisma: PrismaClient }) {
  const repo = createRepo({ prisma });

  app.get<{ Querystring: Record<string, string> }>('/apps', async (req) => {
    const q = req.query;
    const result = await repo.listApps({
      q: q.q,
      category: q.category,
      os: q.os,
      arch: q.arch,
      license: q.license,
      method: q.method,
      sort: q.sort,
      page: q.page ? Number(q.page) : undefined,
      limit: q.limit ? Number(q.limit) : undefined
    });
    return { data: result.apps, meta: { total: result.total, page: result.page, limit: result.limit } };
  });

  app.get<{ Params: { slug: string } }>('/apps/:slug', async (req, reply) => {
    const found = await repo.getAppBySlug(req.params.slug);
    if (!found) return reply.code(404).send({ error: 'not_found' });
    const altSlugs = found.alternatives ?? [];
    const alternatives = (await repo.getAppsBySlugs(altSlugs)).map(toSummary);
    return { data: toDetail(found, alternatives) };
  });
}
