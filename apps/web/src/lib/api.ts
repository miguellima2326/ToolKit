import type { AppSummary } from '@toolkit/shared';

export interface CatalogAppRow extends Omit<AppSummary, 'hasLocalIcon'> {
  description?: string;
  websiteUrl?: string;
  tags?: string[];
  updatedAt?: string;
}

// || (não ??) de propósito: uma env var configurada em branco (string vazia) deve
// cair no fallback igual a não-configurada — senão `new URL('')` quebra o build.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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
