'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';


type Theme = 'light' | 'dark' | 'system';

function applyTheme(theme: Theme) {
  const dark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = (window.localStorage.getItem('toolkit.theme') as Theme | null) ?? 'dark';
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const cycle = () => {
    const next: Theme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
    setTheme(next);
    window.localStorage.setItem('toolkit.theme', next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:border-primary hover:text-fg"
      aria-label={`Tema: ${theme}`}
      title={`Tema: ${theme}`}
    >
      {theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
    </button>
  );
}
