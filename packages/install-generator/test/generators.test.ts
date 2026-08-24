import { describe, expect, it } from 'vitest';
import { buildInstallScript, type GeneratorApp } from '../src';

const pkg = (
  method: GeneratorApp['packages'][number]['method'],
  os: 'windows' | 'macos' | 'linux',
  packageId: string,
  repository: string | null = null
) => ({ method, os, packageId, repository, source: 'official' as const, status: 'verified' as const, notes: null, classic: false });

const app = (over: Partial<GeneratorApp> = {}): GeneratorApp => ({
  slug: 'google-chrome',
  name: 'Google Chrome',
  tagline: '',
  websiteUrl: 'https://www.google.com/chrome/',
  oss: ['windows', 'macos', 'linux'],
  status: 'verified',
  packages: [
    pkg('winget', 'windows', 'Google.Chrome'),
    pkg('brew_cask', 'macos', 'google-chrome'),
    { ...pkg('flatpak', 'linux', 'com.google.Chrome', 'flathub'), source: 'community' as const }
  ],
  ...over
});

describe('install-generator', () => {
  it('gera PowerShell com winget, resumo e tratamento de erro', async () => {
    const out = buildInstallScript([app()], { os: 'windows', distro: null });
    expect(out.format).toBe('ps1');
    expect(out.script).toContain('winget install --id $app.Id --exact --silent');
    expect(out.script).toContain('Test-Winget');
    expect(out.script).toContain('RESUMO');
    expect(out.script).toContain('Google.Chrome');
    expect(out.steps[0]).toContain('Winget');
    expect(out.autoCount).toBe(1);
    expect(out.manualCount).toBe(0);
  });

  it('gera bat sob demanda e sh para linux com apt e flatpak', () => {
    const bat = buildInstallScript([app()], { os: 'windows', distro: null }, 'bat');
    expect(bat.filename).toBe('toolkit-instalar-windows.bat');
    expect(bat.script).toContain('@echo off');

    const git = app({
      slug: 'git',
      name: 'Git',
      packages: [pkg('apt', 'linux', 'git'), pkg('flatpak', 'linux', 'org.git.Git', 'flathub')]
    });
    const sh = buildInstallScript([app(), git], { os: 'linux', distro: 'ubuntu' });
    expect(sh.format).toBe('sh');
    expect(sh.script).toContain('APT_PACKAGES=(git)');
    expect(sh.script).toContain('FLATPAK_PACKAGES=(com.google.Chrome)');
    expect(sh.script).toContain('#!/usr/bin/env bash');
  });

  it('gera Homebrew para macOS separando formulas e casks', () => {
    const git = app({ slug: 'git', name: 'Git', packages: [pkg('brew_formula', 'macos', 'git')] });
    const mac = buildInstallScript([app(), git], { os: 'macos', distro: null });
    expect(mac.script).toContain('BREW_CASKS=(google-chrome)');
    expect(mac.script).toContain('BREW_FORMULAS=(git)');
    expect(mac.script).toContain('brew install --cask "$c"');
  });

  it('envia app sem metodo automatico para lista manual', () => {
    const manualApp = app({ slug: 'figma-x', name: 'Figma X', packages: [] });
    const out = buildInstallScript([manualApp], { os: 'windows', distro: null });
    expect(out.autoCount).toBe(0);
    expect(out.manualCount).toBe(1);
    expect(out.manual[0]!.reason).toBe('no_auto_method');
  });

  it('marca apps de SO incompativel como indisponiveis', () => {
    const winOnly = app({
      slug: 'powertoys',
      name: 'PowerToys',
      oss: ['windows'],
      packages: [pkg('winget', 'windows', 'Microsoft.PowerToys')]
    });
    const out = buildInstallScript([winOnly], { os: 'linux', distro: 'fedora' });
    expect(out.unavailable).toHaveLength(1);
    expect(out.unavailable[0]!.slug).toBe('powertoys');
    expect(out.autoCount).toBe(0);
  });

  it('exige distro no Linux e rejeita formato invalido', () => {
    expect(() => buildInstallScript([app()], { os: 'linux', distro: null })).toThrow();
    expect(() => buildInstallScript([app()], { os: 'windows', distro: null }, 'sh')).toThrow();
  });

  it('nunca interpola packageId fora da allowlist', async () => {
    const evil = app({
      slug: 'evil-app',
      name: 'Evil App',
      status: 'verified',
      oss: ['windows'],
      packages: [
        {
          method: 'winget',
          os: 'windows',
          packageId: 'Foo.Bar; Remove-Item C:\\ -Recurse',
          repository: null,
          source: 'official',
          status: 'verified',
          notes: null,
          classic: false
        }
      ]
    });
    const out = buildInstallScript([evil], { os: 'windows', distro: null });
    expect(out.script).not.toContain('Remove-Item');
    expect(out.manualCount).toBe(1);
  });
});
