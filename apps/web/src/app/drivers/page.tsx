import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, TriangleAlert } from 'lucide-react';
import { listDrivers } from '@/lib/catalog-server';
import { OS_LABELS } from '@toolkit/shared';

export const metadata: Metadata = {
  title: 'Drivers',
  description: 'Drivers de GPU, áudio, rede e chipset direto das páginas oficiais dos fabricantes. NVIDIA, AMD, Intel, Realtek e mais.'
};

export const revalidate = 600;

export default async function DriversPage() {
  const { drivers, hardwareVendors } = await listDrivers();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Drivers</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Catálogo curado com <strong className="text-fg">somente fontes oficiais</strong>. O Toolkit nunca
        hospeda nem redistribui drivers — cada link aponta para a página do fabricante.
      </p>

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/5 p-4">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p className="text-[13px] leading-relaxed text-muted">
          <strong className="text-fg">Antes de baixar:</strong> no Windows, comece pelo Windows Update — ele
          resolve a maioria dos casos com segurança. Para notebooks, prefira sempre a página de suporte do
          fabricante do equipamento (Dell, HP, Lenovo...), que valida compatibilidade de modelo.
        </p>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Por fabricante</h2>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {drivers.map((d) => (
            <a
              key={d.slug}
              href={d.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[15px] font-semibold">{d.name}</h3>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-success/50 bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                  <ShieldCheck className="h-3 w-3" /> Oficial
                </span>
              </div>
              <p className="mt-1 text-[13px] text-muted">{d.tagline}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{d.instructions}</p>
              <p className="mt-3 text-xs text-muted group-hover:text-primary">
                {d.oss.map((o) => OS_LABELS[o as keyof typeof OS_LABELS]).join(' • ')} · abrir site oficial ↗
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-1 text-lg font-semibold tracking-tight">Suporte do fabricante do PC</h2>
        <p className="mb-4 text-sm text-muted">
          A forma mais segura de atualizar drivers de notebook é pelo suporte do fabricante, informando o
          modelo exato (geralmente em um adesivo na base ou via comando <code className="font-mono text-xs">msinfo32</code>).
        </p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {hardwareVendors.map((h) => (
            <a
              key={h.slug}
              href={h.supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border bg-card px-3.5 py-3 transition-colors hover:border-primary"
            >
              <span className="block text-[13px] font-semibold">{h.name}</span>
              <span className="text-[11px] text-muted">{h.kind} · suporte ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-border bg-bg-subtle/60 p-4 text-xs leading-relaxed text-muted">
        Quer detectar hardware automaticamente? Estamos preparando o <code className="font-mono">toolkit scan</code>, uma
        ferramenta open source que identifica componentes localmente e sugere drivers compatíveis.{' '}
        <Link href="/docs#cli" className="text-primary hover:underline">
          Saiba mais na documentação
        </Link>
        .
      </section>
    </div>
  );
}
