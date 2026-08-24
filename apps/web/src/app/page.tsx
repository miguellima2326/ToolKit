import Link from 'next/link';
import { ArrowRight, PackageCheck, Shield, Sparkles, Zap } from 'lucide-react';
import type { CategoryDto } from '@toolkit/shared';
import { getCategoriesWithCounts, getCollectionSummaries, getPopularApps, getRecentApps, getStats } from '@/lib/catalog-server';
import { AppCard } from '@/components/app-card';
import { HeroSearch } from './hero-search';

export const revalidate = 60;

export default async function HomePage() {
  const [stats, categories, popular, recent, collections] = await Promise.all([
    getStats(),
    getCategoriesWithCounts(),
    getPopularApps(8),
    getRecentApps(4),
    getCollectionSummaries()
  ]);

  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-24">
          <p className="fade-up mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted">
            <Sparkles className="h-3 w-3 text-primary" />
            Windows · Linux · macOS
          </p>
          <h1 className="fade-up mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Tudo que seu computador precisa.{' '}
            <span className="text-primary">Em um só lugar.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-muted">
            Encontre aplicativos, drivers e ferramentas para Windows, Linux e macOS.
            Monte seu pacote e instale tudo de uma vez.
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <HeroSearch />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/apps"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg transition-opacity hover:opacity-90"
            >
              Explorar aplicativos <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/generate"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-semibold transition-colors hover:border-primary"
            >
              Montar meu Toolkit
            </Link>
          </div>

          <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-y-6 sm:grid-cols-4">
            <Stat value={stats.apps} label="apps disponíveis" />
            <Stat value={stats.drivers} label="drivers catalogados" />
            <Stat value={stats.categories} label="categorias" />
            <Stat value={stats.scriptsGenerated} label="instalações geradas" />
          </dl>
        </div>
      </section>

      <Section title="Categorias" href="/apps">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <CategoryTile key={c.slug} category={c} />
          ))}
        </div>
      </Section>

      <Section title="Populares agora" href="/apps?sort=popular">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </div>
      </Section>

      <section className="border-y border-border bg-bg-subtle/50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Kits recomendados</h2>
            <Link href="/collections" className="text-sm text-muted hover:text-fg">
              Ver todas →
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {collections.slice(0, 8).map((col) => (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
              >
                <h3 className="text-[15px] font-semibold">{col.name}</h3>
                <p className="mt-1 line-clamp-1 text-xs text-muted">{col.description}</p>
                <div className="mt-3 flex -space-x-1.5">
                  {col.preview.map((a) => (
                    <span
                      key={a.slug}
                      title={a.name}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-card text-[10px] font-bold"
                      style={{ background: `${a.color}26`, color: a.color }}
                    >
                      {a.name.charAt(0)}
                    </span>
                  ))}
                  <span className="ml-4 self-center text-[11px] text-muted group-hover:text-primary">
                    {col.itemCount} apps
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Section title="Atualizados recentemente" href="/apps?sort=recent">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-4">
        <div className="grid gap-3 md:grid-cols-3">
          <FeatureCard
            icon={<Zap className="h-4 w-4" />}
            title="Instale tudo de uma vez"
            text="Gere um script comentado com winget, apt, dnf, pacman, flatpak ou Homebrew — direto do catálogo validado."
          />
          <FeatureCard
            icon={<Shield className="h-4 w-4" />}
            title="Segurança por padrão"
            text="Somente IDs de pacotes oficiais e links de fabricantes. Você vê exatamente o que o script executa antes de rodar."
          />
          <FeatureCard
            icon={<PackageCheck className="h-4 w-4" />}
            title="Feito para formatação"
            text="Perfis prontos como PC Essencial e Dev Web preparam uma máquina nova em poucos minutos."
          />
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="text-2xl font-bold tabular-nums">{value.toLocaleString('pt-BR')}</dd>
      <dd className="text-xs text-muted">{label}</dd>
    </div>
  );
}

function Section({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {href && (
          <Link href={href} className="flex items-center gap-1 text-sm text-muted hover:text-fg">
            Ver mais <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function CategoryTile({ category }: { category: CategoryDto }) {
  return (
    <Link
      href={`/apps?category=${category.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-card px-3.5 py-3 transition-colors hover:border-primary"
    >
      <span className="text-[13px] font-medium">{category.name}</span>
      <span className="mt-0.5 text-[11px] text-muted group-hover:text-primary">
        {category.appCount ?? 0} apps
      </span>
    </Link>
  );
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary-soft text-primary">
        {icon}
      </span>
      <h3 className="mt-3 text-[15px] font-semibold">{title}</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">{text}</p>
    </div>
  );
}
