import type { App, AppPackage, Category, Vendor } from '@prisma/client';
import type { AppSummary, InstallMethodDto } from '@toolkit/shared';
import { hasLocalIcon } from './local-icon';

type Row = App & { vendor: Vendor; category: Category };

export function toSummary(app: Row): AppSummary {
  return {
    slug: app.slug,
    name: app.name,
    developer: app.vendor.name,
    tagline: app.tagline,
    category: app.category.name,
    categorySlug: app.category.slug,
    license: app.license,
    operatingSystems: app.oss as AppSummary['operatingSystems'],
    iconKey: app.iconKey,
    color: app.color,
    popularity: app.popularity,
    status: app.status,
    hasLocalIcon: hasLocalIcon(app.iconKey)
  };
}

export function toMethodDto(p: AppPackage): InstallMethodDto {
  return {
    method: p.method,
    os: p.os as InstallMethodDto['os'],
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
