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
  RotateCcw,
  Sparkles,
  ArrowUpRight,
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
      showToast('O Pão Australiano Base sustenta o lanche na tábua rústica do chef!');
      return;
    }
    setCurrentLayers(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setIsSmashed(false);
  };

  const handleClear = () => {
    setCurrentLayers([baseBun]);
    setIsSmashed(false);
    showToast('Tábua limpa! Comece a empilhar seus ingredientes no fogo.');
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
    showToast('As 7 camadas clássicas do Outland foram empilhadas na tábua!');
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
    showToast('SMASH! Pão Australiano Topo colocado com impacto na tábua do chef!');
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

  const selectableIngredients = BUILDER_INGREDIENTS.filter(item => {
    if (item.isBase) return false;
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <section
      id="monte-no-fogo"
      className="relative py-28 px-6 sm:px-14 bg-transparent text-[#F4EFEA] overflow-hidden"
    >
      {/* Sombra Gradiente Suave para Leitura Limpa sobre a Bancada Rústica do Chef */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(8,5,4,0.25) 0%, rgba(8,5,4,0.55) 48%, rgba(8,5,4,0.88) 100%)',
        }}
      />

      {/* Partículas de Brasa Subindo no Ambiente */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FireEmberCanvasOverlay
          variant="section"
          intensity={heatProfile.intensityLevel}
          emberCount={heatProfile.emberCount}
          shimmerSpeedSec={heatProfile.shimmerSpeedSec}
          burstTrigger={burstCounter}
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Cabeçalho Editorial Assimétrico (Sem Caixas) */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#F5A623]/25">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-editorial-serif italic text-xl text-[#F5A623]">IV.</span>
              <span className="w-10 h-[1px] bg-[#F5A623]/60" />
              <span className="font-cinzel text-[11px] font-bold tracking-[0.34em] text-[#F5A623] uppercase">
                Bancada Rústica do Chef · Mise-en-Place
              </span>
            </div>
            <h2 className="flex flex-wrap items-baseline gap-x-4">
              <span className="font-cinzel font-black text-3xl sm:text-5xl tracking-[0.14em] uppercase text-engraved-cream">
                Monte na
              </span>
              <span className="font-editorial-serif italic font-black text-4xl sm:text-6xl text-molten-gold">
                Tábua Viva
              </span>
            </h2>
          </div>

          <p className="max-w-md font-editorial-serif italic text-base sm:text-lg text-[#F4EFEA]/85 leading-relaxed drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]">
            “Sobre o carvalho rústico aquecido pela brasa, empilhe cortes de Wagyu, cheddar inglês maturado e bacon de macieira.”
          </p>
        </div>

        {/* Layout Aberto em 2 Colunas (Sem Caixas Arredondadas) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* ESQUERDA: O Hambúrguer Diretamente sobre a Tábua da Bancada (Zero Bordas/Retângulos!) */}
          <div className="lg:col-span-6 relative min-h-[580px] flex flex-col justify-between">
            <FireEmberCanvasOverlay
              variant="stage"
              intensity={heatProfile.intensityLevel}
              emberCount={heatProfile.emberCount}
              shimmerSpeedSec={heatProfile.shimmerSpeedSec}
              burstTrigger={burstCounter}
            />

            {/* Linha Editorial Superior do Palco */}
            <div className="relative z-20 flex items-center justify-between pb-3 border-b border-[#F5A623]/25">
              <span className="font-cinzel text-[11px] font-bold tracking-[0.26em] text-[#F5A623] uppercase">
                Tábua de Carvalho · Clique na camada para retirar
              </span>
              <div className="flex items-center gap-3 font-editorial-serif italic text-sm">
                <span className="inline-flex items-center gap-1.5 text-[#F5A623]">
                  <Flame className="w-3.5 h-3.5 text-[#E85D1A] fill-[#E85D1A]" />
                  <span>{heatProfile.grillTempCelsius}°C</span>
                </span>
                <span className="text-[#F5A623]/40">◆</span>
                <span className="text-[#F4EFEA] font-bold">
                  {currentLayers.length} {currentLayers.length === 1 ? 'camada' : 'camadas'}
                </span>
              </div>
            </div>

            {/* Anel de Impacto Smash */}
            <AnimatePresence>
              {isSmashed && (
                <motion.div
                  key="smash-ring"
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 1.75, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-[#F5A623] pointer-events-none z-30"
                />
              )}
            </AnimatePresence>

            {/* Pilha 3D Flutuando Livremente sobre a Tábua do Background */}
            <div className="relative flex-1 flex flex-col items-center justify-end py-12 z-10">
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
                    const overlapMargin = index === 0 ? 0 : isSmashed ? -64 : -50;

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

                        {/* Indicador Tipográfico Limpo de Remoção */}
                        {!layer.isBase && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                            <span className="w-6 h-[1px] bg-[#E85D1A]" />
                            <Trash2 className="w-3.5 h-3.5 text-[#E85D1A]" />
                            <span className="font-cinzel text-[10px] font-bold tracking-[0.2em] uppercase text-[#F4EFEA]">
                              Retirar
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* Sombra de Contato Direta sobre a Tábua de Madeira */}
              <div
                className="w-[78%] h-8 rounded-full blur-lg -mt-2"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(232,93,26,0.32) 65%, transparent 100%)',
                }}
              />
            </div>

            {/* Ações Editoriais Abertas (Sem Botões Caixote) */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-[#F5A623]/25">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleClear}
                  className="group inline-flex items-center gap-2 font-cinzel text-[11px] font-semibold tracking-[0.22em] uppercase text-[#A39B95] hover:text-[#F4EFEA] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#E85D1A] group-hover:-rotate-45 transition-transform" />
                  <span>Reiniciar Tábua</span>
                </button>

                <span className="text-[8px] text-[#F5A623]/40">◆</span>

                <button
                  onClick={handleLoadFullHouseRecipe}
                  className="group inline-flex items-center gap-2 font-cinzel text-[11px] font-semibold tracking-[0.22em] uppercase text-[#F5A623] hover:text-[#E85D1A] transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Receita 7 Camadas</span>
                </button>
              </div>

              <button
                onClick={handleCloseBurger}
                disabled={stats.isClosed}
                className={`group inline-flex items-center gap-3 py-1 font-cinzel text-[11px] font-bold tracking-[0.24em] uppercase transition-all cursor-pointer ${
                  stats.isClosed
                    ? 'text-emerald-400 cursor-default'
                    : 'text-[#F4EFEA] hover:text-[#F5A623]'
                }`}
              >
                <span>
                  {stats.isClosed ? '◆ Lanche Selado no Topo' : 'Selar com Pão Topo'}
                </span>
                {!stats.isClosed && (
                  <span className="w-8 h-[1px] bg-[#E85D1A] group-hover:w-12 transition-all" />
                )}
              </button>
            </div>
          </div>

          {/* DIREITA: Caderno de Mise-en-Place do Chef (Linhas Finas, Sem Caixas!) */}
          <div className="lg:col-span-6 lg:border-l lg:border-[#F5A623]/30 lg:pl-12 flex flex-col gap-10">
            {/* Telemetria Gastronômica em Serif Italic */}
            <div className="grid grid-cols-3 gap-6 pb-8 border-b border-[#F5A623]/25">
              <div>
                <span className="font-cinzel text-[10px] tracking-[0.28em] text-[#A39B95] uppercase block">
                  Peso na Balança
                </span>
                <p className="font-editorial-serif italic font-black text-3xl sm:text-4xl text-[#F4EFEA] tabular-nums mt-1">
                  {stats.totalWeightGrams}
                  <span className="text-base font-normal text-[#F5A623] ml-1">g</span>
                </p>
              </div>

              <div className="border-l border-[#F5A623]/20 pl-6">
                <span className="font-cinzel text-[10px] tracking-[0.28em] text-[#A39B95] uppercase block">
                  Energia da Brasa
                </span>
                <p className="font-editorial-serif italic font-black text-3xl sm:text-4xl text-[#F5A623] tabular-nums mt-1">
                  {stats.totalCalories}
                  <span className="text-base font-normal text-[#A39B95] ml-1">kcal</span>
                </p>
              </div>

              <div className="border-l border-[#F5A623]/20 pl-6">
                <span className="font-cinzel text-[10px] tracking-[0.28em] text-[#A39B95] uppercase block">
                  Valor do Corte
                </span>
                <p className="font-editorial-serif italic font-black text-3xl sm:text-4xl text-molten-gold tabular-nums mt-1">
                  {formatCurrencyBRL(stats.totalPrice)}
                </p>
              </div>
            </div>

            {/* Navegação de Categorias em Linha Tipográfica */}
            <div className="flex items-center gap-5 overflow-x-auto pb-2 border-b border-white/10">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'meat', label: 'Carnes' },
                { id: 'cheese', label: 'Cheddar' },
                { id: 'bacon', label: 'Defumados' },
                { id: 'veggie', label: 'Horta' },
                { id: 'sauce', label: 'Molhos' },
              ].map((tab, idx) => (
                <React.Fragment key={tab.id}>
                  {idx > 0 && (
                    <span className="text-[7px] text-[#F5A623]/40 select-none">◆</span>
                  )}
                  <button
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`relative py-1.5 font-cinzel text-[11px] tracking-[0.24em] uppercase whitespace-nowrap cursor-pointer transition-colors ${
                      selectedCategory === tab.id
                        ? 'text-[#F5A623] font-bold after:content-[""] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-[#E85D1A]'
                        : 'text-[#A39B95] hover:text-[#F4EFEA]'
                    }`}
                  >
                    {tab.label}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Lista Editorial de Ingredientes (Sem Caixas Retangulares!) */}
            <div className="divide-y divide-white/10">
              {selectableIngredients.map(item => {
                const count = currentLayers.filter(l => l.id === item.id).length;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleAddIngredient(item)}
                    aria-label={`Adicionar ${item.name}`}
                    className="w-full py-4 flex items-center gap-5 text-left group cursor-pointer transition-colors hover:bg-white/[0.02]"
                  >
                    {/* Packshot PNG Flutuante Sem Caixa */}
                    <div className="w-16 h-12 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                      {item.pngUrl ? (
                        <img
                          src={item.pngUrl}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.95)]"
                        />
                      ) : (
                        <Flame className="w-6 h-6 text-[#E85D1A]" />
                      )}
                    </div>

                    {/* Nome, Linha Pontilhada e Preço em Estilo Cardápio Clássico */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-[#F4EFEA] group-hover:text-[#F5A623] transition-colors">
                          {item.name}
                        </span>

                        <span className="flex-1 border-b border-dotted border-white/20 mx-2 hidden sm:block" />

                        <div className="flex items-baseline gap-2 shrink-0">
                          {count > 0 && (
                            <span className="font-cinzel text-[11px] font-bold text-[#E85D1A]">
                              [{count}x]
                            </span>
                          )}
                          <span className="font-editorial-serif italic text-base font-bold text-[#F5A623] tabular-nums">
                            +{formatCurrencyBRL(item.price)}
                          </span>
                          <Plus className="w-3.5 h-3.5 text-[#E85D1A] group-hover:rotate-90 transition-transform" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <p className="font-editorial-serif italic text-xs text-[#A39B95] truncate">
                          {item.description}
                        </p>
                        <span className="font-mono text-[10px] text-[#A39B95]/70 tabular-nums shrink-0 ml-3">
                          {item.weightGrams}g · {item.calories} kcal
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Assinatura de Fechamento da Comanda (Dupla Linha de Latão, Sem Botão Retangular) */}
            <button
              onClick={handleFinalizeOrder}
              className="group relative w-full py-5 border-y border-[#F5A623]/55 hover:border-[#E85D1A] flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#E85D1A]">◆</span>
                <span className="font-cinzel text-xs sm:text-sm font-extrabold tracking-[0.28em] uppercase text-[#F4EFEA] group-hover:text-[#F5A623] transition-colors">
                  Enviar Criação para a Comanda
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-editorial-serif italic text-lg font-bold text-[#F5A623]">
                  {formatCurrencyBRL(stats.totalPrice)}
                </span>
                <span className="w-8 h-[1px] bg-[#E85D1A] group-hover:w-14 transition-all" />
                <ArrowUpRight className="w-4 h-4 text-[#E85D1A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Notificação Editorial Minimalista */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50 pl-5 pr-6 py-3 bg-[#0A0705]/95 backdrop-blur-xl border-l-2 border-[#E85D1A] text-[#F4EFEA] font-editorial-serif italic text-sm shadow-2xl flex items-center gap-3"
          >
            <Flame className="w-4 h-4 text-[#E85D1A] shrink-0" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
