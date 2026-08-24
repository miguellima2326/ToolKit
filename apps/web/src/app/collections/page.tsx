import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollectionSummaries } from '@/lib/catalog-server';

export const metadata: Metadata = {
  title: 'Coleções e perfis prontos',
  description: 'PC Essencial, Dev Web, Gaming, SysAdmin: kits prontos para configurar qualquer máquina em minutos.'
};

export const revalidate = 300;

export default async function CollectionsPage() {
  const collections = await getCollectionSummaries();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Kits recomendados</h1>
      <p className="mt-1 max-w-xl text-sm text-muted">
        Perfis prontos para os cenários mais comuns. Selecione tudo ou personalize antes de gerar a instalação.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <Link
            key={col.slug}
            href={`/collections/${col.slug}`}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold">{col.name}</h2>
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted">
                {col.itemCount} apps
              </span>
            </div>
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">{col.description}</p>
            <div className="mt-4 flex -space-x-1.5">
              {col.preview.map((a) => (
                <span
                  key={a.slug}
                  title={a.name}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card text-[11px] font-bold"
                  style={{ background: `${a.color}26`, color: a.color }}
                >
                  {a.name.charAt(0)}
                </span>
              ))}
            </div>
            <span className="mt-3 inline-block text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Abrir kit →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
