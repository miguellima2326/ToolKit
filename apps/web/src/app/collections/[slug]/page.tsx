import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollection, getCollectionSummaries } from '@/lib/catalog-server';
import { AppCard } from '@/components/app-card';
import { SelectAllButton } from './select-all';

export const revalidate = 300;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return { title: 'Coleção não encontrada' };
  return { title: collection.name, description: collection.description };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav aria-label="Trilha" className="mb-6 text-xs text-muted">
        <Link href="/collections" className="hover:text-fg">
          Coleções
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-fg">{collection.name}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{collection.name}</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">{collection.description}</p>
        </div>
        <SelectAllButton
          items={collection.apps.map((a) => ({
            slug: a.slug,
            name: a.name,
            iconKey: a.iconKey,
            color: a.color
          }))}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {collection.apps.map((app) => (
          <AppCard key={app.slug} app={app} />
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const collections = await getCollectionSummaries();
  return collections.map((c) => ({ slug: c.slug }));
}
