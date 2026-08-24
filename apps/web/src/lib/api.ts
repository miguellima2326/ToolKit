import type { AppSummary } from '@toolkit/shared';

export interface CatalogAppRow extends Omit<AppSummary, 'hasLocalIcon'> {
  description?: string;
  websiteUrl?: string;
  tags?: string[];
  updatedAt?: string;
}

// Garante o protocolo mesmo se a env var vier sem "https://" (erro comum de
// configuração) — sem isso, new URL() no layout.tsx quebra o build com
// ERR_INVALID_URL. || (não ??) de propósito: string vazia também cai no fallback.
function withProtocol(url: string, fallback: string): string {
  if (!url) return fallback;
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}

const API_URL = withProtocol(process.env.NEXT_PUBLIC_API_URL || '', 'http://localhost:4000');
export const SITE_URL = withProtocol(process.env.NEXT_PUBLIC_SITE_URL || '', 'http://localhost:3000');

export { API_URL };

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) }
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string; error?: string } | null;
    throw Object.assign(new Error(body?.message ?? body?.error ?? `HTTP ${res.status}`), {
      status: res.status
    });
  }
  return res.json() as Promise<T>;
}
