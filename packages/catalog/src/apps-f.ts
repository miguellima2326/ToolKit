import type { CatalogApp } from './types';
import { AP, BC, DL, FP, SN, W } from './types';

const a = (
  base: Omit<CatalogApp, 'iconKey' | 'status' | 'version'> & Partial<Pick<CatalogApp, 'iconKey' | 'status' | 'version'>>
): CatalogApp => ({
  iconKey: base.slug,
  status: 'verified',
  version: null,
  ...base
});

export const appsF: CatalogApp[] = [
  // ── Compactação ─────────────────────────────────────────────────────────
  a({
    slug: 'winrar',
    name: 'WinRAR',
    vendor: 'RARLAB',
    categorySlug: 'compactacao',
    tagline: 'Compactador clássico com suporte a RAR e ZIP.',
    description:
      'Compactador de arquivos amplamente usado no Windows, com suporte nativo a RAR, ZIP e dezenas de outros formatos, recuperação de arquivos danificados e proteção por senha. Shareware: funciona indefinidamente com aviso periódico de licença.',
    websiteUrl: 'https://www.win-rar.com/',
    license: 'freemium',
    color: '#00A950',
    popularity: 68,
    updatedDaysAgo: 5,
    tags: ['compactação', 'rar', 'zip', 'arquivos'],
    oss: ['windows'],
    archs: ['x64', 'arm64'],
    alternatives: ['7zip', 'peazip'],
    packages: [
      W('RARLab.WinRAR')
    ]
  }),

  // ── Navegadores ─────────────────────────────────────────────────────────
  a({
    slug: 'opera',
    name: 'Opera',
    vendor: 'Opera Software',
    categorySlug: 'navegadores',
    tagline: 'Navegador com VPN grátis e bloqueador de anúncios integrados.',
    description:
      'Navegador baseado em Chromium com VPN gratuita embutida, bloqueador de anúncios nativo, economizador de bateria e barra lateral com mensageiros integrados.',
    websiteUrl: 'https://www.opera.com/',
    license: 'freeware',
    color: '#FF1B2D',
    popularity: 60,
    updatedDaysAgo: 2,
    tags: ['navegador', 'browser', 'vpn'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['opera-gx', 'brave', 'vivaldi'],
    packages: [
      W('Opera.Opera'),
      BC('opera'),
      SN('opera', { source: 'official' })
    ]
  }),
  a({
    slug: 'opera-gx',
    name: 'Opera GX',
    vendor: 'Opera Software',
    categorySlug: 'navegadores',
    tagline: 'Navegador da Opera voltado para gamers.',
    description:
      'Versão do Opera com limitador de uso de CPU/RAM/rede, temas e integrações com Discord, Twitch e Spotify, feita para rodar ao lado de jogos sem competir por recursos.',
    websiteUrl: 'https://www.opera.com/gx',
    license: 'freeware',
    color: '#EE2A5D',
    popularity: 63,
    updatedDaysAgo: 2,
    tags: ['navegador', 'browser', 'gaming', 'jogos'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['opera', 'brave'],
    packages: [
      W('Opera.OperaGX'),
      BC('opera-gx'),
      SN('opera-gx', { source: 'official' })
    ]
  }),

  // ── Segurança ────────────────────────────────────────────────────────────
  a({
    slug: 'bitwarden',
    name: 'Bitwarden',
    vendor: 'Bitwarden Inc.',
    categorySlug: 'seguranca',
    tagline: 'Gerenciador de senhas open source.',
    description:
      'Cofre de senhas open source com sincronização entre dispositivos, geração de senhas fortes, preenchimento automático e camada gratuita completa para uso pessoal.',
    websiteUrl: 'https://bitwarden.com/',
    license: 'freemium',
    color: '#175DDC',
    popularity: 66,
    updatedDaysAgo: 2,
    tags: ['senhas', 'segurança', 'privacidade', 'open source'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['keepassxc'],
    packages: [
      W('Bitwarden.Bitwarden'),
      BC('bitwarden'),
      FP('com.bitwarden.desktop', { source: 'official' })
    ]
  }),
  a({
    slug: 'keepassxc',
    name: 'KeePassXC',
    vendor: 'KeePassXC Team',
    categorySlug: 'seguranca',
    tagline: 'Gerenciador de senhas open source e offline.',
    description:
      'Cofre de senhas local (sem depender de nuvem de terceiros), com banco criptografado, gerador de senhas, TOTP integrado e suporte a chave física para desbloqueio.',
    websiteUrl: 'https://keepassxc.org/',
    license: 'open_source',
    color: '#6CAC4D',
    popularity: 54,
    updatedDaysAgo: 4,
    tags: ['senhas', 'segurança', 'privacidade', 'open source', 'offline'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['bitwarden'],
    packages: [
      W('KeePassXCTeam.KeePassXC'),
      BC('keepassxc'),
      AP('keepassxc')
    ]
  }),
  a({
    slug: 'malwarebytes',
    name: 'Malwarebytes',
    vendor: 'Malwarebytes Inc.',
    categorySlug: 'seguranca',
    tagline: 'Remoção de malware e adware.',
    description:
      'Ferramenta de detecção e remoção de malware, adware e ransomware, usada como complemento ao antivírus principal para limpeza pontual do sistema. Sem cliente para Linux.',
    websiteUrl: 'https://www.malwarebytes.com/',
    license: 'freemium',
    color: '#0D3ECC',
    popularity: 58,
    updatedDaysAgo: 3,
    tags: ['antivírus', 'malware', 'segurança'],
    oss: ['windows', 'macos'],
    archs: ['x64'],
    alternatives: [],
    packages: [
      W('Malwarebytes.Malwarebytes'),
      BC('malwarebytes')
    ]
  }),

  // ── Internet ────────────────────────────────────────────────────────────
  a({
    slug: 'transmission',
    name: 'Transmission',
    vendor: 'Transmission Project',
    categorySlug: 'internet',
    tagline: 'Cliente BitTorrent leve e open source.',
    description:
      'Cliente BitTorrent minimalista e de baixo consumo de recursos, com interface simples, criptografia de protocolo e suporte a controle remoto via web.',
    websiteUrl: 'https://transmissionbt.com/',
    license: 'open_source',
    color: '#B30202',
    popularity: 56,
    updatedDaysAgo: 5,
    tags: ['torrent', 'download', 'p2p', 'open source'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['qbittorrent'],
    packages: [
      W('Transmission.Transmission'),
      BC('transmission'),
      AP('transmission-gtk')
    ]
  }),

  // ── Terminal ────────────────────────────────────────────────────────────
  a({
    slug: 'iterm2',
    name: 'iTerm2',
    vendor: 'iTerm2',
    categorySlug: 'terminal',
    tagline: 'Terminal avançado para macOS.',
    description:
      'Substituto do Terminal.app do macOS com divisão de painéis, busca inline, integração com tmux, perfis por projeto e histórico pesquisável. Exclusivo para macOS.',
    websiteUrl: 'https://iterm2.com/',
    license: 'open_source',
    color: '#2E2E2E',
    popularity: 57,
    updatedDaysAgo: 3,
    tags: ['terminal', 'macos'],
    oss: ['macos'],
    archs: ['x64', 'arm64'],
    alternatives: ['windows-terminal'],
    packages: [
      BC('iterm2')
    ]
  }),

  // ── Design ──────────────────────────────────────────────────────────────
  a({
    slug: 'paint-net',
    name: 'Paint.NET',
    vendor: 'dotPDN LLC',
    categorySlug: 'design',
    tagline: 'Editor de imagens leve para Windows.',
    description:
      'Editor de imagens gratuito para Windows com camadas, ajustes e efeitos, pensado como sucessor moderno do Paint clássico. Interface simples e plugins da comunidade.',
    websiteUrl: 'https://www.getpaint.net/',
    license: 'freeware',
    color: '#5C9FD6',
    popularity: 55,
    updatedDaysAgo: 6,
    tags: ['imagem', 'edição', 'design'],
    oss: ['windows'],
    archs: ['x64', 'arm64'],
    alternatives: ['gimp', 'krita'],
    packages: [
      W('dotPDN.PaintDotNet')
    ]
  }),
  a({
    slug: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud',
    vendor: 'Adobe',
    categorySlug: 'design',
    tagline: 'App de instalação oficial do Photoshop, Illustrator e mais.',
    description:
      'Aplicativo oficial da Adobe para instalar e atualizar Photoshop, Illustrator, Premiere Pro e demais apps da suíte. Requer login com Adobe ID e assinatura Creative Cloud ativa para uso completo.',
    websiteUrl: 'https://www.adobe.com/creativecloud.html',
    license: 'paid',
    color: '#DA1F26',
    popularity: 64,
    updatedDaysAgo: 4,
    tags: ['design', 'photoshop', 'illustrator', 'adobe'],
    oss: ['windows', 'macos'],
    archs: ['x64', 'arm64'],
    alternatives: ['gimp', 'inkscape'],
    packages: [
      W('Adobe.CreativeCloud'),
      BC('adobe-creative-cloud')
    ]
  }),

  // ── Runtimes ────────────────────────────────────────────────────────────
  a({
    slug: 'miniconda',
    name: 'Miniconda',
    vendor: 'Anaconda, Inc.',
    categorySlug: 'runtimes',
    tagline: 'Distribuição mínima do Python com gerenciador Conda.',
    description:
      'Instalador mínimo do Python com o gerenciador de pacotes e ambientes Conda, muito usado em ciência de dados e machine learning para isolar dependências por projeto.',
    websiteUrl: 'https://www.anaconda.com/download/success',
    license: 'freeware',
    color: '#44A833',
    popularity: 57,
    updatedDaysAgo: 5,
    tags: ['python', 'conda', 'ciência de dados', 'runtime'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['python'],
    packages: [
      W('Anaconda.Miniconda3'),
      BC('miniconda'),
      DL('https://www.anaconda.com/download/success', 'linux')
    ]
  }),

  // ── Utilitários ─────────────────────────────────────────────────────────
  a({
    slug: 'dropbox',
    name: 'Dropbox',
    vendor: 'Dropbox, Inc.',
    categorySlug: 'utilitarios',
    tagline: 'Sincronização e backup de arquivos na nuvem.',
    description:
      'Cliente oficial do Dropbox para sincronizar pastas com a nuvem, compartilhar arquivos e acessar backups de qualquer dispositivo. Plano gratuito com espaço limitado.',
    websiteUrl: 'https://www.dropbox.com/',
    license: 'freemium',
    color: '#0061FF',
    popularity: 62,
    updatedDaysAgo: 3,
    tags: ['nuvem', 'sincronização', 'backup', 'armazenamento'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: [],
    packages: [
      W('Dropbox.Dropbox'),
      BC('dropbox'),
      FP('com.dropbox.Client', { source: 'community' })
    ]
  })
];
