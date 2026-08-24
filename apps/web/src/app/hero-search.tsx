'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useDetectedSystem } from '@/lib/os-detect';

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const detected = useDetectedSystem();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/apps?q=${encodeURIComponent(query.trim())}`);
    else router.push('/apps');
  };

  return (
    <div>
      <form onSubmit={submit} role="search">
        <label htmlFor="hero-search" className="sr-only">
          Pesquisar apps, drivers ou ferramentas
        </label>
        <div className="flex h-12 items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 transition-colors focus-within:border-primary">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            id="hero-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar apps, drivers ou ferramentas..."
            autoComplete="off"
            className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted sm:block">⌘K</kbd>
        </div>
      </form>

      {detected && (
        <p className="mt-3 text-xs text-muted" suppressHydrationWarning>
          Detectamos <span className="font-medium text-fg">{detected.label}</span> — {detected.arch}
          {' · '}
          <a href="/generate" className="text-primary hover:underline">
            alterar
          </a>
        </p>
      )}
    </div>
  );
}
