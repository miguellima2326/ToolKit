import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'tk_admin';
const TTL_MS = 30 * 60 * 1000;

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createAdminSession(secret: string): { value: string; maxAge: number } {
  const exp = Date.now() + TTL_MS;
  const payload = `admin.${exp}.${randomBytes(8).toString('hex')}`;
  return {
    value: `${Buffer.from(payload).toString('base64url')}.${sign(payload, secret)}`,
    maxAge: Math.floor(TTL_MS / 1000)
  };
}

export function verifyAdminSession(cookieValue: string | undefined, secret: string): boolean {
  if (!cookieValue) return false;
  const parts = cookieValue.split('.');
  if (parts.length !== 2) return false;
  const [encodedPayload, signature] = parts as [string, string];
  let payload: string;
  try {
    payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  } catch {
    return false;
  }
  const expected = sign(payload, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const seg = payload.split('.');
  const exp = Number(seg[1]);
  return Number.isFinite(exp) && Date.now() < exp;
}

export function safeTokenCompare(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const ADMIN_COOKIE = COOKIE_NAME;
