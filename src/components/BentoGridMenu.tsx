/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BENTO_MENU_ITEMS, MenuItem } from '../data/menuItems.ts';
import { formatCurrencyBRL } from '../utils/burgerLogic.ts';
import { Flame, Plus, Check, Sparkles, UtensilsCrossed } from 'lucide-react';

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

  // Find the exact items specified in the prompt
  const bloomingBurger = BENTO_MENU_ITEMS.find(i => i.id === 'outland-blooming')!;
  const ribsBurger = BENTO_MENU_ITEMS.find(i => i.id === 'firehouse-ribs')!;
  const thunderBurger = BENTO_MENU_ITEMS.find(i => i.id === 'thunder-down-under')!;
  const cheeseFries = BENTO_MENU_ITEMS.find(i => i.id === 'aussie-cheese-fries')!;

  const renderSpiceTag = (level: number, label: string) => {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-[#F5A623]">
        <div className="flex items-center">
          {[...Array(3)].map((_, i) => (
            <Flame
              key={i}
              className={`w-3.5 h-3.5 ${
                i < level ? 'text-[#E85D1A] fill-[#E85D1A]' : 'text-white/20'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] text-[#F4EFEA]">{label}</span>
      </div>
    );
  };

  return (
    <section id="cardapio" className="relative py-28 px-4 sm:px-8 bg-[#110D0B] text-[#F4EFEA]">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-[#E85D1A]/8 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#F5A623]/6 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F5A623] tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#E85D1A]" />
              <span>Cardápio da Casa · Bento Grid UI</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#F4EFEA]">
              CLÁSSICOS DA BRASA
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#A39B95] font-sans leading-relaxed">
            Receitas consagradas criadas com blends nobres de Wagyu e Angus, defumação de macieira e queijos ingleses derretidos na hora.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* BLOCO GRANDE (DESTAQUE): The Outland Blooming Burger (Col 1-7, Row Span 2) */}
          <div className="lg:col-span-7 lg:row-span-2 group rounded-3xl glass-outback border border-[#F5A623]/30 overflow-hidden flex flex-col justify-between hover:border-[#E85D1A]/60 transition-all duration-300 shadow-2xl relative">
            {/* Image Box with Subtle Zoom on Hover */}
            <div className="relative w-full h-[340px] sm:h-[430px] overflow-hidden bg-black/60">
              <img
                src={bloomingBurger.image}
                alt={bloomingBurger.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1512] via-[#1C1512]/20 to-transparent" />

              {/* Tag Destaque Top Right */}
              <div className="absolute top-5 right-5 px-3.5 py-1.5 rounded-lg bg-[#E85D1A] text-[#110D0B] text-xs font-mono font-bold uppercase tracking-wider shadow-lg">
                ★ {bloomingBurger.badge}
              </div>

              {/* Spice level on image bottom-left */}
              <div className="absolute bottom-4 left-6">
                {renderSpiceTag(bloomingBurger.heatLevel, bloomingBurger.heatLabel)}
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
              <div>
                <span className="text-xs font-mono text-[#F5A623] uppercase tracking-wider">
                  {bloomingBurger.subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EFEA] tracking-tight mt-1 mb-2">
                  {bloomingBurger.name}
                </h3>
                <p className="text-xs font-mono text-[#E85D1A] mb-3">
                  {bloomingBurger.tagline}
                </p>
                <p className="text-sm text-[#A39B95] font-sans leading-relaxed mb-5">
                  {bloomingBurger.description}
                </p>

                {/* Clean Editorial Ingredient Line */}
                <p className="text-xs font-mono text-[#F4EFEA]/80 border-l-2 border-[#E85D1A] pl-3 py-0.5 mb-6 leading-relaxed">
                  {bloomingBurger.ingredients.join(' · ')}
                </p>
              </div>

              {/* Bottom Price & Quick Add Action */}
              <div className="flex items-center justify-between pt-5 border-t border-[#F5A623]/15 mt-auto">
                <div>
                  <p className="text-[10px] font-mono text-[#A39B95] uppercase tabular-nums">
                    {bloomingBurger.weightGrams}g · {bloomingBurger.calories} kcal
                  </p>
                  <p className="text-2xl font-mono font-bold text-[#F5A623] tabular-nums">
                    {formatCurrencyBRL(bloomingBurger.price)}
                  </p>
                </div>

                <button
                  onClick={() => handleQuickAdd(bloomingBurger)}
                  className={`px-5 py-3 rounded-xl font-bold font-sans text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    addedIds[bloomingBurger.id]
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-[#E85D1A] to-[#F5A623] text-[#110D0B] hover:opacity-95 shadow-lg shadow-[#E85D1A]/20'
                  }`}
                >
                  {addedIds[bloomingBurger.id] ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Adicionado!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Adicionar ao Pedido</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* BLOCO MÉDIO 1: Firehouse Ribs Burger (Col 8-12) */}
          <div className="lg:col-span-5 group rounded-3xl glass-outback border border-[#F5A623]/25 overflow-hidden flex flex-col justify-between hover:border-[#E85D1A]/50 transition-all duration-300 shadow-xl relative">
            <div className="relative w-full h-[230px] overflow-hidden bg-black/60">
              <img
                src={ribsBurger.image}
                alt={ribsBurger.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1512] via-transparent to-transparent" />
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[#F5A623] text-[10px] font-mono uppercase tracking-wider border border-white/10">
                {ribsBurger.badge}
              </div>
              <div className="absolute bottom-3 left-5">
                {renderSpiceTag(ribsBurger.heatLevel, ribsBurger.heatLabel)}
              </div>
            </div>

            <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#F4EFEA] tracking-tight">
                  {ribsBurger.name}
                </h3>
                <p className="text-xs font-mono text-[#E85D1A] mb-2">
                  {ribsBurger.tagline}
                </p>
                <p className="text-xs text-[#A39B95] font-sans leading-relaxed mb-4">
                  {ribsBurger.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F5A623]/15 mt-auto">
                <div>
                  <p className="text-[10px] font-mono text-[#A39B95] uppercase tabular-nums">
                    {ribsBurger.weightGrams}g · {ribsBurger.calories} kcal
                  </p>
                  <p className="text-xl font-mono font-bold text-[#F5A623] tabular-nums">
                    {formatCurrencyBRL(ribsBurger.price)}
                  </p>
                </div>

                <button
                  onClick={() => handleQuickAdd(ribsBurger)}
                  className={`px-4 py-2.5 rounded-xl font-bold font-sans text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    addedIds[ribsBurger.id]
                      ? 'bg-emerald-500 text-black'
                      : 'bg-[#E85D1A] text-[#110D0B] hover:opacity-95'
                  }`}
                >
                  {addedIds[ribsBurger.id] ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>{addedIds[ribsBurger.id] ? 'Adicionado' : 'Adicionar ao Pedido'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* BLOCO MÉDIO 2: Thunder Down Under (Col 8-12) */}
          <div className="lg:col-span-5 group rounded-3xl glass-outback border border-[#F5A623]/25 overflow-hidden flex flex-col justify-between hover:border-[#E85D1A]/50 transition-all duration-300 shadow-xl relative">
            <div className="relative w-full h-[230px] overflow-hidden bg-black/60">
              <img
                src={thunderBurger.image}
                alt={thunderBurger.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1512] via-transparent to-transparent" />
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[#E85D1A] text-[10px] font-mono uppercase tracking-wider border border-white/10 font-bold">
                {thunderBurger.badge}
              </div>
              <div className="absolute bottom-3 left-5">
                {renderSpiceTag(thunderBurger.heatLevel, thunderBurger.heatLabel)}
              </div>
            </div>

            <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#F4EFEA] tracking-tight">
                  {thunderBurger.name}
                </h3>
                <p className="text-xs font-mono text-[#E85D1A] mb-2">
                  {thunderBurger.tagline}
                </p>
                <p className="text-xs text-[#A39B95] font-sans leading-relaxed mb-4">
                  {thunderBurger.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F5A623]/15 mt-auto">
                <div>
                  <p className="text-[10px] font-mono text-[#A39B95] uppercase tabular-nums">
                    {thunderBurger.weightGrams}g · {thunderBurger.calories} kcal
                  </p>
                  <p className="text-xl font-mono font-bold text-[#F5A623] tabular-nums">
                    {formatCurrencyBRL(thunderBurger.price)}
                  </p>
                </div>

                <button
                  onClick={() => handleQuickAdd(thunderBurger)}
                  className={`px-4 py-2.5 rounded-xl font-bold font-sans text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    addedIds[thunderBurger.id]
                      ? 'bg-emerald-500 text-black'
                      : 'bg-[#E85D1A] text-[#110D0B] hover:opacity-95'
                  }`}
                >
                  {addedIds[thunderBurger.id] ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>{addedIds[thunderBurger.id] ? 'Adicionado' : 'Adicionar ao Pedido'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* BLOCO HORIZONTAL: Aussie Cheese Fries (Full Width Col 1-12) */}
          <div className="lg:col-span-12 group rounded-3xl glass-outback border border-[#F5A623]/30 overflow-hidden grid grid-cols-1 md:grid-cols-12 hover:border-[#E85D1A]/50 transition-all duration-300 shadow-2xl relative">
            <div className="md:col-span-6 lg:col-span-5 relative h-[280px] md:h-auto overflow-hidden bg-black/60">
              <img
                src={cheeseFries.image}
                alt={cheeseFries.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1C1512]/70 hidden md:block" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#F5A623] text-[#110D0B] text-xs font-mono font-bold uppercase tracking-wider shadow-md">
                {cheeseFries.badge}
              </div>
            </div>

            <div className="md:col-span-6 lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="text-xs font-mono text-[#F5A623] uppercase tracking-wider">
                    {cheeseFries.subtitle}
                  </span>
                  {renderSpiceTag(cheeseFries.heatLevel, cheeseFries.heatLabel)}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4EFEA] tracking-tight mb-2">
                  {cheeseFries.name}
                </h3>
                <p className="text-xs font-mono text-[#E85D1A] mb-3">
                  {cheeseFries.tagline}
                </p>
                <p className="text-sm text-[#A39B95] font-sans leading-relaxed mb-5">
                  {cheeseFries.description}
                </p>

                <p className="text-xs font-mono text-[#F4EFEA]/80 border-l-2 border-[#F5A623] pl-3 py-0.5 mb-6 leading-relaxed">
                  {cheeseFries.ingredients.join(' · ')}
                </p>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-[#F5A623]/15 mt-auto">
                <div>
                  <p className="text-[10px] font-mono text-[#A39B95] uppercase tabular-nums">
                    {cheeseFries.weightGrams}g · {cheeseFries.calories} kcal
                  </p>
                  <p className="text-2xl font-mono font-bold text-[#F5A623] tabular-nums">
                    {formatCurrencyBRL(cheeseFries.price)}
                  </p>
                </div>

                <button
                  onClick={() => handleQuickAdd(cheeseFries)}
                  className={`px-6 py-3 rounded-xl font-bold font-sans text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                    addedIds[cheeseFries.id]
                      ? 'bg-emerald-500 text-black'
                      : 'bg-gradient-to-r from-[#E85D1A] to-[#F5A623] text-[#110D0B] hover:opacity-95 shadow-lg shadow-[#E85D1A]/20'
                  }`}
                >
                  {addedIds[cheeseFries.id] ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Adicionado!</span>
                    </>
                  ) : (
                    <>
                      <UtensilsCrossed className="w-4 h-4" />
                      <span>Adicionar ao Pedido</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
