import type { App } from '@prisma/client';
import type { AppDetail, AppSummary, InstallMethodDto } from '@toolkit/shared';

type FullApp = App & {
  vendor: { name: string };
  category: { name: string; slug: string };
  packages: Array<{
    method: InstallMethodDto['method'];
    os: 'windows' | 'linux' | 'macos';
    packageId: string | null;
    repository: string | null;
    source: 'official' | 'community' | 'system';
    status: 'verified' | 'pending_review' | 'deprecated' | 'blocked';
    notes: string | null;
    classic: boolean;
    downloadUrl: string | null;
    lastCheckedAt: Date | null;
  }>;
};

export function toSummary(app: FullApp): AppSummary {
  return {
    slug: app.slug,
    name: app.name,
    developer: app.vendor.name,
    tagline: app.tagline,
    category: app.category.name,
    categorySlug: app.category.slug,
    license: app.license,
    operatingSystems: app.oss,
    iconKey: app.iconKey,
    color: app.color,
    popularity: app.popularity,
    status: app.status
  };
}

export function toMethodDto(p: FullApp['packages'][number]): InstallMethodDto {
  return {
    method: p.method,
    os: p.os,
    packageId: p.packageId ?? undefined,
    repository: p.repository ?? undefined,
    source: p.source,
    status: p.status,
    url: p.downloadUrl ?? undefined,
    notes: p.notes ?? undefined,
    classic: p.classic || undefined,
    lastCheckedAt: p.lastCheckedAt?.toISOString()
  };
}

export function toDetail(app: FullApp, alternatives: AppSummary[]): AppDetail {
  return {
    ...toSummary(app),
    description: app.description,
    websiteUrl: app.websiteUrl,
    version: app.version,
    updatedAtLabel: null,
    tags: app.tags,
    architectures: app.archs,
    installMethods: app.packages.map(toMethodDto),
    alternatives
  };
}
