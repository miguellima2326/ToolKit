'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Share2, Trash2, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useKitStore } from '@/lib/kit-store';
import { apiFetch } from '@/lib/api';
import { AppIcon } from './app-icon';
import { CopyButton, copyText } from './copy-button';

export function KitDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { t } = useI18n();
  const { items, remove, clear, reorder, saveList } = useKitStore();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [listName, setListName] = useState('');

  if (!open) return null;

  const handleShare = async () => {
    if (items.length === 0) return;
    setSharing(true);
    try {
      const data = await apiFetch<{ data: { code: string } }>('/toolkits', {
        method: 'POST',
        body: JSON.stringify({
          title: listName.trim() || undefined,
          slugs: items.map((i) => i.slug)
        })
      });
      const url = `${window.location.origin}/s/${data.data.code}`;
      setShareUrl(url);
      await copyText(url);
    } catch {
      setShareUrl(null);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label={t((d) => d.kit.title)}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="fade-up absolute bottom-0 right-0 top-0 flex w-full flex-col border-l border-border bg-card sm:max-w-[380px]">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">{t((d) => d.kit.title)}</h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
              {t((d) => d.kit.items).replace('{count}', String(items.length))}
            </span>
            <button
              onClick={onClose}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted hover:text-fg"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto p-3">
          {items.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <p className="text-sm font-medium">{t((d) => d.kit.empty)}</p>
              <p className="mt-1 text-xs text-muted">{t((d) => d.kit.emptyHint)}</p>
              <Link
                href="/apps"
                onClick={onClose}
                className="mt-4 inline-flex rounded-md border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-soft"
              >
                {t((d) => d.hero.ctaPrimary)}
              </Link>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {items.map((item, index) => (
                <li key={item.slug} className="flex items-center gap-2.5 rounded-lg border border-border bg-bg px-2.5 py-2">
                  <AppIcon slug={item.iconKey} name={item.name} color={item.color} size={30} />
                  <Link
                    href={`/apps/${item.slug}`}
                    onClick={onClose}
                    className="min-w-0 flex-1 truncate text-[13px] font-medium hover:underline"
                  >
                    {item.name}
                  </Link>
                  <button
                    disabled={index === 0}
                    onClick={() => reorder(index, index - 1)}
                    className="text-muted hover:text-fg disabled:opacity-25"
                    aria-label="Mover para cima"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    disabled={index === items.length - 1}
                    onClick={() => reorder(index, index + 1)}
                    className="text-muted hover:text-fg disabled:opacity-25"
                    aria-label="Mover para baixo"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => remove(item.slug)}
                    className="text-muted hover:text-fg"
                    aria-label={t((d) => d.kit.remove)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-2.5 border-t border-border p-3">
            <input
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Nome da lista (ex.: PC do trabalho)"
              className="h-9 w-full rounded-md border border-border bg-bg px-3 text-xs outline-none focus:border-primary"
              maxLength={80}
            />
            <button
              onClick={() => void handleShare()}
              disabled={sharing}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-fg transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              <Share2 className="h-4 w-4" />
              {sharing ? '…' : t((d) => d.kit.share)}
            </button>
            {shareUrl && (
              <div className="flex items-center gap-2 rounded-md border border-success/40 bg-success/5 px-2.5 py-2">
                <code className="min-w-0 flex-1 truncate text-xs text-success">{shareUrl}</code>
                <CopyButton text={shareUrl} label="" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => router.push('/generate')}
                className="h-10 rounded-md border border-primary bg-primary text-sm font-semibold text-primary-fg hover:opacity-90"
              >
                {t((d) => d.kit.generate)}
              </button>
              <button
                onClick={() => clear()}
                className="h-10 rounded-md border border-border bg-bg text-sm font-medium text-muted hover:text-fg"
              >
                {t((d) => d.kit.clear)}
              </button>
            </div>
            <button
              onClick={() => {
                if (listName.trim()) {
                  saveList(listName.trim());
                  setListName('');
                }
              }}
              disabled={!listName.trim()}
              className="w-full text-center text-xs text-muted underline-offset-2 hover:text-fg hover:underline disabled:opacity-40"
            >
              Salvar lista neste navegador
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
