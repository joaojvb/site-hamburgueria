import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateBurgerIdentity, formatWhatsAppOrderMessage } from './burgerNamer.ts';
import { IngredientItem } from './burgerLogic.ts';

const baseBun: IngredientItem = {
  id: 'bun-bottom',
  name: 'Pão Australiano Base',
  description: 'Base tostada de brioche australiano',
  category: 'bun',
  price: 0,
  weightGrams: 80,
  calories: 180,
  isBase: true,
};

const wagyu: IngredientItem = {
  id: 'meat-wagyu',
  name: 'Blend Wagyu 200g',
  description: 'Blend grelhado na brasa viva',
  category: 'meat',
  price: 18,
  weightGrams: 200,
  calories: 420,
};

const bacon: IngredientItem = {
  id: 'bacon-smoked',
  name: 'Bacon em Tiras',
  description: 'Defumado em lenha de macieira',
  category: 'bacon',
  price: 8,
  weightGrams: 50,
  calories: 160,
};

const cheddar: IngredientItem = {
  id: 'cheese-cheddar',
  name: 'Cheddar Inglês',
  description: 'Cheddar curado derretido no vapor',
  category: 'cheese',
  price: 6,
  weightGrams: 40,
  calories: 140,
};

test('generateBurgerIdentity returns TÁBUA EM BRANCO for base bun alone', () => {
  const identity = generateBurgerIdentity([baseBun]);
  assert.equal(identity.title, 'TÁBUA EM BRANCO');
  assert.equal(identity.personalityTag, 'MINIMALISTA');
});

test('generateBurgerIdentity identifies Baconlover excess', () => {
  const identity = generateBurgerIdentity([baseBun, wagyu, bacon, bacon]);
  assert.equal(identity.title, 'MONSTRO DEFUMADO DA MADRUGADA');
  assert.equal(identity.personalityTag, 'SMOKEHOUSE');
});

test('generateBurgerIdentity identifies double cheese avalanche', () => {
  const identity = generateBurgerIdentity([baseBun, wagyu, cheddar, cheddar]);
  assert.equal(identity.title, 'AVALANCHE DOUTOR CHEDDAR');
  assert.equal(identity.personalityTag, 'FUSÃO');
});

test('formatWhatsAppOrderMessage encodes correctly with total and items', () => {
  const encoded = formatWhatsAppOrderMessage({
    orderNumber: 'OUT-9999',
    orderType: 'dine-in',
    tableNumber: '12',
    customerName: 'AN0N',
    items: [
      {
        name: 'The Blooming Burger',
        quantity: 2,
        price: 54.9,
      },
    ],
    totalPrice: 109.8,
  });

  const decoded = decodeURIComponent(encoded);
  assert.ok(decoded.includes('OUTLAND FIRE GRILL'));
  assert.ok(decoded.includes('#OUT-9999'));
  assert.ok(decoded.includes('AN0N'));
  assert.ok(decoded.includes('Mesa 12'));
  assert.ok(decoded.includes('109,80'));
});
