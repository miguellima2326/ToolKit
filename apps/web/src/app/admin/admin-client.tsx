'use client';

import { useCallback, useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import type { AppStatus } from '@toolkit/shared';
import { API_URL } from '@/lib/api';

interface Overview {
  appsByStatus: Record<string, number>;
  pendingContributions: number;
  scriptsGenerated: number;
  recentAudit: { id: string; actor: string; action: string; target: string; createdAt: string }[];
}
interface AdminApp {
  slug: string;
  name: string;
  status: AppStatus;
  category: string;
  vendor: string;
  packageCount: number;
  updatedAt: string;
}
interface Contribution {
  id: string;
  name: string;
  websiteUrl: string;
  wingetId?: string | null;
  brewId?: string | null;
  flatpakId?: string | null;
  notes?: string | null;
  status: string;
  createdAt: string;
}

export function AdminClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [token, setToken] = useState('');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [apps, setApps] = useState<AdminApp[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [ovRes, appsRes, contribRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/admin/overview`, { credentials: 'include' }),
        fetch(`${API_URL}/api/v1/admin/apps`, { credentials: 'include' }),
        fetch(`${API_URL}/api/v1/admin/contributions?status=pending`, { credentials: 'include' })
      ]);
      if (!ovRes.ok) {
        setAuthed(false);
        return;
      }
      setAuthed(true);
      setOverview((await ovRes.json()).data);
      setApps((await appsRes.json()).data);
      setContributions((await contribRes.json()).data);
    } catch {
      setAuthed(false);
      setError('API indisponível.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch(`${API_URL}/api/v1/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      credentials: 'include'
    });
    if (!res.ok) {
      setError('Credenciais inválidas.');
      return;
    }
    setToken('');
    await load();
  };

  const setStatus = async (slug: string, status: AppStatus) => {
    await fetch(`${API_URL}/api/v1/admin/apps/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      credentials: 'include'
    });
    await load();
  };

  const review = async (id: string, action: 'approve' | 'reject') => {
    await fetch(`${API_URL}/api/v1/admin/contributions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
      credentials: 'include'
    });
    await load();
  };

  if (authed === null) return <p className="py-20 text-center text-sm text-muted">Verificando sessão…</p>;

  if (!authed) {
    return (
      <form onSubmit={login} className="mx-auto mt-20 max-w-sm rounded-xl border border-border bg-card p-6">
        <h1 className="text-lg font-bold">Painel administrativo</h1>
        <p className="mt-1 text-xs text-muted">Acesso restrito. Autenticação via token do servidor.</p>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ADMIN_TOKEN"
          className="mt-4 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:border-primary"
        />
        {error && <p className="mt-2 text-xs text-warning">{error}</p>}
        <button className="mt-4 h-10 w-full rounded-md bg-primary text-sm font-semibold text-primary-fg hover:opacity-90">
          Entrar
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Admin</h1>
        <button
          onClick={() => {
            document.cookie = 'tk_admin=; Max-Age=0; path=/';
            location.reload();
          }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-fg"
        >
          <LogOut className="h-3.5 w-3.5" /> Sair
        </button>
      </div>

      {overview && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Verified', value: overview.appsByStatus['verified'] ?? 0 },
            { label: 'Pending review', value: overview.appsByStatus['pending_review'] ?? 0 },
            { label: 'Sugestões pendentes', value: overview.pendingContributions },
            { label: 'Scripts gerados', value: overview.scriptsGenerated }
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-border bg-card p-4">
              <p className="text-2xl font-bold tabular-nums">{c.value}</p>
              <p className="text-xs text-muted">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold">Sugestões da comunidade</h2>
        {contributions.length === 0 ? (
          <p className="text-xs text-muted">Nenhuma sugestão pendente.</p>
        ) : (
          <ul className="space-y-2">
            {contributions.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium">{c.name}</p>
                  <p className="truncate text-xs text-muted">
                    {c.websiteUrl} · winget: {c.wingetId ?? '—'} · flatpak: {c.flatpakId ?? '—'}
                  </p>
                </div>
                <button onClick={() => review(c.id, 'approve')} className="rounded-md bg-success/15 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/25">
                  Aprovar (pending_review)
                </button>
                <button onClick={() => review(c.id, 'reject')} className="rounded-md bg-warning/15 px-3 py-1.5 text-xs font-medium text-warning hover:bg-warning/25">
                  Rejeitar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold">Aplicativos</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="bg-bg-subtle text-xs text-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">App</th>
                <th className="px-4 py-2.5 font-medium">Categoria</th>
                <th className="px-4 py-2.5 font-medium">Pacotes</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {apps.map((a) => (
                <tr key={a.slug}>
                  <td className="px-4 py-2.5 font-medium">{a.name}</td>
                  <td className="px-4 py-2.5 text-muted">{a.category}</td>
                  <td className="px-4 py-2.5 tabular-nums text-muted">{a.packageCount}</td>
                  <td className="px-4 py-2.5">
                    <select
                      value={a.status}
                      onChange={(e) => void setStatus(a.slug, e.target.value as AppStatus)}
                      className="h-7 rounded border border-border bg-bg px-1.5 text-xs outline-none focus:border-primary"
                    >
                      {(['verified', 'pending_review', 'deprecated', 'blocked'] as const).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {overview && overview.recentAudit.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold">Audit log (recentes)</h2>
          <ul className="space-y-1 font-mono text-[11px] text-muted">
            {overview.recentAudit.map((l) => (
              <li key={l.id}>
                [{new Date(l.createdAt).toLocaleString('pt-BR')}] {l.actor} → {l.action} :: {l.target}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
