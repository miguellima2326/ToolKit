import { writeFileSync, unlinkSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { InstallScriptResponse, ScriptFormat } from '@toolkit/shared';
import { Command } from 'commander';
import * as p from '@clack/prompts';
import { apiPost, ApiError } from '../lib/api.js';
import { bullet, dim, heading, printError, printWarning } from '../lib/format.js';
import { getOsInfo, isInteractive } from '../lib/system.js';

interface InstallOptions {
  format?: ScriptFormat;
  yes?: boolean;
  dryRun?: boolean;
}

export function registerInstallCommand(program: Command): void {
  program
    .command('install <slugs...>')
    .description('Gera e (com confirmação) executa o script de instalação para os apps informados')
    .option('-f, --format <formato>', 'ps1, bat ou sh (default: conforme o SO detectado)')
    .option('-y, --yes', 'pula a confirmação antes de executar', false)
    .option('--dry-run', 'só mostra o script, nunca executa', false)
    .action(async (slugs: string[], opts: InstallOptions) => {
      await runInstallFlow(slugs, opts);
    });
}

export async function runInstallFlow(slugs: string[], opts: InstallOptions): Promise<void> {
  const { os, distro } = getOsInfo();

  const spinner = p.spinner();
  spinner.start('Gerando script de instalação...');

  let result: InstallScriptResponse;
  try {
    const res = await apiPost<{ data: InstallScriptResponse }>('/api/v1/install-script', {
      slugs,
      os,
      distro: os === 'linux' ? distro : undefined,
      format: opts.format
    });
    result = res.data;
  } catch (err) {
    spinner.stop('Falha ao gerar script');
    if (err instanceof ApiError && err.status === 404) {
      printError(`Nenhum dos apps informados foi encontrado. Tente "toolkit search <termo>".`);
    } else if (err instanceof ApiError && err.status === 400) {
      printError(`Entrada inválida: ${err.message}`);
    } else {
      printError(err instanceof ApiError ? err.message : String(err));
    }
    process.exitCode = 1;
    return;
  }

  spinner.stop(`Script gerado para ${result.target.label}`);

  if (result.notFound.length > 0) {
    printWarning(`ignorado(s) por não existir no catálogo: ${result.notFound.join(', ')}`);
  }

  console.log(
    `\n${dim(`${result.autoCount} automático(s) · ${result.manualCount} manual(is) · ${result.unavailable.length} indisponível(is)`)}`
  );

  if (result.manual.length > 0) {
    console.log(`\n${heading('Passos manuais')}`);
    for (const item of result.manual) {
      console.log(bullet(`${item.name}${item.url ? ` — ${item.url}` : ''}${item.note ? ` (${item.note})` : ''}`));
    }
  }

  if (result.unavailable.length > 0) {
    console.log(`\n${heading('Indisponíveis para este sistema')}`);
    for (const item of result.unavailable) {
      console.log(bullet(`${item.name} — ${item.reason}`));
    }
  }

  if (result.autoCount === 0) {
    console.log(dim('\nNada para executar automaticamente.'));
    return;
  }

  console.log(`\n${heading(`Script (${result.filename})`)}`);
  console.log(result.script);

  if (opts.dryRun) return;

  if (!opts.yes) {
    if (!isInteractive()) {
      printWarning('terminal não-interativo — nada foi executado. Use "--yes" pra confirmar sem prompt.');
      return;
    }
    const confirmed = await p.confirm({
      message: `Executar ${result.autoCount} passo(s) automaticamente agora?`
    });
    if (p.isCancel(confirmed) || !confirmed) {
      console.log(dim('\nCancelado.'));
      return;
    }
  }

  await executeScript(result);
}

async function executeScript(result: InstallScriptResponse): Promise<void> {
  const tmpPath = join(tmpdir(), result.filename);
  writeFileSync(tmpPath, result.script, 'utf-8');

  const [command, args] =
    result.format === 'ps1'
      ? ['powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', tmpPath]]
      : result.format === 'bat'
        ? ['cmd.exe', ['/c', tmpPath]]
        : ['sh', [tmpPath]];

  const exitCode = await new Promise<number>((resolve) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', (err) => {
      printError(`Falha ao executar ${command}: ${err.message}`);
      resolve(1);
    });
    child.on('exit', (code) => resolve(code ?? 1));
  });

  if (exitCode === 0) {
    try {
      unlinkSync(tmpPath);
    } catch {
      // não crítico se não conseguir limpar o temporário
    }
  } else {
    console.log(dim(`\nScript mantido em ${tmpPath} para inspeção.`));
  }

  process.exitCode = exitCode;
}
