import { DISTRO_LABELS, type ScriptFormat } from '@toolkit/shared';
import { generateLinuxSh, generateMacSh, generateWindowsBat, generateWindowsPs1, buildSteps } from './generators';
import { selectPackages, targetLabel } from './select';
import type { GeneratedScript, GeneratorApp, GeneratorTarget } from './types';

export * from './types';
export { selectPackages, targetLabel, managerForTarget } from './select';

const LINUX_DISTRO_KEYS: Record<string, string> = {
  ubuntu: 'Ubuntu',
  debian: 'Debian',
  linuxmint: 'Linux Mint',
  pop: 'Pop!_OS',
  fedora: 'Fedora',
  arch: 'Arch Linux',
  other: 'Linux'
};

function filenameFor(target: GeneratorTarget, format: ScriptFormat): string {
  if (target.os === 'windows') return format === 'bat' ? 'toolkit-instalar-windows.bat' : 'toolkit-instalar-windows.ps1';
  if (target.os === 'macos') return 'toolkit-instalar-macos.sh';
  const key = LINUX_DISTRO_KEYS[target.distro ?? 'other']?.toLowerCase().replace(/\s+/g, '-') ?? 'linux';
  return `toolkit-instalar-${key}.sh`;
}

export function buildInstallScript(
  apps: GeneratorApp[],
  target: GeneratorTarget,
  requestedFormat?: ScriptFormat
): GeneratedScript {
  if (target.os === 'linux' && !target.distro) {
    throw new Error('distro é obrigatório para Linux');
  }

  const format: ScriptFormat =
    requestedFormat ??
    (target.os === 'windows' ? 'ps1' : 'sh');

  if (target.os === 'windows' && format !== 'ps1' && format !== 'bat') {
    throw new Error('formato inválido para Windows');
  }
  if (target.os !== 'windows' && format !== 'sh') {
    throw new Error('formato inválido para este sistema');
  }

  const selection = selectPackages(apps, target);
  const now = new Date();
  const distroKey = target.os === 'linux' ? (LINUX_DISTRO_KEYS[target.distro ?? 'other'] ?? 'Linux') : '';

  let script: string;
  if (target.os === 'windows') {
    script =
      format === 'bat'
        ? generateWindowsBat(selection.auto)
        : generateWindowsPs1(selection.auto, selection.manual, now);
  } else if (target.os === 'macos') {
    script = generateMacSh(selection.auto, selection.manual, now);
  } else {
    script = generateLinuxSh(
      selection.auto,
      selection.manual,
      `${distroKey} · ${DISTRO_LABELS[target.distro ?? 'other']}`,
      now
    );
  }

  return {
    target: { os: target.os, distro: target.os === 'linux' ? target.distro : null, label: targetLabel(target) },
    format,
    filename: filenameFor(target, format),
    contentType:
      format === 'ps1'
        ? 'text/plain; charset=utf-8'
        : format === 'bat'
          ? 'text/plain; charset=utf-8'
          : 'application/x-sh; charset=utf-8',
    script,
    steps: buildSteps(selection.auto, target.os),
    autoCount: selection.auto.length,
    manualCount: selection.manual.length,
    manual: selection.manual,
    unavailable: selection.unavailable
  };
}
