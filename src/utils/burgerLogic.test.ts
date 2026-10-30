import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBurgerStats,
  calculateHeatIntensity,
  computeHeroScrollChoreography,
  canAddIngredient,
  formatCurrencyBRL,
  IngredientItem,
} from './burgerLogic.ts';

const mockBaseBun: IngredientItem = {
  id: 'base-bun',
  name: 'Pão Australiano Base',
  category: 'bun',
  weightGrams: 55,
  calories: 160,
  price: 6.0,
  description: 'Tostado na manteiga clarificada',
  isBase: true,
};

const mockPatty: IngredientItem = {
  id: 'meat-wagyu',
  name: 'Blend Wagyu & Angus 200g',
  category: 'meat',
  weightGrams: 200,
  calories: 450,
  price: 24.0,
  description: 'Grelhado no fogo aberto',
};

const mockCheddar: IngredientItem = {
  id: 'cheese-cheddar',
  name: 'Cheddar Inglês Maturado',
  category: 'cheese',
  weightGrams: 40,
  calories: 165,
  price: 7.0,
  description: 'Dupla maturação derretido no vapor',
};

const mockTopBun: IngredientItem = {
  id: 'top-bun',
  name: 'Pão Australiano Topo',
  category: 'bun',
  weightGrams: 55,
  calories: 160,
  price: 6.0,
  description: 'Polvilhado com fubá e mel',
  isTopBun: true,
};

test('calculateBurgerStats correctly aggregates weight, calories and price', () => {
  const layers = [mockBaseBun, mockPatty, mockCheddar];
  const stats = calculateBurgerStats(layers);

  assert.equal(stats.totalWeightGrams, 295);
  assert.equal(stats.totalCalories, 775);
  assert.equal(stats.totalPrice, 37.0);
  assert.equal(stats.itemCount, 3);
  assert.equal(stats.isClosed, false);
  assert.equal(stats.hasPatty, true);
});

test('calculateBurgerStats marks burger as closed when top bun is present', () => {
  const layers = [mockBaseBun, mockPatty, mockCheddar, mockTopBun];
  const stats = calculateBurgerStats(layers);

  assert.equal(stats.isClosed, true);
  assert.equal(stats.totalWeightGrams, 350);
});

test('canAddIngredient blocks adding more items when already closed with top bun', () => {
  const closedLayers = [mockBaseBun, mockPatty, mockTopBun];
  const result = canAddIngredient(closedLayers, mockCheddar);

  assert.equal(result.allowed, false);
  assert.match(result.reason || '', /fechado/);
});

test('canAddIngredient allows adding top bun when burger is open', () => {
  const openLayers = [mockBaseBun, mockPatty];
  const result = canAddIngredient(openLayers, mockTopBun);

  assert.equal(result.allowed, true);
});

test('formatCurrencyBRL formats number properly with currency symbol', () => {
  const formatted = formatCurrencyBRL(48.5);
  assert.ok(formatted.includes('48,50') || formatted.includes('48.50'));
});

test('calculateHeatIntensity scales ember count and temperature with fire-grilled layers', () => {
  const baseProfile = calculateHeatIntensity([mockBaseBun], false);
  const fullProfile = calculateHeatIntensity(
    [mockBaseBun, mockPatty, mockCheddar, mockTopBun],
    true
  );

  assert.ok(fullProfile.intensityLevel > baseProfile.intensityLevel);
  assert.ok(fullProfile.emberCount > baseProfile.emberCount);
  assert.ok(fullProfile.grillTempCelsius > baseProfile.grillTempCelsius);
  assert.ok(fullProfile.shimmerSpeedSec < baseProfile.shimmerSpeedSec);
});

test('computeHeroScrollChoreography transitions cleanly across sky, difference, and anatomy acts', () => {
  const act1 = computeHeroScrollChoreography(0);
  assert.equal(act1.activeAct, 'sky');
  assert.equal(act1.skyTitleExitProgress, 0);
  assert.equal(act1.layerExplosionProgress, 0);

  const act2 = computeHeroScrollChoreography(0.42);
  assert.equal(act2.activeAct, 'difference');
  assert.equal(act2.skyTitleExitProgress, 1);
  assert.ok(act2.differenceTitleProgress > 0.8);
  assert.ok(act2.orbitNodesOpacity > 0.7);

  const act3 = computeHeroScrollChoreography(0.95);
  assert.equal(act3.activeAct, 'anatomy');
  assert.equal(act3.layerExplosionProgress, 1);
});
