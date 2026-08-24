import type { FastifyInstance } from 'fastify';
import { ADMIN_COOKIE, createAdminSession, safeTokenCompare, verifyAdminSession } from '../admin-auth.js';
import type { PrismaClient } from '@prisma/client';

export function registerAdminRoutes(
  app: FastifyInstance,
  deps: {
    prisma: PrismaClient;
    env: { SESSION_SECRET: string; ADMIN_TOKEN: string; isProd: boolean; crossSiteCookies?: boolean };
  }
) {
  const { prisma, env } = deps;

  app.post<{ Body: { token?: string } }>(
    '/admin/login',
    { config: { rateLimit: { max: 8, timeWindow: '5 minutes' } } },
    async (req, reply) => {
      const token = req.body?.token ?? '';
      if (!token || !safeTokenCompare(token, env.ADMIN_TOKEN)) {
        return reply.code(401).send({ error: 'invalid_credentials' });
      }
      const session = createAdminSession(env.SESSION_SECRET);
      void reply.setCookie(ADMIN_COOKIE, session.value, {
        httpOnly: true,
        sameSite: env.crossSiteCookies ? 'none' : 'lax',
        secure: env.isProd,
        path: '/',
        maxAge: session.maxAge
      });
      await prisma.auditLog.create({
        data: { actor: 'admin', action: 'admin.login', target: 'session', metadata: {} }
      });
      return { ok: true };
    }
  );

  const requireAdmin = async (req: import('fastify').FastifyRequest, reply: import('fastify').FastifyReply) => {
    const cookie = req.cookies[ADMIN_COOKIE];
    const ok = verifyAdminSession(cookie, env.SESSION_SECRET);
    if (!ok) return reply.code(401).send({ error: 'unauthorized' });
  };

  app.get<{ Querystring: { q?: string; status?: string; page?: string } }>(
    '/admin/apps',
    { preHandler: [requireAdmin] },
    async (req) => {
      const page = Math.max(1, Number(req.query.page ?? 1));
      const limit = 20;
      const where: Record<string, unknown> = {};
      if (req.query.status) where.status = req.query.status;
      if (req.query.q) where.name = { contains: req.query.q, mode: 'insensitive' };
      const [total, apps] = await Promise.all([
        prisma.app.count({ where }),
        prisma.app.findMany({
          where,
          include: { category: true, vendor: true, _count: { select: { packages: true } } },
          orderBy: { name: 'asc' },
          skip: (page - 1) * limit,
          take: limit
        })
      ]);
      return {
        data: apps.map((a) => ({
          slug: a.slug,
          name: a.name,
          status: a.status,
          category: a.category.slug,
          vendor: a.vendor.name,
          packageCount: a._count.packages,
          updatedAt: a.updatedAt.toISOString()
        })),
        meta: { total, page, limit }
      };
    }
  );

  app.patch<{ Params: { slug: string }; Body: { status?: string } }>(
    '/admin/apps/:slug',
    { preHandler: [requireAdmin] },
    async (req, reply) => {
      const status = req.body?.status;
      if (!status || !['verified', 'pending_review', 'deprecated', 'blocked'].includes(status)) {
        return reply.code(400).send({ error: 'invalid_status' });
      }
      const existing = await prisma.app.findUnique({ where: { slug: req.params.slug } });
      if (!existing) return reply.code(404).send({ error: 'not_found' });
      const updated = await prisma.app.update({
        where: { slug: req.params.slug },
        data: { status: status as never, verifiedAt: status === 'verified' ? new Date() : existing.verifiedAt }
      });
      await prisma.auditLog.create({
        data: {
          actor: 'admin',
          action: 'app.status_changed',
          target: updated.slug,
          metadata: { from: existing.status, to: status }
        }
      });
      return { data: { slug: updated.slug, status: updated.status } };
    }
  );

  app.get<{ Querystring: { status?: string } }>(
    '/admin/contributions',
    { preHandler: [requireAdmin] },
    async (req) => {
      const rows = await prisma.contribution.findMany({
        where: req.query.status ? { status: req.query.status as never } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 100
      });
      return {
        data: rows.map((c) => ({ ...c, createdAt: c.createdAt.toISOString(), reviewedAt: c.reviewedAt?.toISOString() ?? null }))
      };
    }
  );

  app.patch<{ Params: { id: string }; Body: { action: 'approve' | 'reject'; note?: string } }>(
    '/admin/contributions/:id',
    { preHandler: [requireAdmin] },
    async (req, reply) => {
      const contribution = await prisma.contribution.findUnique({ where: { id: req.params.id } });
      if (!contribution) return reply.code(404).send({ error: 'not_found' });
      if (contribution.status !== 'pending') return reply.code(409).send({ error: 'already_reviewed' });

      if (req.body.action === 'reject') {
        await prisma.contribution.update({
          where: { id: contribution.id },
          data: { status: 'rejected', reviewNote: req.body.note ?? null, reviewedAt: new Date() }
        });
        await prisma.auditLog.create({ data: { actor: 'admin', action: 'contribution.rejected', target: String(contribution.id), metadata: {} } });
        return { data: { status: 'rejected' } };
      }

      const slug = contribution.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      if (await prisma.app.findUnique({ where: { slug } })) {
        return reply.code(409).send({ error: 'slug_exists' });
      }

      const categorySlug = contribution.categorySlug ?? 'utilitarios';
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (!category) return reply.code(400).send({ error: 'invalid_category' });

      const vendorName = 'Comunidade';
      const vendorSlug = 'comunidade';
      const vendor = await prisma.vendor.upsert({
        where: { slug: vendorSlug },
        update: {},
        create: { slug: vendorSlug, name: vendorName }
      });

      const app = await prisma.app.create({
        data: {
          slug,
          name: contribution.name,
          tagline: `Sugestão da comunidade — ${contribution.websiteUrl}`,
          description: contribution.notes ?? 'Aplicativo sugerido pela comunidade e aprovado para verificação.',
          websiteUrl: contribution.websiteUrl,
          license: 'freeware',
          iconKey: slug,
          color: '#71717A',
          popularity: 10,
          status: 'pending_review',
          tags: ['comunidade'],
          archs: ['x64'],
          oss: contribution.operatingSystems,
          vendorId: vendor.id,
          categoryId: category.id
        }
      });

      const pendingPackages: Array<{
        method: 'winget' | 'brew_cask' | 'flatpak';
        os: 'windows' | 'macos' | 'linux';
        packageId: string;
        repository?: string;
        source: 'official' | 'community';
        status: 'pending_review';
      }> = [];
      if (contribution.wingetId && contribution.operatingSystems.includes('windows')) {
        pendingPackages.push({ method: 'winget', os: 'windows', packageId: contribution.wingetId, source: 'official', status: 'pending_review' });
      }
      if (contribution.brewId && contribution.operatingSystems.includes('macos')) {
        pendingPackages.push({ method: 'brew_cask', os: 'macos', packageId: contribution.brewId, source: 'official', status: 'pending_review' });
      }
      if (contribution.flatpakId && contribution.operatingSystems.includes('linux')) {
        pendingPackages.push({ method: 'flatpak', os: 'linux', packageId: contribution.flatpakId, repository: 'flathub', source: 'community', status: 'pending_review' });
      }
      if (pendingPackages.length > 0) {
        await prisma.appPackage.createMany({
          data: pendingPackages.map((p) => ({ ...p, appId: app.id }))
        });
      }

      await prisma.contribution.update({
        where: { id: contribution.id },
        data: { status: 'approved', reviewedAt: new Date(), reviewNote: req.body.note ?? null }
      });
      await prisma.auditLog.create({ data: { actor: 'admin', action: 'contribution.approved', target: slug, metadata: {} } });
      return { data: { status: 'approved', slug } };
    }
  );

  app.get('/admin/overview', { preHandler: [requireAdmin] }, async () => {
    const [appsByStatus, pendingContributions, scriptsGenerated, recentAudit] = await Promise.all([
      prisma.app.groupBy({ by: ['status'], _count: true }),
      prisma.contribution.count({ where: { status: 'pending' } }),
      prisma.scriptStat.findUnique({ where: { id: 'global' } }),
      prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 15 })
    ]);
    return {
      data: {
        appsByStatus: Object.fromEntries(appsByStatus.map((s) => [s.status, s._count])),
        pendingContributions,
        scriptsGenerated: scriptsGenerated?.total ?? 0,
        recentAudit: recentAudit.map((l) => ({
          id: l.id,
          actor: l.actor,
          action: l.action,
          target: l.target,
          createdAt: l.createdAt.toISOString()
        }))
      }
    };
  });
}
