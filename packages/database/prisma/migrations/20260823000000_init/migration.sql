-- Toolkit: extensões e índices de busca
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Os" AS ENUM ('windows', 'linux', 'macos');

-- CreateEnum
CREATE TYPE "Arch" AS ENUM ('x64', 'arm64', 'x86', 'universal');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('open_source', 'freeware', 'freemium', 'paid');

-- CreateEnum
CREATE TYPE "InstallMethod" AS ENUM ('winget', 'chocolatey', 'scoop', 'msstore', 'apt', 'dnf', 'pacman', 'flatpak', 'snap', 'appimage', 'brew_formula', 'brew_cask', 'mas', 'official_installer', 'download');

-- CreateEnum
CREATE TYPE "SourceKind" AS ENUM ('official', 'community', 'system');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('verified', 'pending_review', 'deprecated', 'blocked');

-- CreateEnum
CREATE TYPE "CollectionKind" AS ENUM ('profile', 'shared');

-- CreateEnum
CREATE TYPE "ContributionStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "license" "LicenseType" NOT NULL,
    "iconKey" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#71717A',
    "version" TEXT,
    "popularity" INTEGER NOT NULL DEFAULT 50,
    "status" "Status" NOT NULL DEFAULT 'pending_review',
    "tags" TEXT[],
    "archs" "Arch"[],
    "oss" "Os"[],
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "vendorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "alternatives" TEXT[],

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppPackage" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "method" "InstallMethod" NOT NULL,
    "os" "Os" NOT NULL,
    "packageId" TEXT,
    "repository" TEXT,
    "source" "SourceKind" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pending_review',
    "notes" TEXT,
    "classic" BOOLEAN NOT NULL DEFAULT false,
    "downloadUrl" TEXT,
    "lastCheckedAt" TIMESTAMP(3),

    CONSTRAINT "AppPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "sha256" TEXT,
    "signatureNote" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "result" "Status" NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "categories" TEXT[],
    "oss" "Os"[],
    "status" "Status" NOT NULL DEFAULT 'pending_review',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HardwareVendor" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "supportUrl" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "HardwareVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "kind" "CollectionKind" NOT NULL DEFAULT 'profile',
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionItem" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedToolkit" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT,
    "slugs" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedToolkit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "categorySlug" TEXT,
    "operatingSystems" "Os"[],
    "wingetId" TEXT,
    "brewId" TEXT,
    "flatpakId" TEXT,
    "notes" TEXT,
    "contact" TEXT,
    "status" "ContributionStatus" NOT NULL DEFAULT 'pending',
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScriptStat" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "total" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScriptStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "mfaSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_slug_key" ON "Vendor"("slug");

-- CreateIndex
CREATE INDEX "Vendor_name_idx" ON "Vendor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "App_slug_key" ON "App"("slug");

-- CreateIndex
CREATE INDEX "App_status_popularity_idx" ON "App"("status", "popularity");

-- CreateIndex
CREATE INDEX "App_categoryId_idx" ON "App"("categoryId");

-- CreateIndex
CREATE INDEX "App_vendorId_idx" ON "App"("vendorId");

-- CreateIndex
CREATE INDEX "App_name_idx" ON "App"("name");

-- CreateIndex
CREATE INDEX "App_updatedAt_idx" ON "App"("updatedAt");

-- CreateIndex
CREATE INDEX "AppPackage_appId_idx" ON "AppPackage"("appId");

-- CreateIndex
CREATE INDEX "AppPackage_method_status_idx" ON "AppPackage"("method", "status");

-- CreateIndex
CREATE INDEX "AppPackage_packageId_idx" ON "AppPackage"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "AppPackage_appId_method_os_packageId_key" ON "AppPackage"("appId", "method", "os", "packageId");

-- CreateIndex
CREATE INDEX "Verification_checkedAt_idx" ON "Verification"("checkedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_slug_key" ON "Driver"("slug");

-- CreateIndex
CREATE INDEX "Driver_status_idx" ON "Driver"("status");

-- CreateIndex
CREATE INDEX "Driver_name_idx" ON "Driver"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HardwareVendor_slug_key" ON "HardwareVendor"("slug");

-- CreateIndex
CREATE INDEX "HardwareVendor_kind_idx" ON "HardwareVendor"("kind");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_slug_key" ON "Collection"("slug");

-- CreateIndex
CREATE INDEX "Collection_kind_idx" ON "Collection"("kind");

-- CreateIndex
CREATE INDEX "CollectionItem_collectionId_idx" ON "CollectionItem"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionItem_collectionId_appId_key" ON "CollectionItem"("collectionId", "appId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedToolkit_code_key" ON "SharedToolkit"("code");

-- CreateIndex
CREATE INDEX "SharedToolkit_createdAt_idx" ON "SharedToolkit"("createdAt");

-- CreateIndex
CREATE INDEX "Contribution_status_createdAt_idx" ON "Contribution"("status", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actor_action_idx" ON "AuditLog"("actor", "action");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppPackage" ADD CONSTRAINT "AppPackage_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "AppPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Índices de busca (trigram + FTS)
CREATE INDEX IF NOT EXISTS "app_name_trgm_idx" ON "App" USING gin ("name" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "app_tags_gin_idx" ON "App" USING gin ("tags");
CREATE INDEX IF NOT EXISTS "app_search_fts_idx" ON "App" USING gin (
  to_tsvector('simple'::regconfig, "name" || ' ' || "tagline")
);
