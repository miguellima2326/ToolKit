import type { CatalogApp } from './types';
import { AP, BC, BF, DL, FP, PC, W } from './types';

const a = (
  base: Omit<CatalogApp, 'iconKey' | 'status' | 'version'> & Partial<Pick<CatalogApp, 'iconKey' | 'status' | 'version'>>
): CatalogApp => ({
  iconKey: base.slug,
  status: 'verified',
  version: null,
  ...base
});

export const appsC: CatalogApp[] = [
  // ── CLIs de IA ──────────────────────────────────────────────────────────
  a({
    slug: 'claude-code',
    name: 'Claude Code',
    vendor: 'Anthropic',
    categorySlug: 'ia',
    tagline: 'Agente de codificação da Anthropic direto no terminal.',
    description:
      'CLI oficial da Anthropic para programar em par com o Claude direto no terminal: lê e edita arquivos do projeto, roda comandos, cria commits e resolve tarefas de várias etapas com supervisão do desenvolvedor.',
    websiteUrl: 'https://claude.com/product/claude-code',
    license: 'freemium',
    color: '#D97757',
    popularity: 90,
    updatedDaysAgo: 1,
    tags: ['ia', 'cli', 'agente', 'programação', 'anthropic'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['codex-cli', 'opencode'],
    packages: [
      W('Anthropic.ClaudeCode'),
      BC('claude-code')
    ]
  }),
  a({
    slug: 'codex-cli',
    name: 'Codex CLI',
    vendor: 'OpenAI',
    categorySlug: 'ia',
    tagline: 'Agente de codificação da OpenAI no terminal.',
    description:
      'CLI oficial da OpenAI para tarefas de programação assistidas por IA direto no terminal, com acesso ao sistema de arquivos e execução de comandos sob aprovação do usuário.',
    websiteUrl: 'https://github.com/openai/codex',
    license: 'freemium',
    color: '#10A37F',
    popularity: 80,
    updatedDaysAgo: 1,
    tags: ['ia', 'cli', 'agente', 'programação', 'openai'],
    oss: ['macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['claude-code', 'opencode'],
    packages: [
      BC('codex')
    ]
  }),
  a({
    slug: 'opencode',
    name: 'opencode',
    vendor: 'SST',
    categorySlug: 'ia',
    tagline: 'Agente de codificação open source para terminal.',
    description:
      'Cliente de terminal open source para trabalhar com múltiplos provedores de IA (Anthropic, OpenAI, modelos locais e outros) em tarefas de programação, com foco em não ficar preso a um único provedor.',
    websiteUrl: 'https://opencode.ai',
    license: 'open_source',
    color: '#000000',
    popularity: 70,
    updatedDaysAgo: 1,
    tags: ['ia', 'cli', 'agente', 'programação', 'open source'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['claude-code', 'codex-cli'],
    packages: [
      {
        method: 'chocolatey',
        os: 'windows',
        packageId: 'opencode',
        source: 'community',
        status: 'pending_review',
        notes: 'Confirmar disponibilidade atual no Chocolatey antes de promover.'
      },
      BF('anomalyco/tap/opencode', { source: 'community' }),
      PC('opencode')
    ]
  }),
  a({
    slug: 'antigravity-cli',
    name: 'Antigravity CLI',
    vendor: 'Google',
    categorySlug: 'ia',
    tagline: 'Agente de codificação do Google no terminal (comando agy).',
    description:
      'CLI oficial do Google para o agente Antigravity: raciocínio em múltiplas etapas, edição multiarquivo e orquestração de agentes direto no terminal, com foco em workflows via teclado e sessões SSH remotas. Binário Go nativo, sem depender de Node.js.',
    websiteUrl: 'https://antigravity.google/docs/cli/getting-started/',
    license: 'freemium',
    color: '#7C3AED',
    popularity: 52,
    updatedDaysAgo: 1,
    tags: ['ia', 'cli', 'agente', 'google', 'terminal'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['claude-code', 'codex-cli', 'opencode', 'google-antigravity'],
    packages: [
      W('Google.AntigravityCLI'),
      BC('antigravity-cli'),
      DL('https://antigravity.google/docs/cli/install/', 'linux')
    ]
  }),

  // ── IDEs ────────────────────────────────────────────────────────────────
  a({
    slug: 'jetbrains-toolbox',
    name: 'JetBrains Toolbox',
    vendor: 'JetBrains',
    categorySlug: 'desenvolvimento',
    tagline: 'Instalador e atualizador central de todas as IDEs JetBrains.',
    description:
      'Aplicativo que gerencia a instalação, atualização e configuração de todas as IDEs JetBrains (IntelliJ IDEA, PyCharm, WebStorm, Rider, etc.) em um só lugar.',
    websiteUrl: 'https://www.jetbrains.com/toolbox-app/',
    license: 'freeware',
    color: '#000000',
    popularity: 78,
    updatedDaysAgo: 5,
    tags: ['ide', 'jetbrains', 'desenvolvimento'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['visual-studio-code'],
    packages: [
      W('JetBrains.Toolbox'),
      BC('jetbrains-toolbox')
    ]
  }),
  a({
    slug: 'intellij-idea-community',
    name: 'IntelliJ IDEA Community',
    vendor: 'JetBrains',
    categorySlug: 'desenvolvimento',
    tagline: 'IDE Java/Kotlin gratuita da JetBrains.',
    description:
      'Edição Community, gratuita e open source, da IDE Java/Kotlin mais usada do mercado — autocompletar inteligente, refatoração e integração com build tools como Maven e Gradle.',
    websiteUrl: 'https://www.jetbrains.com/idea/download/',
    license: 'open_source',
    color: '#000000',
    popularity: 75,
    updatedDaysAgo: 5,
    tags: ['ide', 'java', 'kotlin', 'jetbrains'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['jetbrains-toolbox', 'visual-studio-code'],
    packages: [
      W('JetBrains.IntelliJIDEA.Community'),
      BC('intellij-idea-ce', { status: 'pending_review', notes: 'Confirmar nome do cask antes de promover.' }),
      FP('com.jetbrains.IntelliJ-IDEA-Community', { status: 'pending_review', notes: 'Confirmar ID no Flathub antes de promover.' })
    ]
  }),
  a({
    slug: 'pycharm-community',
    name: 'PyCharm Community',
    vendor: 'JetBrains',
    categorySlug: 'desenvolvimento',
    tagline: 'IDE Python gratuita da JetBrains.',
    description:
      'Edição Community, gratuita e open source, da IDE Python da JetBrains — depuração, testes integrados e suporte a ambientes virtuais.',
    websiteUrl: 'https://www.jetbrains.com/pycharm/download/',
    license: 'open_source',
    color: '#000000',
    popularity: 74,
    updatedDaysAgo: 5,
    tags: ['ide', 'python', 'jetbrains'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['jetbrains-toolbox', 'visual-studio-code'],
    packages: [
      W('JetBrains.PyCharm.Community'),
      BC('pycharm-ce', { status: 'pending_review', notes: 'Confirmar nome do cask antes de promover.' }),
      FP('com.jetbrains.PyCharm-Community', { status: 'pending_review', notes: 'Confirmar ID no Flathub antes de promover.' })
    ]
  }),
  a({
    slug: 'android-studio',
    name: 'Android Studio',
    vendor: 'Google',
    categorySlug: 'desenvolvimento',
    tagline: 'IDE oficial para desenvolvimento Android.',
    description:
      'Ambiente de desenvolvimento oficial do Google para apps Android, com emulador, editor de layout visual e ferramentas de perfilamento de performance.',
    websiteUrl: 'https://developer.android.com/studio',
    license: 'freeware',
    color: '#3DDC84',
    popularity: 73,
    updatedDaysAgo: 3,
    tags: ['ide', 'android', 'mobile', 'google'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['jetbrains-toolbox'],
    packages: [
      W('Google.AndroidStudio'),
      BC('android-studio', { status: 'pending_review', notes: 'Confirmar nome do cask antes de promover.' })
    ]
  }),

  // ── Ferramentas de programação / visual ─────────────────────────────────
  a({
    slug: 'gitkraken',
    name: 'GitKraken',
    vendor: 'Axosoft',
    categorySlug: 'desenvolvimento',
    tagline: 'Cliente Git visual completo.',
    description:
      'Interface gráfica para Git com visualização de histórico em grafo, resolução de merge assistida e integração com GitHub, GitLab e Bitbucket. Gratuito para repositórios públicos.',
    websiteUrl: 'https://www.gitkraken.com/',
    license: 'freemium',
    color: '#179287',
    popularity: 68,
    updatedDaysAgo: 4,
    tags: ['git', 'gui', 'versionamento', 'desenvolvimento'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['github-desktop'],
    packages: [
      W('Axosoft.GitKraken'),
      BC('gitkraken', { status: 'pending_review', notes: 'Confirmar nome do cask antes de promover.' }),
      FP('com.axosoft.GitKraken', { status: 'pending_review', notes: 'Confirmar ID no Flathub antes de promover.' })
    ]
  }),

  // ── Runtimes / dependências de linguagem ────────────────────────────────
  a({
    slug: 'rust',
    name: 'Rust (rustup)',
    vendor: 'Rust Foundation',
    categorySlug: 'runtimes',
    tagline: 'Toolchain oficial da linguagem Rust.',
    description:
      'Instala o rustup, o instalador e gerenciador de versões oficial do Rust — inclui o compilador (rustc) e o gerenciador de pacotes/build (cargo).',
    websiteUrl: 'https://www.rust-lang.org/tools/install',
    license: 'open_source',
    color: '#DEA584',
    popularity: 70,
    updatedDaysAgo: 2,
    tags: ['rust', 'runtime', 'linguagem', 'compilador'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['go', 'nodejs'],
    packages: [
      W('Rustlang.Rustup'),
      BF('rustup', { status: 'pending_review', notes: 'Confirmar nome da formula antes de promover.' }),
      AP('rustc', { status: 'pending_review', notes: 'apt do Ubuntu costuma trazer versão desatualizada — considerar rustup no lugar.' })
    ]
  }),
  a({
    slug: 'go',
    name: 'Go',
    vendor: 'Google',
    categorySlug: 'runtimes',
    tagline: 'Runtime e compilador oficial da linguagem Go.',
    description:
      'Distribuição oficial da linguagem Go (Golang), mantida pelo Google — compilador, ferramentas de build e o gerenciador de módulos embutido.',
    websiteUrl: 'https://go.dev/dl/',
    license: 'open_source',
    color: '#00ADD8',
    popularity: 72,
    updatedDaysAgo: 2,
    tags: ['go', 'golang', 'runtime', 'linguagem'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['rust', 'nodejs'],
    packages: [
      W('GoLang.Go'),
      BF('go', { status: 'pending_review', notes: 'Confirmar nome da formula antes de promover.' }),
      AP('golang-go')
    ]
  }),
  a({
    slug: 'php',
    name: 'PHP',
    vendor: 'The PHP Group',
    categorySlug: 'runtimes',
    tagline: 'Runtime da linguagem PHP.',
    description:
      'Interpretador oficial do PHP, usado em desenvolvimento web e por frameworks como Laravel e Symfony.',
    websiteUrl: 'https://www.php.net/downloads',
    license: 'open_source',
    color: '#777BB4',
    popularity: 60,
    updatedDaysAgo: 3,
    tags: ['php', 'runtime', 'linguagem', 'web'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['nodejs', 'python'],
    packages: [
      W('PHP.PHP'),
      BF('php', { status: 'pending_review', notes: 'Confirmar nome da formula antes de promover.' }),
      AP('php')
    ]
  }),
  a({
    slug: 'ruby',
    name: 'Ruby',
    vendor: 'Ruby Core Team',
    categorySlug: 'runtimes',
    tagline: 'Runtime da linguagem Ruby.',
    description:
      'Interpretador oficial do Ruby, base do framework Ruby on Rails e de diversas ferramentas de linha de comando do ecossistema dev.',
    websiteUrl: 'https://www.ruby-lang.org/en/downloads/',
    license: 'open_source',
    color: '#CC342D',
    popularity: 55,
    updatedDaysAgo: 3,
    tags: ['ruby', 'runtime', 'linguagem'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['nodejs', 'python'],
    packages: [
      W('RubyInstallerTeam.Ruby'),
      BF('ruby', { status: 'pending_review', notes: 'Confirmar nome da formula antes de promover.' }),
      AP('ruby-full')
    ]
  }),

  // ── Produtividade ────────────────────────────────────────────────────────
  a({
    slug: 'microsoft-office',
    name: 'Microsoft 365 Apps (Office)',
    vendor: 'Microsoft',
    categorySlug: 'produtividade',
    tagline: 'Suíte de escritório Word, Excel, PowerPoint e Outlook.',
    description:
      'Instalador oficial do Microsoft 365 Apps (antigo Office), baixado direto do CDN da Microsoft: Word, Excel, PowerPoint, Outlook e demais aplicativos. Após instalar, é preciso fazer login com uma conta Microsoft com assinatura Microsoft 365 ativa para ativar o uso completo.',
    websiteUrl: 'https://www.microsoft.com/microsoft-365',
    license: 'paid',
    color: '#D83B01',
    popularity: 65,
    updatedDaysAgo: 7,
    tags: ['office', 'escritório', 'produtividade', 'word', 'excel', 'powerpoint', 'outlook', 'planilha', 'apresentação', 'editor de texto'],
    oss: ['windows', 'macos'],
    archs: ['x64', 'arm64'],
    alternatives: ['libreoffice', 'onlyoffice-editors'],
    packages: [
      W('Microsoft.Office'),
      BC('microsoft-office', { notes: 'Requer macOS 14 (Sonoma) ou mais recente.' })
    ]
  }),

  // ── IDEs agênticas de IA ────────────────────────────────────────────────
  a({
    slug: 'google-antigravity',
    name: 'Google Antigravity',
    vendor: 'Google',
    categorySlug: 'desenvolvimento',
    tagline: 'IDE agêntica do Google, fork do VS Code.',
    description:
      'Plataforma de desenvolvimento agêntico do Google: agentes de IA planejam, implementam, testam e iteram tarefas em múltiplos arquivos e workspaces, com a experiência familiar de um editor baseado em VS Code.',
    websiteUrl: 'https://antigravity.google/',
    license: 'freemium',
    color: '#7C3AED',
    popularity: 62,
    updatedDaysAgo: 1,
    tags: ['ide', 'ia', 'agente', 'vscode', 'google'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['cursor', 'windsurf', 'visual-studio-code'],
    packages: [
      W('Google.AntigravityIDE'),
      BC('antigravity-ide'),
      DL('https://antigravity.google/download/linux', 'linux')
    ]
  }),
  a({
    slug: 'windsurf',
    name: 'Windsurf',
    vendor: 'Codeium',
    categorySlug: 'desenvolvimento',
    tagline: 'Editor de código com agente de IA (Cascade).',
    description:
      'Fork do VS Code com o agente Cascade: entende o contexto do projeto inteiro, executa mudanças multiarquivo, roda comandos e corrige erros com supervisão do desenvolvedor.',
    websiteUrl: 'https://windsurf.com/',
    license: 'freemium',
    color: '#58E5C0',
    popularity: 64,
    updatedDaysAgo: 2,
    tags: ['editor de código', 'ia', 'agente', 'vscode'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['cursor', 'google-antigravity', 'visual-studio-code'],
    packages: [
      W('Codeium.Windsurf'),
      BC('windsurf'),
      DL('https://windsurf.com/download', 'linux')
    ]
  })
];
