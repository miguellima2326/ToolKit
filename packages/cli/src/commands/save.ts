import { Command } from 'commander';
import * as p from '@clack/prompts';
import { apiPost, ApiError, SITE_URL } from '../lib/api.js';
import { heading, printError, printWarning } from '../lib/format.js';

interface CreateToolkitResponse {
  data: { code: string; createdAt: string; notFound: string[] };
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
        if (data.notFound.length > 0) {
          printWarning(`ignorado(s) por não existir no catálogo: ${data.notFound.join(', ')}`);
        }
      } catch (err) {
        spinner.stop('Falha ao salvar');
        if (err instanceof ApiError && err.status === 404) {
          printError('Nenhum dos apps informados foi encontrado. Tente "toolkit search <termo>".');
        } else {
          printError(err instanceof ApiError ? err.message : String(err));
        }
        process.exitCode = 1;
      }
    });
}
