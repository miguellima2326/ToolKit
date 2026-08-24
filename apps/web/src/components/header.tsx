'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Github, Search, ShoppingBag } from 'lucide-react';
import { cn } from '@toolkit/shared';
import { useI18n } from '@/lib/i18n';
import { useKitStore } from '@/lib/kit-store';
import { Logo } from './logo';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const items = useKitStore((s) => s.items);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;
    setBump(true);
    const timer = window.setTimeout(() => setBump(false), 400);
    return () => window.clearTimeout(timer);
  }, [items.length]);

  const links = [
    { href: '/apps', label: t((d) => d.nav.apps) },
    { href: '/drivers', label: t((d) => d.nav.drivers) },
    { href: '/collections', label: t((d) => d.nav.collections) },
    { href: '/docs#cli', label: t((d) => d.nav.cli), soon: true },
    { href: '/docs', label: t((d) => d.nav.docs) }
  ];

  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/toolkit-dev/toolkit';

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                pathname.startsWith(link.href.split('#')[0] ?? '')
                  ? 'bg-bg-subtle text-fg'
                  : 'text-muted hover:text-fg'
              )}
            >
              {link.label}
              {'soon' in link && link.soon && (
                <span className="rounded-full border border-border px-1 text-[9px] uppercase text-muted">
                  {t((d) => d.common.soon)}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => router.push('/apps')}
          className="hidden h-8 w-52 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-[13px] text-muted transition-colors hover:border-primary sm:flex lg:w-64"
          aria-label={t((d) => d.nav.search)}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 truncate text-left">{t((d) => d.nav.search)}</span>
          <kbd className="rounded border border-border px-1 text-[10px]">⌘K</kbd>
        </button>

        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:text-fg"
          aria-label="GitHub"
        >
          <Github className="h-4 w-4" />
        </a>

        <ThemeToggle />

        <Link
          href="/generate"
          className={cn(
            'relative inline-flex h-8 items-center gap-2 rounded-md border border-primary bg-primary-soft px-3 text-[13px] font-medium text-fg transition-transform',
            bump && 'kit-bump'
          )}
          aria-label={t((d) => d.nav.myToolkit)}
        >
          <ShoppingBag className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">{t((d) => d.nav.myToolkit)}</span>
          <span className="min-w-5 rounded-full bg-primary px-1.5 text-center text-[11px] font-semibold text-primary-fg">
            {items.length}
          </span>
        </Link>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden" aria-label="Principal mobile">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'whitespace-nowrap rounded-md px-2.5 py-1 text-[13px] font-medium',
              pathname === link.href ? 'bg-bg-subtle text-fg' : 'text-muted'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
