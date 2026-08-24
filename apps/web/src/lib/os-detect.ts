'use client';

import { useEffect, useState } from 'react';
import type { LinuxDistro, OperatingSystem } from '@toolkit/shared';

export interface SystemInfo {
  os: OperatingSystem;
  label: string;
  arch: string;
  distro?: LinuxDistro;
}

function detectFromUA(): SystemInfo {
  const ua = navigator.userAgent;
  if (/Windows NT 10/.test(ua)) {
    return { os: 'windows', label: 'Windows 11', arch: 'x64' };
  }
  if (/Windows/.test(ua)) {
    return { os: 'windows', label: 'Windows', arch: 'x64' };
  }
  if (/Mac OS X|Macintosh/.test(ua)) {
    const arm = /arm|x86_64h/.test(navigator.platform) === false && /Safari/.test(ua);
    void arm;
    return { os: 'macos', label: 'macOS', arch: 'Apple Silicon / Intel' };
  }
  if (/Android/.test(ua)) {
    return { os: 'linux', label: 'Android (Linux)', arch: 'arm64', distro: 'other' };
  }
  if (/Linux|X11|CrOS/.test(ua)) {
    let distro: LinuxDistro | undefined;
    if (/Pop!_OS/i.test(ua)) distro = 'pop';
    else if (/Mint/i.test(ua)) distro = 'linuxmint';
    else if (/Fedora/i.test(ua)) distro = 'fedora';
    else if (/Arch/i.test(ua)) distro = 'arch';
    else distro = 'ubuntu';
    return { os: 'linux', label: 'Linux', arch: 'x86_64', distro };
  }
  return { os: 'windows', label: 'Windows', arch: 'x64' };
}

async function refineArch(info: SystemInfo): Promise<SystemInfo> {
  try {
    const uad = (navigator as Navigator & { userAgentData?: { getHighEntropyValues(hints: string[]): Promise<{ architecture?: string; bitness?: string; platformVersion?: string }> } }).userAgentData;
    if (!uad) return info;
    const details = await uad.getHighEntropyValues(['architecture', 'bitness', 'platformVersion']);
    const arch =
      details.architecture === 'arm'
        ? 'ARM64'
        : details.bitness === '64' && details.architecture
          ? `${details.architecture.toUpperCase()}64`
          : (details.architecture ?? info.arch);
    let label = info.label;
    if (info.os === 'windows' && details.platformVersion) {
      const major = Number(details.platformVersion.split('.')[0]);
      if (major >= 13) label = 'Windows 11';
      else label = 'Windows 10';
    }
    return { ...info, arch, label };
  } catch {
    return info;
  }
}

export function useDetectedSystem(): SystemInfo | null {
  const [system, setSystem] = useState<SystemInfo | null>(null);

  useEffect(() => {
    let active = true;
    const base = detectFromUA();
    setSystem(base);
    void refineArch(base).then((refined) => {
      if (active) setSystem(refined);
    });
    return () => {
      active = false;
    };
  }, []);

  return system;
}
