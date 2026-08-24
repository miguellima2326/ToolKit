export type Locale = 'pt-BR' | 'en-US';

const ptBR = {
  nav: { apps: 'Apps', drivers: 'Drivers', collections: 'Coleções', cli: 'CLI', docs: 'Docs', myToolkit: 'Meu Toolkit', search: 'Pesquisar apps, drivers ou ferramentas...', github: 'GitHub' },
  hero: {
    title1: 'Tudo que seu computador precisa.',
    title2: 'Em um só lugar.',
    subtitle: 'Encontre aplicativos, drivers e ferramentas para Windows, Linux e macOS. Monte seu pacote e instale tudo de uma vez.',
    ctaPrimary: 'Explorar aplicativos',
    ctaSecondary: 'Montar meu Toolkit',
    detected: 'Detectamos',
    change: 'alterar'
  },
  sections: {
    categories: 'Categorias',
    popular: 'Populares agora',
    recent: 'Atualizados recentemente',
    kits: 'Kits recomendados',
    driversTeaserTitle: 'Drivers com fonte garantida',
    driversTeaserText: 'Somente páginas oficiais dos fabricantes. Sem sites obscuros, sem instaladores duvidosos.',
    features: 'Por que Toolkit'
  },
  explorer: {
    title: 'Explorar aplicativos',
    filters: 'Filtros',
    os: 'Sistema operacional',
    category: 'Categoria',
    license: 'Licença',
    method: 'Método de instalação',
    sort: 'Ordenar',
    sortPopular: 'Mais populares',
    sortRecent: 'Mais recentes',
    sortName: 'A-Z',
    clear: 'Limpar filtros',
    results: '{count} aplicativos',
    favoritesOnly: 'Somente favoritos'
  },
  card: { add: 'Adicionar', added: 'Adicionado' },
  kit: {
    title: 'Meu Toolkit',
    empty: 'Seu Toolkit está vazio.',
    emptyHint: 'Adicione aplicativos para gerar um script de instalação.',
    clear: 'Limpar seleção',
    generate: 'Gerar instalação',
    share: 'Compartilhar link',
    remove: 'Remover',
    items: '{count} selecionados'
  },
  generator: {
    title: 'Gerar instalação',
    target: 'Destino',
    willRun: 'Este script executará:',
    script: 'Script completo',
    copy: 'Copiar comando',
    copied: 'Copiado!',
    downloadPs1: 'Baixar script PowerShell',
    downloadBat: 'Baixar script .bat',
    downloadSh: 'Baixar script .sh',
    manualTitle: 'Requer instalação manual ({count})',
    unavailable: 'Indisponíveis para o destino escolhido',
    summaryLine: '{auto} serão instalados automaticamente · {manual} requerem instalação manual',
    emptyKit: 'Nada para instalar ainda. Volte ao catálogo e adicione aplicativos.'
  },
  share: {
    useThis: 'Usar este Toolkit',
    created: 'criado em',
    qrHint: 'Escaneie para abrir esta lista em outro computador.'
  },
  footer: {
    tagline: 'Your apps. Your system. One place.',
    product: 'Produto',
    resources: 'Recursos',
    legal: 'Legal',
    privacy: 'Privacidade',
    terms: 'Termos',
    security: 'Segurança',
    status: 'Status',
    suggest: 'Sugerir aplicativo'
  },
  common: { loading: 'Carregando…', error: 'Algo deu errado.', retry: 'Tentar novamente', backHome: 'Voltar à página inicial', notFoundTitle: 'Página não encontrada', soon: 'Em breve' }
};

type Dict = typeof ptBR;

const enUS: Dict = {
  nav: { apps: 'Apps', drivers: 'Drivers', collections: 'Collections', cli: 'CLI', docs: 'Docs', myToolkit: 'My Toolkit', search: 'Search apps, drivers or tools...', github: 'GitHub' },
  hero: {
    title1: 'Everything your computer needs.',
    title2: 'In one place.',
    subtitle: 'Find apps, drivers and tools for Windows, Linux and macOS. Build your bundle and install everything at once.',
    ctaPrimary: 'Explore apps',
    ctaSecondary: 'Build my Toolkit',
    detected: 'We detected',
    change: 'change'
  },
  sections: {
    categories: 'Categories',
    popular: 'Popular right now',
    recent: 'Recently updated',
    kits: 'Recommended kits',
    driversTeaserTitle: 'Drivers from trusted sources only',
    driversTeaserText: 'Official manufacturer pages only. No shady mirrors, no sketchy installers.',
    features: 'Why Toolkit'
  },
  explorer: {
    title: 'Explore apps',
    filters: 'Filters',
    os: 'Operating system',
    category: 'Category',
    license: 'License',
    method: 'Install method',
    sort: 'Sort by',
    sortPopular: 'Most popular',
    sortRecent: 'Most recent',
    sortName: 'A-Z',
    clear: 'Clear filters',
    results: '{count} apps',
    favoritesOnly: 'Favorites only'
  },
  card: { add: 'Add', added: 'Added' },
  kit: {
    title: 'My Toolkit',
    empty: 'Your Toolkit is empty.',
    emptyHint: 'Add apps to generate an install script.',
    clear: 'Clear selection',
    generate: 'Generate installation',
    share: 'Share link',
    remove: 'Remove',
    items: '{count} selected'
  },
  generator: {
    title: 'Generate installation',
    target: 'Target',
    willRun: 'This script will run:',
    script: 'Full script',
    copy: 'Copy command',
    copied: 'Copied!',
    downloadPs1: 'Download PowerShell script',
    downloadBat: 'Download .bat script',
    downloadSh: 'Download .sh script',
    manualTitle: 'Requires manual installation ({count})',
    unavailable: 'Unavailable for the selected target',
    summaryLine: '{auto} will be installed automatically · {manual} require manual installation',
    emptyKit: 'Nothing to install yet. Go back to the catalog and add apps.'
  },
  share: {
    useThis: 'Use this Toolkit',
    created: 'created on',
    qrHint: 'Scan to open this list on another computer.'
  },
  footer: {
    tagline: 'Your apps. Your system. One place.',
    product: 'Product',
    resources: 'Resources',
    legal: 'Legal',
    privacy: 'Privacy',
    terms: 'Terms',
    security: 'Security',
    status: 'Status',
    suggest: 'Suggest an app'
  },
  common: { loading: 'Loading…', error: 'Something went wrong.', retry: 'Try again', backHome: 'Back to home', notFoundTitle: 'Page not found', soon: 'Soon' }
};

export const dictionaries: Record<Locale, Dict> = { 'pt-BR': ptBR, 'en-US': enUS };
export type Dictionary = Dict;
