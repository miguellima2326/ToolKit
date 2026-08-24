export const OPERATING_SYSTEMS = ['windows', 'linux', 'macos'] as const;
export type OperatingSystem = (typeof OPERATING_SYSTEMS)[number];

export const ARCHITECTURES = ['x64', 'arm64', 'x86', 'universal'] as const;
export type Architecture = (typeof ARCHITECTURES)[number];

export const LICENSE_TYPES = ['open_source', 'freeware', 'freemium', 'paid'] as const;
export type LicenseType = (typeof LICENSE_TYPES)[number];

export const INSTALL_METHODS = [
  'winget',
  'chocolatey',
  'scoop',
  'msstore',
  'apt',
  'dnf',
  'pacman',
  'flatpak',
  'snap',
  'appimage',
  'brew_formula',
  'brew_cask',
  'mas',
  'official_installer',
  'download'
] as const;
export type InstallMethod = (typeof INSTALL_METHODS)[number];

export const SOURCE_KINDS = ['official', 'community', 'system'] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];

export const APP_STATUSES = ['verified', 'pending_review', 'deprecated', 'blocked'] as const;
export type AppStatus = (typeof APP_STATUSES)[number];

export const PACKAGE_STATUSES = APP_STATUSES;
export type PackageStatus = AppStatus;

export const LINUX_DISTROS = [
  'ubuntu',
  'debian',
  'linuxmint',
  'pop',
  'fedora',
  'arch',
  'other'
] as const;
export type LinuxDistro = (typeof LINUX_DISTROS)[number];

export const SCRIPT_FORMATS = ['ps1', 'bat', 'sh'] as const;
export type ScriptFormat = (typeof SCRIPT_FORMATS)[number];

export const METHOD_LABELS: Record<InstallMethod, string> = {
  winget: 'Winget',
  chocolatey: 'Chocolatey',
  scoop: 'Scoop',
  msstore: 'Microsoft Store',
  apt: 'APT',
  dnf: 'DNF',
  pacman: 'Pacman',
  flatpak: 'Flatpak',
  snap: 'Snap',
  appimage: 'AppImage',
  brew_formula: 'Homebrew',
  brew_cask: 'Homebrew Cask',
  mas: 'Mac App Store',
  official_installer: 'Instalador oficial',
  download: 'Download oficial'
};

export const OS_LABELS: Record<OperatingSystem, string> = {
  windows: 'Windows',
  linux: 'Linux',
  macos: 'macOS'
};

export const LICENSE_LABELS: Record<LicenseType, string> = {
  open_source: 'Open Source',
  freeware: 'Freeware',
  freemium: 'Freemium',
  paid: 'Pago'
};

export const DISTRO_LABELS: Record<LinuxDistro, string> = {
  ubuntu: 'Ubuntu / Mint / Pop!_OS',
  debian: 'Debian',
  linuxmint: 'Linux Mint',
  pop: 'Pop!_OS',
  fedora: 'Fedora',
  arch: 'Arch Linux / Manjaro',
  other: 'Outra distribuição'
};

export const SOURCE_LABELS: Record<SourceKind, string> = {
  official: 'Fonte oficial',
  community: 'Repositório da comunidade',
  system: 'Repositório do sistema'
};
