import type { AppSummary } from '@toolkit/shared';
import { Command } from 'commander';
import * as p from '@clack/prompts';
import { apiGet, ApiError } from '../lib/api.js';
import { bullet, dim, heading, printError } from '../lib/format.js';
import { runInstallFlow } from './install.js';

interface ToolkitProfile {
  code: string;
  title: string | null;
  createdAt: string;
  apps: AppSummary[];
}

export function registerProfileCommand(program: Command): void {
  program
    .command('profile <code>')
    .description('Mostra um toolkit salvo (gerado por "toolkit save") e oferece instalar tudo')
    .action(async (code: string) => {
      const spinner = p.spinner();
      spinner.start(`Buscando ${code}...`);
      let profile: ToolkitProfile;
      try {
        const { data } = await apiGet<{ data: ToolkitProfile }>(`/api/v1/toolkits/${encodeURIComponent(code)}`);
        profile = data;
      } catch (err) {
        spinner.stop('Falha ao buscar toolkit');
        if (err instanceof ApiError && err.status === 404) {
          printError(`Código "${code}" não encontrado.`);
        } else {
          printError(err instanceof ApiError ? err.message : String(err));
        }
        process.exitCode = 1;
        return;
      }

      spinner.stop(profile.title ?? `Toolkit ${profile.code}`);
      console.log(`\n${heading('Apps')}`);
      for (const app of profile.apps) {
        console.log(bullet(`${app.slug} — ${app.name} — ${dim(app.tagline)}`));
      }

      if (profile.apps.length === 0) return;

      const install = await p.confirm({ message: 'Instalar todos agora?' });
      if (p.isCancel(install) || !install) return;

      await runInstallFlow(
        profile.apps.map((a) => a.slug),
        {}
      );
    });
}
