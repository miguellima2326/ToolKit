import type { CatalogApp } from './types';
import { AP, BC, FP, W } from './types';

const a = (
  base: Omit<CatalogApp, 'iconKey' | 'status' | 'version'> & Partial<Pick<CatalogApp, 'iconKey' | 'status' | 'version'>>
): CatalogApp => ({
  iconKey: base.slug,
  status: 'verified',
  version: null,
  ...base
});

export const appsE: CatalogApp[] = [
  // ── Bibliotecas / launchers de jogos ────────────────────────────────────
  a({
    slug: 'gog-galaxy',
    name: 'GOG Galaxy',
    vendor: 'GOG.com',
    categorySlug: 'gaming',
    tagline: 'Launcher da GOG com jogos sem DRM.',
    description:
      'Cliente oficial da GOG.com para comprar, baixar e jogar títulos sem DRM, com conquistas, overlay social, suporte a mods e integração de outras bibliotecas via plugins.',
    websiteUrl: 'https://www.gog.com/galaxy',
    license: 'freeware',
    color: '#8642F5',
    popularity: 55,
    updatedDaysAgo: 3,
    tags: ['jogos', 'gaming', 'gog', 'sem drm'],
    oss: ['windows', 'macos'],
    archs: ['x64', 'arm64'],
    alternatives: ['steam', 'heroic-games-launcher'],
    packages: [
      W('GOG.Galaxy'),
      BC('gog-galaxy')
    ]
  }),
  a({
    slug: 'battle-net',
    name: 'Battle.net',
    vendor: 'Blizzard Entertainment',
    categorySlug: 'gaming',
    tagline: 'Launcher oficial da Blizzard.',
    description:
      'Cliente oficial da Blizzard para instalar e jogar World of Warcraft, Diablo, Overwatch, Hearthstone e demais títulos do catálogo, com loja, chat e atualizações automáticas.',
    websiteUrl: 'https://battle.net/',
    license: 'freeware',
    color: '#00AEFF',
    popularity: 62,
    updatedDaysAgo: 2,
    tags: ['jogos', 'gaming', 'blizzard'],
    oss: ['windows', 'macos'],
    archs: ['x64'],
    alternatives: ['steam'],
    packages: [
      W('Blizzard.BattleNet'),
      BC('battle-net')
    ]
  }),
  a({
    slug: 'ubisoft-connect',
    name: 'Ubisoft Connect',
    vendor: 'Ubisoft',
    categorySlug: 'gaming',
    tagline: 'Launcher oficial da Ubisoft.',
    description:
      "Cliente oficial da Ubisoft para jogar títulos como Assassin's Creed, Rainbow Six e Far Cry, com progressão cross-platform, desafios e recompensas Ubisoft Connect. Sem cliente oficial para macOS ou Linux.",
    websiteUrl: 'https://ubisoftconnect.com/',
    license: 'freeware',
    color: '#003DA5',
    popularity: 50,
    updatedDaysAgo: 4,
    tags: ['jogos', 'gaming', 'ubisoft'],
    oss: ['windows'],
    archs: ['x64'],
    alternatives: ['steam'],
    packages: [
      W('Ubisoft.Connect')
    ]
  }),
  a({
    slug: 'ea-app',
    name: 'EA App',
    vendor: 'Electronic Arts',
    categorySlug: 'gaming',
    tagline: 'Launcher oficial da Electronic Arts.',
    description:
      'Cliente oficial da EA (sucessor do Origin) para jogar títulos como EA Sports FC, Battlefield e The Sims, com EA Play incluso para assinantes e atualizações automáticas.',
    websiteUrl: 'https://www.ea.com/ea-app',
    license: 'freeware',
    color: '#F34313',
    popularity: 52,
    updatedDaysAgo: 3,
    tags: ['jogos', 'gaming', 'ea', 'origin'],
    oss: ['windows', 'macos'],
    archs: ['x64'],
    alternatives: ['steam'],
    packages: [
      W('ElectronicArts.EADesktop'),
      BC('ea')
    ]
  }),
  a({
    slug: 'heroic-games-launcher',
    name: 'Heroic Games Launcher',
    vendor: 'Heroic Games Launcher',
    categorySlug: 'gaming',
    tagline: 'Launcher open source para Epic, GOG e Amazon Games.',
    description:
      'Alternativa open source aos launchers oficiais: reúne bibliotecas da Epic Games (via Legendary), GOG e Amazon Games em uma única interface, com suporte nativo a Wine/Proton no Linux.',
    websiteUrl: 'https://heroicgameslauncher.com/',
    license: 'open_source',
    color: '#7F5AF0',
    popularity: 58,
    updatedDaysAgo: 1,
    tags: ['jogos', 'gaming', 'open source', 'epic', 'gog', 'linux'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['epic-games-launcher', 'gog-galaxy', 'lutris'],
    packages: [
      W('HeroicGamesLauncher.HeroicGamesLauncher'),
      BC('heroic'),
      FP('com.heroicgameslauncher.hgl', { source: 'official' })
    ]
  }),
  a({
    slug: 'lutris',
    name: 'Lutris',
    vendor: 'Lutris Team',
    categorySlug: 'gaming',
    tagline: 'Gerenciador de jogos open source para Linux.',
    description:
      'Plataforma open source para instalar e organizar jogos no Linux vindos de várias fontes (Steam, GOG, Epic, emuladores), com scripts de instalação mantidos pela comunidade e gerenciamento integrado de Wine.',
    websiteUrl: 'https://lutris.net/',
    license: 'open_source',
    color: '#FF6B35',
    popularity: 54,
    updatedDaysAgo: 3,
    tags: ['jogos', 'gaming', 'linux', 'wine', 'open source'],
    oss: ['linux'],
    archs: ['x64'],
    alternatives: ['heroic-games-launcher', 'bottles'],
    packages: [
      FP('net.lutris.Lutris', { source: 'official' }),
      AP('lutris', { notes: 'Pacote está na seção multiverse do Ubuntu; pode exigir habilitar o repositório.' })
    ]
  }),
  a({
    slug: 'bottles',
    name: 'Bottles',
    vendor: 'The Bottles Contributors',
    categorySlug: 'gaming',
    tagline: 'Gerenciador de prefixos Wine para Linux.',
    description:
      'Cria e gerencia "garrafas" (prefixos Wine) isoladas para rodar aplicativos e jogos de Windows no Linux, com camadas de compatibilidade prontas e integração com Winetricks e DXVK.',
    websiteUrl: 'https://usebottles.com/',
    license: 'open_source',
    color: '#4A86CF',
    popularity: 46,
    updatedDaysAgo: 4,
    tags: ['jogos', 'gaming', 'linux', 'wine', 'open source'],
    oss: ['linux'],
    archs: ['x64'],
    alternatives: ['lutris'],
    packages: [
      FP('com.usebottles.bottles', { source: 'community' })
    ]
  }),
  a({
    slug: 'itch',
    name: 'itch.io App',
    vendor: 'itch.io',
    categorySlug: 'gaming',
    tagline: 'Cliente oficial da loja itch.io.',
    description:
      'App oficial da itch.io para baixar, atualizar e jogar títulos indie comprados ou obtidos gratuitamente na plataforma, incluindo jogos experimentais e ferramentas de desenvolvedores independentes.',
    websiteUrl: 'https://itch.io/app',
    license: 'open_source',
    color: '#FA5C5C',
    popularity: 48,
    updatedDaysAgo: 2,
    tags: ['jogos', 'gaming', 'indie', 'itch'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64'],
    alternatives: ['steam', 'gog-galaxy'],
    packages: [
      W('ItchIo.Itch'),
      BC('itch'),
      FP('io.itch.itch', { source: 'community' })
    ]
  })
];
