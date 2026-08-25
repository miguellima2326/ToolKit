import { Command } from 'commander';
import { API_URL } from '../lib/api.js';
import { fail, heading, ok } from '../lib/format.js';
import { detectManagers, getOsInfo } from '../lib/system.js';

export function registerDoctorCommand(program: Command): void {
  program
    .command('doctor')
    .description('Diagnostica o sistema: SO, gerenciadores de pacote disponíveis e conexão com a API')
    .action(async () => {
      const info = getOsInfo();

      console.log(heading('Sistema'));
      console.log(ok(info.platformLabel));
      console.log(ok(`SO detectado: ${info.os}${info.distro ? ` (${info.distro})` : ''}`));

      console.log(`\n${heading('Gerenciadores de pacote')}`);
      const managers = detectManagers(info.os);
      for (const [name, found] of Object.entries(managers)) {
        console.log(found ? ok(name) : fail(`${name} (não encontrado no PATH)`));
      }

      console.log(`\n${heading('Conectividade')}`);
      try {
        const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          console.log(ok(`API acessível (${API_URL})`));
        } else {
          console.log(fail(`API respondeu com status ${res.status}`));
        }
      } catch {
        console.log(fail(`Não foi possível conectar em ${API_URL}`));
      }
    });
}
