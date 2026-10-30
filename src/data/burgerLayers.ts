/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScrollytellingLayer {
  id: string;
  index: number;
  numberPrefix: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  quote: string;
  details: {
    origin: string;
    temperature: string;
    craftTime: string;
    keyFlavor: string;
  };
  /**
   * Caminho do PNG transparente de alta definição (isométrica 3D recortada sem fundo).
   */
  pngUrl: string;
  /**
   * Efeito de partículas 3D específico da camada:
   * - 'steam': vapor e fumaça subindo da carne grelhada (camada 5)
   * - 'dewdrops': gotas de frescor brilhando na cebola e alface (camadas 2 e 3)
   * - 'molten': brilho quente de cheddar derretendo (camada 4)
   * - 'smoke': brasa e defumação de macieira no bacon (camada 6)
   */
  particleEffect?: 'steam' | 'dewdrops' | 'molten' | 'smoke' | 'none';
  /**
   * Posição vertical (em px) quando o hambúrguer está fechado no topo (scroll = 0)
   */
  closedY: number;
  /**
   * Posição vertical (em px) quando o hambúrguer está 100% desconstruído no scroll
   */
  explodedY: number;
  /**
   * Escala horizontal relativa para encaixe anatômico perfeito entre as camadas
   */
  widthPercent: number;
  /**
   * Leve inclinação orgânica durante a levitação
   */
  explodedRotate: number;
  /**
   * Float animation offset for zero-gravity breathing physics
   */
  floatDelay: string;
}

export const BURGER_3D_EXPLODED_VIDEO = '/assets/ingredients/burger-3d-exploded.mp4';

export const BURGER_ANATOMY_LAYERS: ScrollytellingLayer[] = [
  {
    id: 'layer-top-bun',
    index: 1,
    numberPrefix: '01',
    title: 'PÃO AUSTRALIANO TOPO',
    subtitle: 'Topo Macio, Mel & Cacau',
    badge: 'Fermentação Natural 24h',
    description: '[01. PÃO AUSTRALIANO TOPO] — Assado na hora, toque de mel silvestre e cacau 100%, polvilhado com fina chuva de fubá artesanal.',
    quote: 'Textura aveludada com coloração escura característica, brilho de forno a lenha e suave dulçor de cacau.',
    details: {
      origin: 'Farinha Australiana Especial',
      temperature: 'Fresco da Estufa (65°C)',
      craftTime: 'Assado a cada 40 minutos',
      keyFlavor: 'Mel Silvestre, Cacau & Fubá',
    },
    pngUrl: '/assets/ingredients/layer-01-top-bun.png',
    particleEffect: 'none',
    closedY: -102,
    explodedY: -232,
    widthPercent: 95,
    explodedRotate: -1.5,
    floatDelay: '0s',
  },
  {
    id: 'layer-onion',
    index: 2,
    numberPrefix: '02',
    title: 'CEBOLA CROCANTE ROXA',
    subtitle: 'Anéis em Banho de Gelo',
    badge: 'Crocância Térmica',
    description: '[02. CEBOLA CROCANTE ROXA] — Cortes frescos em anéis imersos em água gelada mineral para estalo acústico perfeito na mordida.',
    quote: 'Três anéis selecionados com pungência equilibrada e contraste térmico revigorante sobre os cortes quentes.',
    details: {
      origin: 'Produtores Orgânicos da Serra',
      temperature: 'Fresca Resfriada (4°C)',
      craftTime: 'Cortada no instante do pedido',
      keyFlavor: 'Doçura viva e crocância gelada',
    },
    pngUrl: '/assets/ingredients/layer-02-onion.png',
    particleEffect: 'dewdrops',
    closedY: -54,
    explodedY: -152,
    widthPercent: 86,
    explodedRotate: 1.8,
    floatDelay: '0.4s',
  },
  {
    id: 'layer-lettuce',
    index: 3,
    numberPrefix: '03',
    title: 'ALFACE AMERICANA FRESCA',
    subtitle: 'Folha Hidropônica Crocante',
    badge: 'Colhida há < 12h',
    description: '[03. ALFACE AMERICANA FRESCA] — Alface americana hidropônica colhida há menos de 12 horas, lavada em água mineral da nascente.',
    quote: 'Folha inteira crocante com gotículas de orvalho, criando a barreira térmica ideal no interior do hambúrguer.',
    details: {
      origin: 'Estufa Hidropônica Outland',
      temperature: 'Resfriada a 6°C',
      craftTime: 'Higienização em água mineral',
      keyFlavor: 'Frescor herbal e quebra crocante',
    },
    pngUrl: '/assets/ingredients/layer-03-lettuce.png',
    particleEffect: 'dewdrops',
    closedY: -18,
    explodedY: -76,
    widthPercent: 96,
    explodedRotate: -1.2,
    floatDelay: '0.8s',
  },
  {
    id: 'layer-cheddar',
    index: 4,
    numberPrefix: '04',
    title: 'CHEDDAR INGLÊS MATURADO',
    subtitle: 'Maturação Dupla em Cascata',
    badge: 'Derretido no Vapor da Brasa',
    description: '[04. CHEDDAR INGLÊS MATURADO] — Maturação dupla de 9 meses, derretido sob campânula de ferro fundido no vapor aromático de lenha.',
    quote: 'Fatia espessa curada que se molda sobre o corte quente com pontas escorrendo em cascata.',
    details: {
      origin: 'Somerset Tradition',
      temperature: 'Fusão a 82°C',
      craftTime: 'Abafado no vapor de lenha (45s)',
      keyFlavor: 'Cremosidade intensa e notas amanteigadas',
    },
    pngUrl: '/assets/ingredients/layer-04-cheddar.png',
    particleEffect: 'molten',
    closedY: 16,
    explodedY: 4,
    widthPercent: 92,
    explodedRotate: 0.8,
    floatDelay: '1.2s',
  },
  {
    id: 'layer-patty',
    index: 5,
    numberPrefix: '05',
    title: 'BLEND 200g ANGUS & WAGYU',
    subtitle: 'Grelhado no Fogo a 400°C',
    badge: 'Fogo Aberto & Macieira',
    description: '[05. BLEND 200g ANGUS & WAGYU] — Blend nobre moído diariamente, temperado apenas com sal marinho e selado em grelha a 400°C.',
    quote: 'Marcas profundas de ferro fundido, crosta caramelizada Maillard perfeita e suculência extrema do marmoreio Wagyu.',
    details: {
      origin: 'Cortes Nobres Certificados',
      temperature: 'Ao Ponto Suculento (56°C)',
      craftTime: '4 min sobre brasa de carvalho',
      keyFlavor: 'Umami intenso e defumação de brasa',
    },
    pngUrl: '/assets/ingredients/layer-05-patty.png',
    particleEffect: 'steam',
    closedY: 48,
    explodedY: 86,
    widthPercent: 94,
    explodedRotate: -0.9,
    floatDelay: '1.6s',
  },
  {
    id: 'layer-bacon',
    index: 6,
    numberPrefix: '06',
    title: 'BACON DEFUMADO EM MACIEIRA',
    subtitle: 'Duas Tiras Grossas e Crocantes',
    badge: 'Lenha de Macieira por 8h',
    description: '[06. BACON DEFUMADO EM MACIEIRA] — Tiras grossas de barriga suína artesanal defumadas por 8 horas em lenha nobre de macieira.',
    quote: 'Cura a seco e defumação lenta que resultam em crocância vitrificada e aroma rústico inconfundível.',
    details: {
      origin: 'Charcutaria Outland Fire',
      temperature: 'Dourado na Grelha (78°C)',
      craftTime: '8 horas de defumação lenta',
      keyFlavor: 'Defumado adocicado de macieira',
    },
    pngUrl: '/assets/ingredients/layer-06-bacon.png',
    particleEffect: 'smoke',
    closedY: 82,
    explodedY: 164,
    widthPercent: 92,
    explodedRotate: 1.5,
    floatDelay: '2.0s',
  },
  {
    id: 'layer-bottom-bun',
    index: 7,
    numberPrefix: '07',
    title: 'PÃO AUSTRALIANO BASE',
    subtitle: 'Selado na Manteiga Clarificada',
    badge: 'Manteiga Clarificada',
    description: '[07. PÃO AUSTRALIANO BASE] — Base tostada na manteiga clarificada para selar o miolo e reter todos os sucos nobres da carne.',
    quote: 'Superfície espelhada dourada com crocância suave, sustentando a arquitetura do lanche até a última mordida.',
    details: {
      origin: 'Padaria Artesanal Outland',
      temperature: 'Tostagem Dourada (210°C)',
      craftTime: '60s de selagem na manteiga',
      keyFlavor: 'Tostado amanteigado e notas de cacau',
    },
    pngUrl: '/assets/ingredients/layer-07-bottom-bun.png',
    particleEffect: 'none',
    closedY: 118,
    explodedY: 238,
    widthPercent: 93,
    explodedRotate: 0,
    floatDelay: '2.4s',
  },
];

export const HERO_ASSEMBLED_BURGER_IMAGE =
  '/assets/aistudio/Generated_Image_October_30__2026_-_12_35AM__2__9f3f1ec2.jpg';
