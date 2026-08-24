'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, Star } from 'lucide-react';
import type { AppSummary } from '@toolkit/shared';
import { LICENSE_LABELS, LICENSE_TYPES, METHOD_LABELS, OS_LABELS, OPERATING_SYSTEMS, cn } from '@toolkit/shared';
import { apiFetch } from '@/lib/api';
import { useKitStore } from '@/lib/kit-store';
import { useI18n } from '@/lib/i18n';
import { AppCard, EmptyState, SkeletonCard } from '@/components/app-card';

export interface Filters {
  q: string;
  category?: string;
  os?: string;
  arch?: string;
  license?: string;
  method?: string;
  sort?: string;
}

interface Props {
  initial: { apps: AppSummary[]; total: number };
  initialFilters: Filters;
  categories: { slug: string; name: string; appCount?: number }[];
}

const SORTS = [
  { value: 'popular', label: 'Mais populares' },
  { value: 'recent', label: 'Mais recentes' },
  { value: 'name', label: 'A-Z' }
];

export function Explorer({ initial, initialFilters, categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const favorites = useKitStore((s) => s.favorites);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filters: Filters = {
    q: searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? undefined,
    os: searchParams.get('os') ?? undefined,
    arch: searchParams.get('arch') ?? undefined,
    license: searchParams.get('license') ?? undefined,
    method: searchParams.get('method') ?? undefined,
    sort: searchParams.get('sort') ?? 'popular'
  };

  const isDefaultState =
    JSON.stringify(filters) === JSON.stringify(initialFilters) && !favoritesOnly;

  const { data, isFetching } = useQuery({
    queryKey: ['apps', filters, favoritesOnly],
    queryFn: async () => {
      if (favoritesOnly) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => v && params.set(k, String(v)));
        params.set('limit', '48');
        const res = await apiFetch<{ data: AppSummary[]; meta: { total: number } }>(
          `/apps?${params.toString()}`
        );
        return { ...res, data: res.data.filter((a) => favorites.includes(a.slug)) };
      }
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => v && params.set(k, String(v)));
      params.set('limit', '48');
      return apiFetch<{ data: AppSummary[]; meta: { total: number } }>(`/apps?${params.toString()}`);
    },
    initialData: isDefaultState ? { data: initial.apps, meta: { total: initial.total } } : undefined,
    staleTime: 30_000
  });

  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    const params = new URLSearchParams();
    if (next.q) params.set('q', next.q);
    if (next.category) params.set('category', next.category);
    if (next.os) params.set('os', next.os);
    if (next.arch) params.set('arch', next.arch);
    if (next.license) params.set('license', next.license);
    if (next.method) params.set('method', next.method);
    if (next.sort && next.sort !== 'popular') params.set('sort', next.sort);
    router.replace(params.toString() ? `/apps?${params.toString()}` : '/apps', { scroll: false });
  };

  const hasActiveFilters =
    !!filters.category || !!filters.os || !!filters.arch || !!filters.license || !!filters.method || favoritesOnly;

  const visibleApps = useMemo(() => data?.data ?? [], [data]);

  const sidebar = (
    <div className="space-y-5">
      <FilterGroup title={t((d) => d.explorer.os)}>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={!filters.os} onClick={() => update({ os: undefined })}>
            Todos
          </Chip>
          {OPERATING_SYSTEMS.map((os) => (
            <Chip key={os} active={filters.os === os} onClick={() => update({ os })}>
              {OS_LABELS[os]}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t((d) => d.explorer.category)}>
        <select
          value={filters.category ?? ''}
          onChange={(e) => update({ category: e.target.value || undefined })}
          className="h-9 w-full rounded-md border border-border bg-bg px-2 text-[13px] outline-none focus:border-primary"
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name} ({c.appCount ?? 0})
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title={t((d) => d.explorer.license)}>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={!filters.license} onClick={() => update({ license: undefined })}>
            Todas
          </Chip>
          {LICENSE_TYPES.map((l) => (
            <Chip key={l} active={filters.license === l} onClick={() => update({ license: l })}>
              {LICENSE_LABELS[l]}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t((d) => d.explorer.method)}>
        <select
          value={filters.method ?? ''}
          onChange={(e) => update({ method: e.target.value || undefined })}
          className="h-9 w-full rounded-md border border-border bg-bg px-2 text-[13px] outline-none focus:border-primary"
        >
          <option value="">Qualquer</option>
          {(['winget', 'apt', 'dnf', 'pacman', 'flatpak', 'snap', 'brew_formula', 'brew_cask'] as const).map((m) => (
            <option key={m} value={m}>
              {METHOD_LABELS[m]}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup title="Arquitetura">
        <div className="flex gap-1.5">
          <Chip active={!filters.arch} onClick={() => update({ arch: undefined })}>
            Todas
          </Chip>
          <Chip active={filters.arch === 'x64'} onClick={() => update({ arch: 'x64' })}>
            x64
          </Chip>
          <Chip active={filters.arch === 'arm64'} onClick={() => update({ arch: 'arm64' })}>
            ARM64
          </Chip>
        </div>
      </FilterGroup>

      <button
        onClick={() => setFavoritesOnly((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
          favoritesOnly ? 'border-warning/60 bg-warning/10 text-warning' : 'border-border text-muted hover:text-fg'
        )}
      >
        <Star className="h-3.5 w-3.5" /> {t((d) => d.explorer.favoritesOnly)}
      </button>

      {hasActiveFilters && (
        <button
          onClick={() => {
            setFavoritesOnly(false);
            router.replace('/apps', { scroll: false });
          }}
          className="text-xs text-muted underline underline-offset-2 hover:text-fg"
        >
          {t((d) => d.explorer.clear)}
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{t((d) => d.explorer.title)}</h1>
          <p className="mt-0.5 text-sm text-muted" suppressHydrationWarning>
            {(isFetching ? '…' : (data?.meta.total ?? 0).toLocaleString('pt-BR'))}{' '}
            {t((d) => d.explorer.results).replace('{count}', '')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-[13px] font-medium lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> {t((d) => d.explorer.filters)}
          </button>
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value })}
            className="h-9 rounded-md border border-border bg-card px-2 text-[13px] outline-none focus:border-primary"
            aria-label={t((d) => d.explorer.sort)}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">{sidebar}</aside>

        <div>
          {isFetching && !data ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : visibleApps.length === 0 ? (
            <EmptyState query={filters.q || undefined} />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {visibleApps.map((app) => (
                <AppCard key={app.slug} app={app} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fade-up absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-xl border-t border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">{t((d) => d.explorer.filters)}</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-muted">
                ✕
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
        active ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted hover:text-fg'
      )}
    >
      {children}
    </button>
  );
}
