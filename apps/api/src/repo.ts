import { Prisma, type App, type AppPackage, type Category, type Vendor } from '@prisma/client';
import type { PrismaClient } from '@prisma/client';
import type { GeneratorApp } from '@toolkit/install-generator';

import { toSummary } from './mapping.js';

type AppWithRelations = App & { vendor: Vendor; category: Category; packages: AppPackage[] };

type RepoDeps = { prisma: PrismaClient };

export function toGeneratorApp(app: AppWithRelations): GeneratorApp {
  return {
    slug: app.slug,
    name: app.name,
    tagline: app.tagline,
    websiteUrl: app.websiteUrl,
    oss: app.oss,
    status: app.status,
    packages: app.packages.map((p) => ({
      method: p.method,
      os: p.os,
      packageId: p.packageId,
      repository: p.repository,
      source: p.source,
      status: p.status,
      notes: p.notes,
      classic: p.classic,
      downloadUrl: p.downloadUrl
    }))
  };
}

const includeAll = { vendor: true, category: true, packages: true };

export function createRepo({ prisma }: RepoDeps) {
  return {
    async listApps(params: {
      q?: string;
      category?: string;
      os?: string;
      arch?: string;
      license?: string;
      method?: string;
      sort?: string;
      page?: number;
      limit?: number;
    }) {
      const where: Record<string, unknown> = { status: { not: 'blocked' } };
      if (params.category) where.category = { slug: params.category };
      if (params.os) where.oss = { has: params.os as never };
      if (params.arch) where.archs = { has: params.arch as never };
      if (params.license) where.license = params.license;
      if (params.method)
        where.packages = {
          some: { method: params.method, status: 'verified', os: params.os ?? undefined }
        };
      if (params.q) {
        const q = params.q.trim();
        where.OR = [{ name: { contains: q, mode: 'insensitive' } }, { tags: { has: q.toLowerCase() } }, { vendor: { name: { contains: q, mode: 'insensitive' } } }];
      }

      const orderBy =
        params.sort === 'recent'
          ? { updatedAt: 'desc' as const }
          : params.sort === 'name'
            ? { name: 'asc' as const }
            : { popularity: 'desc' as const };

      const page = Math.max(1, params.page ?? 1);
      const limit = Math.min(48, Math.max(1, params.limit ?? 24));

      const [total, rows] = await Promise.all([
        prisma.app.count({ where }),
        prisma.app.findMany({
          where,
          include: includeAll,
          orderBy,
          skip: (page - 1) * limit,
          take: limit
        })
      ]);
      return { total, page, limit, apps: rows.map(toSummary) };
    },

    async getAppBySlug(slug: string) {
      return prisma.app.findFirst({
        where: { slug, status: { not: 'blocked' } },
        include: { ...includeAll, packages: { orderBy: [{ os: 'asc' }, { method: 'asc' }] } }
      }) as Promise<AppWithRelations | null>;
    },

    async getAppsBySlugs(slugs: string[]) {
      const rows = await prisma.app.findMany({
        where: { slug: { in: slugs } },
        include: includeAll
      });
      const bySlug = new Map(rows.map((r) => [r.slug, r]));
      return slugs.map((s) => bySlug.get(s)).filter((x): x is AppWithRelations => !!x);
    },

    async listCategories() {
      const rows = await prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
        include: { _count: { select: { apps: true } } }
      });
      return rows.map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description ?? undefined,
        appCount: c._count.apps
      }));
    },

    async listCollections() {
      return prisma.collection.findMany({
        where: { kind: 'profile' },
        orderBy: { name: 'asc' },
        include: { _count: { select: { items: true } } }
      });
    },

    async getCollectionBySlug(slug: string) {
      return prisma.collection.findUnique({
        where: { slug },
        include: { items: { include: { app: { include: includeAll } }, orderBy: { position: 'asc' } } }
      });
    },

    async searchAll(rawQuery: string) {
      const q = rawQuery.trim();
      if (q.length < 2) return { apps: [], categories: [], collections: [], didYouMean: [] };

      const like = `%${q.replace(/[%_]/g, '')}%`;
      const apps = await prisma.$queryRaw<App[]>(
        Prisma.sql`SELECT * FROM "App"
        WHERE status <> 'blocked'
          AND ("name" ILIKE ${like}
            OR EXISTS (SELECT 1 FROM unnest("tags") t WHERE t ILIKE ${like})
            OR similarity("name", ${q}) > 0.18
            OR "vendorId" IN (SELECT id FROM "Vendor" WHERE name ILIKE ${like}))
        ORDER BY GREATEST(similarity("name", ${q}), similarity(array_to_string("tags", ' '), ${q})) DESC, "popularity" DESC
        LIMIT 20`
      );

      let didYouMean: App[] = [];
      if (apps.length === 0) {
        didYouMean = await prisma.$queryRaw<App[]>(
          Prisma.sql`SELECT * FROM "App"
          WHERE status <> 'blocked' AND word_similarity(${q}, "name") > 0.35
          ORDER BY similarity("name", ${q}) DESC LIMIT 3`
        );
      }

      const categories = await prisma.category.findMany({
        where: { OR: [{ name: { contains: q, mode: 'insensitive' } }, { slug: { contains: q.toLowerCase() } }] },
        take: 5
      });
      const collections = await prisma.collection.findMany({
        where: { kind: 'profile', OR: [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] },
        take: 4
      });

      const full = await prisma.app.findMany({
        where: { id: { in: [...apps, ...didYouMean].map((a) => a.id) } },
        include: includeAll
      });
      const fullById = new Map(full.map((f) => [f.id, f]));
      const hydrate = (list: App[]) =>
        list.map((a) => fullById.get(a.id)).filter((x): x is AppWithRelations => !!x).map(toSummary);

      return {
        query: q,
        apps: hydrate(apps),
        categories: categories.map((c) => ({ slug: c.slug, name: c.name })),
        collections: collections.map((c) => ({ slug: c.slug, name: c.name })),
        didYouMean: apps.length === 0 ? hydrate(didYouMean) : []
      };
    },

    async stats() {
      const [apps, drivers, sharedKits, categories, stat] = await Promise.all([
        prisma.app.count({ where: { status: { not: 'blocked' } } }),
        prisma.driver.count(),
        prisma.sharedToolkit.count(),
        prisma.category.count(),
        prisma.scriptStat.findUnique({ where: { id: 'global' } })
      ]);
      return {
        apps,
        drivers,
        sharedKits,
        scriptsGenerated: stat?.total ?? 0,
        categories
      };
    },

    async incrementScriptsGenerated() {
      await prisma.scriptStat.upsert({
        where: { id: 'global' },
        update: { total: { increment: 1 } },
        create: { id: 'global', total: 1 }
      });
    },

    async popularApps(limit = 8) {
      const rows = await prisma.app.findMany({
        where: { status: 'verified' },
        include: includeAll,
        orderBy: { popularity: 'desc' },
        take: limit
      });
      return rows.map(toSummary);
    },

    async recentApps(limit = 4) {
      const rows = await prisma.app.findMany({
        where: { status: { not: 'blocked' } },
        include: includeAll,
        orderBy: { updatedAt: 'desc' },
        take: limit
      });
      return rows.map(toSummary);
    },

    async listDrivers() {
      return prisma.driver.findMany({
        where: { status: { not: 'blocked' } },
        include: { vendor: true },
        orderBy: { name: 'asc' }
      });
    },

    async listHardwareVendors() {
      return prisma.hardwareVendor.findMany({ orderBy: { sortOrder: 'asc' } });
    },

    async audit(actor: string, action: string, target: string, metadata?: Record<string, unknown>) {
      await prisma.auditLog.create({ data: { actor, action, target, metadata: metadata as never } });
    }
  };
}

export type Repo = ReturnType<typeof createRepo>;
