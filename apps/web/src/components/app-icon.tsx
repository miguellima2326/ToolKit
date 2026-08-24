'use client';

import { useState } from 'react';
import { cn } from '@toolkit/shared';

export function AppIcon({
  slug,
  name,
  color,
  size = 40,
  hasLocalIcon
}: {
  slug: string;
  name: string;
  color: string;
  size?: number;
  hasLocalIcon?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const letter = (name.charAt(0) ?? '?').toUpperCase();

  if (!hasLocalIcon || failed) {
    return (
      <span
        aria-hidden
        style={{ width: size, height: size, color }}
        className="flex shrink-0 items-center justify-center rounded-[10px] border border-border text-[15px] font-bold"
      >
        <span
          className="flex h-full w-full items-center justify-center rounded-[9px]"
          style={{ backgroundColor: `${color}1f` }}
        >
          {letter}
        </span>
      </span>
    );
  }

  return (
    <img
      src={`/icons/${slug}.svg`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className="rounded-[10px] border border-border bg-card object-contain p-1"
    />
  );
}

export function OsBadges({ oss, className }: { oss: string[]; className?: string }) {
  const labels: Record<string, string> = { windows: 'Windows', linux: 'Linux', macos: 'macOS' };
  return (
    <span className={cn('text-xs text-muted', className)}>
      {oss.map((o) => labels[o]).filter(Boolean).join(' • ')}
    </span>
  );
}
