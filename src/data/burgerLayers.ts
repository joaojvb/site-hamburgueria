/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LayerVideoSlice {
  /**
   * Posição vertical (object-position Y) para recortar a faixa correspondente
   * no vídeo 3D explodido (/assets/ingredients/burger-3d-exploded.mp4)
   */
  objectPositionY: string;
  /**
   * Escala do vídeo dentro do recorte da camada
   */
  scale: number;
  /**
   * Tempo inicial do loop em segundos (trecho em que os ingredientes flutuam em 3D no fundo preto)
   */
  loopStart: number;
  /**
   * Tempo final do loop em segundos
   */
  loopEnd: number;
}

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
   * Caminho do PNG transparente de alta definição (8K packshot extraído).
   */
  pngUrl: string;
  /**
   * Caminho de vídeo loop (MP4 ou WebM transparente / fundo preto com mix-blend-mode: screen)
   * onde o ingrediente gira em 3D, derrete ou fumega em câmera lenta.
   */
  videoUrl?: string;
  /**
   * Configuração de recorte vertical quando utiliza o vídeo mestre 3D explodido.
   * Caso você forneça um vídeo dedicado apenas daquele ingrediente, basta omitir videoSlice.
   */
  videoSlice?: LayerVideoSlice;
  /**
   * Caminho opcional para malha 3D (.glb) do ingrediente.
   */
  glbUrl?: string;
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
}

export const BURGER_3D_EXPLODED_VIDEO = '/assets/ingredients/burger-3d-exploded.mp4';

export const BURGER_ANATOMY_LAYERS: ScrollytellingLayer[] = [
  {
    id: 'layer-top-bun',
    index: 1,
    numberPrefix: '01',
    title: 'PÃO AUSTRALIANO',
    subtitle: 'Topo Macio, Mel & Cacau',
    badge: 'Fermentação Natural 24h',
    description: '[01. PÃO AUSTRALIANO] — Assado na hora, toque de mel e cacau, polvilhado com fubá.',
    quote: 'Textura aveludada com coloração escura característica, brilho de forno a lenha e suave dulçor de cacau.',
    details: {
      origin: 'Farinha Australiana Especial',
      temperature: 'Fresco da Estufa (65°C)',
      craftTime: 'Assado a cada 40 minutos',
      keyFlavor: 'Mel Silvestre, Cacau & Fubá',
    },
    pngUrl: '/assets/ingredients/layer-01-top-bun.png',
    videoUrl: BURGER_3D_EXPLODED_VIDEO,
    videoSlice: {
      objectPositionY: '14%',
      scale: 2.35,
      loopStart: 2.8,
      loopEnd: 5.0,
    },
    particleEffect: 'none',
    closedY: -102,
    explodedY: -232,
    widthPercent: 95,
    explodedRotate: -1.5,
  },
  {
    id: 'layer-onion',
    index: 2,
    numberPrefix: '02',
    title: 'CEBOLA CROCANTE',
    subtitle: 'Anéis de Cebola Roxa Fresca',
    badge: 'Crocância Térmica',
    description: '[02. CEBOLA CROCANTE] — Cortes frescos em anéis com crocância térmica.',
    quote: 'Três anéis selecionados imersos em banho de gelo para atingir o estalo acústico perfeito na mordida.',
    details: {
      origin: 'Produtores Orgânicos da Serra',
      temperature: 'Fresca Resfriada (4°C)',
      craftTime: 'Cortada no instante do pedido',
      keyFlavor: 'Doçura viva e crocância gelada',
    },
    pngUrl: '/assets/ingredients/layer-02-onion.png',
    videoUrl: BURGER_3D_EXPLODED_VIDEO,
    videoSlice: {
      objectPositionY: '29%',
      scale: 2.6,
      loopStart: 2.8,
      loopEnd: 5.0,
    },
    particleEffect: 'dewdrops',
    closedY: -54,
    explodedY: -152,
    widthPercent: 86,
    explodedRotate: 1.8,
  },
  {
    id: 'layer-lettuce',
    index: 3,
    numberPrefix: '03',
    title: 'COLHEITA ORGÂNICA',
    subtitle: 'Alface Americana Hidropônica',
    badge: 'Colhida há < 12h',
    description: '[03. COLHEITA ORGÂNICA] — Alface americana hidropônica colhida há menos de 12h.',
    quote: 'Folha inteira crocante com gotículas de frescor, criando a barreira térmica ideal no interior do lanche.',
    details: {
      origin: 'Estufa Hidropônica Outland',
      temperature: 'Resfriada a 6°C',
      craftTime: 'Higienização em água mineral',
      keyFlavor: 'Frescor herbal e quebra crocante',
    },
    pngUrl: '/assets/ingredients/layer-03-lettuce.png',
    videoUrl: BURGER_3D_EXPLODED_VIDEO,
    videoSlice: {
      objectPositionY: '77%',
      scale: 2.45,
      loopStart: 2.8,
      loopEnd: 5.0,
    },
    particleEffect: 'dewdrops',
    closedY: -18,
    explodedY: -76,
    widthPercent: 96,
    explodedRotate: -1.2,
  },
  {
    id: 'layer-cheddar',
    index: 4,
    numberPrefix: '04',
    title: 'CHEDDAR INGLÊS',
    subtitle: 'Maturação Dupla em Cascata',
    badge: 'Derretido no Vapor da Brasa',
    description: '[04. CHEDDAR INGLÊS] — Maturação dupla, derretido no vapor da brasa.',
    quote: 'Fatia espessa curada por 9 meses que se molda sobre a carne quente com pontas derretidas.',
    details: {
      origin: 'Somerset Tradition',
      temperature: 'Fusão a 82°C',
      craftTime: 'Abafado no vapor de lenha (45s)',
      keyFlavor: 'Cremosidade intensa e notas amanteigadas',
    },
    pngUrl: '/assets/ingredients/layer-04-cheddar.png',
    videoUrl: BURGER_3D_EXPLODED_VIDEO,
    videoSlice: {
      objectPositionY: '48%',
      scale: 2.4,
      loopStart: 2.6,
      loopEnd: 5.0,
    },
    particleEffect: 'molten',
    closedY: 16,
    explodedY: 4,
    widthPercent: 92,
    explodedRotate: 0.8,
  },
  {
    id: 'layer-patty',
    index: 5,
    numberPrefix: '05',
    title: 'QUALIDADE BOVINA',
    subtitle: 'Blend 200g Angus & Wagyu',
    badge: 'Grelhado no Fogo Aberto',
    description: '[05. QUALIDADE BOVINA] — Blend 200g Angus & Wagyu grelhado no fogo aberto.',
    quote: 'Marcas profundas de grelha de ferro fundido a 400°C, crosta caramelizada Maillard e suculência extrema.',
    details: {
      origin: 'Cortes Nobres Certificados',
      temperature: 'Ao Ponto Suculento (56°C)',
      craftTime: '4 min sobre brasa de carvalho',
      keyFlavor: 'Umami intenso e defumação de brasa',
    },
    pngUrl: '/assets/ingredients/layer-05-patty.png',
    videoUrl: BURGER_3D_EXPLODED_VIDEO,
    videoSlice: {
      objectPositionY: '63%',
      scale: 2.4,
      loopStart: 2.6,
      loopEnd: 5.0,
    },
    particleEffect: 'steam',
    closedY: 48,
    explodedY: 86,
    widthPercent: 94,
    explodedRotate: -0.9,
  },
  {
    id: 'layer-bacon',
    index: 6,
    numberPrefix: '06',
    title: 'BACON DEFUMADO',
    subtitle: 'Duas Tiras Grossas Crocantes',
    badge: 'Lenha de Macieira por 8h',
    description: '[06. BACON DEFUMADO] — Cortes grossos defumados em lenha de macieira por 8h.',
    quote: 'Barriga suína artesanal curada a seco e defumada lentamente até atingir crocância vitrificada.',
    details: {
      origin: 'Charcutaria Outland Fire',
      temperature: 'Dourado na Grelha (78°C)',
      craftTime: '8 horas de defumação lenta',
      keyFlavor: 'Defumado adocicado de macieira',
    },
    pngUrl: '/assets/ingredients/layer-06-bacon.png',
    videoUrl: BURGER_3D_EXPLODED_VIDEO,
    videoSlice: {
      objectPositionY: '37%',
      scale: 2.5,
      loopStart: 2.8,
      loopEnd: 5.0,
    },
    particleEffect: 'smoke',
    closedY: 82,
    explodedY: 164,
    widthPercent: 92,
    explodedRotate: 1.5,
  },
  {
    id: 'layer-bottom-bun',
    index: 7,
    numberPrefix: '07',
    title: 'BASE TOSTADA',
    subtitle: 'Pão Australiano Selado',
    badge: 'Manteiga Clarificada',
    description: '[07. BASE TOSTADA] — Selado na manteiga clarificada para reter a suculência.',
    quote: 'Miolo dourado na chapa espelhada com manteiga clarificada, garantindo estrutura firme do início ao fim.',
    details: {
      origin: 'Padaria Artesanal Outland',
      temperature: 'Tostagem Dourada (210°C)',
      craftTime: '60s de selagem na manteiga',
      keyFlavor: 'Tostado amanteigado e notas de cacau',
    },
    pngUrl: '/assets/ingredients/layer-07-bottom-bun.png',
    videoUrl: BURGER_3D_EXPLODED_VIDEO,
    videoSlice: {
      objectPositionY: '88%',
      scale: 2.35,
      loopStart: 2.8,
      loopEnd: 5.0,
    },
    particleEffect: 'none',
    closedY: 118,
    explodedY: 238,
    widthPercent: 93,
    explodedRotate: 0,
  },
];

export const HERO_ASSEMBLED_BURGER_IMAGE =
  '/assets/aistudio/Generated_Image_October_30__2026_-_12_35AM__2__9f3f1ec2.jpg';
