'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Download, ExternalLink, QrCode, X } from 'lucide-react';
import {
  DISTRO_LABELS,
  LINUX_DISTROS,
  OS_LABELS,
  type InstallScriptResponse,
  type LinuxDistro,
  type OperatingSystem
} from '@toolkit/shared';
import { cn } from '@toolkit/shared';
import { apiFetch } from '@/lib/api';
import { useKitStore } from '@/lib/kit-store';
import { useI18n } from '@/lib/i18n';
import { useDetectedSystem } from '@/lib/os-detect';
import { CopyButton } from '@/components/copy-button';
import { AppIcon } from '@/components/app-icon';

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

export function GenerateClient() {
  const items = useKitStore((s) => s.items);
  const remove = useKitStore((s) => s.remove);
  const clear = useKitStore((s) => s.clear);
  const detected = useDetectedSystem();
  const { t } = useI18n();

  const [os, setOs] = useState<OperatingSystem>('windows');
  const [distro, setDistro] = useState<LinuxDistro>('ubuntu');
  const [format, setFormat] = useState<'ps1' | 'bat'>('ps1');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (detected) {
      setOs(detected.os);
      if (detected.distro && detected.distro !== 'other') setDistro(detected.distro);
    }
  }, [detected]);

  useEffect(() => {
    if (!confirmClear) return;
    const timer = window.setTimeout(() => setConfirmClear(false), 3000);
    return () => window.clearTimeout(timer);
  }, [confirmClear]);

  const slugs = useMemo(() => items.map((i) => i.slug), [items]);

  const { data, isFetching, error } = useQuery({
    queryKey: ['install-script', slugs, os, distro, format],
    queryFn: async () => {
      const res = await apiFetch<{ data: InstallScriptResponse }>('/install-script', {
        method: 'POST',
        body: JSON.stringify({ slugs, os, distro: os === 'linux' ? distro : undefined, format: os === 'windows' ? format : undefined })
      });
      return res.data;
    },
    enabled: slugs.length > 0,
    staleTime: 60_000,
    retry: false
  });

  const share = async () => {
    const res = await apiFetch<{ data: { code: string } }>('/toolkits', {
      method: 'POST',
      body: JSON.stringify({ slugs })
    });
    setShareUrl(`${window.location.origin}/s/${res.data.code}`);
  };

  const download = (result: InstallScriptResponse) => {
    const blob = new Blob([result.script], { type: result.contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold tracking-tight">{t((d) => d.generator.title)}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{t((d) => d.generator.emptyKit)}</p>
        <Link
          href="/apps"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-fg hover:opacity-90"
        >
          {t((d) => d.hero.ctaPrimary)}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">{t((d) => d.generator.title)}</h1>

      <div className="mt-5 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
              {t((d) => d.generator.target)}
            </h2>
            <p className="mt-2 text-sm">
              {items.length} aplicativo{items.length > 1 ? 's' : ''} selecionado
              {items.length > 1 ? 's' : ''}
            </p>

            <ul className="mt-3 max-h-56 space-y-1.5 overflow-y-auto scrollbar-thin">
              {items.map((item) => (
                <li
                  key={item.slug}
                  className="flex items-center gap-2 rounded-md border border-border bg-bg px-2 py-1.5"
                >
                  <AppIcon slug={item.iconKey} name={item.name} color={item.color} size={20} />
                  <span className="min-w-0 flex-1 truncate text-xs font-medium">{item.name}</span>
                  <button
                    onClick={() => remove(item.slug)}
                    aria-label={`${t((d) => d.kit.remove)} ${item.name}`}
                    title={t((d) => d.kit.remove)}
                    className="shrink-0 text-muted hover:text-warning"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                if (!confirmClear) {
                  setConfirmClear(true);
                  return;
                }
                clear();
                setConfirmClear(false);
                setShareUrl(null);
              }}
              className={cn(
                'mt-3 h-9 w-full rounded-md text-xs font-medium transition-colors',
                confirmClear
                  ? 'border border-warning bg-warning/10 text-warning'
                  : 'border border-border bg-bg text-muted hover:text-fg'
              )}
            >
              {confirmClear ? t((d) => d.kit.clearConfirm) : t((d) => d.kit.clear)}
            </button>

            <div className="mt-3 space-y-3">
              <div>
                <span className="mb-1.5 block text-xs text-muted">Sistema</span>
                <div className="flex gap-1.5">
                  {(Object.keys(OS_LABELS) as OperatingSystem[]).map((o) => (
                    <button
                      key={o}
                      onClick={() => setOs(o)}
                      aria-pressed={os === o}
                      className={cn(
                        'rounded-full border px-2.5 py-1 text-xs font-medium',
                        os === o ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted hover:text-fg'
                      )}
                    >
                      {OS_LABELS[o]}
                    </button>
                  ))}
                </div>
              </div>

              {os === 'linux' && (
                <div>
                  <label htmlFor="distro" className="mb-1.5 block text-xs text-muted">
                    Distribuição
                  </label>
                  <select
                    id="distro"
                    value={distro}
                    onChange={(e) => setDistro(e.target.value as LinuxDistro)}
                    className="h-9 w-full rounded-md border border-border bg-bg px-2 text-[13px] outline-none focus:border-primary"
                  >
                    {[...new Set([distro, ...LINUX_DISTROS])].map((d) => (
                      <option key={d} value={d}>
                        {DISTRO_LABELS[d]}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {os === 'windows' && (
                <div>
                  <span className="mb-1.5 block text-xs text-muted">Formato</span>
                  <div className="flex gap-1.5">
                    {(['ps1', 'bat'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        aria-pressed={format === f}
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-xs font-medium',
                          format === f ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted'
                        )}
                      >
                        {f === 'ps1' ? 'PowerShell' : '.bat'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => void share()}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-card text-sm font-medium hover:border-primary"
          >
            <QrCode className="h-4 w-4" /> {t((d) => d.kit.share)}
          </button>
          {shareUrl && (
            <div className="space-y-2 rounded-lg border border-border bg-card p-3">
              <code className="block truncate text-xs text-success">{shareUrl}</code>
              <CopyButton text={shareUrl} />
              <QrImage url={shareUrl} />
              <p className="text-[11px] leading-relaxed text-muted">{t((d) => d.share.qrHint)}</p>
            </div>
          )}
        </aside>

        <section>
          {error && (
            <div className="rounded-lg border border-warning/50 bg-warning/10 p-4 text-sm text-warning">
              Não foi possível gerar o script agora. Verifique sua conexão e tente novamente.
            </div>
          )}

          {isFetching && !data && (
            <div className="space-y-3">
              <div className="skeleton h-20 rounded-xl" />
              <div className="skeleton h-64 rounded-xl" />
            </div>
          )}

          {data && (
            <div className="space-y-5">
              <p className="rounded-lg border border-border bg-card px-4 py-3 text-[13px]" suppressHydrationWarning>
                <strong>{data.target.label}</strong> ·{' '}
                {t((d) => d.generator.summaryLine)
                  .replace('{auto}', String(data.autoCount))
                  .replace('{manual}', String(data.manualCount))}
                {data.unavailable.length > 0 && ` · ${data.unavailable.length} indisponíveis`}
              </p>

              <div className="rounded-xl border border-border bg-card p-4">
                <h2 className="text-sm font-semibold">{t((d) => d.generator.willRun)}</h2>
                <ol className="mt-2.5 list-decimal space-y-1 pl-5 text-[13px] text-muted">
                  {data.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="overflow-hidden rounded-xl border border-border">
                <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
                  <span className="font-mono text-xs text-muted">{data.filename}</span>
                  <div className="flex items-center gap-2">
                    <CopyButton text={data.script} label={t((d) => d.generator.copy)} />
                    <button
                      onClick={() => download(data)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-fg hover:opacity-90"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Baixar
                    </button>
                  </div>
                </div>
                <pre className="scrollbar-thin max-h-[420px] overflow-auto bg-bg-subtle p-4 font-mono text-[12px] leading-relaxed text-fg">
                  <code>{data.script}</code>
                </pre>
              </div>

              {data.manual.length > 0 && (
                <div className="rounded-xl border border-warning/40 bg-warning/5 p-4">
                  <h2 className="text-sm font-semibold text-warning">
                    {t((d) => d.generator.manualTitle).replace('{count}', String(data.manual.length))}
                  </h2>
                  <ul className="mt-2 space-y-2">
                    {data.manual.map((m) => (
                      <li key={m.slug} className="text-[13px]">
                        <strong>{m.name}</strong> — {m.note ?? 'instale pelo site oficial'}{' '}
                        {m.url && (
                          <a href={m.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-primary hover:underline">
                            abrir <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.unavailable.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <h2 className="text-sm font-semibold text-muted">
                    {t((d) => d.generator.unavailable)}
                  </h2>
                  <ul className="mt-2 space-y-1 text-[13px] text-muted">
                    {data.unavailable.map((u) => (
                      <li key={u.slug}>
                        {u.name} — {u.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs leading-relaxed text-muted">
                Revise o script antes de executar. Ele usa somente IDs validados no catálogo e nunca recebe
                comandos de terceiros.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
