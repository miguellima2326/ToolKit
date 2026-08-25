import { Command } from 'commander';
import * as p from '@clack/prompts';
import { apiPost, ApiError, SITE_URL } from '../lib/api.js';
import { heading, printError } from '../lib/format.js';

interface CreateToolkitResponse {
  data: { code: string; createdAt: string };
}

export function registerSaveCommand(program: Command): void {
  program
    .command('save <slugs...>')
    .description('Salva uma lista de apps e gera um código/link compartilhável')
    .option('-t, --title <titulo>', 'título do toolkit salvo')
    .action(async (slugs: string[], opts: { title?: string }) => {
      const spinner = p.spinner();
      spinner.start('Salvando...');
      try {
        const { data } = await apiPost<CreateToolkitResponse>('/api/v1/toolkits', {
          slugs,
          title: opts.title
        });
        spinner.stop('Salvo!');
        console.log(`\n${heading('Código:')} ${data.code}`);
        console.log(`${heading('Link:')} ${SITE_URL}/s/${data.code}`);
        console.log(`\nPara reinstalar depois: ${'`'}toolkit profile ${data.code}${'`'}`);
      } catch (err) {
        spinner.stop('Falha ao salvar');
        printError(err instanceof ApiError ? err.message : String(err));
        process.exitCode = 1;
      }
    });
}
