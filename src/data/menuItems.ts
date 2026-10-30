/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IngredientItem } from '../utils/burgerLogic.ts';

export interface MenuItem {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  price: number;
  weightGrams: number;
  calories: number;
  heatLevel: 0 | 1 | 2 | 3;
  heatLabel: string;
  badge?: string;
  image: string;
  ingredients: string[];
  pairing: string;
}

export const BENTO_MENU_ITEMS: MenuItem[] = [
  {
    id: 'outland-blooming',
    name: 'The Outland Blooming Burger',
    subtitle: 'O Ícone da Casa na Brasa',
    tagline: 'Hambúrguer com pétalas de cebola empanada e molho especial Outland Bloom',
    description:
      'Pão australiano artesanal polvilhado com fubá e mel, blend nobre 200g Angus & Wagyu grelhado no fogo aberto, queijo cheddar inglês duplo derretido, tiras grossas de bacon defumado e coroa crocante de pétalas de cebola douradas com cascata de molho especial picante.',
    price: 56.9,
    weightGrams: 490,
    calories: 980,
    heatLevel: 2,
    heatLabel: 'Picância Australiana Moderada',
    badge: 'Assinatura do Chef',
    image: '/assets/aistudio/Generated_Image_October_30__2026_-_12_39AM_d8458766.jpg',
    ingredients: [
      'Pão Australiano com Fubá',
      'Blend 200g Angus & Wagyu',
      'Pétalas de Cebola Blooming',
      'Cheddar Inglês Derretido',
      'Bacon em Lenha de Macieira',
      'Molho Especial Outland Bloom',
    ],
    pairing: 'Chopp Escuro Cremoso ou Shiraz Australiano',
  },
  {
    id: 'firehouse-ribs',
    name: 'Firehouse Ribs Burger',
    subtitle: 'Costela Desfiada no Barbecue',
    tagline: 'Com costela bovina desfiada marinada por 18 horas e barbecue de macieira',
    description:
      'Generosa camada de costela defumada desfiada no garfo e banhada em molho barbecue artesanal de lenha de macieira, sobre hambúrguer Angus 200g grelhado na brasa e cheddar inglês fundido no pão australiano.',
    price: 59.9,
    weightGrams: 470,
    calories: 940,
    heatLevel: 1,
    heatLabel: 'Defumado Intenso & Adocicado',
    badge: 'Cocção Lenta 18h',
    image: '/assets/aistudio/Generated_Image_October_30__2026_-_12_41AM_d7d0652f.jpg',
    ingredients: [
      'Costela Desfiada 18h',
      'Barbecue de Lenha de Macieira',
      'Blend Angus 200g na Brasa',
      'Cheddar Inglês Maturado',
      'Pão Australiano Selado',
    ],
    pairing: 'Bourbon Smoked Old Fashioned ou Red Ale',
  },
  {
    id: 'thunder-down-under',
    name: 'Thunder Down Under',
    subtitle: 'Duplo Smash na Brasa',
    tagline: 'Duplo smash com muito cheddar inglês derretido e farto bacon crocante',
    description:
      'Dois discos suculentos de Wagyu & Angus com crosta Maillard estalando, dupla camada de queijo cheddar inglês derretido em cascata e fatias grossas de bacon defumado em lenha de macieira por 8 horas.',
    price: 52.9,
    weightGrams: 430,
    calories: 920,
    heatLevel: 1,
    heatLabel: 'Pimenta-do-Reino Prensada na Crosta',
    badge: 'Campeão de Vendas',
    image: '/assets/aistudio/Generated_Image_October_30__2026_-_12_44AM_2b7976a7.jpg',
    ingredients: [
      'Duplo Blend Wagyu & Angus',
      'Duplo Cheddar Inglês',
      'Bacon Defumado em Tiras Grossas',
      'Pão Australiano Tostado na Manteiga',
    ],
    pairing: 'American IPA ou Lager Puro Malte Congelada',
  },
  {
    id: 'aussie-cheese-fries',
    name: 'Aussie Cheese Fries',
    subtitle: 'O Clássico Absoluto para Compartilhar',
    tagline: 'As clássicas batatas fritas douradas cobertas com muito queijo e bacon',
    description:
      'Montanha de batatas rústicas crocantes temperadas com mix de especiarias da casa, coberta por generosa camada de queijos cheddar e monterey jack derretidos no vapor, cubos crocantes de bacon defumado e molho Ranch fresco.',
    price: 46.9,
    weightGrams: 540,
    calories: 880,
    heatLevel: 0,
    heatLabel: 'Cremoso & Defumado',
    badge: 'Para Compartilhar',
    image: '/assets/aistudio/Generated_Image_October_30__2026_-_12_46AM_c3483704.jpg',
    ingredients: [
      'Batatas Rústicas Temperadas',
      'Mix de Cheddar & Monterey Jack',
      'Bacon Crocante Picado',
      'Molho Ranch de Ervas Frescas',
    ],
    pairing: 'Ideal como entrada para toda a mesa',
  },
];

/**
 * Ingredientes do Montador Interativo 3D "Monte no Fogo" (usando os PNGs transparentes reais)
 */
export const BUILDER_INGREDIENTS: IngredientItem[] = [
  {
    id: 'bun-bottom',
    name: 'Base Tostada (Pão Australiano)',
    category: 'bun',
    weightGrams: 60,
    calories: 165,
    price: 6.0,
    pngUrl: '/assets/ingredients/layer-07-bottom-bun.png',
    description: 'Selado na manteiga clarificada para reter a suculência',
    isBase: true,
  },
  {
    id: 'bun-top',
    name: 'Pão Australiano Topo',
    category: 'bun',
    weightGrams: 65,
    calories: 175,
    price: 6.0,
    pngUrl: '/assets/ingredients/layer-01-top-bun.png',
    description: 'Assado na hora, toque de mel e cacau, polvilhado com fubá',
    isTopBun: true,
  },
  {
    id: 'meat-wagyu',
    name: 'Carne Wagyu & Angus 200g',
    category: 'meat',
    weightGrams: 200,
    calories: 460,
    price: 24.0,
    pngUrl: '/assets/ingredients/layer-05-patty.png',
    description: 'Blend 200g Angus & Wagyu grelhado no fogo aberto',
  },
  {
    id: 'cheese-cheddar',
    name: 'Queijo Cheddar Inglês',
    category: 'cheese',
    weightGrams: 45,
    calories: 170,
    price: 7.5,
    pngUrl: '/assets/ingredients/layer-04-cheddar.png',
    description: 'Maturação dupla, derretido no vapor da brasa',
  },
  {
    id: 'bacon-smoked',
    name: 'Bacon Defumado (2 Tiras Grossas)',
    category: 'bacon',
    weightGrams: 50,
    calories: 195,
    price: 9.0,
    pngUrl: '/assets/ingredients/layer-06-bacon.png',
    description: 'Cortes grossos defumados em lenha de macieira por 8h',
  },
  {
    id: 'veggie-lettuce',
    name: 'Salada Colheita Orgânica',
    category: 'veggie',
    weightGrams: 30,
    calories: 12,
    price: 3.5,
    pngUrl: '/assets/ingredients/layer-03-lettuce.png',
    description: 'Alface americana hidropônica colhida há menos de 12h',
  },
  {
    id: 'veggie-onion',
    name: 'Cebola Roxa Crocante',
    category: 'veggie',
    weightGrams: 35,
    calories: 18,
    price: 4.0,
    pngUrl: '/assets/ingredients/layer-02-onion.png',
    description: 'Cortes frescos em anéis com crocância térmica',
  },
  {
    id: 'sauce-outback',
    name: 'Molho Especial Outland Bloom',
    category: 'sauce',
    weightGrams: 30,
    calories: 115,
    price: 5.0,
    description: 'Redução cremosa picante de páprica defumada e especiarias',
  },
];
