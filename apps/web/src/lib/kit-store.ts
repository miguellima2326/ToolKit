'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KitItem {
  slug: string;
  name: string;
  iconKey: string;
  color: string;
}

export interface SavedKit {
  id: string;
  name: string;
  slugs: string[];
  createdAt: number;
}

interface KitState {
  items: KitItem[];
  favorites: string[];
  savedKits: SavedKit[];
  add: (item: KitItem) => boolean;
  remove: (slug: string) => void;
  clear: () => void;
  reorder: (from: number, to: number) => void;
  toggleFavorite: (slug: string) => void;
  saveList: (name: string) => void;
  deleteSaved: (id: string) => void;
}

export const useKitStore = create<KitState>()(
  persist(
    (set, get) => ({
      items: [],
      favorites: [],
      savedKits: [],
      add: (item) => {
        if (get().items.some((i) => i.slug === item.slug)) return false;
        set((s) => ({ items: [...s.items, item] }));
        return true;
      },
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      clear: () => set({ items: [] }),
      reorder: (from, to) =>
        set((s) => {
          const next = [...s.items];
          const [moved] = next.splice(from, 1);
          if (!moved) return s;
          next.splice(to, 0, moved);
          return { items: next };
        }),
      toggleFavorite: (slug) =>
        set((s) => ({
          favorites: s.favorites.includes(slug)
            ? s.favorites.filter((f) => f !== slug)
            : [...s.favorites, slug]
        })),
      saveList: (name) =>
        set((s) => ({
          savedKits: [
            ...s.savedKits,
            {
              id: Math.random().toString(36).slice(2, 10),
              name,
              slugs: s.items.map((i) => i.slug),
              createdAt: Date.now()
            }
          ]
        })),
      deleteSaved: (id) => set((s) => ({ savedKits: s.savedKits.filter((k) => k.id !== id) }))
    }),
    { name: 'toolkit.kit.v1' }
  )
);
