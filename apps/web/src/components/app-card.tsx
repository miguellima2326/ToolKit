'use client';

import { useState } from 'react';
import { Check, Plus, Star } from 'lucide-react';
import Link from 'next/link';
import type { AppSummary } from '@toolkit/shared';
import { cn } from '@toolkit/shared';
import { useI18n } from '@/lib/i18n';
import { useKitStore } from '@/lib/kit-store';
import { AppIcon, OsBadges } from './app-icon';

export function AddButton({
  app,
  size = 'md'
}: {
  app: Pick<AppSummary, 'slug' | 'name' | 'iconKey' | 'color'>;
  size?: 'sm' | 'md';
}) {
  const add = useKitStore((s) => s.add);
  const has = useKitStore((s) => s.items.some((i) => i.slug === app.slug));
  const [justAdded, setJustAdded] = useState(false);
  const { t } = useI18n();

  const handleAdd = () => {
    if (has) return;
    if (add({ slug: app.slug, name: app.name, iconKey: app.iconKey, color: app.color })) {
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 1200);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={has}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-md font-medium transition-all',
        size === 'sm' ? 'h-7 px-2 text-xs' : 'h-8 px-3 text-[13px]',
        has
          ? 'border border-success/50 bg-success/10 text-success'
          : 'border border-primary bg-primary text-primary-fg hover:opacity-90'
      )}
      aria-label={`${t((d) => d.card.add)} ${app.name}`}
    >
      {has ? (
        <>
          <Check className="h-3.5 w-3.5" /> {t((d) => d.card.added)}
        </>
      ) : (
        <>
          <Plus className={cn('h-3.5 w-3.5', justAdded && 'rotate-90 transition-transform')} />
          {t((d) => d.card.add)}
        </>
      )}
    </button>
  );
}

export function FavoriteButton({ slug }: { slug: string }) {
  const favorites = useKitStore((s) => s.favorites);
  const toggleFavorite = useKitStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(slug);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(slug)}
      aria-label={isFav ? 'Remover dos favoritos' : 'Favoritar'}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
        isFav ? 'border-warning/60 bg-warning/10 text-warning' : 'border-border text-muted hover:text-fg'
      )}
    >
      <Star className={cn('h-4 w-4', isFav && 'fill-current')} />
    </button>
  );
}

export function AppCard({ app }: { app: AppSummary }) {
  return (
    <article className="group flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-muted">
      <div className="flex items-start gap-3">
        <AppIcon slug={app.iconKey} name={app.name} color={app.color} hasLocalIcon={app.hasLocalIcon} />
        <div className="min-w-0 flex-1">
          <Link href={`/apps/${app.slug}`} className="block truncate text-[15px] font-semibold hover:underline">
            {app.name}
          </Link>
          <p className="truncate text-xs text-muted">{app.developer}</p>
        </div>
        <FavoriteButton slug={app.slug} />
      </div>

      <p className="mt-2.5 line-clamp-2 min-h-[2.4em] text-[13px] leading-relaxed text-muted">
        {app.tagline}
      </p>

      <div className="mt-auto flex items-center justify-between pt-3">
        <OsBadges oss={app.operatingSystems} />
        <AddButton app={app} />
      </div>
    </article>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex gap-3">
        <div className="skeleton h-10 w-10 rounded-[10px]" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3.5 w-2/3 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
      </div>
      <div className="mt-4 flex justify-between">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-7 w-20 rounded-md" />
      </div>
    </div>
  );
}

export function EmptyState({
  query,
  suggestions
}: {
  query?: string;
  suggestions?: AppSummary[];
}) {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-14 text-center">
      <p className="text-sm font-medium">
        Nenhum aplicativo encontrado{query ? ` para “${query}”` : ''}.
      </p>
      {suggestions && suggestions.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-muted">Talvez você estivesse procurando:</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {suggestions.map((s) => (
              <Link
                key={s.slug}
                href={`/apps/${s.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs hover:border-primary"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
