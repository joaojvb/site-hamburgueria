/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BUILDER_INGREDIENTS } from '../data/menuItems.ts';
import {
  calculateBurgerStats,
  calculateHeatIntensity,
  canAddIngredient,
  formatCurrencyBRL,
  IngredientItem,
} from '../utils/burgerLogic.ts';
import { BurgerLayerGraphic } from './BurgerLayerGraphic.tsx';
import { FireEmberCanvasOverlay } from './FireEmberCanvasOverlay.tsx';
import {
  Flame,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Zap,
} from 'lucide-react';

interface BurgerCustomizerProps {
  onAddToCart?: (burgerOrder: {
    id: string;
    name: string;
    layers: IngredientItem[];
    stats: ReturnType<typeof calculateBurgerStats>;
  }) => void;
}

export const BurgerCustomizer: React.FC<BurgerCustomizerProps> = ({ onAddToCart }) => {
  const baseBun = BUILDER_INGREDIENTS.find(i => i.isBase)!;
  const topBun = BUILDER_INGREDIENTS.find(i => i.isTopBun)!;

  // Starts with only the Bottom Bun on the rustic wooden platter as specified in the prompt
  const [currentLayers, setCurrentLayers] = useState<IngredientItem[]>([baseBun]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSmashed, setIsSmashed] = useState<boolean>(false);
  const [burstCounter, setBurstCounter] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);

  const stats = calculateBurgerStats(currentLayers);
  const heatProfile = calculateHeatIntensity(currentLayers, isSmashed);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3200);
  };

  const handleAddIngredient = (ingredient: IngredientItem) => {
    const check = canAddIngredient(currentLayers, ingredient);
    if (!check.allowed) {
      showToast(check.reason || 'Não foi possível adicionar este ingrediente.');
      return;
    }

    const itemToAdd = {
      ...ingredient,
      _stackId: `${ingredient.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setCurrentLayers(prev => [...prev, itemToAdd]);
    setBurstCounter(prev => prev + 1);
    if (ingredient.isTopBun) {
      setIsSmashed(true);
    } else {
      setIsSmashed(false);
    }
  };

  const handleRemoveLayer = (indexToRemove: number) => {
    if (indexToRemove === 0 && currentLayers[0]?.isBase) {
      showToast('O Pão Australiano Base sustenta o lanche no prato rústico!');
      return;
    }
    setCurrentLayers(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setIsSmashed(false);
  };

  const handleClear = () => {
    setCurrentLayers([baseBun]);
    setIsSmashed(false);
    showToast('Prato limpo! Comece a empilhar seus ingredientes no fogo.');
  };

  const handleLoadFullHouseRecipe = () => {
    const bacon = BUILDER_INGREDIENTS.find(i => i.id === 'bacon-smoked')!;
    const patty = BUILDER_INGREDIENTS.find(i => i.id === 'meat-wagyu')!;
    const cheddar = BUILDER_INGREDIENTS.find(i => i.id === 'cheese-cheddar')!;
    const lettuce = BUILDER_INGREDIENTS.find(i => i.id === 'veggie-lettuce')!;
    const onion = BUILDER_INGREDIENTS.find(i => i.id === 'veggie-onion')!;

    setCurrentLayers([
      baseBun,
      { ...bacon, _stackId: `bacon-${Date.now()}-1` } as IngredientItem,
      { ...patty, _stackId: `patty-${Date.now()}-2` } as IngredientItem,
      { ...cheddar, _stackId: `cheddar-${Date.now()}-3` } as IngredientItem,
      { ...lettuce, _stackId: `lettuce-${Date.now()}-4` } as IngredientItem,
      { ...onion, _stackId: `onion-${Date.now()}-5` } as IngredientItem,
      { ...topBun, _stackId: `top-${Date.now()}-6` } as IngredientItem,
    ]);
    setIsSmashed(true);
    setBurstCounter(prev => prev + 1);
    showToast('As 7 camadas clássicas do Outland foram empilhadas!');
  };

  const handleCloseBurger = () => {
    if (stats.isClosed) {
      showToast('O lanche já foi finalizado com o Pão Australiano Topo!');
      return;
    }

    setCurrentLayers(prev => [
      ...prev,
      { ...topBun, _stackId: `top-bun-${Date.now()}` } as IngredientItem,
    ]);
    setIsSmashed(true);
    setBurstCounter(prev => prev + 1);
    showToast('SMASH! Pão Australiano Topo colocado com impacto na brasa!');
  };

  const handleFinalizeOrder = () => {
    const finalLayers = stats.isClosed
      ? currentLayers
      : [...currentLayers, { ...topBun, _stackId: `top-bun-${Date.now()}` } as IngredientItem];

    if (!stats.isClosed) {
      setCurrentLayers(finalLayers);
      setIsSmashed(true);
      setBurstCounter(prev => prev + 1);
    }

    const customBurger = {
      id: `custom-burger-${Date.now()}`,
      name: `Outland Custom Grill (${finalLayers.length} camadas)`,
      layers: finalLayers,
      stats: calculateBurgerStats(finalLayers),
    };

    if (onAddToCart) {
      onAddToCart(customBurger);
      showToast('Seu hambúrguer artesanal foi adicionado à Comanda!');
    }
  };

  // Selectable ingredients on the right panel (excluding base bun which is already on the plate)
  const selectableIngredients = BUILDER_INGREDIENTS.filter(item => {
    if (item.isBase) return false;
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <section
      id="monte-no-fogo"
      className="relative py-24 px-4 sm:px-8 bg-[#110D0B] border-t border-[#F5A623]/15 text-[#F4EFEA] overflow-hidden"
    >
      {/* Ambient Section-Wide Heat Glow & Rising Ember Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="heat-convection-aura absolute top-1/3 left-1/4 w-[620px] h-[620px] rounded-full blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(232,93,26,0.12) 0%, transparent 70%)',
            '--heat-speed': `${heatProfile.shimmerSpeedSec}s`,
          } as React.CSSProperties}
        />
        <FireEmberCanvasOverlay
          variant="section"
          intensity={heatProfile.intensityLevel}
          emberCount={heatProfile.emberCount}
          shimmerSpeedSec={heatProfile.shimmerSpeedSec}
          burstTrigger={burstCounter}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F5A623] uppercase tracking-[0.2em] mb-3">
            <span>02 · Laboratório Interativo 3D</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#E85D1A]">Física de Mola & Brasa Viva</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#F4EFEA] mb-4">
            MONTE NO FOGO
          </h2>
          <p className="text-sm sm:text-base text-[#A39B95] font-sans leading-relaxed">
            Comece pelo Pão Australiano Base sobre a tábua rústica. Clique nos ingredientes ao lado para vê-los cair entre fagulhas e ondas de calor da grelha e finalize com o impacto do Pão Topo.
          </p>
        </div>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* ESQUERDA: Palco de Montagem 3D com Canvas de Fagulhas e Distorção Térmica (Col 1-6) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative flex-1 min-h-[620px] rounded-3xl glass-outback p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl">
              {/* Concentrated Stage Canvas Overlay: Rising Heat Distortion & Glowing Embers */}
              <FireEmberCanvasOverlay
                variant="stage"
                intensity={heatProfile.intensityLevel}
                emberCount={heatProfile.emberCount}
                shimmerSpeedSec={heatProfile.shimmerSpeedSec}
                burstTrigger={burstCounter}
              />

              {/* Top Stage Info */}
              <div className="relative z-20 flex items-center justify-between gap-4 border-b border-[#F5A623]/15 pb-4">
                <div>
                  <p className="text-xs font-mono text-[#F5A623] uppercase tracking-wider font-bold">
                    Palco de Montagem 3D
                  </p>
                  <p className="text-[11px] text-[#A39B95] mt-0.5">
                    Clique em qualquer camada empilhada para removê-la
                  </p>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-mono tabular-nums">
                  <span className="inline-flex items-center gap-1 text-[#F5A623]">
                    <Flame className="w-3.5 h-3.5 text-[#E85D1A] fill-[#E85D1A]" />
                    <span>{heatProfile.grillTempCelsius}°C</span>
                  </span>
                  <span className="text-white/20" aria-hidden="true">·</span>
                  <span className="text-[#E85D1A] font-bold">
                    {currentLayers.length} {currentLayers.length === 1 ? 'camada' : 'camadas'}
                  </span>
                </div>
              </div>

              {/* Smash Impact Ring Animation */}
              <AnimatePresence>
                {isSmashed && (
                  <motion.div
                    key="smash-ring"
                    initial={{ scale: 0.6, opacity: 0.9 }}
                    animate={{ scale: 1.75, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-2 border-[#F5A623] pointer-events-none z-30"
                  />
                )}
              </AnimatePresence>

              {/* Center 3D Burger Stack over Rustic Wooden Platter */}
              <div className="relative flex-1 flex flex-col items-center justify-end py-8 z-10">
                <motion.div
                  animate={
                    isSmashed
                      ? { scaleY: [1, 0.88, 1.03, 0.97], y: [0, 12, -4, 0] }
                      : { scaleY: 1, y: 0 }
                  }
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="relative flex flex-col-reverse items-center justify-start w-full max-w-[360px]"
                >
                  <AnimatePresence initial={false}>
                    {currentLayers.map((layer, index) => {
                      // Overlap calculation: when smashed, layers compress more tightly together
                      const overlapMargin =
                        index === 0 ? 0 : isSmashed ? -64 : -50;

                      return (
                        <motion.div
                          key={(layer as any)._stackId || `${layer.id}-${index}`}
                          initial={{ y: -220, opacity: 0, scale: 0.82, rotate: -4 }}
                          animate={{
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                          }}
                          exit={{
                            y: -90,
                            opacity: 0,
                            scale: 0.75,
                            transition: { duration: 0.18 },
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 15,
                            mass: 0.9,
                          }}
                          onClick={() => handleRemoveLayer(index)}
                          style={{
                            marginBottom: `${overlapMargin}px`,
                            zIndex: 10 + index,
                          }}
                          className="relative w-full cursor-pointer group select-none"
                          title={
                            layer.isBase
                              ? 'Pão Australiano Base (Fundação do Lanche)'
                              : `Clique para remover ${layer.name}`
                          }
                        >
                          <BurgerLayerGraphic
                            layerId={layer.id}
                            pngUrl={layer.pngUrl}
                            altText={layer.name}
                            widthPercent={layer.isTopBun ? 95 : 92}
                          />

                          {/* Hover Remove Indicator */}
                          {!layer.isBase && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#110D0B]/90 px-2.5 py-1 rounded-lg border border-[#E85D1A]/50 text-[10px] font-mono text-[#F4EFEA] flex items-center gap-1 shadow-xl pointer-events-none">
                              <Trash2 className="w-3 h-3 text-[#E85D1A]" />
                              <span>Remover {layer.name.split(' ')[0]}</span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>

                {/* Rustic Wooden Platter Base */}
                <div className="relative mt-2 w-full max-w-[420px] z-0 flex flex-col items-center">
                  <div className="w-full h-[36px] rounded-2xl bg-gradient-to-r from-[#24160E] via-[#3A2418] to-[#24160E] border-t-2 border-[#633E29] shadow-[0_20px_35px_rgba(0,0,0,0.95)] flex items-center justify-between px-6">
                    <span className="text-[10px] font-mono tracking-[0.2em] text-[#A39B95] uppercase">
                      Prato de Madeira Rústica
                    </span>
                    <span className="text-[10px] font-mono text-[#F5A623] font-bold tracking-widest">
                      {heatProfile.label.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-[88%] h-3 rounded-b-xl bg-[#160D08] border-b border-[#3A2418]/50" />
                </div>
              </div>

              {/* Bottom Stage Action Bar */}
              <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F5A623]/15">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClear}
                    className="px-3.5 py-2 rounded-xl bg-black/50 hover:bg-black/70 border border-white/10 text-xs font-mono text-[#A39B95] hover:text-[#F4EFEA] flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Limpar Tudo</span>
                  </button>
                  <button
                    onClick={handleLoadFullHouseRecipe}
                    className="px-3.5 py-2 rounded-xl bg-[#F5A623]/15 hover:bg-[#F5A623]/25 border border-[#F5A623]/30 text-xs font-mono text-[#F5A623] flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Montar Clássico 7 Camadas</span>
                  </button>
                </div>

                {/* Fechar Lanche (Colocar Pão Topo) Smash Button */}
                <button
                  onClick={handleCloseBurger}
                  disabled={stats.isClosed}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    stats.isClosed
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 cursor-default'
                      : 'bg-gradient-to-r from-[#E85D1A] to-[#F5A623] text-[#110D0B] hover:opacity-95 shadow-lg shadow-[#E85D1A]/25'
                  }`}
                >
                  {stats.isClosed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Lanche Fechado no Topo</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Fechar Lanche (Colocar Pão Topo)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* DIREITA: Painel de Controle de Ingredientes e Comanda (Col 7-12) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Painel de Resumo (Deconstructed Branding): Peso, Calorias e Preço em Tempo Real */}
            <div className="p-6 sm:p-7 rounded-3xl glass-outback shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#F5A623] uppercase tracking-wider">
                  <span>Painel de Resumo</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#E85D1A]">Deconstructed Branding</span>
                </div>
                <span className="text-xs font-mono text-[#A39B95] tabular-nums">
                  {stats.isClosed ? 'Pronto para a Grelha' : 'Em Montagem'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#110D0B]/90 border border-[#F5A623]/20 mb-5">
                <div>
                  <p className="text-[11px] font-mono text-[#A39B95] uppercase">Peso Total</p>
                  <p className="text-2xl sm:text-3xl font-mono font-bold text-[#F4EFEA] tabular-nums mt-0.5">
                    {stats.totalWeightGrams}
                    <span className="text-xs font-normal text-[#A39B95] ml-1">g</span>
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-[#A39B95] uppercase">Calorias</p>
                  <p className="text-2xl sm:text-3xl font-mono font-bold text-[#F5A623] tabular-nums mt-0.5">
                    {stats.totalCalories}
                    <span className="text-xs font-normal text-[#A39B95] ml-1">kcal</span>
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-[#A39B95] uppercase">Preço Atual</p>
                  <p className="text-2xl sm:text-3xl font-mono font-bold text-[#E85D1A] tabular-nums mt-0.5">
                    {formatCurrencyBRL(stats.totalPrice)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleFinalizeOrder}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#E85D1A] to-[#F5A623] text-[#110D0B] font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg shadow-[#E85D1A]/25 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar Meu Lanche à Comanda</span>
              </button>
            </div>

            {/* Painel de Ingredientes com Miniaturas PNG Reais */}
            <div className="p-6 sm:p-7 rounded-3xl glass-outback shadow-xl flex-1 flex flex-col">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 border-b border-[#F5A623]/15">
                {[
                  { id: 'all', label: 'Todos Ingredientes' },
                  { id: 'meat', label: 'Carne Extra' },
                  { id: 'cheese', label: 'Cheddar' },
                  { id: 'bacon', label: 'Bacon' },
                  { id: 'veggie', label: 'Salada & Cebola' },
                  { id: 'sauce', label: 'Molho Outback' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedCategory === tab.id
                        ? 'bg-[#E85D1A] text-[#110D0B] font-bold'
                        : 'text-[#A39B95] hover:text-[#F4EFEA] hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Ingredient Buttons Grid with Miniature PNG Previews */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {selectableIngredients.map(item => {
                  const count = currentLayers.filter(l => l.id === item.id).length;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleAddIngredient(item)}
                      aria-label={`Adicionar ${item.name}`}
                      className="p-3.5 rounded-2xl bg-[#110D0B]/75 border border-[#F5A623]/15 hover:border-[#E85D1A]/60 transition-all flex items-center gap-3.5 text-left group cursor-pointer"
                    >
                      {/* Miniature Packshot PNG Preview */}
                      <div className="w-16 h-14 rounded-xl bg-[#1C1512] border border-white/5 p-1.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {item.pngUrl ? (
                          <img
                            src={item.pngUrl}
                            alt={item.name}
                            className="max-w-full max-h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                          />
                        ) : (
                          <Flame className="w-6 h-6 text-[#E85D1A]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-serif font-bold text-[#F4EFEA] group-hover:text-[#F5A623] transition-colors truncate">
                            {item.name}
                          </span>
                          {count > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-[#E85D1A] text-[#110D0B] font-mono text-[10px] font-bold shrink-0">
                              {count}x
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#A39B95] truncate mt-0.5">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-2 font-mono text-[11px]">
                          <span className="text-[#A39B95] tabular-nums">
                            {item.weightGrams}g · {item.calories}kcal
                          </span>
                          <span className="text-[#F5A623] font-bold flex items-center gap-1 tabular-nums">
                            +{formatCurrencyBRL(item.price)}
                            <Plus className="w-3.5 h-3.5 text-[#E85D1A]" />
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Feedback Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl glass-outback border border-[#E85D1A] text-[#F4EFEA] font-sans text-xs font-medium shadow-2xl flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-[#E85D1A]" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
