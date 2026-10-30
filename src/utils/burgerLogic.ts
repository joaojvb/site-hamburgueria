/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IngredientItem {
  id: string;
  name: string;
  category: 'bun' | 'meat' | 'cheese' | 'veggie' | 'bacon' | 'sauce' | 'extra';
  weightGrams: number;
  calories: number;
  price: number;
  pngUrl?: string;
  description: string;
  isBase?: boolean;
  isTopBun?: boolean;
}

export interface BurgerStats {
  totalWeightGrams: number;
  totalCalories: number;
  totalPrice: number;
  itemCount: number;
  isClosed: boolean;
  hasPatty: boolean;
}

export interface HeatIntensityProfile {
  /** Normalized intensity from 0.25 to 1.0 */
  intensityLevel: number;
  /** Target number of active ember particles on the canvas */
  emberCount: number;
  /** CSS heat-shimmer animation duration in seconds (lower = faster shimmer) */
  shimmerSpeedSec: number;
  /** Display temperature in °C for the grill stage */
  grillTempCelsius: number;
  /** Descriptive status label */
  label: string;
}

export interface HeroScrollChoreography {
  /** 0..1 progress of Act 1 title ('SINTA A BRASA') breaking apart & flying upward */
  skyTitleExitProgress: number;
  /** 0..1 progress of Act 2 title ('A DIFERENÇA') rising from the bottom ember field */
  differenceTitleProgress: number;
  /** 0..1 progress of the 4 orbiting attribute nodes around the central burger */
  orbitNodesOpacity: number;
  /** 0..1 progress of the 7 burger layers separating vertically (Anatomy explosion) */
  layerExplosionProgress: number;
  /** Dynamic 3D rotation of the burger stack in degrees as it descends from smoke to fire */
  burgerRotationDeg: number;
  /** Dynamic scale of the central burger */
  burgerScale: number;
  /** Current narrative act ('sky' | 'difference' | 'anatomy') */
  activeAct: 'sky' | 'difference' | 'anatomy';
}

function clamp01(val: number): number {
  return Math.min(1, Math.max(0, val));
}

/**
 * Computes the 3-act scroll choreography inspired by WildCrumb Sky Cookie:
 * - Act 1 (0.00 -> 0.34): 'SINTA A BRASA' monumental headline + rotating burger in smoky sky; letters tilt and fly off on scroll.
 * - Act 2 (0.24 -> 0.64): Descent into the glowing 400°C ember hearth + 'A DIFERENÇA' bottom headline + 4 orbiting attribute nodes.
 * - Act 3 (0.58 -> 1.00): 7-layer vertical burger anatomy explosion with interactive callout arrows & glassmorphic card.
 */
export function computeHeroScrollChoreography(scrollProgress: number): HeroScrollChoreography {
  const p = clamp01(scrollProgress);

  // Act 1 title breaks apart and flies off between p = 0.02 and p = 0.34
  const skyTitleExitProgress = clamp01((p - 0.02) / 0.32);

  // Act 2 'A DIFERENÇA' rises in at p = 0.22..0.40, holds during Act 2, then exits cleanly as Act 3 explodes (p = 0.56..0.74)
  const diffEnter = clamp01((p - 0.22) / 0.18);
  const diffExit = p > 0.56 ? 1 - clamp01((p - 0.56) / 0.18) : 1;
  const differenceTitleProgress = Math.round(diffEnter * diffExit * 1000) / 1000;

  // Orbiting 4 nodes appear around the closed burger in Act 2 (p = 0.25..0.40) and fade out cleanly when Act 3 card opens (p = 0.58..0.74)
  const orbitEnter = clamp01((p - 0.25) / 0.16);
  const orbitExit = p > 0.58 ? 1 - clamp01((p - 0.58) / 0.16) : 1;
  const orbitNodesOpacity = Math.round(orbitEnter * orbitExit * 1000) / 1000;

  // 7 layers deconstruct smoothly from p = 0.54..0.94
  const layerExplosionProgress = clamp01((p - 0.54) / 0.4);

  // Burger rotates dynamically during Act 1 -> Act 2 descent (-8deg -> +10deg -> 0deg when exploding)
  const rotationWave = Math.sin(p * Math.PI * 1.4) * 10 * (1 - layerExplosionProgress * 0.9);
  const burgerRotationDeg = Math.round(rotationWave * 100) / 100;

  // Burger scales up slightly in Act 2 focus, then settles for 7-layer explosion
  const burgerScale =
    Math.round((1 + Math.sin(p * Math.PI) * 0.05 - layerExplosionProgress * 0.08) * 1000) / 1000;

  let activeAct: 'sky' | 'difference' | 'anatomy' = 'sky';
  if (p >= 0.62) {
    activeAct = 'anatomy';
  } else if (p >= 0.26) {
    activeAct = 'difference';
  }

  return {
    skyTitleExitProgress,
    differenceTitleProgress,
    orbitNodesOpacity,
    layerExplosionProgress,
    burgerRotationDeg,
    burgerScale,
    activeAct,
  };
}

/**
 * Calculates aggregate stats for a customized burger build
 */
export function calculateBurgerStats(layers: IngredientItem[]): BurgerStats {
  if (!layers || layers.length === 0) {
    return {
      totalWeightGrams: 0,
      totalCalories: 0,
      totalPrice: 0,
      itemCount: 0,
      isClosed: false,
      hasPatty: false,
    };
  }

  const totalWeightGrams = layers.reduce((acc, item) => acc + (item.weightGrams || 0), 0);
  const totalCalories = layers.reduce((acc, item) => acc + (item.calories || 0), 0);
  const totalPrice = layers.reduce((acc, item) => acc + (item.price || 0), 0);

  const hasTopBun = layers.some(item => item.isTopBun);
  const hasPatty = layers.some(item => item.category === 'meat');

  return {
    totalWeightGrams,
    totalCalories,
    totalPrice: Math.round(totalPrice * 100) / 100,
    itemCount: layers.length,
    isClosed: hasTopBun,
    hasPatty,
  };
}

/**
 * Computes the thermal distortion & ember particle intensity profile for the
 * 'Monte no Fogo' customizer stage based on fire-grilled ingredients stacked.
 */
export function calculateHeatIntensity(
  layers: IngredientItem[],
  isSmashed: boolean = false
): HeatIntensityProfile {
  if (!layers || layers.length === 0) {
    return {
      intensityLevel: 0.25,
      emberCount: 22,
      shimmerSpeedSec: 6.5,
      grillTempCelsius: 280,
      label: 'Brasa Branda',
    };
  }

  const meatCount = layers.filter(l => l.category === 'meat').length;
  const baconCount = layers.filter(l => l.category === 'bacon').length;
  const cheeseCount = layers.filter(l => l.category === 'cheese').length;

  const rawScore =
    0.28 +
    layers.length * 0.055 +
    meatCount * 0.16 +
    baconCount * 0.1 +
    cheeseCount * 0.06 +
    (isSmashed ? 0.15 : 0);

  const intensityLevel = Math.min(1, Math.max(0.25, Math.round(rawScore * 100) / 100));
  const emberCount = Math.round(24 + intensityLevel * 44);
  const shimmerSpeedSec = Math.max(2.6, Math.round((6.8 - intensityLevel * 3.8) * 10) / 10);
  const grillTempCelsius = Math.round(290 + intensityLevel * 130);

  let label = 'Brasa Ativa';
  if (intensityLevel >= 0.85) {
    label = 'Chama Alta · 400°C+';
  } else if (intensityLevel >= 0.55) {
    label = 'Brasa Intensa';
  }

  return {
    intensityLevel,
    emberCount,
    shimmerSpeedSec,
    grillTempCelsius,
    label,
  };
}

/**
 * Formats Brazilian Real currency
 */
export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Validates whether an ingredient can be stacked onto the burger
 */
export function canAddIngredient(
  currentLayers: IngredientItem[],
  newIngredient: IngredientItem,
  maxLayers: number = 14
): { allowed: boolean; reason?: string } {
  if (currentLayers.length >= maxLayers) {
    return { allowed: false, reason: 'Limite máximo de camadas atingido para a estrutura' };
  }

  const isClosed = currentLayers.some(item => item.isTopBun);
  if (isClosed && !newIngredient.isTopBun) {
    return {
      allowed: false,
      reason: 'O lanche já está fechado. Remova o pão topo para continuar customizando.',
    };
  }

  if (newIngredient.isTopBun && isClosed) {
    return { allowed: false, reason: 'O pão topo já foi adicionado.' };
  }

  return { allowed: true };
}
