import type { CatalogDriver, CatalogHardwareVendor } from './types';

export const drivers: CatalogDriver[] = [
  {
    slug: 'nvidia-geforce',
    name: 'NVIDIA GeForce Driver',
    vendorSlug: 'nvidia',
    tagline: 'Driver oficial para GPUs GeForce.',
    instructions:
      'Baixe pelo site oficial da NVIDIA informando o modelo exato da placa. No Windows, o NVIDIA App também pode gerenciar drivers e otimizações. Evite instaladores de terceiros.',
    downloadUrl: 'https://www.nvidia.com/pt-br/drivers/',
    categories: ['gpu', 'video'],
    oss: ['windows', 'linux']
  },
  {
    slug: 'amd-adrenalin',
    name: 'AMD Software: Adrenalin Edition',
    vendorSlug: 'amd',
    tagline: 'Driver e suite de otimização para GPUs AMD Radeon.',
    instructions:
      'Use o seletor oficial da AMD para encontrar o driver da sua GPU ou APU. O Auto-Detect da AMD identifica a placa automaticamente no Windows.',
    downloadUrl: 'https://www.amd.com/pt/support',
    categories: ['gpu', 'video'],
    oss: ['windows', 'linux']
  },
  {
    slug: 'intel-graphics',
    name: 'Intel Graphics Driver',
    vendorSlug: 'intel',
    tagline: 'Driver gráfico para Intel Arc e integradas.',
    instructions:
      'Prefira Windows Update como primeira opção. Para versões mais recentes, use o Intel Driver & Support Assistant, que detecta seu hardware automaticamente.',
    downloadUrl: 'https://www.intel.com.br/content/www/br/pt/support/detect.html',
    categories: ['gpu', 'video'],
    oss: ['windows', 'linux']
  },
  {
    slug: 'intel-wireless-bluetooth',
    name: 'Intel Wi-Fi & Bluetooth',
    vendorSlug: 'intel',
    tagline: 'Drivers oficiais de Wi-Fi e Bluetooth Intel.',
    instructions:
      'O Intel Driver & Support Assistant detecta adaptadores wireless e oferece os drivers corretos. Em notebooks, verifique também a página do fabricante do equipamento.',
    downloadUrl: 'https://www.intel.com.br/content/www/br/pt/support/detect.html',
    categories: ['wifi', 'bluetooth', 'rede'],
    oss: ['windows']
  },
  {
    slug: 'realtek-audio',
    name: 'Realtek HD Audio',
    vendorSlug: 'realtek',
    tagline: 'Driver de áudio onboard Realtek.',
    instructions:
      'Em notebooks e placas-mãe, prefira sempre o driver oferecido pelo fabricante do equipamento — versões genéricas podem faltar com recursos (painel jack, equalização).',
    downloadUrl: 'https://www.realtek.com/Download',
    categories: ['audio'],
    oss: ['windows']
  },
  {
    slug: 'realtek-ethernet',
    name: 'Realtek Ethernet',
    vendorSlug: 'realtek',
    tagline: 'Drivers de rede cabeada Realtek.',
    instructions:
      'O Windows Update costuma instalar automaticamente. Se precisar da versão completa com utilitários, baixe na área oficial da Realtek.',
    downloadUrl: 'https://www.realtek.com/Download',
    categories: ['rede', 'wifi'],
    oss: ['windows', 'linux']
  },
  {
    slug: 'amd-chipset',
    name: 'AMD Chipset Driver',
    vendorSlug: 'amd',
    tagline: 'Drivers de chipset para plataformas AMD.',
    instructions:
      'Instale após formatar para garantir energia/USB funcionando corretamente. Baixe pelo site oficial da AMD selecionando seu chipset.',
    downloadUrl: 'https://www.amd.com/pt/support',
    categories: ['chipset'],
    oss: ['windows']
  },
  {
    slug: 'intel-chipset',
    name: 'Intel Chipset INF Utility',
    vendorSlug: 'intel',
    tagline: 'INF utility para chipsets Intel.',
    instructions:
      'Instale antes dos demais drivers em máquinas recém-formatadas com CPU Intel. O Windows Update geralmente cobre; o utilitário oficial garante.',
    downloadUrl: 'https://downloadcenter.intel.com/',
    categories: ['chipset'],
    oss: ['windows']
  },
  {
    slug: 'intel-rst',
    name: 'Intel Rapid Storage Technology',
    vendorSlug: 'intel',
    tagline: 'Driver SATA/NVMe (RST) para plataformas Intel.',
    instructions:
      'Necessário em alguns notebooks/desktops para o instalador do Windows reconhecer o SSD. Busque por "Rapid Storage Technology" no Download Center da Intel informando a geração do processador.',
    downloadUrl: 'https://downloadcenter.intel.com/',
    categories: ['armazenamento', 'chipset'],
    oss: ['windows']
  },
  {
    slug: 'intel-killer',
    name: 'Intel Killer Wireless & Ethernet',
    vendorSlug: 'intel',
    tagline: 'Drivers e Killer Control Center para adaptadores Killer.',
    instructions:
      'Adaptadores Killer (comuns em notebooks gamer) são mantidos pela Intel. Baixe o Killer Control Center com os drivers inclusos pela página oficial da Intel ou use o Driver & Support Assistant.',
    downloadUrl: 'https://www.intel.com/content/www/us/en/support/articles/000059060/wireless.html',
    categories: ['rede', 'wifi', 'bluetooth'],
    oss: ['windows']
  },
  {
    slug: 'samsung-magician',
    name: 'Samsung Magician',
    vendorSlug: 'samsung',
    tagline: 'Ferramenta oficial de firmware e saúde para SSDs Samsung.',
    instructions:
      'Após formatar, use o Magician para verificar atualizações de firmware do SSD Samsung. Também disponível para macOS. A mesma página concentra firmware e ferramentas de armazenamento da Samsung.',
    downloadUrl: 'https://semiconductor.samsung.com/consumer-storage/support/tools/',
    categories: ['armazenamento'],
    oss: ['windows', 'macos']
  },
  {
    slug: 'crucial-storage-executive',
    name: 'Crucial Storage Executive',
    vendorSlug: 'crucial',
    tagline: 'Gerenciador oficial de SSDs Crucial/Micron.',
    instructions:
      'Monitora a saúde do SSD Crucial e aplica atualizações de firmware. Se o Windows estiver em outra unidade, instale normalmente e selecione o SSD Crucial pelo painel.',
    downloadUrl: 'https://www.crucial.com/support/storage-executive',
    categories: ['armazenamento'],
    oss: ['windows']
  },
  {
    slug: 'realtek-card-reader',
    name: 'Realtek Card Reader',
    vendorSlug: 'realtek',
    tagline: 'Driver para leitores de cartão SD/microSD Realtek.',
    instructions:
      'Comum em notebooks que param de ler cartão SD após a formatação. Baixe na área de downloads da Realtek sob "Card Reader" — ou verifique primeiro se o Windows Update já instalou.',
    downloadUrl: 'https://www.realtek.com/Download',
    categories: ['armazenamento'],
    oss: ['windows']
  },
  {
    slug: 'hp-printers',
    name: 'HP — Drivers de Impressoras',
    vendorSlug: 'hp',
    tagline: 'Portal oficial HP para impressoras e multifuncionais.',
    instructions:
      'Informe o modelo da impressora no portal da HP para baixar o driver completo (impressão + digitalização). No Windows, o HP Smart da Microsoft Store também detecta e instala automaticamente.',
    downloadUrl: 'https://support.hp.com/br-pt/drivers',
    categories: ['impressoras'],
    oss: ['windows', 'macos']
  },
  {
    slug: 'epson-printers',
    name: 'Epson — Suporte para Impressoras',
    vendorSlug: 'epson',
    tagline: 'Drivers e utilitários oficiais Epson Brasil.',
    instructions:
      'Busque o modelo (ex.: L455, EcoTank, WorkForce) na página de suporte da Epson Brasil. O pacote oficial inclui driver de impressão, scanner e o Epson Scan 2.',
    downloadUrl: 'https://epson.com.br/Suporte/Impressoras/sh/s1',
    categories: ['impressoras'],
    oss: ['windows', 'macos']
  },
  {
    slug: 'canon-printers',
    name: 'Canon — Downloads e Drivers',
    vendorSlug: 'canon',
    tagline: 'Portal oficial de drivers Canon Brasil.',
    instructions:
      'No portal web da Canon Brasil, informe o modelo da impressora (PIXMA, MAXIFY, imageCLASS) para obter drivers e firmware. Em Macs recentes, impressão via AirPrint dispensa driver.',
    downloadUrl: 'https://websupport.canon.com.br/',
    categories: ['impressoras'],
    oss: ['windows', 'macos']
  },
  {
    slug: 'brother-printers',
    name: 'Brother — Downloads e Drivers',
    vendorSlug: 'brother',
    tagline: 'Pacote completo de drivers Brother (BR).',
    instructions:
      'Pesquise o modelo no portal de downloads da Brother Brasil e prefira o "Pacote Completo de Drivers e Software". Há suporte oficial também para Linux (pacotes .deb/.rpm) via CUPS.',
    downloadUrl: 'https://support.brother.com/g/b/productsearch.aspx?c=br&lang=pt&content=dl',
    categories: ['impressoras'],
    oss: ['windows', 'linux']
  }
];

export const hardwareVendors: CatalogHardwareVendor[] = [
  { slug: 'dell', name: 'Dell', supportUrl: 'https://www.dell.com/support/pt-br/', kind: 'notebook' },
  { slug: 'hp', name: 'HP', supportUrl: 'https://support.hp.com/br-pt', kind: 'notebook' },
  { slug: 'lenovo', name: 'Lenovo', supportUrl: 'https://pcsupport.lenovo.com/br/pt/', kind: 'notebook' },
  { slug: 'asus', name: 'ASUS', supportUrl: 'https://www.asus.com/br/support/', kind: 'notebook' },
  { slug: 'acer', name: 'Acer', supportUrl: 'https://www.acer.com/br-pt/support', kind: 'notebook' },
  { slug: 'msi', name: 'MSI', supportUrl: 'https://www.msi.com/support', kind: 'placa-mãe' },
  { slug: 'gigabyte', name: 'Gigabyte', supportUrl: 'https://www.gigabyte.com/Support', kind: 'placa-mãe' },
  { slug: 'asrock', name: 'ASRock', supportUrl: 'https://www.asrock.com/support/', kind: 'placa-mãe' },
  { slug: 'samsung', name: 'Samsung', supportUrl: 'https://www.samsung.com/br/support/', kind: 'notebook' },
  { slug: 'positivo', name: 'Positivo', supportUrl: 'https://www.meupositivo.com.br/setor-publico/suporte-tecnico/drivers', kind: 'notebook' },
  { slug: 'vaio', name: 'VAIO', supportUrl: 'https://www.br.vaio.com/suporte', kind: 'notebook' },
  { slug: 'microsoft-surface', name: 'Microsoft Surface', supportUrl: 'https://support.microsoft.com/pt-br/surface', kind: 'notebook' },
  { slug: 'apple', name: 'Apple', supportUrl: 'https://support.apple.com/pt-br', kind: 'notebook' }
];
