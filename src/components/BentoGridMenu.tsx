import React, { useState } from 'react';
import { BENTO_MENU_ITEMS, MenuItem } from '../data/menuItems.ts';
import { formatCurrencyBRL } from '../utils/burgerLogic.ts';
import { SunburstIcon, DiamondBadge, StickerTag } from './PosterOrnaments.tsx';
import { sound } from '../utils/soundEffects.ts';
import { Flame, Check, Plus, Sparkles } from 'lucide-react';

interface BentoGridMenuProps {
  onAddToCart?: (item: MenuItem) => void;
}

export const BentoGridMenu: React.FC<BentoGridMenuProps> = ({ onAddToCart }) => {
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleQuickAdd = (item: MenuItem) => {
    sound.playAdd();
    if (onAddToCart) {
      onAddToCart(item);
    }
    setAddedIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  const bloomingBurger = BENTO_MENU_ITEMS.find(i => i.id === 'outland-blooming')!;
  const ribsBurger = BENTO_MENU_ITEMS.find(i => i.id === 'firehouse-ribs')!;
  const thunderBurger = BENTO_MENU_ITEMS.find(i => i.id === 'thunder-down-under')!;
  const cheeseFries = BENTO_MENU_ITEMS.find(i => i.id === 'aussie-cheese-fries')!;

  return (
    <section
      id="cardapio"
      className="relative py-28 px-4 sm:px-10 bg-gradient-to-b from-[#0D0814]/40 via-[#160F22]/90 to-[#0D0814] text-[#EDE3F7] overflow-hidden"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none film-grain opacity-40" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#8E6FD1]/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#FF4FA3]/12 blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* ===================================================================
            SECTION HEADER: POSTER EDITORIAL
           =================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b-2 border-[#8E6FD1]/30">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <StickerTag variant="pink" rotate="-rotate-1">
                <span>ATO IV</span>
              </StickerTag>
              <StickerTag variant="gold" rotate="rotate-1">
                <SunburstIcon size={12} spin={true} />
                <span>CURADORIA DA CASA</span>
              </StickerTag>
              <DiamondBadge text="26" />
            </div>

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h2 className="font-poster text-5xl sm:text-7xl lg:text-8xl tracking-[0.04em] uppercase text-[#8E6FD1] drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)] m-0 leading-[0.88]">
                CLÁSSICOS
              </h2>
              <span className="font-grotesk font-black text-2xl sm:text-4xl lg:text-5xl tracking-[0.14em] uppercase text-[#EDE3F7]">
                DA BRASA
              </span>
            </div>
          </div>

          <p className="max-w-md text-xs sm:text-sm font-grotesk text-[#EDE3F7]/80 leading-relaxed border-l-2 border-[#E0A95F] pl-4">
            Cortes nobres com crosta Maillard caramelizada em fogo aberto a 400°C.
            Brioche australiano com mel e cacau, blends de Wagyu e cheddar inglês legítimo.
          </p>
        </div>

        {/* ===================================================================
            FEATURE ITEM (ATO 01): The Outland Blooming Burger
           =================================================================== */}
        <article className="relative mb-20 p-6 sm:p-10 bg-[#160F22] border-2 border-[#8E6FD1] shadow-[8px_8px_0px_#8E6FD1] overflow-hidden group">
          {/* Background Giant Watermark Number */}
          <div className="absolute right-4 bottom-2 font-poster text-[28vw] lg:text-[18vw] text-[#8E6FD1]/10 leading-none select-none pointer-events-none">
            01
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Tilted Photo with Sticker Depth */}
            <div className="lg:col-span-7 relative">
              <div className="relative overflow-hidden border-2 border-[#EDE3F7] shadow-[6px_6px_0px_#E0A95F] -rotate-1 group-hover:rotate-0 transition-transform duration-500">
                <img
                  src={bloomingBurger.image}
                  alt={bloomingBurger.name}
                  className="w-full h-[320px] sm:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <StickerTag variant="pink">
                    <Sparkles className="w-3 h-3" />
                    <span>ASSINATURA DO CHEF</span>
                  </StickerTag>
                  <StickerTag variant="gold">
                    <span>400°C FOGO VIVO</span>
                  </StickerTag>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <span className="font-mono text-xs text-[#EDE3F7] bg-[#0D0814]/80 px-2 py-1 backdrop-blur-sm border border-[#8E6FD1]/40">
                    490g · 980 kcal
                  </span>
                  <span className="font-poster text-3xl sm:text-4xl text-[#E0A95F] bg-[#0D0814]/90 px-3 py-1 shadow-[3px_3px_0px_#8E6FD1]">
                    {formatCurrencyBRL(bloomingBurger.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Content & Action */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#E0A95F] uppercase tracking-wider">
                  <span>01 · CORTE PRINCIPAL</span>
                  <span>✦</span>
                  <span className="text-[#FF4FA3]">DUPLO CHEDDAR</span>
                </div>

                <h3 className="font-poster text-3xl sm:text-5xl text-[#EDE3F7] tracking-[0.04em] uppercase leading-none mb-3">
                  {bloomingBurger.name}
                </h3>

                <p className="font-grotesk text-sm text-[#EDE3F7]/85 leading-relaxed mb-6">
                  {bloomingBurger.description}
                </p>

                {/* Key Ingredients Pill List */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {bloomingBurger.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-[11px] font-mono bg-[#231636] border border-[#8E6FD1]/40 text-[#EDE3F7]/90 uppercase"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add to Cart Action */}
              <button
                onClick={() => handleQuickAdd(bloomingBurger)}
                className={`w-full py-4 px-6 font-grotesk font-black text-xs sm:text-sm uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center justify-center gap-3 shadow-[4px_4px_0px_#EDE3F7] hover:shadow-[2px_2px_0px_#EDE3F7] hover:translate-x-[2px] hover:translate-y-[2px] ${
                  addedIds[bloomingBurger.id]
                    ? 'bg-emerald-400 text-[#0D0814]'
                    : 'bg-[#FF4FA3] hover:bg-[#8E6FD1] text-white'
                }`}
              >
                {addedIds[bloomingBurger.id] ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>ADICIONADO À COMANDA!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>ADICIONAR À COMANDA · {formatCurrencyBRL(bloomingBurger.price)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </article>

        {/* ===================================================================
            GRID OF OTHER CLASSICS (POSTER CARDS)
           =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { item: ribsBurger, num: '02', tilt: 'rotate-[0.6deg]', tagVariant: 'gold' as const },
            { item: thunderBurger, num: '03', tilt: '-rotate-[0.6deg]', tagVariant: 'pink' as const },
            { item: cheeseFries, num: '04', tilt: 'rotate-[0.6deg]', tagVariant: 'violet' as const },
          ].map(({ item, num, tilt, tagVariant }) => (
            <article
              key={item.id}
              className={`relative p-5 sm:p-6 bg-[#160F22] border-2 border-[#8E6FD1]/60 shadow-[6px_6px_0px_#8E6FD1] hover:shadow-[8px_8px_0px_#E0A95F] transition-all duration-300 flex flex-col justify-between group ${tilt} hover:rotate-0`}
            >
              <div>
                {/* Photo with Badge */}
                <div className="relative overflow-hidden border border-[#EDE3F7]/40 mb-5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <StickerTag variant={tagVariant} className="text-[10px]">
                      {item.badge}
                    </StickerTag>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="font-poster text-xl text-[#0D0814] bg-[#E0A95F] px-2 py-0.5 shadow-[2px_2px_0px_#0D0814]">
                      {num}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h4 className="font-poster text-2xl text-[#EDE3F7] tracking-[0.04em] uppercase group-hover:text-[#8E6FD1] transition-colors leading-tight">
                    {item.name}
                  </h4>
                  <span className="font-poster text-2xl text-[#E0A95F] shrink-0">
                    {formatCurrencyBRL(item.price)}
                  </span>
                </div>

                <p className="font-mono text-[11px] text-[#A797BD] uppercase tracking-wider mb-2">
                  {item.subtitle}
                </p>

                <p className="font-grotesk text-xs text-[#EDE3F7]/80 line-clamp-3 mb-6 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Add Button */}
              <button
                onClick={() => handleQuickAdd(item)}
                className={`w-full py-3 px-4 font-grotesk font-black text-xs uppercase tracking-[0.16em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[3px_3px_0px_#EDE3F7] hover:shadow-[1px_1px_0px_#EDE3F7] hover:translate-x-[2px] hover:translate-y-[2px] ${
                  addedIds[item.id]
                    ? 'bg-emerald-400 text-[#0D0814]'
                    : 'bg-[#8E6FD1] hover:bg-[#FF4FA3] text-[#0D0814] hover:text-white'
                }`}
              >
                {addedIds[item.id] ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>NA COMANDA!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>ADICIONAR · {formatCurrencyBRL(item.price)}</span>
                  </>
                )}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
