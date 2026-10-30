/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BENTO_MENU_ITEMS, MenuItem } from '../data/menuItems.ts';
import { formatCurrencyBRL } from '../utils/burgerLogic.ts';
import { Flame, Check } from 'lucide-react';

interface BentoGridMenuProps {
  onAddToCart?: (item: MenuItem) => void;
}

export const BentoGridMenu: React.FC<BentoGridMenuProps> = ({ onAddToCart }) => {
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleQuickAdd = (item: MenuItem) => {
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

  const renderSpiceIndicator = (level: number, label: string) => {
    return (
      <div className="inline-flex items-center gap-2 text-[11px] font-mono text-[#F5A623] uppercase tracking-[0.18em]">
        <div className="flex items-center gap-0.5">
          {[...Array(3)].map((_, i) => (
            <Flame
              key={i}
              className={`w-3.5 h-3.5 ${
                i < level ? 'text-[#E85D1A] fill-[#E85D1A]' : 'text-white/20'
              }`}
            />
          ))}
        </div>
        <span className="text-[#F4EFEA]/80">{label}</span>
      </div>
    );
  };

  return (
    <section
      id="cardapio"
      className="relative py-28 px-4 sm:px-10 bg-gradient-to-b from-black/30 via-[#090604]/80 to-[#080504]/95 text-[#F4EFEA]"
    >
      {/* Top Architectural Brass Hairline */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="h-[1px] w-full hairline-gold-center" />
      </div>

      {/* Subtle Warm Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-[#E85D1A]/8 blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#F5A623]/6 blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Editorial Section Header — Unboxed */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[1px] w-10 hairline-gold-r" />
              <span className="text-[11px] font-mono uppercase tracking-[0.32em] text-[#F5A623]">
                ATO IV · CURADORIA DA CASA
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-cinzel font-black tracking-[0.06em] text-[#F4EFEA] drop-shadow-[0_10px_28px_rgba(0,0,0,0.95)]">
              CLÁSSICOS{' '}
              <span className="font-editorial-serif italic font-normal text-molten-gold tracking-normal">
                da Brasa
              </span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#F4EFEA]/80 font-sans leading-relaxed border-l border-[#F5A623]/35 pl-4">
            Cortes autorais selados sobre ferro fundido a 400°C com lenha de macieira, blends nobres de Wagyu e queijos ingleses maturados.
          </p>
        </div>

        {/* Unboxed Asymmetric Editorial Gallery */}
        <div className="space-y-20">
          {/* I · SIGNATURE FEATURE: The Outland Blooming Burger */}
          <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Feathered / Chamfered Visual Showcase */}
            <div className="lg:col-span-7 relative overflow-hidden clip-chamfer">
              <div className="relative h-[360px] sm:h-[460px] w-full overflow-hidden">
                <img
                  src={bloomingBurger.image}
                  alt={bloomingBurger.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0705] via-transparent to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A0705]/70 hidden lg:block" />
              </div>

              {/* Architectural Roman Numeral & Badge Watermark */}
              <div className="absolute top-5 left-6 flex items-center gap-3">
                <span className="font-cinzel text-3xl sm:text-4xl font-black text-[#F5A623] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                  I.
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#F4EFEA] bg-black/65 backdrop-blur-md px-3 py-1 border-l-2 border-[#E85D1A]">
                  ★ {bloomingBurger.badge}
                </span>
              </div>

              <div className="absolute bottom-5 left-6">
                {renderSpiceIndicator(bloomingBurger.heatLevel, bloomingBurger.heatLabel)}
              </div>
            </div>

            {/* Open Editorial Typography Column */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#F5A623] uppercase tracking-[0.25em] block mb-2">
                  {bloomingBurger.subtitle}
                </span>
                <h3 className="text-3xl sm:text-4xl font-cinzel font-black text-[#F4EFEA] tracking-wide leading-tight mb-2">
                  {bloomingBurger.name}
                </h3>
                <p className="text-sm font-editorial-serif italic text-[#E85D1A] mb-4">
                  {bloomingBurger.tagline}
                </p>
                <p className="text-sm text-[#D5CCC4]/85 font-sans leading-relaxed mb-6">
                  {bloomingBurger.description}
                </p>

                {/* Open Hairline Ingredient Ledger */}
                <div className="border-l-2 border-[#E85D1A] pl-4 py-1 mb-8">
                  <span className="block text-[9px] font-mono uppercase tracking-[0.25em] text-[#A39B95] mb-1">
                    COMPOSIÇÃO NA TÁBUA
                  </span>
                  <p className="text-xs font-mono text-[#F4EFEA]/90 leading-relaxed">
                    {bloomingBurger.ingredients.join(' · ')}
                  </p>
                </div>
              </div>

              {/* Price & Unboxed Action Trigger */}
              <div className="pt-5 border-t border-[#F5A623]/25 flex items-end justify-between gap-4">
                <div>
                  <span className="block text-[10px] font-mono text-[#A39B95] uppercase tracking-[0.2em] tabular-nums">
                    {bloomingBurger.weightGrams}g · {bloomingBurger.calories} kcal
                  </span>
                  <span className="text-3xl font-editorial-serif italic font-black text-molten-gold tabular-nums">
                    {formatCurrencyBRL(bloomingBurger.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleQuickAdd(bloomingBurger)}
                  className="group/btn relative py-2.5 px-1 text-xs font-cinzel font-bold uppercase tracking-[0.22em] text-[#F4EFEA] hover:text-[#F5A623] transition-colors cursor-pointer flex items-center gap-3"
                >
                  {addedIds[bloomingBurger.id] ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">REGISTRADO NA COMANDA</span>
                    </>
                  ) : (
                    <>
                      <span>ADICIONAR AO PEDIDO</span>
                      <span className="text-[#E85D1A] group-hover/btn:translate-x-1.5 transition-transform">
                        ──►
                      </span>
                    </>
                  )}
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#E85D1A] to-[#F5A623]" />
                </button>
              </div>
            </div>
          </article>

          {/* Horizontal Divider */}
          <div className="h-[1px] w-full hairline-gold-center opacity-50" />

          {/* II & III · DUAL ARCHITECTURAL COLUMNS: Firehouse Ribs & Thunder Down Under */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-stretch">
            {[
              { numeral: 'II.', item: ribsBurger },
              { numeral: 'III.', item: thunderBurger },
            ].map(({ numeral, item }, idx) => (
              <article
                key={item.id}
                className={`lg:col-span-6 flex flex-col justify-between group ${
                  idx === 1 ? 'lg:border-l lg:border-[#F5A623]/20 lg:pl-10' : ''
                }`}
              >
                <div>
                  {/* Chamfered Image without heavy card frame */}
                  <div className="relative h-[260px] sm:h-[300px] w-full overflow-hidden clip-chamfer mb-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0705] via-transparent to-black/25" />

                    <div className="absolute top-4 left-5 flex items-center gap-3">
                      <span className="font-cinzel text-2xl font-black text-[#F5A623] drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                        {numeral}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#F4EFEA] bg-black/65 backdrop-blur-md px-2.5 py-0.5 border-l-2 border-[#F5A623]">
                        {item.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-5">
                      {renderSpiceIndicator(item.heatLevel, item.heatLabel)}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-[#F5A623] uppercase tracking-[0.24em] block mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#F4EFEA] tracking-wide mb-1.5">
                    {item.name}
                  </h3>
                  <p className="text-xs font-editorial-serif italic text-[#E85D1A] mb-3">
                    {item.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-[#D5CCC4]/80 font-sans leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <p className="text-[11px] font-mono text-[#F4EFEA]/75 border-l border-[#F5A623]/40 pl-3 py-0.5 mb-6">
                    {item.ingredients.join(' · ')}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F5A623]/20 flex items-end justify-between gap-4 mt-auto">
                  <div>
                    <span className="block text-[10px] font-mono text-[#A39B95] uppercase tabular-nums">
                      {item.weightGrams}g · {item.calories} kcal
                    </span>
                    <span className="text-2xl font-editorial-serif italic font-black text-molten-gold tabular-nums">
                      {formatCurrencyBRL(item.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleQuickAdd(item)}
                    className="group/btn relative py-2 px-1 text-[11px] font-cinzel font-bold uppercase tracking-[0.2em] text-[#F4EFEA] hover:text-[#F5A623] transition-colors cursor-pointer flex items-center gap-2.5"
                  >
                    {addedIds[item.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">ADICIONADO</span>
                      </>
                    ) : (
                      <>
                        <span>ADICIONAR AO PEDIDO</span>
                        <span className="text-[#E85D1A] group-hover/btn:translate-x-1 transition-transform">
                          ──►
                        </span>
                      </>
                    )}
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#E85D1A] to-[#F5A623]" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Horizontal Divider */}
          <div className="h-[1px] w-full hairline-gold-center opacity-50" />

          {/* IV · PANORAMIC SHARED COURSE: Aussie Cheese Fries */}
          <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 lg:order-2 relative overflow-hidden clip-chamfer">
              <div className="relative h-[280px] sm:h-[340px] w-full overflow-hidden">
                <img
                  src={cheeseFries.image}
                  alt={cheeseFries.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0705] via-transparent to-black/25" />
              </div>

              <div className="absolute top-4 left-5 flex items-center gap-3">
                <span className="font-cinzel text-2xl sm:text-3xl font-black text-[#F5A623] drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                  IV.
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#F4EFEA] bg-black/65 backdrop-blur-md px-3 py-1 border-l-2 border-[#F5A623]">
                  {cheeseFries.badge}
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 lg:order-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-[11px] font-mono text-[#F5A623] uppercase tracking-[0.25em]">
                    {cheeseFries.subtitle}
                  </span>
                  {renderSpiceIndicator(cheeseFries.heatLevel, cheeseFries.heatLabel)}
                </div>

                <h3 className="text-2xl sm:text-4xl font-cinzel font-black text-[#F4EFEA] tracking-wide mb-2">
                  {cheeseFries.name}
                </h3>
                <p className="text-sm font-editorial-serif italic text-[#E85D1A] mb-4">
                  {cheeseFries.tagline}
                </p>
                <p className="text-sm text-[#D5CCC4]/85 font-sans leading-relaxed mb-5">
                  {cheeseFries.description}
                </p>

                <p className="text-xs font-mono text-[#F4EFEA]/85 border-l-2 border-[#F5A623] pl-4 py-1 mb-8 leading-relaxed">
                  {cheeseFries.ingredients.join(' · ')}
                </p>
              </div>

              <div className="pt-5 border-t border-[#F5A623]/25 flex items-end justify-between gap-4">
                <div>
                  <span className="block text-[10px] font-mono text-[#A39B95] uppercase tabular-nums">
                    {cheeseFries.weightGrams}g · {cheeseFries.calories} kcal
                  </span>
                  <span className="text-3xl font-editorial-serif italic font-black text-molten-gold tabular-nums">
                    {formatCurrencyBRL(cheeseFries.price)}
                  </span>
                </div>

                <button
                  onClick={() => handleQuickAdd(cheeseFries)}
                  className="group/btn relative py-2.5 px-1 text-xs font-cinzel font-bold uppercase tracking-[0.22em] text-[#F4EFEA] hover:text-[#F5A623] transition-colors cursor-pointer flex items-center gap-3"
                >
                  {addedIds[cheeseFries.id] ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">REGISTRADO NA COMANDA</span>
                    </>
                  ) : (
                    <>
                      <span>ADICIONAR AO PEDIDO</span>
                      <span className="text-[#E85D1A] group-hover/btn:translate-x-1.5 transition-transform">
                        ──►
                      </span>
                    </>
                  )}
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#E85D1A] to-[#F5A623]" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
