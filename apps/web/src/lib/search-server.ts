import { prisma, Prisma } from '@toolkit/database';
import type { AppSummary } from '@toolkit/shared';
import { toSummary } from './serialize';

export interface SearchAllResult {
  query: string;
  apps: AppSummary[];
  categories: { slug: string; name: string }[];
  collections: { slug: string; name: string }[];
  didYouMean?: AppSummary[];
}

async function hydrate(ids: string[]): Promise<AppSummary[]> {
  if (ids.length === 0) return [];
  const rows = await prisma.app.findMany({
    where: { id: { in: ids } },
    include: { vendor: true, category: true }
  });
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids
    .map((id) => byId.get(id))
    .filter((r): r is NonNullable<typeof r> => !!r)
    .map((r) => toSummary(r));
}

export async function searchAll(rawQuery: string): Promise<SearchAllResult> {
  const q = rawQuery.trim();
  if (q.length < 2) return { query: q, apps: [], categories: [], collections: [] };

  const like = `%${q.replace(/[%_]/g, '')}%`;

  let ids: string[];
  try {
    const rows = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT "id" FROM "App"
      WHERE status <> 'blocked'
        AND ("name" ILIKE ${like}
          OR EXISTS (SELECT 1 FROM unnest("tags") t WHERE t ILIKE ${like})
          OR similarity("name", ${q}) > 0.18
          OR "vendorId" IN (SELECT id FROM "Vendor" WHERE name ILIKE ${like}))
      ORDER BY GREATEST(similarity("name", ${q}), similarity(array_to_string("tags", ' '), ${q})) DESC, "popularity" DESC
      LIMIT 20`);
    ids = rows.map((r) => r.id);
  } catch {
    // Fallback sem pg_trgm (extensão ausente): mantém a busca funcional
    const rows = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT "id" FROM "App"
      WHERE status <> 'blocked'
        AND ("name" ILIKE ${like}
          OR EXISTS (SELECT 1 FROM unnest("tags") t WHERE t ILIKE ${like})
          OR "vendorId" IN (SELECT id FROM "Vendor" WHERE name ILIKE ${like}))
      ORDER BY "popularity" DESC
      LIMIT 20`);
    ids = rows.map((r) => r.id);
  }

  const apps = await hydrate(ids);

  let didYouMean: AppSummary[] | undefined;
  if (apps.length === 0) {
    try {
      const rows = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
        SELECT "id" FROM "App"
        WHERE status <> 'blocked' AND word_similarity(${q}, "name") > 0.35
        ORDER BY similarity("name", ${q}) DESC
        LIMIT 3`);
      didYouMean = await hydrate(rows.map((r) => r.id));
    } catch {
      didYouMean = undefined;
    }
  }

  const [categories, collections] = await Promise.all([
    prisma.category.findMany({
      where: {
        OR: [{ name: { contains: q, mode: 'insensitive' } }, { slug: { contains: q.toLowerCase() } }]
      },
      take: 5,
      select: { slug: true, name: true }
    }),
    prisma.collection.findMany({
      where: {
        kind: 'profile',
        OR: [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }]
      },
      take: 5,
      select: { slug: true, name: true }
    })
  ]);

  return { query: q, apps, categories, collections, didYouMean };
}
