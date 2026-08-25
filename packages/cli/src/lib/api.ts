const VERSION = '0.1.0';

export const API_URL = (process.env.TOOLKIT_API_URL ?? 'https://toolkit-is5v.onrender.com').replace(/\/$/, '');
export const SITE_URL = (process.env.TOOLKIT_SITE_URL ?? 'https://tool-kit-web-liart.vercel.app').replace(
  /\/$/,
  ''
);

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'user-agent': `toolkit-cli/${VERSION}`,
        accept: 'application/json',
        ...init?.headers
      }
    });
  } catch {
    throw new ApiError(`Não foi possível conectar em ${API_URL}. Verifique sua conexão ou TOOLKIT_API_URL.`, 0);
  }

  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      // resposta não-JSON (ex: 502 de proxy) — segue com body null
    }
  }

  if (!res.ok) {
    const payload = body as { error?: string; message?: string } | null;
    if (res.status === 429) {
      throw new ApiError('Limite de requisições atingido. Aguarde um pouco e tente de novo.', 429, payload?.error);
    }
    throw new ApiError(payload?.message ?? payload?.error ?? `Erro HTTP ${res.status}`, res.status, payload?.error);
  }

  return body as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
}
