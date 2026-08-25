import { Command } from 'commander';
import { registerSearchCommand } from './commands/search.js';
import { registerInstallCommand } from './commands/install.js';
import { registerSaveCommand } from './commands/save.js';
import { registerProfileCommand } from './commands/profile.js';
import { registerInfoCommand } from './commands/info.js';
import { registerDoctorCommand } from './commands/doctor.js';

const program = new Command();

program
  .name('toolkit')
  .description('CLI do Toolkit — busca, instala e gerencia apps direto do terminal')
  .version('0.1.0');

registerSearchCommand(program);
registerInstallCommand(program);
registerSaveCommand(program);
registerProfileCommand(program);
registerInfoCommand(program);
registerDoctorCommand(program);

program.parseAsync(process.argv).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
