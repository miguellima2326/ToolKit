'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CornerDownLeft, Search, Terminal } from 'lucide-react';
import type { SearchResponse } from '@toolkit/shared';
import { apiFetch } from '@/lib/api';
import { AppIcon } from './app-icon';
import { LogoMark } from './logo';

interface PaletteItem {
  id: string;
  label: string;
  hint?: string;
  group: 'Apps' | 'Categorias' | 'Coleções' | 'Navegação';
  href?: string;
  slug?: string;
  icon?: { slug: string; name: string; color: string };
}

const NAV_ACTIONS = [
  { href: '/apps', label: 'Explorar aplicativos' },
  { href: '/drivers', label: 'Drivers' },
  { href: '/collections', label: 'Coleções e perfis prontos' },
  { href: '/generate', label: 'Gerar instalação do meu Toolkit' },
  { href: '/docs', label: 'Documentação' },
  { href: '/security', label: 'Segurança e transparência' }
];

export function SearchPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void apiFetch<{ data: SearchResponse }>(`/search?q=${encodeURIComponent(query.trim())}`, {
        signal: controller.signal
      })
        .then((r) => {
          setResults(r.data);
          setActiveIndex(0);
        })
        .catch(() => undefined)
        .finally(() => setLoading(false));
    }, 160);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
      setLoading(false);
    };
  }, [query, open]);

  const items = useMemo<PaletteItem[]>(() => {
    const list: PaletteItem[] = [];
    for (const app of results?.apps ?? []) {
      list.push({
        id: `app-${app.slug}`,
        label: app.name,
        hint: `${app.developer} · ${app.category}`,
        group: 'Apps',
        href: `/apps/${app.slug}`,
        icon: { slug: app.iconKey, name: app.name, color: app.color }
      });
    }
    for (const cat of results?.categories ?? []) {
      list.push({ id: `cat-${cat.slug}`, label: cat.name, group: 'Categorias', href: `/apps?category=${cat.slug}` });
    }
    for (const col of results?.collections ?? []) {
      list.push({ id: `col-${col.slug}`, label: col.name, group: 'Coleções', href: `/collections/${col.slug}` });
    }
    if (query.trim().length < 2) {
      for (const nav of NAV_ACTIONS) {
        list.push({
          id: `nav-${nav.href}`,
          label: nav.label,
          group: 'Navegação',
          href: nav.href,
          hint: nav.href
        });
      }
    }
    return list.slice(0, 14);
  }, [results, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, PaletteItem[]>();
    for (const item of items) {
      const arr = map.get(item.group) ?? [];
      arr.push(item);
      map.set(item.group, arr);
    }
    return [...map.entries()];
  }, [items]);

  const go = (item: PaletteItem | undefined) => {
    if (!item?.href) return;
    setOpen(false);
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(items[activeIndex]);
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Busca universal"
    >
      <div
        className="fade-up w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Pesquisar apps, drivers ou ferramentas..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted"
            autoComplete="off"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted">ESC</kbd>
        </div>

        <div ref={listRef} className="scrollbar-thin max-h-[50vh] overflow-y-auto p-2">
          {items.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-muted">
              {query.trim().length >= 2 && !loading ? (
                <>
                  Nenhum resultado para “{query}”.
                  <br />
                  <button
                    className="mt-1 inline-flex items-center gap-1 text-primary hover:underline"
                    onClick={() => {
                      setOpen(false);
                      router.push(`/apps?q=${encodeURIComponent(query.trim())}`);
                    }}
                  >
                    Buscar no catálogo completo <ArrowRight className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Terminal className="h-4 w-4" /> Digite para buscar ou navegue abaixo
                </span>
              )}
            </div>
          )}

          {grouped.map(([group, groupItems]) => (
            <div key={group} className="mb-1">
              <div className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted">
                {group}
              </div>
              {groupItems.map((item) => {
                flatIndex++;
                const idx = flatIndex;
                return (
                  <button
                    key={item.id}
                    data-index={idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => go(item)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      activeIndex === idx ? 'bg-primary-soft text-fg' : 'text-fg/90'
                    }`}
                  >
                    {item.icon ? (
                      <AppIcon slug={item.icon.slug} name={item.icon.name} color={item.icon.color} size={24} />
                    ) : (
                      <LogoMark className="h-4 w-4 text-muted" />
                    )}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.hint && <span className="truncate text-xs text-muted">{item.hint}</span>}
                    {idx === activeIndex && <CornerDownLeft className="h-3 w-3 shrink-0 text-muted" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted">
          <span>↑↓ navegar · ↵ abrir · esc fechar</span>
          <span>Toolkit</span>
        </div>
      </div>
    </div>
  );
}
