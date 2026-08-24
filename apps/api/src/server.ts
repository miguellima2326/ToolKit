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
    env,
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
