import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BUILDER_INGREDIENTS } from '../data/menuItems.ts';
import {
  calculateBurgerStats,
  calculateHeatIntensity,
  canAddIngredient,
  formatCurrencyBRL,
  IngredientItem,
  MeatDoneness,
  MEAT_DONENESS_OPTIONS,
} from '../utils/burgerLogic.ts';
import { generateBurgerIdentity } from '../utils/burgerNamer.ts';
import { sound } from '../utils/soundEffects.ts';
import { BurgerLayerGraphic } from './BurgerLayerGraphic.tsx';
import { BurgerDaylistTicketModal } from './BurgerDaylistTicketModal.tsx';
import { FireEmberCanvasOverlay } from './FireEmberCanvasOverlay.tsx';
import { SunburstIcon, DiamondBadge, StickerTag } from './PosterOrnaments.tsx';
import {
  Flame,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ShoppingBag,
  Receipt,
  Send,
  Dices,
} from 'lucide-react';

interface BurgerCustomizerProps {
  onAddToCart?: (burgerOrder: {
    id: string;
    name: string;
    layers: IngredientItem[];
    stats: ReturnType<typeof calculateBurgerStats>;
    meatDoneness?: MeatDoneness;
  }) => void;
}

export const BurgerCustomizer: React.FC<BurgerCustomizerProps> = ({ onAddToCart }) => {
  const baseBun = BUILDER_INGREDIENTS.find(i => i.isBase)!;
  const topBun = BUILDER_INGREDIENTS.find(i => i.isTopBun)!;

  const [currentLayers, setCurrentLayers] = useState<IngredientItem[]>([baseBun]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDoneness, setSelectedDoneness] = useState<MeatDoneness>('medium');
  const [isSmashed, setIsSmashed] = useState<boolean>(false);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [burstCounter, setBurstCounter] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [hoveredLayerIndex, setHoveredLayerIndex] = useState<number | null>(null);
  const [hoveredIngredientId, setHoveredIngredientId] = useState<string | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);

  const stats = calculateBurgerStats(currentLayers);
  const heatProfile = calculateHeatIntensity(currentLayers, isSmashed);
  const burgerIdentity = generateBurgerIdentity(currentLayers);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3200);
  };

  const triggerSmashFX = () => {
    setIsSmashed(true);
    setIsScreenShaking(true);
    sound.playSmashSizzle();
    if (typeof navigator !== 'undefined' && (navigator as any).vibrate) {
      try {
        (navigator as any).vibrate([35, 20, 60]);
      } catch {
        // haptics fallback
      }
    }
    setTimeout(() => setIsScreenShaking(false), 500);
  };

  const handleAddIngredient = (ingredient: IngredientItem) => {
    const check = canAddIngredient(currentLayers, ingredient);
    if (!check.allowed) {
      sound.playHover();
      showToast(check.reason || 'Não foi possível adicionar este ingrediente.');
      return;
    }

    sound.playAdd();
    const itemToAdd = {
      ...ingredient,
      _stackId: `${ingredient.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setCurrentLayers(prev => [...prev, itemToAdd]);
    setBurstCounter(prev => prev + 1);
    if (ingredient.isTopBun) {
      triggerSmashFX();
    } else {
      setIsSmashed(false);
    }
  };

  const handleRemoveLayer = (indexToRemove: number) => {
    if (indexToRemove === 0 && currentLayers[0]?.isBase) {
      sound.playHover();
      showToast('O Pão Australiano Base sustenta o lanche na tábua!');
      return;
    }
    sound.playRemove();
    setCurrentLayers(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setIsSmashed(false);
  };

  const handleClear = () => {
    sound.playRemove();
    setCurrentLayers([baseBun]);
    setIsSmashed(false);
    showToast('Tábua reiniciada! Comece a empilhar seus ingredientes.');
  };

  const handleLoadFullHouseRecipe = () => {
    sound.playAdd();
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
    triggerSmashFX();
    setBurstCounter(prev => prev + 1);
    showToast('As 7 camadas originais foram montadas na tábua!');
  };

  const handleChefRoulette = () => {
    sound.playHover();
    const bacon = BUILDER_INGREDIENTS.find(i => i.id === 'bacon-smoked')!;
    const patty = BUILDER_INGREDIENTS.find(i => i.id === 'meat-wagyu')!;
    const cheddar = BUILDER_INGREDIENTS.find(i => i.id === 'cheese-cheddar')!;
    const lettuce = BUILDER_INGREDIENTS.find(i => i.id === 'veggie-lettuce')!;
    const onion = BUILDER_INGREDIENTS.find(i => i.id === 'veggie-onion')!;

    const secretRecipes = [
      {
        name: 'Monstro Defumado',
        layers: [baseBun, bacon, patty, bacon, cheddar, topBun],
      },
      {
        name: 'Avalanche 400°C',
        layers: [baseBun, patty, cheddar, cheddar, onion, topBun],
      },
      {
        name: 'Dueto Brutalista Wagyu',
        layers: [baseBun, patty, cheddar, patty, bacon, topBun],
      },
      {
        name: 'Equilíbrio da Horta & Fogo',
        layers: [baseBun, lettuce, patty, cheddar, onion, topBun],
      },
      {
        name: 'O Titã da Brasa 7 Camadas',
        layers: [baseBun, bacon, patty, cheddar, lettuce, onion, topBun],
      },
    ];

    const pick = secretRecipes[Math.floor(Math.random() * secretRecipes.length)];
    let tickCount = 0;
    const ticker = setInterval(() => {
      sound.playHover();
      tickCount++;
      if (tickCount >= 5) {
        clearInterval(ticker);
        const resolved = pick.layers.map((item, idx) => ({
          ...item,
          _stackId: `roulette-${item.id}-${Date.now()}-${idx}`,
        }));
        setCurrentLayers(resolved);
        triggerSmashFX();
        setBurstCounter(prev => prev + 1);
        const newId = generateBurgerIdentity(resolved);
        showToast(`🎲 Roleta do Chef: "${newId.title}" na brasa!`);
      }
    }, 120);
  };

  const handleCloseBurger = () => {
    if (stats.isClosed) {
      sound.playHover();
      showToast('O lanche já foi selado com o Pão Australiano Topo!');
      return;
    }

    setCurrentLayers(prev => [
      ...prev,
      { ...topBun, _stackId: `top-bun-${Date.now()}` } as IngredientItem,
    ]);
    triggerSmashFX();
    setBurstCounter(prev => prev + 1);
    showToast('SMASH! Pão Topo selado na brasa!');
  };

  const handleOpenTicketModal = () => {
    sound.playHover();
    setIsTicketModalOpen(true);
  };

  const handleConfirmAddToCart = (customName: string, doneness?: MeatDoneness) => {
    const finalLayers = stats.isClosed
      ? currentLayers
      : [...currentLayers, { ...topBun, _stackId: `top-bun-${Date.now()}` } as IngredientItem];

    if (!stats.isClosed) {
      setCurrentLayers(finalLayers);
      triggerSmashFX();
      setBurstCounter(prev => prev + 1);
    }

    const currentStats = calculateBurgerStats(finalLayers);
    const finalDoneness = currentStats.hasPatty ? (doneness || selectedDoneness) : undefined;

    const customBurger = {
      id: `custom-burger-${Date.now()}`,
      name: customName || burgerIdentity.title,
      layers: finalLayers,
      stats: currentStats,
      meatDoneness: finalDoneness,
    };

    if (onAddToCart) {
      onAddToCart(customBurger);
      sound.playSuccess();
      showToast(`"${customBurger.name}" adicionado à Comanda!`);
    }
  };

  const handleFinalizeOrder = () => {
    handleOpenTicketModal();
  };

  const selectableIngredients = BUILDER_INGREDIENTS.filter(item => {
    if (item.isBase) return false;
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <section
      id="monte-no-fogo"
      className="relative py-28 px-4 sm:px-10 bg-transparent text-[#EDE3F7] overflow-hidden"
    >
      {/* Contrast Scrim over Stage 4 Counter */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(13,8,20,0.4) 0%, rgba(13,8,20,0.75) 50%, rgba(13,8,20,0.92) 100%)',
        }}
      />

      {/* Atmospheric Fire Canvas Overlay */}
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
        {/* ===================================================================
            HEADER: POSTER EDITORIAL "MONTE O SEU NA TÁBUA DO CHEF"
           =================================================================== */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b-2 border-[#8E6FD1]/30">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <StickerTag variant="pink" rotate="-rotate-1">
                <span>ATO III</span>
              </StickerTag>
              <StickerTag variant="gold" rotate="rotate-1">
                <SunburstIcon size={12} spin={true} />
                <span>MISE-EN-PLACE DO CHEF</span>
              </StickerTag>
              <DiamondBadge text="26" />
            </div>

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h2 className="font-poster text-5xl sm:text-7xl lg:text-8xl tracking-[0.04em] uppercase text-[#8E6FD1] drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)] m-0 leading-[0.88]">
                MONTE O SEU
              </h2>
              <span className="font-grotesk font-black text-2xl sm:text-4xl lg:text-5xl tracking-[0.14em] uppercase text-[#EDE3F7]">
                NA TÁBUA DO CHEF
              </span>
            </div>
          </div>

          <p className="max-w-md font-grotesk text-xs sm:text-sm text-[#EDE3F7]/80 leading-relaxed border-l-2 border-[#E0A95F] pl-4">
            Escolha os cortes, o queijo derretido no vapor e os defumados.
            Clique na camada sobre a tábua para retirar a qualquer momento.
          </p>
        </div>

        {/* 2-Column Poster Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ===================================================================
              LEFT: THE LIVE 3D BURGER ON CHEF'S BOARD
             =================================================================== */}
          <div className="lg:col-span-6 relative min-h-[620px] flex flex-col justify-between p-6 sm:p-8 bg-[#160F22]/70 border-2 border-[#8E6FD1]/40 shadow-[8px_8px_0px_#8E6FD1] backdrop-blur-md">
            {/* Top Board Bar */}
            <div className="relative z-20 flex items-center justify-between pb-4 border-b border-[#8E6FD1]/30">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E0A95F] animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#E0A95F]">
                  TÁBUA DE CARVALHO
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-[#EDE3F7]">
                <span className="inline-flex items-center gap-1 text-[#FF5B1F]">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>{heatProfile.grillTempCelsius}°C</span>
                </span>
                <span>✦</span>
                <span className="text-[#8E6FD1] font-bold">
                  {currentLayers.length} {currentLayers.length === 1 ? 'CAMADA' : 'CAMADAS'}
                </span>
              </div>
            </div>

            {/* Spotlight HUD Indicator Bar */}
            <div className="relative z-20 mt-3 px-3 py-1.5 bg-[#0D0814]/90 border border-[#8E6FD1]/40 flex items-center justify-between text-xs transition-all duration-200 shadow-[2px_2px_0px_#8E6FD1]">
              {hoveredLayerIndex !== null ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-[#E0A95F] text-[#0D0814] font-mono text-[10px] font-black uppercase">
                      ✦ CAMADA 0{hoveredLayerIndex + 1}
                    </span>
                    <span className="font-grotesk font-black text-xs sm:text-sm uppercase tracking-wide text-[#EDE3F7]">
                      {currentLayers[hoveredLayerIndex]?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-[#A797BD]">
                    <span className="text-[#E0A95F] font-bold">+{formatCurrencyBRL(currentLayers[hoveredLayerIndex]?.price || 0)}</span>
                    <span className="hidden sm:inline">· {currentLayers[hoveredLayerIndex]?.weightGrams}g</span>
                  </div>
                </div>
              ) : hoveredIngredientId !== null ? (
                (() => {
                  const ing = selectableIngredients.find(i => i.id === hoveredIngredientId);
                  return ing ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-[#FF4FA3] text-white font-mono text-[10px] font-black uppercase">
                          ✦ INGREDIENTE
                        </span>
                        <span className="font-grotesk font-black text-xs sm:text-sm uppercase tracking-wide text-[#EDE3F7]">
                          {ing.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-[#A797BD]">
                        <span className="text-[#E0A95F] font-bold">+{formatCurrencyBRL(ing.price)}</span>
                        <span className="hidden sm:inline">· {ing.weightGrams}g</span>
                      </div>
                    </div>
                  ) : null;
                })()
              ) : (
                <div className="flex items-center gap-2 text-[#A797BD]/70 font-mono text-[11px] uppercase tracking-wider">
                  <span className="text-[#8E6FD1]">✦</span>
                  <span>PASSE O CURSOR NAS CAMADAS DO HAMBÚRGUER OU NOS ITENS AO LADO</span>
                </div>
              )}
            </div>

            {/* Smash Shockwave Effect */}
            <AnimatePresence>
              {isSmashed && (
                <motion.div
                  key="smash-ring"
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-[#FF4FA3] pointer-events-none z-30"
                />
              )}
            </AnimatePresence>

            {/* Free Floating 3D Burger Stack */}
            <div className="relative flex-1 flex flex-col items-center justify-end py-10 z-10">
              <motion.div
                animate={
                  isScreenShaking
                    ? { x: [-6, 6, -4, 4, -2, 2, 0], y: [0, 8, -4, 2, 0] }
                    : isSmashed
                    ? { scaleY: [1, 0.82, 1.05, 0.98, 1], y: [0, 18, -6, 2, 0] }
                    : { scaleY: 1, y: 0 }
                }
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative flex flex-col-reverse items-center justify-start w-full max-w-[360px]"
              >
                <AnimatePresence initial={false}>
                  {currentLayers.map((layer, index) => {
                    // Cálculo harmonioso de sobreposição para fechar o hambúrguer perfeitamente
                    const isClosed = stats.isClosed || isSmashed;
                    let overlapMargin = 0;
                    if (index > 0) {
                      if (!isClosed) {
                        overlapMargin = -52;
                      } else {
                        if (layer.isTopBun) overlapMargin = -122;
                        else if (layer.category === 'cheese') overlapMargin = -102;
                        else if (layer.category === 'sauce') overlapMargin = -98;
                        else if (layer.category === 'bacon') overlapMargin = -94;
                        else if (layer.category === 'veggie') overlapMargin = -90;
                        else overlapMargin = -96;
                      }
                    }

                    const isLayerHovered =
                      hoveredLayerIndex === index ||
                      (hoveredIngredientId !== null && layer.id === hoveredIngredientId);
                    const isLayerDimmed =
                      (hoveredLayerIndex !== null && hoveredLayerIndex !== index) ||
                      (hoveredIngredientId !== null && layer.id !== hoveredIngredientId);

                    return (
                      <motion.div
                        key={(layer as any)._stackId || `${layer.id}-${index}`}
                        initial={{ y: -240, opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{
                          y: isLayerHovered ? -8 : 0,
                          opacity: isLayerDimmed ? 0.35 : 1,
                          scale: isLayerHovered ? 1.05 : isLayerDimmed ? 0.97 : 1,
                          rotate: isLayerHovered ? (index % 2 === 0 ? 1 : -1) : 0,
                        }}
                        exit={{
                          y: -90,
                          opacity: 0,
                          scale: 0.75,
                          transition: { duration: 0.18 },
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 280,
                          damping: 18,
                          mass: 0.85,
                        }}
                        onMouseEnter={() => {
                          setHoveredLayerIndex(index);
                          sound.playHover();
                        }}
                        onMouseLeave={() => setHoveredLayerIndex(null)}
                        onTouchStart={() => {
                          if (hoveredLayerIndex === index) {
                            setHoveredLayerIndex(null);
                          } else {
                            setHoveredLayerIndex(index);
                            sound.playHover();
                          }
                        }}
                        onClick={() => {
                          if (layer.isTopBun && isClosed) {
                            triggerSmashFX();
                            setBurstCounter(prev => prev + 1);
                            showToast('SMASH! Lanche selado no fogo vivo!');
                          } else {
                            handleRemoveLayer(index);
                          }
                        }}
                        style={{
                          marginBottom: `${overlapMargin}px`,
                          zIndex: isLayerHovered ? 60 : 10 + index,
                        }}
                        className={`relative w-full cursor-pointer group select-none transition-all duration-200 ${
                          isLayerHovered ? 'z-60' : ''
                        }`}
                        title={
                          layer.isBase
                            ? 'Pão Australiano Base'
                            : layer.isTopBun
                            ? 'Clique para animar o fechamento do lanche'
                            : `Clique para remover ${layer.name}`
                        }
                      >
                        {/* Tag de destaque do ingrediente flutuante com indicador de beacon */}
                        {isLayerHovered && (
                          <div className="absolute left-2 sm:left-4 -top-3.5 z-60 pointer-events-none flex items-center gap-2 px-2.5 py-1 bg-[#160F22] border-2 border-[#E0A95F] text-[#EDE3F7] shadow-[3px_3px_0px_#8E6FD1] animate-in fade-in zoom-in-95 duration-150">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E0A95F] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E0A95F]"></span>
                            </span>
                            <span className="font-mono text-[10px] text-[#E0A95F] font-black">
                              0{index + 1}
                            </span>
                            <span className="font-grotesk font-black text-xs uppercase tracking-wider text-[#EDE3F7] whitespace-nowrap">
                              {layer.name}
                            </span>
                            <span className="hidden sm:inline font-mono text-[10px] text-[#A797BD]">
                              +{formatCurrencyBRL(layer.price)}
                            </span>
                          </div>
                        )}

                        <BurgerLayerGraphic
                          layerId={layer.id}
                          pngUrl={layer.pngUrl}
                          altText={layer.name}
                          widthPercent={layer.isTopBun ? 96 : 92}
                          isClosed={isClosed}
                          isHovered={isLayerHovered}
                          isDimmed={isLayerDimmed}
                        />

                        {/* Botão de Remoção Tátil na Frente e Posicionado ao Lado */}
                        {!layer.isBase && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveLayer(index);
                            }}
                            className="absolute -right-8 sm:-right-20 top-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 px-2 py-1 bg-[#FF4FA3] hover:bg-[#FF5B1F] text-white border border-[#EDE3F7] text-[10px] font-mono font-bold uppercase shadow-[2px_2px_0px_#0D0814] hover:shadow-[1px_1px_0px_#0D0814] hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer pointer-events-auto"
                            title={`Remover ${layer.name}`}
                            aria-label={`Remover ${layer.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="hidden sm:inline">REMOVER</span>
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* Shadow on Wood Board */}
              <div
                className="w-[78%] h-8 rounded-full blur-md -mt-2"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(142,111,209,0.3) 65%, transparent 100%)',
                }}
              />
            </div>

            {/* Ponto da Carne Selector (Exibido quando há carne na bancada) */}
            {stats.hasPatty && (
              <div className="relative z-20 mb-3 p-3 bg-[#0D0814]/90 border border-[#8E6FD1]/40 shadow-[3px_3px_0px_#8E6FD1]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-[#FF5B1F] fill-current" />
                    <span className="font-grotesk font-black text-xs uppercase tracking-wider text-[#EDE3F7]">
                      PONTO DA CARNE NA BRASA
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#E0A95F] font-bold">
                    TEMPERATURA INTERNA
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {MEAT_DONENESS_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedDoneness(opt.id);
                        sound.playHover();
                      }}
                      className={`p-2 text-left transition-all cursor-pointer border ${
                        selectedDoneness === opt.id
                          ? 'bg-[#8E6FD1] text-[#0D0814] border-[#EDE3F7] shadow-[2px_2px_0px_#EDE3F7] font-bold'
                          : 'bg-[#160F22] text-[#EDE3F7]/80 hover:text-white border-[#8E6FD1]/30 hover:border-[#8E6FD1]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-grotesk font-black text-[11px] uppercase tracking-wide truncate">
                          {opt.label}
                        </span>
                        <span className={`px-1 py-0.2 text-[9px] font-mono font-bold leading-none ${
                          selectedDoneness === opt.id ? 'bg-[#0D0814] text-[#E0A95F]' : 'bg-[#0D0814]/70 text-[#FF5B1F]'
                        }`}>
                          {opt.badge}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono block mt-1 leading-tight truncate ${
                        selectedDoneness === opt.id ? 'text-[#0D0814]/80 font-bold' : 'text-[#A797BD]'
                      }`}>
                        {opt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions on Board */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#8E6FD1]/30">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 bg-[#0D0814] text-[#EDE3F7] hover:text-[#FF4FA3] border border-[#8E6FD1]/50 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_#8E6FD1]"
                >
                  <RotateCcw className="w-3 h-3 text-[#FF5B1F]" />
                  <span>LIMPAR</span>
                </button>

                <button
                  onClick={handleChefRoulette}
                  className="px-3 py-1.5 bg-[#FF5B1F] text-[#0D0814] font-grotesk font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_#EDE3F7] hover:shadow-[1px_1px_0px_#EDE3F7] hover:translate-x-[1px] hover:translate-y-[1px]"
                  title="Girar a Roleta do Chef para sortear uma combinação secreta"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>ROLETA</span>
                </button>

                <button
                  onClick={handleLoadFullHouseRecipe}
                  className="px-3 py-1.5 bg-[#8E6FD1] text-[#0D0814] font-grotesk font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_#EDE3F7] hover:shadow-[1px_1px_0px_#EDE3F7] hover:translate-x-[1px] hover:translate-y-[1px]"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>7 CAMADAS</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenTicketModal}
                  className="px-3 py-1.5 bg-[#160F22] hover:bg-[#231636] text-[#E0A95F] border border-[#E0A95F]/60 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-[2px_2px_0px_#E0A95F]"
                  title="Ver Ticket de Comanda & Pedir no WhatsApp"
                >
                  <Receipt className="w-3.5 h-3.5 fill-current" />
                  <span>TICKET / ZAP</span>
                </button>

                <button
                  onClick={handleCloseBurger}
                  disabled={stats.isClosed}
                  className={`px-4 py-1.5 font-grotesk font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                    stats.isClosed
                      ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/40 cursor-default'
                      : 'bg-[#FF4FA3] text-white shadow-[2px_2px_0px_#E0A95F] hover:shadow-[1px_1px_0px_#E0A95F] hover:translate-x-[1px] hover:translate-y-[1px]'
                  }`}
                >
                  <span>{stats.isClosed ? '✓ SELADO NO TOPO' : 'SELAR COM PÃO TOPO'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ===================================================================
              RIGHT: CHEF'S MISE-EN-PLACE & INGREDIENT LIST
             =================================================================== */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Spotify Daylist Style Identity Banner */}
            <div className="p-5 bg-[#160F22] border-2 border-[#8E6FD1] shadow-[6px_6px_0px_#8E6FD1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-[#FF4FA3] text-white text-[10px] font-mono font-black uppercase shadow-[1px_1px_0px_#0D0814]">
                    {burgerIdentity.personalityTag}
                  </span>
                  <span className="font-mono text-[10px] text-[#E0A95F] uppercase tracking-wider flex items-center gap-1">
                    <SunburstIcon size={10} color="#E0A95F" spin={true} />
                    <span>NOME DO SEU CORTE</span>
                  </span>
                </div>
                <h3 className="font-poster text-3xl sm:text-4xl text-[#EDE3F7] tracking-wider uppercase leading-none mt-1">
                  {burgerIdentity.title}
                </h3>
                <p className="font-grotesk text-xs text-[#A797BD] font-bold mt-1.5">
                  {burgerIdentity.subtitle}
                </p>
              </div>

              <button
                onClick={handleOpenTicketModal}
                className="px-3.5 py-2.5 bg-[#E0A95F] hover:bg-[#FF4FA3] text-[#0D0814] hover:text-white font-grotesk font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#0D0814] hover:shadow-[1px_1px_0px_#0D0814] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                title="Ver Comanda Térmica & Pedir no WhatsApp"
              >
                <Receipt className="w-4 h-4 fill-current" />
                <span>TICKET & ZAP</span>
              </button>
            </div>

            {/* Telemetry Row (Poster Numbers) */}
            <div className="grid grid-cols-3 gap-4 p-5 bg-[#160F22] border-2 border-[#8E6FD1]/50 shadow-[5px_5px_0px_#8E6FD1]">
              <div>
                <span className="font-mono text-[10px] text-[#A797BD] uppercase tracking-widest block">
                  PESO TOTAL
                </span>
                <p className="font-poster text-4xl sm:text-5xl text-[#EDE3F7] leading-none mt-1">
                  {stats.totalWeightGrams}
                  <span className="font-mono text-xs text-[#E0A95F] ml-1">g</span>
                </p>
              </div>

              <div className="border-l border-[#8E6FD1]/30 pl-4">
                <span className="font-mono text-[10px] text-[#A797BD] uppercase tracking-widest block">
                  ENERGIA
                </span>
                <p className="font-poster text-4xl sm:text-5xl text-[#E0A95F] leading-none mt-1">
                  {stats.totalCalories}
                  <span className="font-mono text-xs text-[#A797BD] ml-1">kcal</span>
                </p>
              </div>

              <div className="border-l border-[#8E6FD1]/30 pl-4">
                <span className="font-mono text-[10px] text-[#A797BD] uppercase tracking-widest block">
                  VALOR TOTAL
                </span>
                <p className="font-poster text-4xl sm:text-5xl text-[#FF4FA3] leading-none mt-1">
                  {formatCurrencyBRL(stats.totalPrice)}
                </p>
              </div>
            </div>

            {/* Category Filter Pills (Tactile Sticker Style) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'TODOS' },
                { id: 'meat', label: 'CARNES' },
                { id: 'cheese', label: 'CHEDDAR' },
                { id: 'bacon', label: 'DEFUMADOS' },
                { id: 'veggie', label: 'HORTA' },
                { id: 'sauce', label: 'MOLHOS' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? 'bg-[#8E6FD1] text-[#0D0814] font-bold shadow-[2px_2px_0px_#EDE3F7]'
                      : 'bg-[#160F22] text-[#EDE3F7]/80 hover:text-white border border-[#8E6FD1]/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Ingredient List (Editorial Cards) */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
              {selectableIngredients.map(item => {
                const count = currentLayers.filter(l => l.id === item.id).length;
                const isItemHovered =
                  hoveredIngredientId === item.id ||
                  (hoveredLayerIndex !== null && currentLayers[hoveredLayerIndex]?.id === item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleAddIngredient(item)}
                    onMouseEnter={() => setHoveredIngredientId(item.id)}
                    onMouseLeave={() => setHoveredIngredientId(null)}
                    aria-label={`Adicionar ${item.name}`}
                    className={`w-full p-3 flex items-center gap-4 text-left transition-all group cursor-pointer ${
                      isItemHovered
                        ? 'bg-[#2E1A3D] border-2 border-[#E0A95F] shadow-[4px_4px_0px_#E0A95F] translate-x-1'
                        : 'bg-[#160F22] hover:bg-[#231636] border border-[#8E6FD1]/40 hover:border-[#8E6FD1] shadow-[2px_2px_0px_#8E6FD1]/30 hover:shadow-[4px_4px_0px_#8E6FD1]'
                    }`}
                  >
                    {/* Packshot PNG */}
                    <div className="w-14 h-12 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {item.pngUrl ? (
                        <img
                          src={item.pngUrl}
                          alt={item.name}
                          className={`max-w-full max-h-full object-contain filter transition-all ${
                            isItemHovered
                              ? 'drop-shadow-[0_0_12px_rgba(224,169,95,0.85)] scale-110'
                              : 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]'
                          }`}
                        />
                      ) : (
                        <Flame className="w-6 h-6 text-[#E0A95F]" />
                      )}
                    </div>

                    {/* Name, Details & Price */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <span className={`font-grotesk font-black text-xs sm:text-sm uppercase tracking-wide transition-colors truncate ${
                            isItemHovered ? 'text-[#E0A95F]' : 'text-[#EDE3F7] group-hover:text-[#8E6FD1]'
                          }`}>
                            {item.name}
                          </span>
                          {isItemHovered && (
                            <span className="px-1.5 py-0.5 bg-[#E0A95F] text-[#0D0814] text-[9px] font-mono font-bold leading-none shrink-0">
                              ✦ DESTAQUE
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-2 shrink-0">
                          {count > 0 && (
                            <span className="px-1.5 py-0.2 bg-[#FF4FA3] text-white text-[10px] font-mono font-bold leading-none">
                              {count}x
                            </span>
                          )}
                          <span className="font-poster text-xl text-[#E0A95F]">
                            +{formatCurrencyBRL(item.price)}
                          </span>
                          <Plus className="w-4 h-4 text-[#8E6FD1] group-hover:rotate-90 group-hover:text-[#FF4FA3] transition-transform" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-[#A797BD] mt-0.5">
                        <span className="truncate">{item.description}</span>
                        <span className="shrink-0 ml-2">
                          {item.weightGrams}g · {item.calories}kcal
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Final Order Button: Tactile Banner */}
            <button
              onClick={handleFinalizeOrder}
              className="w-full py-5 px-6 bg-[#8E6FD1] hover:bg-[#FF4FA3] text-[#0D0814] hover:text-white font-grotesk font-black text-sm uppercase tracking-[0.2em] shadow-[6px_6px_0px_#EDE3F7] hover:shadow-[3px_3px_0px_#EDE3F7] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 fill-current" />
                <span>ENVIAR CRIAÇÃO PARA A COMANDA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-poster text-2xl">
                  {formatCurrencyBRL(stats.totalPrice)}
                </span>
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Pop-up Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50 px-5 py-3 bg-[#160F22] border-2 border-[#8E6FD1] text-[#EDE3F7] font-mono text-xs uppercase shadow-[4px_4px_0px_#E0A95F] flex items-center gap-3"
          >
            <Flame className="w-4 h-4 text-[#FF5B1F]" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotify Daylist Style Thermal Ticket Modal */}
      <BurgerDaylistTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        layers={currentLayers}
        meatDoneness={selectedDoneness}
        onConfirmAddToCart={handleConfirmAddToCart}
      />
    </section>
  );
};
