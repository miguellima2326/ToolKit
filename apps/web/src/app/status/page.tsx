import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Status',
  description: 'Disponibilidade dos serviços do Toolkit.',
  robots: { index: false }
};

// Página de status sempre renderizada por requisição — nunca em build. Sem isso,
// o Next tenta pré-renderizar em build time e o fetch trava esperando a API
// (que pode nem estar no ar ainda durante o deploy), estourando o timeout do build.
export const dynamic = 'force-dynamic';

interface HealthResponse {
  status: string;
  components: Record<string, string>;
  timestamp: string;
}

export default async function StatusPage() {
  let health: HealthResponse | null = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/health/detailed`,
      { cache: 'no-store' }
    );
    if (res.ok) health = (await res.json()) as HealthResponse;
  } catch {
    health = null;
  }

  const services = [
    { key: 'database', name: 'API & Catálogo', desc: 'Banco PostgreSQL e endpoints públicos' },
    { key: 'search', name: 'Busca', desc: 'PostgreSQL FTS + trigram' },
    { key: 'redis', name: 'Cache & Rate limit', desc: 'Redis (degrada para memória)' },
    { key: 'workers', name: 'Catalog Updates', desc: 'Workers de verificação de versões (fase 2)' }
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Status do serviço</h1>

      {!health ? (
        <div className="mt-6 rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm text-warning">
          Não foi possível verificar o estado dos serviços neste momento.
        </div>
      ) : (
        <>
          <p className="mt-2 flex items-center gap-2 text-sm">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${health.status === 'ok' ? 'bg-success' : 'bg-warning'}`}
            />
            {health.status === 'ok'
              ? 'Todos os sistemas operacionais essenciais estão funcionando.'
              : 'Alguns componentes estão degradados.'}
          </p>

          <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
            {services.map((s) => {
              const state = health!.components[s.key] ?? 'unknown';
              const up = state === 'up';
              return (
                <li key={s.key} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted">{s.desc}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                      up
                        ? 'border-success/50 bg-success/10 text-success'
                        : state === 'disabled'
                          ? 'border-border text-muted'
                          : 'border-warning/50 bg-warning/10 text-warning'
                    }`}
                  >
                    {state === 'up' ? 'Operacional' : state === 'disabled' ? 'Opcional' : state === 'planned_phase_2' ? 'Fase 2' : state === 'degraded' ? 'Degradado' : 'Indisponível'}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-muted">Atualizado às {new Date(health.timestamp).toLocaleString('pt-BR')}</p>
        </>
      )}
    </div>
  );
}
