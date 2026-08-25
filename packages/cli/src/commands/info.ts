import type { AppDetail } from '@toolkit/shared';
import { Command } from 'commander';
import * as p from '@clack/prompts';
import { apiGet, ApiError } from '../lib/api.js';
import { bullet, dim, heading, printError } from '../lib/format.js';

export function registerInfoCommand(program: Command): void {
  program
    .command('info <slug>')
    .description('Mostra detalhes de um app: descrição, licença e métodos de instalação')
    .action(async (slug: string) => {
      const spinner = p.spinner();
      spinner.start(`Buscando ${slug}...`);
      try {
        const { data } = await apiGet<{ data: AppDetail }>(`/api/v1/apps/${encodeURIComponent(slug)}`);
        spinner.stop(`${data.name} (${data.slug})`);
        printDetail(data);
      } catch (err) {
        spinner.stop('Falha ao buscar app');
        if (err instanceof ApiError && err.status === 404) {
          printError(`App "${slug}" não encontrado. Tente "toolkit search ${slug}".`);
        } else {
          printError(err instanceof ApiError ? err.message : String(err));
        }
        process.exitCode = 1;
      }
    });
}

function printDetail(app: AppDetail): void {
  console.log(`\n${heading(app.name)} ${dim(`(${app.developer})`)}`);
  console.log(app.tagline);
  console.log(`\n${app.description}`);
  console.log(`\n${dim('Licença:')} ${app.license}  ${dim('Categoria:')} ${app.category}`);
  console.log(`${dim('Site:')} ${app.websiteUrl}`);
  if (app.version) console.log(`${dim('Versão:')} ${app.version}`);

  console.log(`\n${heading('Métodos de instalação')}`);
  for (const method of app.installMethods) {
    const id = method.packageId ?? method.url ?? '';
    const statusTag = method.status !== 'verified' ? ` [${method.status}]` : '';
    console.log(bullet(`${method.os} · ${method.method} — ${id}${statusTag}`));
  }

  if (app.alternatives && app.alternatives.length > 0) {
    console.log(`\n${heading('Alternativas')}`);
    for (const alt of app.alternatives) {
      console.log(bullet(`${alt.slug} — ${alt.name}`));
    }
  }
}
