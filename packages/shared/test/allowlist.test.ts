import { describe, expect, it } from 'vitest';
import { isValidPackageId, isScriptedMethod } from '../src/allowlist';

describe('allowlist de pacotes', () => {
  it('aceita ids válidos e rejeita injeção de shell', () => {
    expect(isValidPackageId('winget', 'Google.Chrome')).toBe(true);
    expect(isValidPackageId('winget', 'Microsoft.VisualStudioCode')).toBe(true);
    expect(isValidPackageId('flatpak', 'com.google.Chrome')).toBe(true);
    expect(isValidPackageId('apt', 'git')).toBe(true);
    expect(isValidPackageId('brew_cask', 'visual-studio-code')).toBe(true);
    expect(isValidPackageId('winget', 'Google.Chrome; rm -rf /')).toBe(false);
    expect(isValidPackageId('apt', 'git$(curl evil)')).toBe(false);
    expect(isValidPackageId('flatpak', 'org.app`id')).toBe(false);
    expect(isValidPackageId('download', 'qualquer-coisa')).toBe(false);
    expect(isScriptedMethod('official_installer')).toBe(false);
    expect(isScriptedMethod('winget')).toBe(true);
  });
});
