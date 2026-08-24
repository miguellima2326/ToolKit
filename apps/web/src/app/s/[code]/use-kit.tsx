'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKitStore } from '@/lib/kit-store';
import { CopyButton } from '@/components/copy-button';

function QrImage({ url }: { url: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    void import('qrcode').then(async (QR) => {
      try {
        const dataUrl = await QR.toDataURL(url, { width: 160, margin: 1 });
        if (active) setSrc(dataUrl);
      } catch {
        if (active) setSrc(null);
      }
    });
    return () => {
      active = false;
    };
  }, [url]);
  if (!src) return null;
  return (
    <img src={src} alt="QR Code do Toolkit compartilhado" className="rounded-md border border-border bg-white p-1" />
  );
}

export function UseKitButton({
  code,
  items
}: {
  code: string;
  items: { slug: string; name: string; iconKey: string; color: string }[];
}) {
  const router = useRouter();
  const add = useKitStore((s) => s.add);
  const clear = useKitStore((s) => s.clear);
  const [used, setUsed] = useState(false);
  const [origin, setOrigin] = useState('');
  useEffect(() => setOrigin(window.location.origin), []);
  const shareUrl = origin ? `${origin}/s/${code}` : `/s/${code}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => {
          clear();
          for (const item of items) add(item);
          setUsed(true);
          window.setTimeout(() => router.push('/generate'), 500);
        }}
        disabled={used}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-fg hover:opacity-90 disabled:opacity-70"
      >
        {used ? '✓ Carregado!' : `Usar este Toolkit (${items.length})`}
      </button>
      <CopyButton text={shareUrl} label="Copiar link" />
      {origin && <QrImage url={shareUrl} />}
    </div>
  );
}
