import { z } from 'zod';
import {
  ARCHITECTURES,
  APP_STATUSES,
  INSTALL_METHODS,
  LICENSE_TYPES,
  LINUX_DISTROS,
  OPERATING_SYSTEMS,
  PACKAGE_STATUSES,
  SCRIPT_FORMATS,
  SOURCE_KINDS
} from './constants';

export const osSchema = z.enum(OPERATING_SYSTEMS);
export const archSchema = z.enum(ARCHITECTURES);
export const licenseSchema = z.enum(LICENSE_TYPES);
export const methodSchema = z.enum(INSTALL_METHODS);
export const sourceKindSchema = z.enum(SOURCE_KINDS);
export const appStatusSchema = z.enum(APP_STATUSES);
export const packageStatusSchema = z.enum(PACKAGE_STATUSES);
export const distroSchema = z.enum(LINUX_DISTROS);
export const scriptFormatSchema = z.enum(SCRIPT_FORMATS);

export const slugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug inválido');

export const installMethodDtoSchema = z.object({
  method: methodSchema,
  os: osSchema,
  packageId: z.string().max(120).optional(),
  repository: z.string().max(160).optional(),
  source: sourceKindSchema,
  status: packageStatusSchema,
  url: z.string().url().startsWith('https://').max(500).optional(),
  notes: z.string().max(300).optional(),
  classic: z.boolean().optional(),
  lastCheckedAt: z.string().datetime().optional()
});

export type InstallMethodDto = z.infer<typeof installMethodDtoSchema>;

export const appSummarySchema = z.object({
  slug: slugSchema,
  name: z.string().min(1).max(120),
  developer: z.string().min(1).max(120),
  tagline: z.string().min(1).max(200),
  category: z.string().min(1).max(60),
  categorySlug: slugSchema,
  license: licenseSchema,
  operatingSystems: z.array(osSchema),
  iconKey: z.string().max(80),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  popularity: z.number().int().min(0).max(100),
  status: appStatusSchema,
  hasLocalIcon: z.boolean().optional()
});

export type AppSummary = z.infer<typeof appSummarySchema>;

export const appDetailSchema = appSummarySchema.extend({
  description: z.string().max(4000),
  websiteUrl: z.string().url(),
  version: z.string().max(40).nullable(),
  updatedAtLabel: z.string().max(60).nullable(),
  tags: z.array(z.string().max(40)),
  architectures: z.array(archSchema),
  installMethods: z.array(installMethodDtoSchema),
  alternatives: z.array(appSummarySchema.partial({ hasLocalIcon: true })).optional()
});

export type AppDetail = z.infer<typeof appDetailSchema>;

export const categorySchema = z.object({
  slug: slugSchema,
  name: z.string().min(1).max(60),
  description: z.string().max(240).optional(),
  appCount: z.number().int().min(0).optional()
});

export type CategoryDto = z.infer<typeof categorySchema>;

export const collectionSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1).max(80),
  description: z.string().max(240),
  kind: z.enum(['profile', 'shared']),
  apps: z.array(appSummarySchema)
});

export type CollectionDto = z.infer<typeof collectionSchema>;

export const searchResponseSchema = z.object({
  query: z.string(),
  apps: z.array(appSummarySchema),
  categories: z.array(categorySchema),
  collections: z.array(z.object({ slug: slugSchema, name: z.string() })),
  didYouMean: z.array(appSummarySchema).optional()
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;

export const statsSchema = z.object({
  apps: z.number().int().min(0),
  drivers: z.number().int().min(0),
  sharedKits: z.number().int().min(0),
  scriptsGenerated: z.number().int().min(0),
  categories: z.number().int().min(0)
});

export type StatsDto = z.infer<typeof statsSchema>;

export const installScriptRequestSchema = z
  .object({
    slugs: z.array(slugSchema).min(1).max(50),
    os: osSchema,
    distro: distroSchema.optional(),
    format: scriptFormatSchema.optional()
  })
  .refine((v) => v.os !== 'linux' || !!v.distro, {
    message: 'distro é obrigatório para Linux',
    path: ['distro']
  })
  .refine((v) => !v.format || v.os === 'windows' || v.format === 'sh', {
    message: 'format inválido para este SO: linux/macos só aceitam "sh"',
    path: ['format']
  })
  .refine((v) => !v.format || v.os !== 'windows' || v.format !== 'sh', {
    message: 'format inválido para este SO: windows aceita "ps1" ou "bat"',
    path: ['format']
  });

export type InstallScriptRequest = z.infer<typeof installScriptRequestSchema>;

export const manualInstallSchema = z.object({
  slug: slugSchema,
  name: z.string(),
  reason: z.enum(['no_auto_method', 'pending_review', 'deprecated']),
  url: z.string().url().optional(),
  note: z.string().max(300).optional()
});

export const installScriptResponseSchema = z.object({
  target: z.object({
    os: osSchema,
    distro: distroSchema.nullable(),
    label: z.string()
  }),
  format: scriptFormatSchema,
  filename: z.string(),
  contentType: z.string(),
  script: z.string(),
  steps: z.array(z.string()),
  autoCount: z.number().int().min(0),
  manualCount: z.number().int().min(0),
  manual: z.array(manualInstallSchema),
  unavailable: z.array(z.object({ slug: slugSchema, name: z.string(), reason: z.string() }))
});

export type InstallScriptResponse = z.infer<typeof installScriptResponseSchema>;

export const createToolkitSchema = z.object({
  title: z.string().trim().min(1).max(80).optional(),
  slugs: z.array(slugSchema).min(1).max(50)
});

export type CreateToolkitInput = z.infer<typeof createToolkitSchema>;

export const suggestionCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  websiteUrl: z.string().url().startsWith('https://').max(300),
  categorySlug: slugSchema.optional(),
  operatingSystems: z.array(osSchema).min(1),
  wingetId: z.string().max(120).optional(),
  brewId: z.string().max(120).optional(),
  flatpakId: z.string().max(120).optional(),
  notes: z.string().max(600).optional(),
  contact: z.string().email().max(160).optional()
});

export type SuggestionCreateInput = z.infer<typeof suggestionCreateSchema>;
