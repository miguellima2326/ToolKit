import type { InstallMethod } from './constants';

const WINGET_ID = /^[A-Za-z0-9][A-Za-z0-9.\-_]*$/;
const SIMPLE_ID = /^[a-z0-9][a-z0-9+.\-_]*$/;
const FLATPAK_ID = /^[A-Za-z][A-Za-z0-9_-]*(\.[A-Za-z0-9_-]+)+$/;
const BREW_NAME = /^[a-z0-9][a-z0-9@.\-_]*$/;
const REPO_NAME = /^[A-Za-z0-9][A-Za-z0-9._\/-]*$/;

export function isValidPackageId(method: InstallMethod, id: string): boolean {
  switch (method) {
    case 'winget':
    case 'chocolatey':
    case 'scoop':
      return WINGET_ID.test(id) && id.length <= 120;
    case 'apt':
    case 'dnf':
      return SIMPLE_ID.test(id) && id.length <= 80;
    case 'pacman':
      return SIMPLE_ID.test(id) && id.length <= 80;
    case 'flatpak':
      return FLATPAK_ID.test(id) && id.length <= 160;
    case 'snap':
    case 'brew_formula':
    case 'brew_cask':
    case 'mas':
      return BREW_NAME.test(id) && id.length <= 120;
    default:
      return false;
  }
}

export function isValidRepository(repo: string): boolean {
  return REPO_NAME.test(repo) && repo.length <= 160;
}

export function isScriptedMethod(method: InstallMethod): boolean {
  return (
    method === 'winget' ||
    method === 'chocolatey' ||
    method === 'scoop' ||
    method === 'apt' ||
    method === 'dnf' ||
    method === 'pacman' ||
    method === 'flatpak' ||
    method === 'snap' ||
    method === 'brew_formula' ||
    method === 'brew_cask'
  );
}
