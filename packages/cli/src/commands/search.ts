import type { SearchResponse } from '@toolkit/shared';
import { Command } from 'commander';
import * as p from '@clack/prompts';
import { apiGet, ApiError } from '../lib/api.js';
import { bullet, dim, heading, printError } from '../lib/format.js';

export function registerSearchCommand(program: Command): void {
  program
    .command('search <termo>')
    .description('Busca apps, categorias e coleções no catálogo do Toolkit')
    .action(async (termo: string) => {
      const spinner = p.spinner();
      spinner.start(`Buscando "${termo}"...`);
      try {
        const result = await apiGet<SearchResponse>(`/api/v1/search?q=${encodeURIComponent(termo)}`);
        spinner.stop(`Resultados para "${termo}"`);
        printResults(result);
      } catch (err) {
        spinner.stop('Falha na busca');
        printError(err instanceof ApiError ? err.message : String(err));
        process.exitCode = 1;
      }
    });
}

function printResults(result: SearchResponse): void {
  if (result.apps.length > 0) {
    console.log(`\n${heading('Apps')}`);
    for (const app of result.apps) {
      console.log(bullet(`${app.slug} — ${app.name} — ${dim(app.tagline)}`));
    }
  }

  if (result.categories.length > 0) {
    console.log(`\n${heading('Categorias')}`);
    for (const cat of result.categories) {
      console.log(bullet(`${cat.slug} — ${cat.name}`));
    }
  }

  if (result.collections.length > 0) {
    console.log(`\n${heading('Coleções')}`);
    for (const col of result.collections) {
      console.log(bullet(`${col.slug} — ${col.name}`));
    }
  }

  if (result.apps.length === 0 && result.categories.length === 0 && result.collections.length === 0) {
    console.log(dim('Nada encontrado.'));
    if (result.didYouMean && result.didYouMean.length > 0) {
      console.log(`\n${heading('Você quis dizer')}`);
      for (const app of result.didYouMean) {
        console.log(bullet(`${app.slug} — ${app.name}`));
      }
    }
  }
}
