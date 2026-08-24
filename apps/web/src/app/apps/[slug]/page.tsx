import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  LICENSE_LABELS,
  OS_LABELS,
  timeAgoLabel,
  type AppDetail
} from '@toolkit/shared';
import { getAppDetail } from '@/lib/catalog-server';
import { SITE_URL } from '@/lib/api';
import { AppIcon } from '@/components/app-icon';
import { AddButton, FavoriteButton } from '@/components/app-card';
import { InstallMethods } from '@/components/install-methods';

export const revalidate = 300;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = await getAppDetail(slug);
  if (!app) return { title: 'Aplicativo não encontrado' };
  return {
    title: `${app.name} — instalar com winget, brew ou flatpak`,
    description: app.tagline,
    alternates: { canonical: `/apps/${app.slug}` },
    openGraph: {
      title: `${app.name} · Toolkit`,
      description: app.tagline,
      url: `${SITE_URL}/apps/${app.slug}`
    }
  };
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = (await getAppDetail(slug)) as AppDetail | null;
  if (!app) notFound();

  const verifiedCount = app.installMethods.filter((m) => m.source === 'official').length;
  const lastChecked = app.installMethods
    .map((m) => m.lastCheckedAt)
    .filter((x): x is string => !!x)
    .sort()
    .at(-1);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    applicationCategory: app.category,
    operatingSystem: app.operatingSystems.map((o) => OS_LABELS[o]).join(', '),
    author: { '@type': 'Organization', name: app.developer },
    offers: { '@type': 'Offer', price: '0' },
    url: `${SITE_URL}/apps/${app.slug}`
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Trilha" className="mb-6 text-xs text-muted">
        <Link href="/apps" className="hover:text-fg">
          Apps
        </Link>
        <span className="mx-1.5">/</span>
        <Link href={`/apps?category=${app.categorySlug}`} className="hover:text-fg">
          {app.category}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-fg">{app.name}</span>
      </nav>

      <header className="flex flex-wrap items-start gap-4">
        <AppIcon slug={app.iconKey} name={app.name} color={app.color} size={64} hasLocalIcon={app.hasLocalIcon} />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{app.name}</h1>
          <p className="mt-0.5 text-sm text-muted">
            {app.developer} · {LICENSE_LABELS[app.license]} ·{' '}
            {app.operatingSystems.map((o) => OS_LABELS[o]).join(' • ')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton slug={app.slug} />
          <AddButton app={app} />
        </div>
      </header>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        {verifiedCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full border border-success/50 bg-success/10 px-2 py-0.5 text-success">
            ✓ Fonte oficial verificada
          </span>
        )}
        {lastChecked && <span>Pacotes verificados {timeAgoLabel(lastChecked)}</span>}
        <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          Site oficial ↗
        </a>
      </div>

      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-fg/90">{app.description}</p>

      {app.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {app.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted">
              {tag}
            </span>
          ))}
        </div>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Como instalar</h2>
        <InstallMethods methods={app.installMethods} />
      </section>

      {(app.alternatives ?? []).length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold tracking-tight">Alternativas</h2>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {(app.alternatives ?? []).map((alt) => (
              <Link
                key={alt.slug}
                href={`/apps/${alt.slug}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary"
              >
                <AppIcon slug={alt.iconKey} name={alt.name} color={alt.color} size={32} />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{alt.name}</p>
                  <p className="truncate text-xs text-muted">{alt.developer}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 rounded-xl border border-border bg-bg-subtle/60 p-4 text-xs leading-relaxed text-muted">
        <strong className="text-fg">Transparência:</strong> os comandos acima são gerados a partir de IDs de
        pacote registrados e validados no catálogo do Toolkit. O Toolkit não hospeda binários de terceiros.
        Consulte nossa{' '}
        <Link href="/security" className="text-primary hover:underline">
          página de segurança
        </Link>
        .
      </section>
    </div>
  );
}
