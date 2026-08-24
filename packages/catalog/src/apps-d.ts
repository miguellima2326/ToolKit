import type { CatalogApp } from './types';
import { AP, BC, BF, DL, FP, W } from './types';

const a = (
  base: Omit<CatalogApp, 'iconKey' | 'status' | 'version'> & Partial<Pick<CatalogApp, 'iconKey' | 'status' | 'version'>>
): CatalogApp => ({
  iconKey: base.slug,
  status: 'verified',
  version: null,
  ...base
});

export const appsD: CatalogApp[] = [
  // ── Editores e IDEs ─────────────────────────────────────────────────────
  a({
    slug: 'sublime-text',
    name: 'Sublime Text',
    vendor: 'Sublime HQ',
    categorySlug: 'desenvolvimento',
    tagline: 'Editor de texto rápido e leve para código.',
    description:
      'Editor de texto multiplataforma conhecido pela velocidade de abertura, o recurso "Goto Anything" e uma ampla comunidade de plugins via Package Control. Gratuito para avaliação indefinida, com aviso periódico de licença para uso contínuo.',
    websiteUrl: 'https://www.sublimetext.com/',
    license: 'freemium',
    color: '#FF9800',
    popularity: 62,
    updatedDaysAgo: 4,
    tags: ['editor de código', 'leve', 'multiplataforma'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['visual-studio-code', 'notepad-plus-plus', 'vscodium'],
    packages: [
      W('SublimeHQ.SublimeText'),
      BC('sublime-text'),
      FP('com.sublimehq.SublimeText', { source: 'community' })
    ]
  }),
  a({
    slug: 'neovim',
    name: 'Neovim',
    vendor: 'Neovim',
    categorySlug: 'desenvolvimento',
    tagline: 'Editor de texto modal em terminal, fork do Vim.',
    description:
      'Fork do Vim com arquitetura moderna, suporte nativo a LSP, plugins assíncronos escritos em Lua e forte comunidade de configurações prontas. Roda inteiramente no terminal.',
    websiteUrl: 'https://neovim.io/',
    license: 'open_source',
    color: '#57A143',
    popularity: 58,
    updatedDaysAgo: 2,
    tags: ['editor', 'terminal', 'vim', 'open source'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['sublime-text', 'visual-studio-code'],
    packages: [
      W('Neovim.Neovim'),
      BF('neovim'),
      AP('neovim')
    ]
  }),
  a({
    slug: 'eclipse-ide',
    name: 'Eclipse IDE',
    vendor: 'Eclipse Foundation',
    categorySlug: 'desenvolvimento',
    tagline: 'IDE open source para Java e outras linguagens.',
    description:
      'IDE extensível mantida pela Eclipse Foundation, historicamente a referência para desenvolvimento Java, com suporte a Maven, Gradle, Git e dezenas de plugins para outras linguagens via marketplace.',
    websiteUrl: 'https://www.eclipse.org/downloads/',
    license: 'open_source',
    color: '#2C2255',
    popularity: 55,
    updatedDaysAgo: 5,
    tags: ['ide', 'java', 'open source'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['intellij-idea-community', 'visual-studio-code'],
    packages: [
      W('EclipseFoundation.Eclipse'),
      BC('eclipse-ide'),
      FP('org.eclipse.Java', { source: 'official' })
    ]
  }),

  // ── Ferramentas visuais de desenvolvimento ─────────────────────────────
  a({
    slug: 'sourcetree',
    name: 'Sourcetree',
    vendor: 'Atlassian',
    categorySlug: 'desenvolvimento',
    tagline: 'Cliente Git visual gratuito da Atlassian.',
    description:
      'Interface gráfica gratuita para Git e Mercurial, com visualização de histórico em grafo, staging interativo por hunk e integração com Bitbucket, GitHub e outros remotos. Sem versão para Linux.',
    websiteUrl: 'https://www.sourcetreeapp.com/',
    license: 'freeware',
    color: '#0747A6',
    popularity: 60,
    updatedDaysAgo: 6,
    tags: ['git', 'gui', 'versionamento', 'atlassian'],
    oss: ['windows', 'macos'],
    archs: ['x64', 'arm64'],
    alternatives: ['gitkraken', 'github-desktop'],
    packages: [
      W('Atlassian.Sourcetree'),
      BC('sourcetree')
    ]
  }),
  a({
    slug: 'tableplus',
    name: 'TablePlus',
    vendor: 'TablePlus',
    categorySlug: 'banco-de-dados',
    tagline: 'Cliente gráfico moderno para bancos de dados.',
    description:
      'Interface nativa para MySQL, PostgreSQL, SQLite, SQL Server, Redis e outros bancos, com edição inline de dados, aba múltipla e execução de queries. Versão gratuita limita abas simultâneas por janela.',
    websiteUrl: 'https://tableplus.com/',
    license: 'freemium',
    color: '#5A67D8',
    popularity: 58,
    updatedDaysAgo: 3,
    tags: ['banco de dados', 'gui', 'sql'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['dbeaver-ce'],
    packages: [
      W('TablePlus.TablePlus'),
      BC('tableplus'),
      DL('https://tableplus.com/linux', 'linux')
    ]
  }),
  a({
    slug: 'github-cli',
    name: 'GitHub CLI',
    vendor: 'GitHub',
    categorySlug: 'desenvolvimento',
    tagline: 'CLI oficial do GitHub para terminal.',
    description:
      'Interface de linha de comando oficial do GitHub: cria e revisa pull requests, gerencia issues, releases e workflows do Actions sem sair do terminal.',
    websiteUrl: 'https://cli.github.com/',
    license: 'open_source',
    color: '#181717',
    popularity: 65,
    updatedDaysAgo: 2,
    tags: ['git', 'cli', 'github', 'terminal'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['git', 'github-desktop'],
    packages: [
      W('GitHub.cli'),
      BF('gh'),
      AP('gh')
    ]
  })
];
