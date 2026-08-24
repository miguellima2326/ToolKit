import type { MetadataRoute } from 'next';
import { prisma } from '@toolkit/database';
import { SITE_URL } from '@/lib/api';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/apps', '/drivers', '/collections', '/docs', '/security', '/privacy', '/terms'].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: path === '' ? 1 : 0.7
    })
  );

  try {
    const [apps, collections, drivers] = await Promise.all([
      prisma.app.findMany({ where: { status: 'verified' }, select: { slug: true, updatedAt: true } }),
      prisma.collection.findMany({ where: { kind: 'profile' }, select: { slug: true } }),
      prisma.driver.findMany({ select: { slug: true } })
    ]);
    return [
      ...staticRoutes,
      ...apps.map((a) => ({ url: `${SITE_URL}/apps/${a.slug}`, lastModified: a.updatedAt, changeFrequency: 'weekly' as const, priority: 0.8 })),
      ...collections.map((c) => ({ url: `${SITE_URL}/collections/${c.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
      ...drivers.map((d) => ({ url: `${SITE_URL}/drivers#${d.slug}`, changeFrequency: 'monthly' as const, priority: 0.5 }))
    ];
  } catch {
    return staticRoutes;
  }
}
