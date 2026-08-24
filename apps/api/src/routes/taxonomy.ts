import type { FastifyInstance } from 'fastify';
import { createRepo } from '../repo.js';
import type { PrismaClient } from '@prisma/client';

export function registerTaxonomyRoutes(app: FastifyInstance, { prisma }: { prisma: PrismaClient }) {
  const repo = createRepo({ prisma });

  app.get('/categories', async () => ({ data: await repo.listCategories() }));

  app.get('/collections', async () => {
    const rows = await repo.listCollections();
    return {
      data: rows.map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description,
        itemCount: c._count.items
      }))
    };
  });

  app.get<{ Params: { slug: string } }>('/collections/:slug', async (req, reply) => {
    const collection = await repo.getCollectionBySlug(req.params.slug);
    if (!collection) return reply.code(404).send({ error: 'not_found' });
    const apps = collection.items.map((i) => i.app).map((a) => a);
    return {
      data: {
        slug: collection.slug,
        name: collection.name,
        description: collection.description,
        kind: collection.kind,
        items: apps.map((a) => ({ slug: a.slug, name: a.name }))
      }
    };
  });

  app.get('/drivers', async () => {
    const [drivers, hardwareVendors] = await Promise.all([repo.listDrivers(), repo.listHardwareVendors()]);
    return {
      data: drivers.map((d) => ({
        slug: d.slug,
        name: d.name,
        vendor: d.vendor.name,
        tagline: d.tagline,
        instructions: d.instructions,
        downloadUrl: d.downloadUrl,
        categories: d.categories,
        oss: d.oss,
        status: d.status,
        updatedAt: d.updatedAt.toISOString()
      })),
      hardwareVendors: hardwareVendors.map((h) => ({
        slug: h.slug,
        name: h.name,
        supportUrl: h.supportUrl,
        kind: h.kind
      }))
    };
  });

  app.get('/stats', async () => repo.stats());
}
