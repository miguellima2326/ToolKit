import {
  isValidPackageId,
  type InstallMethod,
  type LinuxDistro,
  type OperatingSystem
} from '@toolkit/shared';
import type { AutoItem, GeneratorApp, GeneratorPackage, GeneratorTarget, ManualItem, SelectionResult, UnavailableItem } from './types';

const PREFERENCES: Record<OperatingSystem, Record<string, InstallMethod[]>> = {
  windows: { '*': ['winget', 'chocolatey', 'scoop'] },
  macos: { '*': ['brew_formula', 'brew_cask', 'mas'] },
  linux: {
    ubuntu: ['apt', 'flatpak', 'snap'],
    debian: ['apt', 'flatpak', 'snap'],
    linuxmint: ['apt', 'flatpak', 'snap'],
    pop: ['apt', 'flatpak', 'snap'],
    fedora: ['dnf', 'flatpak', 'snap'],
    arch: ['pacman', 'flatpak', 'snap'],
    other: ['flatpak', 'snap']
  }
};

const SCRIPTED_METHODS: Partial<Record<InstallMethod, boolean>> = {
  winget: true,
  chocolatey: true,
  scoop: true,
  apt: true,
  dnf: true,
  pacman: true,
  flatpak: true,
  snap: true,
  brew_formula: true,
  brew_cask: true
};

export function managerForTarget(target: GeneratorTarget): InstallMethod | null {
  if (target.os === 'windows') return 'winget';
  if (target.os === 'macos') return 'brew_formula';
  if (target.os === 'linux' && target.distro) {
    const map: Record<LinuxDistro, string> = {
      ubuntu: 'apt',
      debian: 'apt',
      linuxmint: 'apt',
      pop: 'apt',
      fedora: 'dnf',
      arch: 'pacman',
      other: 'flatpak'
    };
    return map[target.distro] as InstallMethod;
  }
  return null;
}

function preferenceOrder(target: GeneratorTarget): InstallMethod[] {
  const table = PREFERENCES[target.os];
  if (!table) return [];
  const key = target.os === 'linux' ? (target.distro ?? 'other') : '*';
  return table[key] ?? [];
}

export function targetLabel(target: GeneratorTarget): string {
  if (target.os === 'windows') return 'Windows (Winget)';
  if (target.os === 'macos') return 'macOS (Homebrew)';
  const distroNames: Record<LinuxDistro, string> = {
    ubuntu: 'Ubuntu / Mint / Pop!_OS (APT + Flatpak)',
    debian: 'Debian (APT + Flatpak)',
    linuxmint: 'Linux Mint (APT + Flatpak)',
    pop: 'Pop!_OS (APT + Flatpak)',
    fedora: 'Fedora (DNF + Flatpak)',
    arch: 'Arch Linux (Pacman + Flatpak)',
    other: 'Linux (Flatpak)'
  };
  return distroNames[target.distro ?? 'other'];
}

export function selectPackages(apps: GeneratorApp[], target: GeneratorTarget): SelectionResult {
  const auto: AutoItem[] = [];
  const manual: ManualItem[] = [];
  const unavailable: UnavailableItem[] = [];
  const order = preferenceOrder(target);

  for (const app of apps) {
    if (!app.oss.includes(target.os)) {
      unavailable.push({
        slug: app.slug,
        name: app.name,
        reason: `Não disponível para ${target.os === 'linux' ? 'Linux' : target.os === 'macos' ? 'macOS' : 'Windows'}`
      });
      continue;
    }
    if (app.status === 'blocked') {
      unavailable.push({ slug: app.slug, name: app.name, reason: 'Pacote bloqueado pela curadoria' });
      continue;
    }

    const candidates = app.packages.filter(
      (p) => p.os === target.os && SCRIPTED_METHODS[p.method] && isValidPackageId(p.method, p.packageId ?? '')
    );
    let chosen: GeneratorPackage | undefined;
    for (const method of order) {
      chosen = candidates.find((p) => p.method === method && p.status === 'verified');
      if (chosen) break;
    }
    if (!chosen) {
      for (const method of order) {
        const pending = candidates.find((p) => p.method === method && p.status === 'pending_review');
        if (pending) {
          manual.push({
            slug: app.slug,
            name: app.name,
            reason: 'pending_review',
            url: app.websiteUrl,
            note:
              pending.notes ??
              'Pacote aguardando verificação de ID. Use a fonte oficial enquanto isso.'
          });
          chosen = undefined;
          break;
        }
      }
    }

    if (app.status === 'deprecated') {
      manual.push({
        slug: app.slug,
        name: app.name,
        reason: 'deprecated',
        url: app.websiteUrl,
        note: 'Aplicativo descontinuado no catálogo. Consulte o site oficial.'
      });
      continue;
    }

    if (chosen) {
      auto.push({ app, pkg: chosen });
      continue;
    }
    if (!manual.some((m) => m.slug === app.slug)) {
      const fallback = app.packages.find((p) => p.os === target.os && p.downloadUrl);
      const official = app.packages.find((p) => p.os === target.os && p.method === 'official_installer');
      manual.push({
        slug: app.slug,
        name: app.name,
        reason: 'no_auto_method',
        url: official?.downloadUrl ?? fallback?.downloadUrl ?? app.websiteUrl,
        note: 'Sem método automático seguro para este sistema — instale pelo site oficial.'
      });
    }
  }

  return { auto, manual, unavailable };
}
