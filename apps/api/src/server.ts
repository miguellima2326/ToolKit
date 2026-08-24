import { config } from 'dotenv';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { buildApp } from './app.js';
import { loadEnv } from './env.js';

config({ path: resolve(import.meta.dirname, '../../../.env') });

const env = loadEnv();
const prisma = new PrismaClient({ log: ['error'] });

async function main() {
  const app = await buildApp({
    prisma,
    // Mapeamento explícito: `env` (Env do zod) tem CROSS_SITE_COOKIES (maiúsculo,
    // igual ao nome da variável); BuildOptions.env espera crossSiteCookies
    // (camelCase). Passar `env` direto fazia opts.env.crossSiteCookies ser sempre
    // undefined — TS não acusava porque o campo é opcional — e o cookie de admin
    // saía sempre SameSite=Lax, quebrando login cross-site (Vercel <-> Render)
    // mesmo com CROSS_SITE_COOKIES=true configurado.
    env: {
      NODE_ENV: env.NODE_ENV,
      WEB_ORIGIN: env.WEB_ORIGIN,
      SESSION_SECRET: env.SESSION_SECRET,
      ADMIN_TOKEN: env.ADMIN_TOKEN,
      crossSiteCookies: env.CROSS_SITE_COOKIES
    },
    redis: null
  });

  await app.listen({ port: env.API_PORT, host: '0.0.0.0' });

  let closing = false;
  const shutdown = async (signal: string) => {
    if (closing) return;
    closing = true;
    app.log.info({ signal }, 'encerrando');
    try {
      await app.close();
      await prisma.$disconnect();
      process.exit(0);
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((err) => {
  console.error('Falha ao iniciar a API:', err);
  process.exit(1);
});
