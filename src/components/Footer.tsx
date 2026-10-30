/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, MapPin, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { HERO_ASSEMBLED_BURGER_IMAGE } from '../data/burgerLayers.ts';

export const Footer: React.FC = () => {
  return (
    <footer id="sobre" className="relative bg-[#0D0A08] border-t border-[#F5A623]/20 text-[#F4EFEA] pt-24 pb-12 px-6 sm:px-12 overflow-hidden">
      {/* Subtle Fire Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-[#E85D1A]/8 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Showcase Banner featuring the 8th Levitating Burger Studio Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl glass-outback border border-[#F5A623]/25 overflow-hidden mb-16 shadow-2xl">
          <div className="lg:col-span-6 relative h-[320px] sm:h-[380px] bg-black overflow-hidden">
            <img
              src={HERO_ASSEMBLED_BURGER_IMAGE}
              alt="Outland Fire Grill — Levitação na Brasa Viva"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1C1512]/90 hidden lg:block" />
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-md bg-black/75 backdrop-blur-md border border-[#F5A623]/30 text-[11px] font-mono text-[#F5A623]">
              PACKSHOT OFICIAL · CHIAROSCURO 8K
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#E85D1A] uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Filosofia Outback Luxury</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif font-black text-[#F4EFEA] tracking-tight mb-4">
              ONDE O FOGO ENCONTRA A ALTA GASTRONOMIA
            </h3>
            <p className="text-sm text-[#A39B95] font-sans leading-relaxed mb-6">
              Cada hambúrguer do Outland Fire Grill nasce sobre grelhas de ferro fundido a 400°C alimentadas por lenha de macieira. A iluminação dramática em chiaroscuro do nosso salão destaca o que realmente importa: a crosta caramelizada do Wagyu, o brilho do brioche australiano com mel e o cheddar inglês derretendo em câmera lenta.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 font-mono">
              <div>
                <p className="text-xl font-bold text-[#F5A623] tabular-nums">400°C</p>
                <p className="text-[11px] text-[#A39B95]">Brasa Viva</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#E85D1A] tabular-nums">200g</p>
                <p className="text-[11px] text-[#A39B95]">Blend Wagyu</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#F4EFEA] tabular-nums">24h</p>
                <p className="text-[11px] text-[#A39B95]">Fermentação</p>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-white/10">
          <div className="p-6 rounded-3xl glass-outback border border-[#F5A623]/15">
            <div className="w-10 h-10 rounded-full bg-[#E85D1A]/20 border border-[#E85D1A]/40 text-[#E85D1A] flex items-center justify-center mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#F4EFEA] mb-2">
              Brasa Viva a 400°C
            </h4>
            <p className="text-xs text-[#A39B95] leading-relaxed">
              Sem chapas elétricas. Utilizamos lenha nobre de macieira e carvão vegetal sustentável para criar a crosta Maillard perfeita e o autêntico aroma defumado Outback.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-outback border border-[#F5A623]/15">
            <div className="w-10 h-10 rounded-full bg-[#F5A623]/20 border border-[#F5A623]/40 text-[#F5A623] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#F4EFEA] mb-2">
              Blends Angus & Wagyu
            </h4>
            <p className="text-xs text-[#A39B95] leading-relaxed">
              Carnes com certificado de marmoreio nobre, moídas diariamente no próprio açougue da casa. Nunca congeladas, temperadas apenas com sal de rocha e fumaça.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-outback border border-[#F5A623]/15">
            <div className="w-10 h-10 rounded-full bg-[#E85D1A]/20 border border-[#E85D1A]/40 text-[#E85D1A] flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#F4EFEA] mb-2">
              Pão Australiano Fresco
            </h4>
            <p className="text-xs text-[#A39B95] leading-relaxed">
              Fermentação lenta de 24 horas, massa enriquecida com cacau 100% puro e mel silvestre de flor de eucalipto, finalizada com fina chuva de fubá artesanal.
            </p>
          </div>
        </div>

        {/* Footer Brand & Practical Information */}
        <div className="pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E85D1A] text-[#110D0B]">
                <Flame className="w-3.5 h-3.5 fill-current" />
              </span>
              <span className="font-serif font-black text-xl tracking-wider text-[#F4EFEA]">
                OUTLAND FIRE GRILL
              </span>
            </div>
            <p className="text-xs font-mono text-[#A39B95]">
              Hambúrgueres de Luxo na Brasa Aberta · Low-Key Chiaroscuro Experience
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-xs font-mono text-[#A39B95]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E85D1A]" />
              <span>Alameda dos Eucaliptos, 1890 · Jardim Paulista</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F5A623]" />
              <span>Terça a Domingo: 18h às 23h30</span>
            </div>
          </div>
        </div>

        {/* Quiet Copyright without slop */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#A39B95]/60 gap-4">
          <p>© {new Date().getFullYear()} OUTLAND FIRE GRILL. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#anatomia" className="hover:text-[#F4EFEA] transition-colors">Voltar ao Topo</a>
            <span>·</span>
            <a href="#monte-no-fogo" className="hover:text-[#F4EFEA] transition-colors">Monte no Fogo</a>
            <span>·</span>
            <a href="#cardapio" className="hover:text-[#F4EFEA] transition-colors">Cardápio Bento</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
