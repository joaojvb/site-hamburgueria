import React from 'react';
import { Flame, MapPin, Clock, Instagram } from 'lucide-react';
import { HERO_ASSEMBLED_BURGER_IMAGE } from '../data/burgerLayers.ts';
import { SunburstIcon, DiamondBadge, StickerTag } from './PosterOrnaments.tsx';

export const Footer: React.FC = () => {
  return (
    <footer
      id="sobre"
      className="relative bg-[#0A0610] text-[#EDE3F7] pt-24 pb-12 px-4 sm:px-10 overflow-hidden border-t-2 border-[#8E6FD1]/40"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none film-grain opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#8E6FD1]/10 blur-[150px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        {/* ===================================================================
            SHOWCASE: PHILOSOPHY & PACKSHOT
           =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-20 pb-16 border-b border-[#8E6FD1]/25">
          {/* Tilted Sticker Packshot */}
          <div className="lg:col-span-5 relative">
            <div className="relative border-2 border-[#EDE3F7] shadow-[8px_8px_0px_#8E6FD1] -rotate-1 hover:rotate-0 transition-transform duration-500 overflow-hidden">
              <img
                src={HERO_ASSEMBLED_BURGER_IMAGE}
                alt="Outland Fire Grill — Levitação na Brasa Viva"
                className="w-full h-[320px] sm:h-[400px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <StickerTag variant="pink">
                  <span>PACKSHOT 8K</span>
                </StickerTag>
              </div>
            </div>
          </div>

          {/* Philosophy Statement */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <StickerTag variant="gold">
                <SunburstIcon size={12} spin={true} />
                <span>FILOSOFIA DO FOGO</span>
              </StickerTag>
              <DiamondBadge text="26" />
            </div>

            <h3 className="font-poster text-4xl sm:text-6xl lg:text-7xl tracking-[0.04em] uppercase text-[#8E6FD1] leading-[0.88] m-0">
              ONDE O FOGO ENCONTRA{' '}
              <span className="font-grotesk text-3xl sm:text-5xl text-[#EDE3F7] block mt-1">
                A ALTA GASTRONOMIA
              </span>
            </h3>

            <p className="font-grotesk text-sm sm:text-base text-[#EDE3F7]/85 leading-relaxed border-l-2 border-[#E0A95F] pl-4">
              Cada hambúrguer do Outland Fire Grill nasce sobre grelhas de ferro fundido a 400°C alimentadas por lenha nobre de macieira. O resultado é a crosta Maillard perfeita, a untuosidade do blend Wagyu & Angus e o brioche australiano com fermentação natural de 24 horas.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#8E6FD1]/25">
              <div>
                <span className="font-poster text-3xl sm:text-4xl text-[#E0A95F] block">
                  400°C
                </span>
                <span className="font-mono text-[10px] text-[#A797BD] uppercase tracking-wider">
                  BRASA VIVA
                </span>
              </div>
              <div className="border-l border-[#8E6FD1]/25 pl-4">
                <span className="font-poster text-3xl sm:text-4xl text-[#FF4FA3] block">
                  200g
                </span>
                <span className="font-mono text-[10px] text-[#A797BD] uppercase tracking-wider">
                  BLEND WAGYU
                </span>
              </div>
              <div className="border-l border-[#8E6FD1]/25 pl-4">
                <span className="font-poster text-3xl sm:text-4xl text-[#EDE3F7] block">
                  24h
                </span>
                <span className="font-mono text-[10px] text-[#A797BD] uppercase tracking-wider">
                  FERMENTAÇÃO
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            THREE PILLARS (POSTER STYLE)
           =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 pb-16 border-b border-[#8E6FD1]/25">
          {[
            {
              num: '01',
              title: 'BRASA VIVA A 400°C',
              desc: 'Sem chapas elétricas. Fogo aberto alimentado por lenha de macieira e carvão vegetal para gerar crosta e aroma incomparáveis.',
              tag: 'FOGO ABERTO',
            },
            {
              num: '02',
              title: 'BLEND NOBRE ANGUS & WAGYU',
              desc: 'Cortes nobres moídos diariamente no ponto perfeito, preservando suculência, maciez e equilíbrio lipídico.',
              tag: 'CARNE FRESCA',
            },
            {
              num: '03',
              title: 'BRIOCHE AUSTRALIANO 24H',
              desc: 'Fermentação lenta e natural com toque de mel silvestre e cacau, tostado na chapa na hora exata do serviço.',
              tag: 'FERMENTAÇÃO LENTA',
            },
          ].map(p => (
            <div
              key={p.num}
              className="p-6 bg-[#160F22] border-2 border-[#8E6FD1]/40 shadow-[4px_4px_0px_#8E6FD1]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-poster text-2xl text-[#0D0814] bg-[#E0A95F] px-2 py-0.5 shadow-[2px_2px_0px_#0D0814]">
                  {p.num}
                </span>
                <StickerTag variant="dark" className="text-[10px]">
                  {p.tag}
                </StickerTag>
              </div>

              <h4 className="font-poster text-2xl text-[#EDE3F7] tracking-[0.04em] uppercase mb-2">
                {p.title}
              </h4>

              <p className="font-grotesk text-xs text-[#EDE3F7]/80 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ===================================================================
            GIANT POSTER WORDMARK
           =================================================================== */}
        <div className="mb-16 text-center select-none">
          <div className="flex items-center justify-center gap-4 text-[#E0A95F] mb-2">
            <SunburstIcon size={24} spin={true} />
            <span className="font-mono text-xs uppercase tracking-[0.3em]">
              EXPERIÊNCIA GASTRONÔMICA AUTÊNTICA
            </span>
            <SunburstIcon size={24} spin={true} />
          </div>

          <h2 className="font-poster text-[16vw] leading-[0.8] tracking-[0.02em] uppercase text-[#8E6FD1] drop-shadow-[0_10px_30px_rgba(142,111,209,0.3)] m-0">
            OUTLAND FIRE
          </h2>
        </div>

        {/* Bottom Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#8E6FD1]/30 font-mono text-xs text-[#A797BD]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FF5B1F]" />
            <span>OUTLAND FIRE GRILL © {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E0A95F]" />
              <span>Av. dos Estados, 1420 · Jardins</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF4FA3]" />
              <span>Ter a Dom: 18h às 23h45</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
