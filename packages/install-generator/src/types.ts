import type {
  LinuxDistro,
  OperatingSystem,
  PackageStatus,
  ScriptFormat,
  SourceKind
} from '@toolkit/shared';
import type { InstallMethod } from '@toolkit/shared';

export interface GeneratorPackage {
  method: InstallMethod;
  os: OperatingSystem;
  packageId: string | null;
  repository: string | null;
  source: SourceKind;
  status: PackageStatus;
  notes: string | null;
  classic: boolean;
  downloadUrl?: string | null;
}

export interface GeneratorApp {
  slug: string;
  name: string;
  tagline: string;
  websiteUrl: string;
  oss: OperatingSystem[];
  status: PackageStatus;
  packages: GeneratorPackage[];
}

export interface GeneratorTarget {
  os: OperatingSystem;
  distro: LinuxDistro | null;
}

export interface AutoItem {
  app: GeneratorApp;
  pkg: GeneratorPackage;
}

export interface ManualItem {
  slug: string;
  name: string;
  reason: 'no_auto_method' | 'pending_review' | 'deprecated';
  url?: string;
  note?: string;
}

export interface UnavailableItem {
  slug: string;
  name: string;
  reason: string;
}

export interface SelectionResult {
  auto: AutoItem[];
  manual: ManualItem[];
  unavailable: UnavailableItem[];
}

export interface GeneratedScript {
  target: { os: OperatingSystem; distro: LinuxDistro | null; label: string };
  format: ScriptFormat;
  filename: string;
  contentType: string;
  script: string;
  steps: string[];
  autoCount: number;
  manualCount: number;
  manual: ManualItem[];
  unavailable: UnavailableItem[];
}
