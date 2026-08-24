import type { CatalogCollection } from './types';

export const collections: CatalogCollection[] = [
  {
    slug: 'pc-essencial',
    name: 'PC Essencial',
    description: 'O básico que todo computador precisa depois de formatado.',
    itemSlugs: ['google-chrome', '7zip', 'vlc', 'sumatrapdf', 'discord']
  },
  {
    slug: 'dev-web',
    name: 'Desenvolvedor Web',
    description: 'Stack completa para quem constrói para a web.',
    itemSlugs: [
      'visual-studio-code',
      'git',
      'nodejs',
      'docker-desktop',
      'postman',
      'insomnia',
      'dbeaver-ce'
    ]
  },
  {
    slug: 'dev-dotnet',
    name: 'Desenvolvedor .NET',
    description: 'Ferramentas para o ecossistema .NET da Microsoft.',
    itemSlugs: [
      'visual-studio-2022',
      'visual-studio-code',
      'dotnet-sdk-8',
      'git',
      'dbeaver-ce',
      'docker-desktop',
      'postman'
    ]
  },
  {
    slug: 'dev-python',
    name: 'Desenvolvedor Python',
    description: 'Ambiente Python pronto para dados, scripts e backend.',
    itemSlugs: ['python', 'visual-studio-code', 'git', 'docker-desktop', 'postman']
  },
  {
    slug: 'gaming',
    name: 'Gaming',
    description: 'Prepare a máquina para jogar e transmitir.',
    itemSlugs: ['steam', 'epic-games-launcher', 'discord', 'obs-studio']
  },
  {
    slug: 'trabalho',
    name: 'Trabalho',
    description: 'Comunicação e produtividade corporativa em minutos.',
    itemSlugs: ['google-chrome', 'microsoft-teams', 'zoom', 'slack', 'libreoffice']
  },
  {
    slug: 'sysadmin',
    name: 'SysAdmin',
    description: 'Kit de diagnóstico, acesso remoto e rede.',
    itemSlugs: [
      'putty',
      'winscp',
      'wireshark',
      'nmap',
      'process-explorer',
      'windows-terminal',
      'rustdesk'
    ]
  },
  {
    slug: 'pc-novo',
    name: 'PC Novo',
    description: 'Os aplicativos mais comuns logo após uma formatação.',
    itemSlugs: [
      'google-chrome',
      'mozilla-firefox',
      '7zip',
      'vlc',
      'discord',
      'spotify',
      'sumatrapdf',
      'libreoffice',
      'whatsapp'
    ]
  }
];
