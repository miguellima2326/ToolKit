import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCategoriesWithCounts, listAppsFiltered } from '@/lib/catalog-server';
import { Explorer, type Filters } from './explorer';

export const metadata: Metadata = {
  title: 'Explorar aplicativos',
  description: 'Catálogo de apps para Windows, Linux e macOS com filtros por categoria, licença e método de instalação.'
};

export const dynamic = 'force-dynamic';

export default async function AppsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const pick = (key: string) => (typeof sp[key] === 'string' ? (sp[key] as string) : undefined);
  const filters: Filters = {
    q: pick('q') ?? '',
    category: pick('category'),
    os: pick('os'),
    arch: pick('arch'),
    license: pick('license'),
    method: pick('method'),
    sort: pick('sort') ?? 'popular'
  };

  const [initial, categories] = await Promise.all([
    listAppsFiltered(filters),
    getCategoriesWithCounts()
  ]);

  return (
    <Suspense>
      <Explorer initial={initial} initialFilters={filters} categories={categories} />
    </Suspense>
  );
}
