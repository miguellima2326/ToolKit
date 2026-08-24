import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { randomUUID } from 'node:crypto';
import { createRepo } from './repo.js';
import { registerAppRoutes } from './routes/apps.js';
import { registerTaxonomyRoutes } from './routes/taxonomy.js';
import { registerInstallScriptRoutes } from './routes/install-script.js';
import { registerToolkitRoutes } from './routes/toolkits.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerSuggestionRoutes } from './routes/suggestions.js';
import { registerAdminRoutes } from './routes/admin.js';

export interface BuildOptions {
  prisma: import('@prisma/client').PrismaClient;
  env: {
    NODE_ENV: string;
    WEB_ORIGIN: string;
    SESSION_SECRET: string;
    ADMIN_TOKEN: string;
    crossSiteCookies?: boolean;
  };
  redis?: { ping(): Promise<string> } | null;
}

async function v1Routes(app: FastifyInstance, opts: BuildOptions) {
  const repo = createRepo({ prisma: opts.prisma });

  app.get('/search', { config: { rateLimit: { max: 120, timeWindow: '1 minute' } } }, async (req) => {
    const q = String((req.query as Record<string, string>).q ?? '').slice(0, 80);
    return repo.searchAll(q);
  });

  registerAppRoutes(app, { prisma: opts.prisma });
  registerTaxonomyRoutes(app, { prisma: opts.prisma });
  registerToolkitRoutes(app, { prisma: opts.prisma });
  registerInstallScriptRoutes(app, { prisma: opts.prisma });
  registerSuggestionRoutes(app, { prisma: opts.prisma });
  registerAdminRoutes(app, {
    prisma: opts.prisma,
    env: {
      SESSION_SECRET: opts.env.SESSION_SECRET,
      ADMIN_TOKEN: opts.env.ADMIN_TOKEN,
      isProd: opts.env.NODE_ENV === 'production',
      crossSiteCookies: opts.env.crossSiteCookies ?? false
    }
  });
}

export async function buildApp(opts: BuildOptions): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
      redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie', 'req.body.token'],
        censor: '[REDACTED]'
      },
      base: { service: 'toolkit-api' }
    },
    genReqId: () => randomUUID(),
    trustProxy: true,
    bodyLimit: 32 * 1024
  });

  app.setErrorHandler((error: Error & { statusCode?: number }, req, reply) => {
    const statusCode = error.statusCode ?? 500;
    if (statusCode >= 500) req.log.error({ err: error }, 'erro interno');
    const message = statusCode >= 500 ? 'Erro interno. Tente novamente.' : String(error);
    void reply.code(statusCode).send({
      error: statusCode >= 500 ? 'internal_error' : 'request_error',
      requestId: req.id,
      message
    });
  });

  const origins = opts.env.WEB_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || origins.includes(origin)) return cb(null, true);
      cb(null, false);
    },
    credentials: true,
    maxAge: 86400
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    frameguard: { action: 'deny' }
  });

  await app.register(cookie);
  await app.register(rateLimit, { global: true, max: 300, timeWindow: '1 minute' });

  await app.register(async (scope) => v1Routes(scope as never, opts), { prefix: '/api/v1' });
  registerHealthRoutes(app, { prisma: opts.prisma, redis: opts.redis ?? null });

  app.setNotFoundHandler(async (_req, reply) => {
    void reply.code(404).send({ error: 'not_found' });
  });

  return app;
}
