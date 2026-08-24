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
  { slug: 'asrock', name: 'ASRock', supportUrl: 'https://www.asrock.com/support/', kind: 'placa-mãe' }
];
