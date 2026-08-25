import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import type { LinuxDistro, OperatingSystem } from '@toolkit/shared';

export function detectOS(): OperatingSystem {
  if (process.platform === 'win32') return 'windows';
  if (process.platform === 'darwin') return 'macos';
  return 'linux';
}

const DISTRO_ID_MAP: Record<string, LinuxDistro> = {
  ubuntu: 'ubuntu',
  debian: 'debian',
  linuxmint: 'linuxmint',
  pop: 'pop',
  fedora: 'fedora',
  arch: 'arch'
};

export function detectDistro(): LinuxDistro {
  try {
    const raw = readFileSync('/etc/os-release', 'utf-8');
    const fields = new Map<string, string>();
    for (const line of raw.split('\n')) {
      const match = /^([A-Z_]+)=(.*)$/.exec(line.trim());
      if (!match?.[1] || match[2] === undefined) continue;
      fields.set(match[1], match[2].replace(/^"|"$/g, ''));
    }

    const id = fields.get('ID')?.toLowerCase() ?? '';
    if (DISTRO_ID_MAP[id]) return DISTRO_ID_MAP[id];

    const idLike = fields.get('ID_LIKE')?.toLowerCase() ?? '';
    for (const candidate of idLike.split(' ')) {
      if (DISTRO_ID_MAP[candidate]) return DISTRO_ID_MAP[candidate];
    }
  } catch {
    // /etc/os-release ausente (não é Linux, ou distro atípica) — cai no fallback abaixo
  }
  return 'other';
}

export interface OsInfo {
  os: OperatingSystem;
  distro: LinuxDistro | null;
  arch: string;
  platformLabel: string;
}

export function getOsInfo(): OsInfo {
  const os = detectOS();
  const distro = os === 'linux' ? detectDistro() : null;
  return {
    os,
    distro,
    arch: process.arch,
    platformLabel: `${process.platform} ${process.arch} (Node ${process.version})`
  };
}

const MANAGERS_BY_OS: Record<OperatingSystem, string[]> = {
  windows: ['winget', 'choco', 'scoop'],
  macos: ['brew'],
  linux: ['apt', 'dnf', 'pacman', 'flatpak', 'snap']
};

export function detectManagers(os: OperatingSystem): Record<string, boolean> {
  const managers = MANAGERS_BY_OS[os];
  const result: Record<string, boolean> = {};
  for (const manager of managers) {
    result[manager] = commandExists(manager);
  }
  return result;
}

function commandExists(command: string): boolean {
  const probe = process.platform === 'win32' ? 'where' : 'which';
  const res = spawnSync(probe, [command], { stdio: 'ignore' });
  return res.status === 0;
}
