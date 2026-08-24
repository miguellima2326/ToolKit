import Link from 'next/link';
import { cn } from '@toolkit/shared';

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('h-5 w-5', className)} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v8M8 12h8" stroke="var(--primary)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-fg transition-opacity hover:opacity-80"
      aria-label="Toolkit"
    >
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight">Toolkit</span>
    </Link>
  );
}
