import { config } from 'dotenv';
import { resolve } from 'node:path';
import { PrismaClient, type Os } from '@prisma/client';
import {
  allApps,
  categories as catalogCategories,
  collections,
  drivers,
  hardwareVendors
} from '@toolkit/catalog';

config({ path: resolve(import.meta.dirname, '../../..', '.env') });

const prisma = new PrismaClient();

const DAY_MS = 86_400_000;

async function main() {
  const now = new Date();

  console.log('→ Categorias');
  for (const c of catalogCategories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description ?? null, sortOrder: c.sortOrder },
      create: { slug: c.slug, name: c.name, description: c.description ?? null, sortOrder: c.sortOrder }
    });
  }

  const vendorNames = [...new Set(allApps.map((x) => x.vendor))];
  const driverVendorSlugs = new Map(drivers.map((d) => [d.vendorSlug, d]));
  console.log(`→ Fabricantes (${vendorNames.length})`);
  for (const name of vendorNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await prisma.vendor.upsert({
      where: { slug },
      update: { name },
      create: { slug, name, verified: true }
    });
  }
  for (const slug of driverVendorSlugs.keys()) {
    await prisma.vendor.upsert({
      where: { slug },
      update: {},
      create: { slug, name: slug.charAt(0).toUpperCase() + slug.slice(1), verified: true }
    });
  }

  console.log(`→ Aplicativos (${allApps.length})`);
  for (const app of allApps) {
    const vendorSlug = app.vendor.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const vendor = await prisma.vendor.findUniqueOrThrow({ where: { slug: vendorSlug } });
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: app.categorySlug } });

    const dbApp = await prisma.app.upsert({
      where: { slug: app.slug },
      update: {
        name: app.name,
        tagline: app.tagline,
        description: app.description,
        websiteUrl: app.websiteUrl,
        license: app.license,
        iconKey: app.iconKey,
        color: app.color,
        popularity: app.popularity,
        status: app.status === 'verified' ? 'verified' : 'pending_review',
        tags: app.tags,
        archs: app.archs,
        oss: app.oss,
        alternatives: app.alternatives,
        version: app.version,
        verifiedAt: app.status === 'verified' ? now : null,
        updatedAt: new Date(now.getTime() - app.updatedDaysAgo * DAY_MS),
        vendorId: vendor.id,
        categoryId: category.id
      },
      create: {
        slug: app.slug,
        name: app.name,
        tagline: app.tagline,
        description: app.description,
        websiteUrl: app.websiteUrl,
        license: app.license,
        iconKey: app.iconKey,
        color: app.color,
        popularity: app.popularity,
        status: app.status === 'verified' ? 'verified' : 'pending_review',
        tags: app.tags,
        archs: app.archs,
        oss: app.oss,
        alternatives: app.alternatives,
        version: app.version,
        verifiedAt: app.status === 'verified' ? now : null,
        updatedAt: new Date(now.getTime() - app.updatedDaysAgo * DAY_MS),
        addedAt: new Date(now.getTime() - Math.max(1, 120 - app.popularity) * DAY_MS),
        vendorId: vendor.id,
        categoryId: category.id
      }
    });

    await prisma.appPackage.deleteMany({ where: { appId: dbApp.id } });
    await prisma.appPackage.createMany({
      data: app.packages.map((p) => ({
        appId: dbApp.id,
        method: p.method,
        os: p.os,
        packageId: p.packageId ?? null,
        repository: p.repository ?? null,
        source: p.source,
        status: p.status,
        notes: p.notes ?? null,
        classic: p.classic ?? false,
        downloadUrl: p.url ?? null,
        lastCheckedAt: p.status === 'verified' ? now : null
      }))
    });
  }

  console.log(`→ Coleções (${collections.length})`);
  for (const col of collections) {
    const db = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: { name: col.name, description: col.description },
      create: { slug: col.slug, name: col.name, description: col.description, kind: 'profile' }
    });
    await prisma.collectionItem.deleteMany({ where: { collectionId: db.id } });
    let position = 0;
    for (const itemSlug of col.itemSlugs) {
      const appRow = await prisma.app.findUnique({ where: { slug: itemSlug } });
      if (!appRow) continue;
      await prisma.collectionItem.create({
        data: { collectionId: db.id, appId: appRow.id, position: position++ }
      });
    }
  }

  console.log(`→ Drivers (${drivers.length})`);
  for (const d of drivers) {
    const vendor = await prisma.vendor.upsert({
      where: { slug: d.vendorSlug },
      update: {},
      create: {
        slug: d.vendorSlug,
        name: d.vendorSlug.charAt(0).toUpperCase() + d.vendorSlug.slice(1),
        verified: true
      }
    });
    await prisma.driver.upsert({
      where: { slug: d.slug },
      update: {
        name: d.name,
        tagline: d.tagline,
        instructions: d.instructions,
        downloadUrl: d.downloadUrl,
        categories: d.categories,
        oss: d.oss.map((o) => o as Os),
        status: 'verified'
      },
      create: {
        slug: d.slug,
        name: d.name,
        tagline: d.tagline,
        instructions: d.instructions,
        downloadUrl: d.downloadUrl,
        vendorId: vendor.id,
        categories: d.categories,
        oss: d.oss.map((o) => o as Os),
        status: 'verified'
      }
    });
  }

  console.log(`→ Fabricantes de hardware (${hardwareVendors.length})`);
  for (const hv of hardwareVendors) {
    await prisma.hardwareVendor.upsert({
      where: { slug: hv.slug },
      update: { name: hv.name, supportUrl: hv.supportUrl, kind: hv.kind },
      create: hv
    });
  }

  await prisma.scriptStat.upsert({
    where: { id: 'global' },
    update: {},
    create: { id: 'global', total: 0 }
  });

  const counts = {
    apps: await prisma.app.count(),
    packages: await prisma.appPackage.count(),
    collections: await prisma.collection.count(),
    drivers: await prisma.driver.count()
  };
  console.log('✔ Seed concluído:', counts);
}

main()
  .catch((e) => {
    console.error('✖ Seed falhou:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
