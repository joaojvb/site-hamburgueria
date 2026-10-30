/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { HERO_ASSEMBLED_BURGER_IMAGE } from '../data/burgerLayers.ts';

export const Footer: React.FC = () => {
  return (
    <footer
      id="sobre"
      className="relative bg-[#070504]/90 backdrop-blur-md text-[#F4EFEA] pt-24 pb-12 px-6 sm:px-12 overflow-hidden"
    >
      {/* Top Center-Fading Brass Hairline */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="h-[1px] w-full hairline-gold-center" />
      </div>

      {/* Subtle Fire Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-[#E85D1A]/8 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Unboxed Chiaroscuro Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-24">
          <div className="lg:col-span-6 relative h-[320px] sm:h-[400px] overflow-hidden clip-chamfer">
            <img
              src={HERO_ASSEMBLED_BURGER_IMAGE}
              alt="Outland Fire Grill — Levitação na Brasa Viva"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070504] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#070504]/85 hidden lg:block" />
            <div className="absolute bottom-4 left-5 border-l-2 border-[#F5A623] pl-3 py-0.5 text-[10px] font-mono uppercase tracking-[0.28em] text-[#F5A623] bg-black/60 backdrop-blur-sm pr-3">
              PACKSHOT OFICIAL · CHIAROSCURO 8K
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[1px] w-8 hairline-gold-r" />
              <span className="text-[11px] font-mono text-[#E85D1A] uppercase tracking-[0.3em]">
                FILOSOFIA OUTLAND FIRE
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-cinzel font-black text-[#F4EFEA] tracking-wide leading-tight mb-5">
              ONDE O FOGO ENCONTRA A{' '}
              <span className="font-editorial-serif italic font-normal text-molten-gold">
                Alta Gastronomia
              </span>
            </h3>
            <p className="text-sm text-[#D5CCC4]/80 font-sans leading-relaxed mb-8 border-l border-[#F5A623]/30 pl-4">
              Cada hambúrguer do Outland Fire Grill nasce sobre grelhas de ferro fundido a 400°C alimentadas por lenha de macieira. A iluminação dramática em chiaroscuro do nosso salão destaca o que realmente importa: a crosta caramelizada do Wagyu, o brilho do brioche australiano com mel e o cheddar inglês derretendo em câmera lenta.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#F5A623]/20 font-mono">
              <div className="border-l border-[#F5A623]/30 pl-3">
                <p className="text-2xl font-editorial-serif italic font-black text-molten-gold tabular-nums">
                  400°C
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#A39B95] mt-0.5">
                  Brasa Viva
                </p>
              </div>
              <div className="border-l border-[#E85D1A]/40 pl-3">
                <p className="text-2xl font-editorial-serif italic font-black text-[#E85D1A] tabular-nums">
                  200g
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#A39B95] mt-0.5">
                  Blend Wagyu
                </p>
              </div>
              <div className="border-l border-white/20 pl-3">
                <p className="text-2xl font-editorial-serif italic font-black text-[#F4EFEA] tabular-nums">
                  24h
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#A39B95] mt-0.5">
                  Fermentação
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Open Architectural Pillars (No Boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-16 border-b border-[#F5A623]/20">
          <div className="border-l border-[#E85D1A]/45 pl-6">
            <div className="flex items-center gap-2.5 text-[#E85D1A] mb-3">
              <Flame className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-[0.28em]">PILAR I</span>
            </div>
            <h4 className="font-cinzel font-bold text-lg text-[#F4EFEA] tracking-wide mb-2">
              Brasa Viva a 400°C
            </h4>
            <p className="text-xs text-[#A39B95] leading-relaxed font-sans">
              Sem chapas elétricas. Utilizamos lenha nobre de macieira e carvão vegetal sustentável para criar a crosta Maillard perfeita e o autêntico aroma defumado.
            </p>
          </div>

          <div className="border-l border-[#F5A623]/45 pl-6">
            <div className="flex items-center gap-2.5 text-[#F5A623] mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-[0.28em]">PILAR II</span>
            </div>
            <h4 className="font-cinzel font-bold text-lg text-[#F4EFEA] tracking-wide mb-2">
              Blends Angus & Wagyu
            </h4>
            <p className="text-xs text-[#A39B95] leading-relaxed font-sans">
              Carnes com certificado de marmoreio nobre, moídas diariamente no próprio açougue da casa. Nunca congeladas, temperadas apenas com sal de rocha e fumaça.
            </p>
          </div>

          <div className="border-l border-[#E85D1A]/45 pl-6">
            <div className="flex items-center gap-2.5 text-[#E85D1A] mb-3">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-[0.28em]">PILAR III</span>
            </div>
            <h4 className="font-cinzel font-bold text-lg text-[#F4EFEA] tracking-wide mb-2">
              Pão Australiano Fresco
            </h4>
            <p className="text-xs text-[#A39B95] leading-relaxed font-sans">
              Fermentação lenta de 24 horas, massa enriquecida com cacau 100% puro e mel silvestre de flor de eucalipto, finalizada com fina chuva de fubá artesanal.
            </p>
          </div>
        </div>

        {/* Footer Brand & Practical Information */}
        <div className="pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-5 h-5 text-[#E85D1A] fill-[#E85D1A]" />
              <span className="font-cinzel font-black text-xl tracking-[0.2em] text-[#F4EFEA]">
                OUTLAND{' '}
                <span className="font-editorial-serif italic font-normal text-molten-gold tracking-normal">
                  Fire Grill
                </span>
              </span>
            </div>
            <p className="text-xs font-mono text-[#A39B95] tracking-wider">
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

        {/* Quiet Colophon */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#A39B95]/60 gap-4">
          <p>© {new Date().getFullYear()} OUTLAND FIRE GRILL. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#anatomia" className="hover:text-[#F4EFEA] transition-colors">
              Voltar ao Topo
            </a>
            <span className="text-[#F5A623]/40">◆</span>
            <a href="#monte-no-fogo" className="hover:text-[#F4EFEA] transition-colors">
              Bancada do Chef
            </a>
            <span className="text-[#F5A623]/40">◆</span>
            <a href="#cardapio" className="hover:text-[#F4EFEA] transition-colors">
              Clássicos da Brasa
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
