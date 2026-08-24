import type { CatalogCollection } from './types';

export const collections: CatalogCollection[] = [
  {
    slug: 'pc-essencial',
    name: 'PC Essencial',
    description: 'O básico que todo computador precisa depois de formatado.',
    itemSlugs: [
      'google-chrome',
      '7zip',
      'vlc',
      'sumatrapdf',
      'discord',
      'bitwarden',
      'vc-redist-2015-2022-x64',
      'vc-redist-2015-2022-x86',
      'directx-end-user-runtime'
    ]
  },
  {
    slug: 'dependencias-essenciais',
    name: 'Dependências Essenciais',
    description:
      'Runtimes e bibliotecas que jogos e programas pedem logo após a formatação — instale tudo de uma vez e pare de caçar erro de DLL.',
    itemSlugs: [
      'vc-redist-2015-2022-x64',
      'vc-redist-2015-2022-x86',
      'directx-end-user-runtime',
      'dotnet-desktop-runtime-8',
      'dotnet-desktop-runtime-10',
      'dotnet-framework-481',
      'corretto-jre8'
    ]
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
      'dbeaver-ce',
      'github-cli',
      'claude-code'
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
      'postman',
      'github-cli'
    ]
  },
  {
    slug: 'dev-python',
    name: 'Desenvolvedor Python',
    description: 'Ambiente Python pronto para dados, scripts e backend.',
    itemSlugs: ['python', 'miniconda', 'visual-studio-code', 'git', 'docker-desktop', 'postman', 'github-cli']
  },
  {
    slug: 'ia-para-devs',
    name: 'IA para Devs',
    description: 'Agentes e IDEs de IA para programar mais rápido.',
    itemSlugs: ['claude-code', 'codex-cli', 'opencode', 'cursor', 'windsurf', 'google-antigravity', 'ollama']
  },
  {
    slug: 'seguranca-privacidade',
    name: 'Segurança e Privacidade',
    description: 'Senhas, criptografia e proteção básica contra malware.',
    itemSlugs: ['bitwarden', 'keepassxc', 'veracrypt', 'cryptomator', 'malwarebytes']
  },
  {
    slug: 'design-criativo',
    name: 'Design Criativo',
    description: 'Edição de imagem, ilustração e modelagem 3D.',
    itemSlugs: ['figma', 'gimp', 'krita', 'inkscape', 'blender', 'paint-net', 'adobe-creative-cloud']
  },
  {
    slug: 'gaming',
    name: 'Gaming',
    description: 'Prepare a máquina para jogar e transmitir.',
    itemSlugs: [
      'steam',
      'epic-games-launcher',
      'gog-galaxy',
      'battle-net',
      'ea-app',
      'ubisoft-connect',
      'discord',
      'opera-gx',
      'obs-studio'
    ]
  },
  {
    slug: 'trabalho',
    name: 'Trabalho',
    description: 'Comunicação e produtividade corporativa em minutos.',
    itemSlugs: ['google-chrome', 'microsoft-teams', 'zoom', 'slack', 'microsoft-office', 'libreoffice', 'dropbox']
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
      'winrar',
      'vlc',
      'discord',
      'spotify',
      'sumatrapdf',
      'libreoffice',
      'whatsapp',
      'malwarebytes'
    ]
  }
];
