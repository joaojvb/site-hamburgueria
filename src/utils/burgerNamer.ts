/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Gerador de Nomes e Personalidades Brutalistas estilo "Spotify Daylist"
 */

import { IngredientItem, MeatDoneness } from './burgerLogic.ts';

export interface BurgerIdentity {
  title: string;
  subtitle: string;
  personalityTag: string;
  vibeColor: string;
}

export function generateBurgerIdentity(layers: IngredientItem[]): BurgerIdentity {
  const meatCount = layers.filter(l => l.category === 'meat').length;
  const cheeseCount = layers.filter(l => l.category === 'cheese').length;
  const baconCount = layers.filter(l => l.category === 'bacon').length;
  const veggieCount = layers.filter(l => l.category === 'veggie').length;
  const sauceCount = layers.filter(l => l.category === 'sauce').length;
  const hasTopBun = layers.some(l => l.isTopBun);
  const totalCount = layers.length;

  // 1. Caso Base: Apenas o pão inferior
  if (totalCount <= 1) {
    return {
      title: 'TÁBUA EM BRANCO',
      subtitle: 'PROJETO DO CHEF · AGUARDANDO BRASA',
      personalityTag: 'MINIMALISTA',
      vibeColor: '#8E6FD1',
    };
  }

  // 2. The Full House (7 ou mais camadas variadas)
  if (totalCount >= 7 && meatCount >= 1 && baconCount >= 1 && cheeseCount >= 1) {
    return {
      title: 'O TITÃ DA BRASA · 7 CAMADAS',
      subtitle: 'ARQUITETURA COMPLETA · FOGO VIVO 400°C',
      personalityTag: 'ASSINATURA',
      vibeColor: '#FF5B1F',
    };
  }

  // 3. Excessos de Bacon (Baconlover)
  if (baconCount >= 2) {
    return {
      title: 'MONSTRO DEFUMADO DA MADRUGADA',
      subtitle: 'LENHA DE MACIEIRA · CROSTA CARAMELIZADA',
      personalityTag: 'SMOKEHOUSE',
      vibeColor: '#FF4FA3',
    };
  }

  // 4. Avalanche de Queijo
  if (cheeseCount >= 2) {
    return {
      title: 'AVALANCHE DOUTOR CHEDDAR',
      subtitle: 'DERRETIMENTO DUPLO NO VAPOR · GORDURA DOURADA',
      personalityTag: 'FUSÃO',
      vibeColor: '#E0A95F',
    };
  }

  // 5. Carnívoro Extremo (2+ carnes)
  if (meatCount >= 2) {
    return {
      title: 'DUPLO SMASH WAGYU PESO PESADO',
      subtitle: '400G DE BLEND ANGUS · GRELHA DE FERRO FUNDIDO',
      personalityTag: 'BRUTALISTA',
      vibeColor: '#FF5B1F',
    };
  }

  // 6. Horta e Frescor
  if (veggieCount >= 2 && meatCount === 0) {
    return {
      title: 'GREEN HARVEST CROCANTE',
      subtitle: 'CEBOLA ROXA DOCE & ALFACE AMERICANA VIVA',
      personalityTag: 'HORTA',
      vibeColor: '#34D399',
    };
  }

  if (veggieCount >= 2 && meatCount >= 1) {
    return {
      title: 'EQUILÍBRIO SELVAGEM DA CASA',
      subtitle: 'MAILLARD CARAMELIZADA · FRESCOR EM CONTRASTE',
      personalityTag: 'HARMONIA',
      vibeColor: '#8E6FD1',
    };
  }

  // 7. Molho Dominante
  if (sauceCount >= 2) {
    return {
      title: 'THE DRIPPING SAUCE EXPERIENCE',
      subtitle: 'CREMOSIDADE ARTESANAL ESCORRENDO NA TÁBUA',
      personalityTag: 'SUCULÊNCIA',
      vibeColor: '#FF4FA3',
    };
  }

  // 8. Selado Clássico
  if (hasTopBun && meatCount === 1) {
    return {
      title: 'OUTLAND SINGLE RESERVE',
      subtitle: 'BRIOCHE AUSTRALIANO SELADO NO TOPO',
      personalityTag: 'CLÁSSICO',
      vibeColor: '#E0A95F',
    };
  }

  // 9. Aberto sem topo
  if (!hasTopBun) {
    return {
      title: 'ANATOMIA ABERTA NA GRELHA',
      subtitle: 'EM CONSTRUÇÃO · EXPOSTO AO CALOR',
      personalityTag: 'DESCONSTRUÍDO',
      vibeColor: '#8E6FD1',
    };
  }

  // Fallback Elegante
  return {
    title: 'CUSTOM BLEND DO SALÃO',
    subtitle: `${totalCount} CAMADAS CALIBRADAS PELO CLIENTE`,
    personalityTag: 'AUTORAL',
    vibeColor: '#EDE3F7',
  };
}

/**
 * Formata um pedido completo para mensagem do WhatsApp com layout de comanda de restaurante
 */
export function formatWhatsAppOrderMessage(params: {
  orderNumber: string;
  orderType: 'dine-in' | 'pickup' | 'delivery';
  tableNumber?: string;
  customerName?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    isCustom?: boolean;
    layers?: IngredientItem[];
    meatDoneness?: MeatDoneness;
  }>;
  totalPrice: number;
}): string {
  const { orderNumber, orderType, tableNumber, customerName, items, totalPrice } = params;

  const typeLabel =
    orderType === 'dine-in'
      ? `SALÃO (Mesa ${tableNumber || 'Balcão'})`
      : orderType === 'pickup'
      ? 'RETIRADA NO BALCÃO'
      : 'DELIVERY EXPRESS';

  const lines: string[] = [
    `🔥 *OUTLAND FIRE GRILL · COMANDA DA BRASA* 🔥`,
    `📋 *Pedido:* \`#${orderNumber}\``,
    `📍 *Modalidade:* ${typeLabel}`,
    customerName ? `👤 *Cliente:* ${customerName}` : '',
    `⏱ *Data/Hora:* ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
    `────────────────────────`,
    `*ITENS DO CORTE:*`,
  ].filter(Boolean);

  items.forEach((item, index) => {
    lines.push(`\n*${index + 1}. ${item.quantity}x ${item.name.toUpperCase()}*`);
    lines.push(`   R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}`);

    if (item.meatDoneness) {
      const donenessMap: Record<MeatDoneness, string> = {
        'rare': 'Mal Passado (52°C · Vermelho)',
        'medium': 'Ao Ponto do Chef (58°C · Rosa)',
        'well-done': 'Bem Passado (68°C · Dourado)',
      };
      lines.push(`   🥩 _Ponto da Carne: ${donenessMap[item.meatDoneness] || item.meatDoneness}_`);
    }

    if (item.isCustom && item.layers && item.layers.length > 0) {
      lines.push(`   _Camadas da Tábua:_`);
      item.layers.forEach((l, lIdx) => {
        lines.push(`   └ [${lIdx + 1}] ${l.name}`);
      });
    }
  });

  lines.push(`\n────────────────────────`);
  lines.push(`💰 *TOTAL DA CONTA: R$ ${totalPrice.toFixed(2).replace('.', ',')}*`);
  lines.push(`────────────────────────`);
  lines.push(`_Enviado direto da bancada interativa do site Outland._`);

  return encodeURIComponent(lines.join('\n'));
}

