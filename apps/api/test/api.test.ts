import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';

const env = {
  NODE_ENV: 'test',
  WEB_ORIGIN: 'http://localhost:3000',
  SESSION_SECRET: 'segredo-de-teste-com-mais-de-24-chars',
  ADMIN_TOKEN: 'token-admin-de-teste'
};

function fakePrisma(overrides: Record<string, unknown> = {}) {
  const chromeRow = {
    id: '1',
    slug: 'google-chrome',
    name: 'Google Chrome',
    tagline: 'Navegador',
    description: 'desc',
    websiteUrl: 'https://www.google.com/chrome/',
    license: 'freeware',
    iconKey: 'google-chrome',
    color: '#4285F4',
    popularity: 99,
    status: 'verified',
    tags: ['navegador'],
    archs: ['x64'],
    oss: ['windows', 'macos', 'linux'],
    alternatives: [],
    version: null,
    vendor: { name: 'Google' },
    category: { name: 'Navegadores', slug: 'navegadores' },
    packages: [
      {
        method: 'winget',
        os: 'windows',
        packageId: 'Google.Chrome',
        repository: null,
        source: 'official',
        status: 'verified',
        notes: null,
        classic: false,
        downloadUrl: null,
        lastCheckedAt: new Date()
      }
    ]
  };
  return {
    app: {
      findMany: async () => [chromeRow],
      findFirst: async () => chromeRow,
      count: async () => 1,
      groupBy: async () => [{ status: 'verified', _count: 1 }]
    },
    contribution: { count: async () => 0, findMany: async () => [] },
    scriptStat: { findUnique: async () => ({ total: 0 }), upsert: async () => ({}) },
    auditLog: { create: async () => ({}), findMany: async () => [] },
    sharedToolkit: {
      count: async () => 0,
      create: async (args: { data: { code: string; title: string | null; slugs: string[] } }) => ({
        code: args.data.code,
        createdAt: new Date()
      }),
      findUnique: async () => null,
      update: async () => ({})
    },
    driver: { count: async () => 8 },
    category: { count: async () => 21, findMany: async () => [] },
    ...overrides
  } as never;
}

describe('API', () => {
  it('GET /health responde ok', async () => {
    const app = await buildApp({ prisma: fakePrisma(), env });
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: 'ok' });
    await app.close();
  });

  it('POST /api/v1/install-script gera script e nunca vaza packageId inválido', async () => {
    const app = await buildApp({ prisma: fakePrisma(), env });
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/install-script',
      payload: { slugs: ['google-chrome'], os: 'windows' }
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.data.format).toBe('ps1');
    expect(body.data.script).toContain('Google.Chrome');
    expect(body.data.autoCount).toBe(1);
    await app.close();
  });

  it('POST /api/v1/install-script valida entrada', async () => {
    const app = await buildApp({ prisma: fakePrisma(), env });
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/install-script',
      payload: { slugs: [], os: 'windows' }
    });
    expect(res.statusCode).toBe(400);
    const linuxSemDistro = await app.inject({
      method: 'POST',
      url: '/api/v1/install-script',
      payload: { slugs: ['git'], os: 'linux' }
    });
    expect(linuxSemDistro.statusCode).toBe(400);
    await app.close();
  });

  it('admin exige sessão', async () => {
    const app = await buildApp({ prisma: fakePrisma(), env });
    const denied = await app.inject({ method: 'GET', url: '/api/v1/admin/overview' });
    expect(denied.statusCode).toBe(401);
    const badLogin = await app.inject({ method: 'POST', url: '/api/v1/admin/login', payload: { token: 'errado' } });
    expect(badLogin.statusCode).toBe(401);
    await app.close();
  });

  it('login admin emite cookie HttpOnly e permite overview', async () => {
    const app = await buildApp({ prisma: fakePrisma(), env });
    const login = await app.inject({ method: 'POST', url: '/api/v1/admin/login', payload: { token: env.ADMIN_TOKEN } });
    expect(login.statusCode).toBe(200);
    const cookie = login.cookies.find((c) => c.name === 'tk_admin');
    expect(cookie).toBeDefined();
    expect(cookie!.httpOnly).toBe(true);
    const overview = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/overview',
      cookies: { tk_admin: cookie!.value }
    });
    if (overview.statusCode !== 200) console.log('OVERVIEW_FAIL:', overview.body);
    expect(overview.statusCode).toBe(200);
    await app.close();
  });
});
