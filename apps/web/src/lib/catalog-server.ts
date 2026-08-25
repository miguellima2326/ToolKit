import { prisma } from '@toolkit/database';
import { toSummary } from './serialize';

export async function getStats() {
  const [apps, drivers, sharedKits, categories, stat] = await Promise.all([
    prisma.app.count({ where: { status: { not: 'blocked' } } }),
    prisma.driver.count(),
    prisma.sharedToolkit.count(),
    prisma.category.count(),
    prisma.scriptStat.findUnique({ where: { id: 'global' } })
  ]);
  return { apps, drivers, sharedKits, categories, scriptsGenerated: stat?.total ?? 0 };
}

export const APPS_PAGE_SIZE = 24;

export async function listAppsFiltered(params: {
  q?: string;
  category?: string;
  os?: string;
  arch?: string;
  license?: string;
  method?: string;
  sort?: string;
  page?: number;
}): Promise<{ apps: ReturnType<typeof toSummary>[]; total: number }> {
  const where: Record<string, unknown> = { status: { not: 'blocked' } };
  if (params.category) where.category = { slug: params.category };
  if (params.os) where.oss = { has: params.os as never };
  if (params.arch) where.archs = { has: params.arch as never };
  if (params.license) where.license = params.license;
  if (params.method) {
    where.packages = {
      some: { method: params.method, status: 'verified', os: params.os ?? undefined }
    };
  }
  if (params.q) {
    const q = params.q.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { tags: { has: q.toLowerCase() } },
      { vendor: { name: { contains: q, mode: 'insensitive' } } }
    ];
  }
  const orderBy =
    params.sort === 'recent'
      ? { updatedAt: 'desc' as const }
      : params.sort === 'name'
        ? { name: 'asc' as const }
        : { popularity: 'desc' as const };

  const page = Math.max(1, params.page ?? 1);
  const [total, rows] = await Promise.all([
    prisma.app.count({ where }),
    prisma.app.findMany({
      where,
      include: { vendor: true, category: true },
      orderBy,
      skip: (page - 1) * APPS_PAGE_SIZE,
      take: APPS_PAGE_SIZE
    })
  ]);
  return { total, apps: rows.map(toSummary) };
}

export async function getCategoriesWithCounts() {
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
}

export async function getPopularApps(limit = 8) {
  const rows = await prisma.app.findMany({
    where: { status: { not: 'blocked' } },
    include: { vendor: true, category: true },
    orderBy: { popularity: 'desc' },
    take: limit
  });
  return rows.map(toSummary);
}

export async function getRecentApps(limit = 6) {
  const rows = await prisma.app.findMany({
    where: { status: 'verified' },
    include: { vendor: true, category: true },
    orderBy: { updatedAt: 'desc' },
    take: limit
  });
  return rows.map(toSummary);
}

export async function getCollectionSummaries() {
  const rows = await prisma.collection.findMany({
    where: { kind: 'profile' },
    orderBy: { name: 'asc' },
    include: {
      items: { take: 5, orderBy: { position: 'asc' }, include: { app: { include: { vendor: true, category: true } } } },
      _count: { select: { items: true } }
    }
  });
  return rows.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    itemCount: c._count.items,
    preview: c.items.map((i) => toSummary(i.app))
  }));
}

export async function getCollection(slug: string) {
  const c = await prisma.collection.findUnique({
    where: { slug },
    include: { items: { orderBy: { position: 'asc' }, include: { app: { include: { vendor: true, category: true } } } } }
  });
  if (!c) return null;
  return {
    slug: c.slug,
    name: c.name,
    description: c.description,
    apps: c.items.map((i) => toSummary(i.app))
  };
}

export async function getAppDetail(slug: string) {
  const app = await prisma.app.findFirst({
    where: { slug, status: { not: 'blocked' } },
    include: { vendor: true, category: true, packages: { orderBy: [{ os: 'asc' }, { method: 'asc' }] } }
  });
  if (!app) return null;
  let alternatives = [] as ReturnType<typeof toSummary>[];
  if (app.alternatives.length > 0) {
    const altRows = await prisma.app.findMany({
      where: { slug: { in: app.alternatives }, status: { not: 'blocked' } },
      include: { vendor: true, category: true }
    });
    alternatives = altRows.sort(
      (a, b) => app.alternatives.indexOf(a.slug) - app.alternatives.indexOf(b.slug)
    ).map(toSummary);
  }
  const detail = {
    ...toSummary(app),
    description: app.description,
    websiteUrl: app.websiteUrl,
    version: app.version,
    tags: app.tags,
    updatedAt: app.updatedAt.toISOString(),
    verifiedAt: app.verifiedAt?.toISOString() ?? null,
    architectures: app.archs as string[],
    installMethods: app.packages.map((p) => ({
      method: p.method,
      packageId: p.packageId ?? undefined,
      repository: p.repository ?? undefined,
      source: p.source,
      status: p.status,
      url: p.downloadUrl ?? undefined,
      notes: p.notes ?? undefined,
      classic: p.classic || undefined,
      lastCheckedAt: p.lastCheckedAt?.toISOString()
    })),
    alternatives
  };
  return detail;
}

export async function getSharedKit(code: string) {
  const kit = await prisma.sharedToolkit.findUnique({ where: { code: code.toLowerCase() } });
  if (!kit) return null;
  void prisma.sharedToolkit.update({ where: { id: kit.id }, data: { views: { increment: 1 } } }).catch(() => undefined);
  const apps = await prisma.app.findMany({
    where: { slug: { in: kit.slugs }, status: { not: 'blocked' } },
    include: { vendor: true, category: true }
  });
  const bySlug = new Map(apps.map((a) => [a.slug, a]));
  return {
    code: kit.code,
    title: kit.title,
    createdAt: kit.createdAt.toISOString(),
    apps: kit.slugs.map((s) => bySlug.get(s)).filter((x): x is NonNullable<typeof x> => !!x).map(toSummary)
  };
}

export async function listDrivers() {
  const [drivers, hardwareVendors] = await Promise.all([
    prisma.driver.findMany({
      where: { status: { not: 'blocked' } },
      include: { vendor: true },
      orderBy: { name: 'asc' }
    }),
    prisma.hardwareVendor.findMany({ orderBy: { sortOrder: 'asc' } })
  ]);
  return {
    drivers: drivers.map((d) => ({
      slug: d.slug,
      name: d.name,
      vendor: d.vendor.name,
      tagline: d.tagline,
      instructions: d.instructions,
      downloadUrl: d.downloadUrl,
      categories: d.categories,
      oss: d.oss as string[],
      updatedAt: d.updatedAt.toISOString()
    })),
    hardwareVendors: hardwareVendors.map((h) => ({ slug: h.slug, name: h.name, supportUrl: h.supportUrl, kind: h.kind }))
  };
}

export async function getDriver(slug: string) {
  const d = await prisma.driver.findFirst({
    where: { slug, status: { not: 'blocked' } },
    include: { vendor: true }
  });
  if (!d) return null;
  return {
    slug: d.slug,
    name: d.name,
    vendor: d.vendor.name,
    tagline: d.tagline,
    instructions: d.instructions,
    downloadUrl: d.downloadUrl,
    categories: d.categories,
    oss: d.oss as string[],
    updatedAt: d.updatedAt.toISOString()
  };
}
