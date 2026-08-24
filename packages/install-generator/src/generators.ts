import { METHOD_LABELS } from '@toolkit/shared';
import type { AutoItem, ManualItem } from './types';

function psQuote(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

export function generateWindowsPs1(items: AutoItem[], manual: ManualItem[], generatedAt: Date): string {
  const names = items.map((i) => i.app.name).join(', ');
  const entries = items
    .map((i) => `    @{ Id = ${psQuote(i.pkg.packageId ?? '')}; Name = ${psQuote(i.app.name)} }`)
    .join(`;\n`);

  const manualBlock =
    manual.length > 0
      ? `\n# ------------------------------------------------------------------\n# Instalacao manual necessaria (${manual.length}):\n${manual
          .map((m) => `# - ${m.name}: ${m.url ?? m.note ?? ''}`)
          .join('\n')}\n# ------------------------------------------------------------------\n`
      : '';

  return `# ==================================================================
# Toolkit — Instalacao automatica de aplicativos (Windows)
# Gerado em ${generatedAt.toISOString()}
# Conteudo (${items.length}): ${names}
#
# Como usar:
#   1. Abra o PowerShell como administrador (opcional, recomendado)
#   2. Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
#   3. Execute: .\\toolkit-instalar-windows.ps1
#
# O script usa somente IDs oficiais validados do catalogo do Toolkit.
# Cada falha e registrada e NAO interrompe as demais instalacoes.
# ==================================================================

$ErrorActionPreference = 'Continue'

function Test-Winget {
    return $null -ne (Get-Command winget -ErrorAction SilentlyContinue)
}

if (-not (Test-Winget)) {
    Write-Host ''
    Write-Host 'ERRO: Winget nao encontrado.' -ForegroundColor Red
    Write-Host 'Instale "Instalador de Aplicativos do Windows" na Microsoft Store ou via:'
    Write-Host 'https://learn.microsoft.com/windows/package-manager/winget/'
    exit 1
}

$apps = @(
${entries}
)

$resultados = @()
$indice = 0

Write-Host "Toolkit — instalando $($apps.Count) aplicativo(s) via Winget...\`n" -ForegroundColor Cyan

foreach ($app in $apps) {
    $indice++
    Write-Host "[$indice/$($apps.Count)] $($app.Name) ($($app.Id))..." -ForegroundColor Cyan
    try {
        winget install --id $app.Id --exact --silent --accept-package-agreements --accept-source-agreements
        if ($LASTEXITCODE -ne 0 -and $LASTEXITCODE -ne $null) {
            throw "winget retornou codigo $LASTEXITCODE"
        }
        $resultados += [pscustomobject]@{ Aplicativo = $app.Name; Resultado = 'OK' }
    }
    catch {
        Write-Warning "Falhou: $($app.Name) — $($_.Exception.Message)"
        $resultados += [pscustomobject]@{ Aplicativo = $app.Name; Resultado = 'FALHOU' }
    }
}
${manualBlock}
Write-Host "\`n==================== RESUMO ====================" -ForegroundColor Cyan
$resultados | Format-Table -AutoSize

$falhas = @($resultados | Where-Object { $_.Resultado -eq 'FALHOU' }).Count
if ($falhas -eq 0) {
    Write-Host 'Tudo pronto! Todos os aplicativos foram instalados.' -ForegroundColor Green
} else {
    Write-Host "$falhas instalacao(oes) falharam. Reexecute o script para tentar novamente." -ForegroundColor Yellow
}
`;
}

export function generateWindowsBat(items: AutoItem[]): string {
  const lines = items.map(
    (i) => `echo Instalando ${i.app.name}...\nwinget install --id ${i.pkg.packageId} --exact --silent --accept-package-agreements --accept-source-agreements`
  );
  return `@echo off
REM Toolkit — instalacao via Winget (gerado pelo Toolkit)
REM Prefira a versao .ps1 para resumo detalhado e tratamento de erros.

where winget >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Winget nao encontrado. Atualize o Windows ou instale pela Microsoft Store.
    exit /b 1
)

${lines.join('\n\n')}

echo.
echo Concluido! Alguns aplicativos podem exigir reinicio do terminal.
`;
}

export function generateLinuxSh(
  items: AutoItem[],
  manual: ManualItem[],
  distroKey: string,
  generatedAt: Date
): string {
  const groups: Record<string, string[]> = {
    apt: [],
    dnf: [],
    pacman: [],
    flatpak: [],
    snap: []
  };
  const classicSnaps: string[] = [];
  for (const { pkg } of items) {
    const id = pkg.packageId ?? '';
    if (pkg.method === 'apt') groups['apt']!.push(id);
    else if (pkg.method === 'dnf') groups['dnf']!.push(id);
    else if (pkg.method === 'pacman') groups['pacman']!.push(id);
    else if (pkg.method === 'flatpak') groups['flatpak']!.push(id);
    else if (pkg.method === 'snap') {
      groups['snap']!.push(id);
      if (pkg.classic) classicSnaps.push(id);
    }
  }

  const sections: string[] = [];

  if ((groups['apt']?.length ?? 0) > 0) {
    sections.push(`# ---- Pacotes APT -------------------------------------------------
APT_PACKAGES=(${groups['apt']!.join(' ')})
echo "==> Atualizando listas de pacotes (apt update)..."
$SUDO apt-get update
for p in "\${APT_PACKAGES[@]}"; do
    echo "---- Instalando $p"
    $SUDO apt-get install -y "$p" || echo "AVISO: falha ao instalar $p (continuando)"
done`);
  }
  if ((groups['dnf']?.length ?? 0) > 0) {
    sections.push(`# ---- Pacotes DNF -------------------------------------------------
DNF_PACKAGES=(${groups['dnf']!.join(' ')})
for p in "\${DNF_PACKAGES[@]}"; do
    echo "---- Instalando $p"
    $SUDO dnf install -y "$p" || echo "AVISO: falha ao instalar $p (continuando)"
done`);
  }
  if ((groups['pacman']?.length ?? 0) > 0) {
    sections.push(`# ---- Pacotes PACMAN ----------------------------------------------
PACMAN_PACKAGES=(${groups['pacman']!.join(' ')})
$SUDO pacman -Sy --needed --noconfirm "\${PACMAN_PACKAGES[@]}" || \\
    echo "AVISO: alguns pacotes pacman falharam (continuando)"`);
  }
  if ((groups['flatpak']?.length ?? 0) > 0) {
    sections.push(`# ---- Flatpak ------------------------------------------------------
if ! command -v flatpak >/dev/null 2>&1; then
    echo "Instalando o Flatpak..."
    if command -v apt-get >/dev/null 2>&1; then $SUDO apt-get install -y flatpak;
    elif command -v dnf >/dev/null 2>&1; then $SUDO dnf install -y flatpak;
    elif command -v pacman >/dev/null 2>&1; then $SUDO pacman -Sy --needed --noconfirm flatpak;
    fi
fi
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo 2>/dev/null || true
FLATPAK_PACKAGES=(${groups['flatpak']!.join(' ')})
for p in "\${FLATPAK_PACKAGES[@]}"; do
    echo "---- Instalando $p (Flathub)"
    flatpak install --or-update --assumeyes --noninteractive flathub "$p" || echo "AVISO: falha ao instalar $p (continuando)"
done`);
  }
  if ((groups['snap']?.length ?? 0) > 0) {
    sections.push(`# ---- Snap ---------------------------------------------------------
if ! command -v snap >/dev/null 2>&1; then
    echo "Snapd ausente — instale com o gerenciador da sua distribuicao."
fi
SNAP_PACKAGES=(${groups['snap']!.join(' ')})
CLASSIC_SNAPS=(${classicSnaps.join(' ')})
for p in "\${SNAP_PACKAGES[@]}"; do
    EXTRA=""
    for c in "\${CLASSIC_SNAPS[@]:-}"; do [ "$c" = "$p" ] && EXTRA="--classic"; done
    echo "---- Instalando $p (Snap)"
    $SUDO snap install $EXTRA "$p" || echo "AVISO: falha ao instalar $p (continuando)"
done`);
  }

  const manualBlock =
    manual.length > 0
      ? `\necho ""
echo "====================================================="
echo "Requerem instalacao manual (${manual.length}):"
${manual.map((m) => `echo "  • ${m.name.replace(/"/g, '')} → ${m.url ?? m.note ?? ''}"`).join('\n')}\n`
      : '';

  return `#!/usr/bin/env bash
# ==================================================================
# Toolkit — Instalacao automatica de aplicativos (Linux · ${distroKey})
# Gerado em ${generatedAt.toISOString()}
#
# Como usar:
#   chmod +x toolkit-instalar-linux.sh
#   ./toolkit-instalar-linux.sh
#
# Somente IDs validados do catalogo do Toolkit sao utilizados.
# Falhas individuais nao interrompem o restante da instalacao.
# ==================================================================
set -u

SUDO=""
if [ "$(id -u)" -ne 0 ] && command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
fi

${sections.join('\n\n')}${manualBlock}

echo ""
echo "Concluido! Verifique as mensagens AVISO acima caso algo tenha falhado."
`;
}

export function generateMacSh(items: AutoItem[], manual: ManualItem[], generatedAt: Date): string {
  const formulas = items.filter((i) => i.pkg.method === 'brew_formula').map((i) => i.pkg.packageId!);
  const casks = items.filter((i) => i.pkg.method === 'brew_cask').map((i) => i.pkg.packageId!);

  const blocks: string[] = [];
  if (formulas.length > 0) {
    blocks.push(`BREW_FORMULAS=(${formulas.join(' ')})
for f in "\${BREW_FORMULAS[@]}"; do
    echo "---- brew install $f"
    brew install "$f" || echo "AVISO: falha ao instalar $f (continuando)"
done`);
  }
  if (casks.length > 0) {
    blocks.push(`BREW_CASKS=(${casks.join(' ')})
for c in "\${BREW_CASKS[@]}"; do
    echo "---- brew install --cask $c"
    brew install --cask "$c" || echo "AVISO: falha ao instalar $c (continuando)"
done`);
  }

  const manualBlock =
    manual.length > 0
      ? `\necho ""
echo "Requerem instalacao manual (${manual.length}):"
${manual.map((m) => `echo "  • ${m.name.replace(/"/g, '')} → ${m.url ?? ''}"`).join('\n')}\n`
      : '';

  return `#!/usr/bin/env bash
# ==================================================================
# Toolkit — Instalacao automatica de aplicativos (macOS · Homebrew)
# Gerado em ${generatedAt.toISOString()}
#
# Como usar:
#   chmod +x toolkit-instalar-macos.sh && ./toolkit-instalar-macos.sh
#
# Requer Homebrew: https://brew.sh
# ==================================================================
set -u

if ! command -v brew >/dev/null 2>&1; then
    echo "ERRO: Homebrew nao encontrado. Instale em https://brew.sh e reexecute."
    exit 1
fi

${blocks.join('\n\n')}${manualBlock}
echo ""
echo "Concluido!"
`;
}

export function buildSteps(items: AutoItem[], targetOs: 'windows' | 'linux' | 'macos'): string[] {
  const managerNames: Record<string, string> = {
    windows: 'Winget',
    macos: 'Homebrew',
    linux: 'os gerenciadores nativos'
  };
  const steps = [`Verificar disponibilidade do ${managerNames[targetOs] ?? 'gerenciador'}`];
  for (const item of items) {
    steps.push(`Instalar ${item.app.name} (${METHOD_LABELS[item.pkg.method]})`);
  }
  return steps;
}
