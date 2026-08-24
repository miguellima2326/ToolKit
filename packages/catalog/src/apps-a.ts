import type { CatalogApp } from './types';
import { AP, BC, BF, DL, DN, FP, OI, PC, SN, W } from './types';

const a = (
  base: Omit<CatalogApp, 'iconKey' | 'status' | 'version'> & Partial<Pick<CatalogApp, 'iconKey' | 'status' | 'version'>>
): CatalogApp => ({
  iconKey: base.slug,
  status: 'verified',
  version: null,
  ...base
});

export const appsA: CatalogApp[] = [
  a({
    slug: 'google-chrome',
    name: 'Google Chrome',
    vendor: 'Google',
    categorySlug: 'navegadores',
    tagline: 'Navegador rápido e amplamente compatível.',
    description:
      'Navegador do Google com sincronização de favoritos e senhas, extensões e ferramentas de desenvolvedor. É o navegador mais usado do mundo e costuma ser o primeiro aplicativo instalado em qualquer máquina nova.',
    websiteUrl: 'https://www.google.com/chrome/',
    license: 'freeware',
    color: '#4285F4',
    popularity: 99,
    updatedDaysAgo: 2,
    tags: ['navegador', 'browser', 'internet', 'chromium'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['mozilla-firefox', 'brave', 'microsoft-edge'],
    packages: [
      W('Google.Chrome'),
      BC('google-chrome'),
      FP('com.google.Chrome'),
      DL('https://www.google.com/chrome/', 'linux')
    ]
  }),
  a({
    slug: 'mozilla-firefox',
    name: 'Firefox',
    vendor: 'Mozilla',
    categorySlug: 'navegadores',
    tagline: 'Navegador independente focado em privacidade.',
    description:
      'Navegador open source da Mozilla, com engine própria (Gecko), proteção contra rastreadores e forte compromisso com a web aberta.',
    websiteUrl: 'https://www.mozilla.org/firefox/',
    license: 'open_source',
    color: '#FF7139',
    popularity: 88,
    updatedDaysAgo: 1,
    tags: ['navegador', 'browser', 'privacidade', 'open source'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['google-chrome', 'brave'],
    packages: [
      W('Mozilla.Firefox'),
      BC('firefox'),
      FP('org.mozilla.firefox', { source: 'official' }),
      AP('firefox', { notes: 'No Ubuntu, o pacote apt instala a versão via snap.' }),
      DN('firefox'),
      PC('firefox')
    ]
  }),
  a({
    slug: 'brave',
    name: 'Brave',
    vendor: 'Brave Software',
    categorySlug: 'navegadores',
    tagline: 'Navegador com bloqueio de anúncios e rastreadores nativo.',
    description:
      'Navegador baseado em Chromium com bloqueio integrado de anúncios e rastreadores, suporte a Tor e carteira cripto opcional.',
    websiteUrl: 'https://brave.com/',
    license: 'open_source',
    color: '#FB542B',
    popularity: 74,
    updatedDaysAgo: 3,
    tags: ['navegador', 'privacidade', 'chromium'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['google-chrome', 'mozilla-firefox'],
    packages: [
      W('Brave.Brave'),
      BC('brave-browser'),
      FP('com.brave.Browser'),
      DL('https://brave.com/download/', 'linux')
    ]
  }),
  a({
    slug: 'microsoft-edge',
    name: 'Microsoft Edge',
    vendor: 'Microsoft',
    categorySlug: 'navegadores',
    tagline: 'Navegador da Microsoft baseado em Chromium.',
    description:
      'Navegador padrão do Windows com integração ao ecossistema Microsoft, coleções, Copilot e desempenho semelhante ao Chrome.',
    websiteUrl: 'https://www.microsoft.com/edge',
    license: 'freeware',
    color: '#0078D4',
    popularity: 82,
    updatedDaysAgo: 2,
    tags: ['navegador', 'microsoft', 'chromium'],
    oss: ['windows', 'macos'],
    archs: ['x64', 'arm64'],
    alternatives: ['google-chrome', 'brave'],
    packages: [W('Microsoft.Edge'), BC('microsoft-edge')]
  }),
  a({
    slug: 'vivaldi',
    name: 'Vivaldi',
    vendor: 'Vivaldi Technologies',
    categorySlug: 'navegadores',
    tagline: 'Navegador altamente personalizável para usuários avançados.',
    description:
      'Navegador baseado em Chromium com abas empilhadas, painéis laterais, temas profundos e controle total sobre a interface.',
    websiteUrl: 'https://vivaldi.com/',
    license: 'freeware',
    color: '#EF3939',
    popularity: 58,
    updatedDaysAgo: 5,
    tags: ['navegador', 'personalização', 'chromium'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['google-chrome', 'brave'],
    packages: [
      W('Vivaldi.Vivaldi'),
      BC('vivaldi'),
      FP('com.vivaldi.Vivaldi'),
      DL('https://vivaldi.com/download/', 'linux')
    ]
  }),
  a({
    slug: 'discord',
    name: 'Discord',
    vendor: 'Discord Inc.',
    categorySlug: 'comunicacao',
    tagline: 'Voz, vídeo e texto para comunidades e amigos.',
    description:
      'Plataforma de comunicação com servidores, canais de voz de baixa latência, streaming de tela e integrações. Padrão para gamers e comunidades técnicas.',
    websiteUrl: 'https://discord.com/',
    license: 'freeware',
    color: '#5865F2',
    popularity: 95,
    updatedDaysAgo: 1,
    tags: ['chat', 'voz', 'comunidade', 'gaming'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64'],
    alternatives: ['telegram-desktop', 'slack'],
    packages: [
      W('Discord.Discord'),
      BC('discord'),
      FP('com.discordapp.Discord'),
      SN('discord'),
      PC('discord', { repository: 'extra' }),
      DL('https://discord.com/download', 'linux')
    ]
  }),
  a({
    slug: 'slack',
    name: 'Slack',
    vendor: 'Salesforce',
    categorySlug: 'comunicacao',
    tagline: 'Mensageria corporativa por canais.',
    description:
      'Chat corporativo organizado em canais, com threads, huddles, integrações e automações. Amplamente usado por equipes de produto e engenharia.',
    websiteUrl: 'https://slack.com/',
    license: 'freemium',
    color: '#611F69',
    popularity: 80,
    updatedDaysAgo: 2,
    tags: ['chat', 'trabalho', 'equipe'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['microsoft-teams', 'discord'],
    packages: [
      W('SlackTechnologies.Slack'),
      BC('slack'),
      FP('com.slack.Slack'),
      DL('https://slack.com/downloads/linux', 'linux')
    ]
  }),
  a({
    slug: 'telegram-desktop',
    name: 'Telegram Desktop',
    vendor: 'Telegram FZ-LLC',
    categorySlug: 'comunicacao',
    tagline: 'Mensageiro rápido com canais e bots.',
    description:
      'Cliente oficial do Telegram para desktop, com canais, grupos grandes, bots, arquivos de até 2 GB e sincronização instantânea.',
    websiteUrl: 'https://telegram.org/',
    license: 'open_source',
    color: '#26A5E4',
    popularity: 78,
    updatedDaysAgo: 3,
    tags: ['mensageiro', 'chat', 'canais'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['signal', 'whatsapp'],
    packages: [
      W('Telegram.TelegramDesktop', {
        status: 'pending_review',
        notes: 'Confirmar ID atual no winget antes de promover'
      }),
      BC('telegram'),
      FP('org.telegram.desktop', { source: 'official' }),
      SN('telegram-desktop'),
      PC('telegram-desktop', { repository: 'extra' })
    ]
  }),
  a({
    slug: 'signal',
    name: 'Signal',
    vendor: 'Signal Foundation',
    categorySlug: 'comunicacao',
    tagline: 'Mensageiro focado em privacidade com criptografia ponta a ponta.',
    description:
      'Mensageiro com criptografia ponta a ponta por padrão, mantido por uma fundação sem fins lucrativos. Referência em comunicação privada.',
    websiteUrl: 'https://signal.org/',
    license: 'open_source',
    color: '#3A76F0',
    popularity: 62,
    updatedDaysAgo: 4,
    tags: ['mensageiro', 'privacidade', 'criptografia'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['telegram-desktop'],
    packages: [
      W('OpenWhisperSystems.Signal'),
      BC('signal'),
      FP('org.signal.Signal', { source: 'official' }),
      DL('https://signal.org/download/', 'linux')
    ]
  }),
  a({
    slug: 'whatsapp',
    name: 'WhatsApp',
    vendor: 'Meta',
    categorySlug: 'comunicacao',
    tagline: 'Mensageiro mais popular do Brasil, direto no desktop.',
    description:
      'Aplicativo oficial do WhatsApp para computador com espelhamento das conversas do celular, chamadas de voz e vídeo.',
    websiteUrl: 'https://www.whatsapp.com/',
    license: 'freeware',
    color: '#25D366',
    popularity: 90,
    updatedDaysAgo: 2,
    tags: ['mensageiro', 'meta', 'chat'],
    oss: ['windows', 'macos'],
    archs: ['x64', 'arm64'],
    alternatives: ['telegram-desktop', 'signal'],
    packages: [
      W('WhatsApp.Whatsapp', {
        status: 'pending_review',
        notes: 'Confirmar capitalização do ID no winget'
      }),
      BC('whatsapp')
    ]
  }),
  a({
    slug: 'microsoft-teams',
    name: 'Microsoft Teams',
    vendor: 'Microsoft',
    categorySlug: 'comunicacao',
    tagline: 'Reuniões, chat e colaboração do ecossistema Microsoft 365.',
    description:
      'Plataforma de trabalho híbrido com reuniões, canais, arquivos e integração com Office. Requisito comum em ambientes corporativos.',
    websiteUrl: 'https://www.microsoft.com/microsoft-teams',
    license: 'freemium',
    color: '#6264A7',
    popularity: 84,
    updatedDaysAgo: 2,
    tags: ['reuniões', 'trabalho', 'microsoft 365'],
    oss: ['windows', 'macos'],
    archs: ['x64', 'arm64'],
    alternatives: ['zoom', 'slack'],
    packages: [W('Microsoft.Teams'), BC('microsoft-teams')]
  }),
  a({
    slug: 'zoom',
    name: 'Zoom Workplace',
    vendor: 'Zoom',
    categorySlug: 'comunicacao',
    tagline: 'Videochamadas estáveis para reuniões e aulas.',
    description:
      'Plataforma de videoconferência com salas de espera, compartilhamento de tela e gravação local. Muito usada em educação e suporte remoto.',
    websiteUrl: 'https://zoom.us/',
    license: 'freemium',
    color: '#2D8CFF',
    popularity: 83,
    updatedDaysAgo: 3,
    tags: ['videoconferência', 'reuniões', 'aulas'],
    oss: ['windows', 'macos'],
    archs: ['x64', 'arm64'],
    alternatives: ['microsoft-teams'],
    packages: [W('Zoom.Zoom'), BC('zoom')]
  }),
  a({
    slug: 'libreoffice',
    name: 'LibreOffice',
    vendor: 'The Document Foundation',
    categorySlug: 'produtividade',
    tagline: 'Suíte office completa, livre e gratuita.',
    description:
      'Alternativa open source ao Microsoft Office com Writer, Calc, Impress, Draw, Base e Math. Abre e exporta formatos do Office com boa fidelidade.',
    websiteUrl: 'https://pt-br.libreoffice.org/',
    license: 'open_source',
    color: '#18A303',
    popularity: 76,
    updatedDaysAgo: 6,
    tags: ['office', 'editor de texto', 'planilhas', 'open source'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['onlyoffice-editors'],
    packages: [
      W('TheDocumentFoundation.LibreOffice'),
      BC('libreoffice'),
      FP('org.libreoffice.LibreOffice', { source: 'official' }),
      AP('libreoffice'),
      DN('libreoffice'),
      PC('libreoffice-fresh', { repository: 'extra' })
    ]
  }),
  a({
    slug: 'onlyoffice-editors',
    name: 'ONLYOFFICE Editors',
    vendor: 'ONLYOFFICE',
    categorySlug: 'produtividade',
    tagline: 'Editores de documentos com máxima compatibilidade com o Office.',
    description:
      'Suite desktop com editores de texto, planilha e apresentação muito fiéis aos formatos DOCX/XLSX/PPTX, incluindo edição colaborativa.',
    websiteUrl: 'https://www.onlyoffice.com/',
    license: 'open_source',
    color: '#FF6F3D',
    popularity: 55,
    updatedDaysAgo: 7,
    tags: ['office', 'documentos', 'open source'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64'],
    alternatives: ['libreoffice'],
    packages: [
      W('ONLYOFFICE.DesktopEditors'),
      BC('onlyoffice'),
      FP('org.onlyoffice.desktopeditors', { source: 'official' })
    ]
  }),
  a({
    slug: 'notion',
    name: 'Notion',
    vendor: 'Notion Labs',
    categorySlug: 'produtividade',
    tagline: 'Workspace de notas, docs e bancos de dados.',
    description:
      'Espaço de trabalho tudo-em-um que combina documentos, wikis, tarefas e bancos de dados com blocos modulares e colaboração em tempo real.',
    websiteUrl: 'https://www.notion.so/',
    license: 'freemium',
    color: '#111113',
    popularity: 72,
    updatedDaysAgo: 4,
    tags: ['notas', 'wiki', 'produtividade'],
    oss: ['windows', 'macos'],
    archs: ['x64', 'arm64'],
    alternatives: ['obsidian'],
    packages: [W('Notion.Notion'), BC('notion')]
  }),
  a({
    slug: 'obsidian',
    name: 'Obsidian',
    vendor: 'Dynalist Inc.',
    categorySlug: 'produtividade',
    tagline: 'Notas locais em Markdown com links entre ideias.',
    description:
      'Editor de notas em Markdown armazenando tudo localmente, com grafos de conexões, plugins da comunidade e sincronização opcional.',
    websiteUrl: 'https://obsidian.md/',
    license: 'freemium',
    color: '#8B7CF6',
    popularity: 68,
    updatedDaysAgo: 5,
    tags: ['notas', 'markdown', 'produtividade'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: ['notion'],
    packages: [
      W('Obsidian.Obsidian'),
      BC('obsidian'),
      FP('md.obsidian.Obsidian', { source: 'official' })
    ]
  }),
  a({
    slug: 'vlc',
    name: 'VLC media player',
    vendor: 'VideoLAN',
    categorySlug: 'multimidia',
    tagline: 'Toca praticamente qualquer arquivo de mídia.',
    description:
      'Player multimídia gratuito e open source que reproduz quase todos os formatos de vídeo e áudio sem codecs extras, além de transmitir pela rede.',
    websiteUrl: 'https://www.videolan.org/vlc/',
    license: 'open_source',
    color: '#FF8800',
    popularity: 93,
    updatedDaysAgo: 9,
    tags: ['player', 'vídeo', 'áudio', 'multimídia'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: [],
    packages: [
      W('VideoLAN.VLC'),
      BC('vlc'),
      FP('org.videolan.VLC', { source: 'official' }),
      SN('vlc'),
      AP('vlc'),
      DN('vlc'),
      PC('vlc')
    ]
  }),
  a({
    slug: 'spotify',
    name: 'Spotify',
    vendor: 'Spotify AB',
    categorySlug: 'audio',
    tagline: 'Streaming de música e podcasts.',
    description:
      'Cliente oficial do Spotify para desktop, com playlists, podcasts e integração com teclas de mídia.',
    websiteUrl: 'https://open.spotify.com/',
    license: 'freemium',
    color: '#1DB954',
    popularity: 89,
    updatedDaysAgo: 3,
    tags: ['música', 'streaming', 'podcasts'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: [],
    packages: [W('Spotify.Spotify'), BC('spotify'), FP('com.spotify.Client'), SN('spotify')]
  }),
  a({
    slug: 'audacity',
    name: 'Audacity',
    vendor: 'Muse Group',
    categorySlug: 'audio',
    tagline: 'Editor de áudio multitrilha simples e poderoso.',
    description:
      'Editor e gravador de áudio open source para gravações, podcasts, limpeza de ruído e edições rápidas em múltiplas faixas.',
    websiteUrl: 'https://www.audacityteam.org/',
    license: 'open_source',
    color: '#3E93CD',
    popularity: 66,
    updatedDaysAgo: 12,
    tags: ['áudio', 'editor', 'podcast', 'gravação'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64'],
    alternatives: [],
    packages: [
      W('Audacity.Audacity'),
      BC('audacity'),
      FP('org.audacityteam.Audacity', { source: 'official' }),
      AP('audacity'),
      DN('audacity'),
      PC('audacity')
    ]
  }),
  a({
    slug: 'obs-studio',
    name: 'OBS Studio',
    vendor: 'OBS Project',
    categorySlug: 'video',
    tagline: 'Gravação de tela e transmissão ao vivo profissional.',
    description:
      'Software livre para captura de tela, cenas composição e streaming para Twitch, YouTube e afins. Padrão da indústria para criadores.',
    websiteUrl: 'https://obsproject.com/',
    license: 'open_source',
    color: '#302E31',
    popularity: 85,
    updatedDaysAgo: 5,
    tags: ['streaming', 'gravação de tela', 'twitch', 'youtube'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: [],
    packages: [
      W('OBSProject.OBSStudio'),
      BC('obs'),
      FP('com.obsproject.Studio', { source: 'official' }),
      AP('obs-studio'),
      DN('obs-studio', { repository: 'rpmfusion', notes: 'Requer RPM Fusion habilitado.' }),
      PC('obs-studio')
    ]
  }),
  a({
    slug: 'kdenlive',
    name: 'Kdenlive',
    vendor: 'KDE',
    categorySlug: 'video',
    tagline: 'Editor de vídeo não linear open source.',
    description:
      'Editor de vídeo multicamadas com timeline profissional, efeitos, transições e proxy de mídia. Alternativa livre ao DaVinci/Premiere.',
    websiteUrl: 'https://kdenlive.org/',
    license: 'open_source',
    color: '#47A6E5',
    popularity: 57,
    updatedDaysAgo: 10,
    tags: ['edição de vídeo', 'editor', 'kde'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64'],
    alternatives: [],
    packages: [
      W('KDE.Kdenlive'),
      BC('kdenlive'),
      FP('org.kde.kdenlive', { source: 'official' }),
      AP('kdenlive'),
      DN('kdenlive'),
      PC('kdenlive')
    ]
  }),
  a({
    slug: 'handbrake',
    name: 'HandBrake',
    vendor: 'HandBrake Team',
    categorySlug: 'video',
    tagline: 'Conversor de vídeo open source com presets.',
    description:
      'Transcodificador de vídeo multiplataforma para converter vídeos para MP4/MKV com presets para dispositivos, compressão e legendas.',
    websiteUrl: 'https://handbrake.fr/',
    license: 'open_source',
    color: '#D64545',
    popularity: 54,
    updatedDaysAgo: 14,
    tags: ['conversão', 'vídeo', 'compressão'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64'],
    alternatives: [],
    packages: [W('HandBrake.HandBrake'), BC('handbrake-app'), AP('handbrake'), DN('handbrake')]
  }),
  a({
    slug: 'blender',
    name: 'Blender',
    vendor: 'Blender Foundation',
    categorySlug: 'design',
    tagline: 'Criação 3D completa: modelagem, animação e render.',
    description:
      'Suíte open source para modelagem 3D, escultura, animação, simulação, renderização (Cycles/Eevee) e edição de vídeo. Gratuito para qualquer uso.',
    websiteUrl: 'https://www.blender.org/',
    license: 'open_source',
    color: '#EA7600',
    popularity: 79,
    updatedDaysAgo: 3,
    tags: ['3d', 'modelagem', 'animação', 'render'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64', 'arm64'],
    alternatives: [],
    packages: [
      W('BlenderFoundation.Blender'),
      BC('blender'),
      FP('org.blender.Blender', { source: 'official' }),
      SN('blender'),
      AP('blender'),
      DN('blender'),
      PC('blender')
    ]
  }),
  a({
    slug: 'gimp',
    name: 'GIMP',
    vendor: 'GIMP Team',
    categorySlug: 'design',
    tagline: 'Editor de imagens open source estilo Photoshop.',
    description:
      'Editor de imagens raster com camadas, máscaras, filtros e scripts. A alternativa livre mais conhecida ao Adobe Photoshop.',
    websiteUrl: 'https://www.gimp.org/',
    license: 'open_source',
    color: '#7D6F5B',
    popularity: 75,
    updatedDaysAgo: 20,
    tags: ['imagem', 'fotos', 'design', 'photoshop alternativa'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64'],
    alternatives: ['krita', 'inkscape'],
    packages: [
      W('GIMP.GIMP'),
      BC('gimp'),
      FP('org.gimp.GIMP', { source: 'official' }),
      SN('gimp'),
      AP('gimp'),
      DN('gimp'),
      PC('gimp')
    ]
  }),
  a({
    slug: 'inkscape',
    name: 'Inkscape',
    vendor: 'Inkscape Project',
    categorySlug: 'design',
    tagline: 'Editor vetorial open source estilo Illustrator.',
    description:
      'Editor de gráficos vetoriais SVG com curvas bezier, nós, texto avançado e extensões. Ideal para logos, ícones e arte vetorial.',
    websiteUrl: 'https://inkscape.org/',
    license: 'open_source',
    color: '#2B6E68',
    popularity: 64,
    updatedDaysAgo: 18,
    tags: ['vetor', 'svg', 'logotipo', 'illustrator alternativa'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64'],
    alternatives: ['gimp'],
    packages: [
      W('Inkscape.Inkscape'),
      BC('inkscape'),
      FP('org.inkscape.Inkscape', { source: 'official' }),
      AP('inkscape'),
      DN('inkscape'),
      PC('inkscape')
    ]
  }),
  a({
    slug: 'krita',
    name: 'Krita',
    vendor: 'KDE',
    categorySlug: 'design',
    tagline: 'Pintura digital profissional para artistas.',
    description:
      'Aplicativo de pintura digital com pincéis avançados, estabilizadores, animação 2D e suporte a tablets. Favorito de ilustradores.',
    websiteUrl: 'https://krita.org/',
    license: 'open_source',
    color: '#8FADF4',
    popularity: 61,
    updatedDaysAgo: 15,
    tags: ['pintura', 'ilustração', 'desenho', 'tablet'],
    oss: ['windows', 'macos', 'linux'],
    archs: ['x64'],
    alternatives: ['gimp'],
    packages: [
      W('KDE.Krita'),
      BC('krita'),
      FP('org.kde.krita', { source: 'official' }),
      AP('krita'),
      DN('krita'),
      PC('krita')
    ]
  }),
  a({
    slug: 'figma',
    name: 'Figma Desktop',
    vendor: 'Figma Inc.',
    categorySlug: 'design',
    tagline: 'Design colaborativo de interfaces na nuvem.',
    description:
      'Aplicativo desktop do Figma para design de interfaces, protótipos e sistemas de design com colaboração em tempo real.',
    websiteUrl: 'https://www.figma.com/',
    license: 'freemium',
    color: '#A259FF',
    popularity: 77,
    updatedDaysAgo: 2,
    tags: ['ui design', 'protótipo', 'colaboração'],
    oss: ['windows', 'macos'],
    archs: ['x64', 'arm64'],
    alternatives: [],
    packages: [W('Figma.Figma'), BC('figma')]
  })
];
