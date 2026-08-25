import { describe, expect, it } from 'vitest';
import { isValidPackageId, isScriptedMethod, isValidRepository } from '../src/allowlist';

describe('allowlist de pacotes', () => {
  it('aceita ids válidos de todos os métodos', () => {
    expect(isValidPackageId('winget', 'Google.Chrome')).toBe(true);
    expect(isValidPackageId('winget', 'Microsoft.VisualStudioCode')).toBe(true);
    expect(isValidPackageId('winget', 'Microsoft.VCRedist.2015+.x64')).toBe(true);
    expect(isValidPackageId('winget', 'Microsoft.VCRedist.2015+.x86')).toBe(true);
    expect(isValidPackageId('winget', 'Open-Shell.Open-Shell-Menu')).toBe(true);
    expect(isValidPackageId('winget', 'PeterPawlowski.foobar2000')).toBe(true);
    expect(isValidPackageId('chocolatey', '7zip')).toBe(true);
    expect(isValidPackageId('scoop', 'git')).toBe(true);
    expect(isValidPackageId('apt', 'git')).toBe(true);
    expect(isValidPackageId('apt', 'libstdc++6')).toBe(true);
    expect(isValidPackageId('dnf', 'python3-pip')).toBe(true);
    expect(isValidPackageId('pacman', 'jdk21-openjdk')).toBe(true);
    expect(isValidPackageId('flatpak', 'com.google.Chrome')).toBe(true);
    expect(isValidPackageId('flatpak', 'org.mozilla.firefox')).toBe(true);
    expect(isValidPackageId('snap', 'firefox')).toBe(true);
    expect(isValidPackageId('brew_formula', 'ollama')).toBe(true);
    expect(isValidPackageId('brew_cask', 'visual-studio-code')).toBe(true);
    expect(isValidPackageId('brew_formula', 'temurin@21')).toBe(true);
    expect(isValidPackageId('mas', 'xcode')).toBe(true);
  });

  it('rejeita injeção de shell e caracteres perigosos', () => {
    expect(isValidPackageId('winget', 'Google.Chrome; rm -rf /')).toBe(false);
    expect(isValidPackageId('winget', 'Google.Chrome & calc')).toBe(false);
    expect(isValidPackageId('winget', 'Google.Chrome | echo pwned')).toBe(false);
    expect(isValidPackageId('apt', 'git$(curl evil)')).toBe(false);
    expect(isValidPackageId('apt', 'git;cat /etc/passwd')).toBe(false);
    expect(isValidPackageId('apt', 'git`id`')).toBe(false);
    expect(isValidPackageId('flatpak', 'org.app`id')).toBe(false);
    expect(isValidPackageId('winget', 'Pkg%PATH%')).toBe(false);
    expect(isValidPackageId('winget', 'Pkg"quote')).toBe(false);
    expect(isValidPackageId("winget", "Pkg'quote")).toBe(false);
    expect(isValidPackageId('winget', 'Pkg$env:X')).toBe(false);
    expect(isValidPackageId('winget', 'Pkg\nnewline')).toBe(false);
    expect(isValidPackageId('winget', 'Pkg\ttab')).toBe(false);
    expect(isValidPackageId('winget', '-Pkg')).toBe(false);
    expect(isValidPackageId('winget', '.Pkg')).toBe(false);
    expect(isValidPackageId('winget', '+Pkg')).toBe(false);
    expect(isValidPackageId('winget', 'Pkg espaço')).toBe(false);
    expect(isValidPackageId('winget', 'Pkg/../../etc')).toBe(false);
  });

  it('rejeita ids acima do limite de tamanho', () => {
    expect(isValidPackageId('winget', 'A'.repeat(121))).toBe(false);
    expect(isValidPackageId('winget', 'A'.repeat(120))).toBe(true);
    expect(isValidPackageId('apt', 'a'.repeat(81))).toBe(false);
    expect(isValidPackageId('apt', 'a'.repeat(80))).toBe(true);
    expect(isValidPackageId('flatpak', `a${'.b'.repeat(80)}`)).toBe(false);
  });

  it('métodos não scriptados nunca viram comando', () => {
    expect(isValidPackageId('download', 'qualquer-coisa')).toBe(false);
    expect(isValidPackageId('official_installer', 'Google.Chrome')).toBe(false);
    expect(isScriptedMethod('official_installer')).toBe(false);
    expect(isScriptedMethod('download')).toBe(false);
    expect(isScriptedMethod('winget')).toBe(true);
    expect(isScriptedMethod('flatpak')).toBe(true);
    expect(isScriptedMethod('brew_cask')).toBe(true);
  });

  it('valida repositórios', () => {
    expect(isValidRepository('flathub')).toBe(true);
    expect(isValidRepository('extra')).toBe(true);
    expect(isValidRepository('flathub; rm -rf /')).toBe(false);
  });
});
