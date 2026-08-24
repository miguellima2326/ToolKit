'use client';

import { useState } from 'react';
import { useKitStore, type KitItem } from '@/lib/kit-store';

export function SelectAllButton({ items }: { items: KitItem[] }) {
  const add = useKitStore((s) => s.add);
  const [allAdded, setAllAdded] = useState(false);

  return (
    <button
      onClick={() => {
        for (const item of items) add(item);
        setAllAdded(true);
      }}
      disabled={allAdded}
      className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-fg transition-opacity hover:opacity-90 disabled:opacity-70"
    >
      {allAdded ? `✓ ${items.length} adicionados` : `Selecionar tudo (${items.length})`}
    </button>
  );
}
