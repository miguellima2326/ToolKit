import type {
  Architecture,
  InstallMethod,
  LicenseType,
  OperatingSystem,
  PackageStatus,
  SourceKind
} from '@toolkit/shared';

export interface CatalogPackage {
  method: InstallMethod;
  os: OperatingSystem;
  packageId?: string;
  repository?: string;
  source: SourceKind;
  status: PackageStatus;
  notes?: string;
  classic?: boolean;
  url?: string;
}

export interface CatalogApp {
  slug: string;
  name: string;
  vendor: string;
  categorySlug: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  license: LicenseType;
  iconKey: string;
  color: string;
  popularity: number;
  status: PackageStatus;
  version: string | null;
  updatedDaysAgo: number;
  tags: string[];
  archs: Architecture[];
  oss: OperatingSystem[];
  alternatives: string[];
  packages: CatalogPackage[];
}

export interface CatalogDriver {
  slug: string;
  name: string;
  vendorSlug: string;
  tagline: string;
  instructions: string;
  downloadUrl: string;
  categories: string[];
  oss: OperatingSystem[];
}

export interface CatalogHardwareVendor {
  slug: string;
  name: string;
  supportUrl: string;
  kind: string;
}

export interface CatalogCategory {
  slug: string;
  name: string;
  description?: string;
  sortOrder: number;
}

export interface CatalogCollection {
  slug: string;
  name: string;
  description: string;
  itemSlugs: string[];
}

export const W = (
  packageId: string,
  overrides: Partial<CatalogPackage> = {}
): CatalogPackage => ({
  method: 'winget',
  os: 'windows',
  packageId,
  source: 'official',
  status: 'verified',
  ...overrides
});

export const BF = (packageId: string, overrides: Partial<CatalogPackage> = {}): CatalogPackage => ({
  method: 'brew_formula',
  os: 'macos',
  packageId,
  source: 'official',
  status: 'verified',
  ...overrides
});

export const BC = (packageId: string, overrides: Partial<CatalogPackage> = {}): CatalogPackage => ({
  method: 'brew_cask',
  os: 'macos',
  packageId,
  source: 'official',
  status: 'verified',
  ...overrides
});

export const FP = (packageId: string, overrides: Partial<CatalogPackage> = {}): CatalogPackage => ({
  method: 'flatpak',
  os: 'linux',
  packageId,
  repository: 'flathub',
  source: 'community',
  status: 'verified',
  ...overrides
});

export const SN = (packageId: string, overrides: Partial<CatalogPackage> = {}): CatalogPackage => ({
  method: 'snap',
  os: 'linux',
  packageId,
  repository: 'snapcraft',
  source: 'community',
  status: 'verified',
  ...overrides
});

export const AP = (packageId: string, overrides: Partial<CatalogPackage> = {}): CatalogPackage => ({
  method: 'apt',
  os: 'linux',
  packageId,
  source: 'system',
  status: 'verified',
  ...overrides
});

export const DN = (packageId: string, overrides: Partial<CatalogPackage> = {}): CatalogPackage => ({
  method: 'dnf',
  os: 'linux',
  packageId,
  source: 'system',
  status: 'verified',
  ...overrides
});

export const PC = (packageId: string, overrides: Partial<CatalogPackage> = {}): CatalogPackage => ({
  method: 'pacman',
  os: 'linux',
  packageId,
  repository: 'extra',
  source: 'community',
  status: 'verified',
  ...overrides
});

export const OI = (url: string, os: OperatingSystem, overrides: Partial<CatalogPackage> = {}) =>
  ({ method: 'official_installer', os, url, source: 'official', status: 'verified', ...overrides }) as CatalogPackage;

export const DL = (url: string, os: OperatingSystem, overrides: Partial<CatalogPackage> = {}) =>
  ({ method: 'download', os, url, source: 'official', status: 'verified', ...overrides }) as CatalogPackage;
