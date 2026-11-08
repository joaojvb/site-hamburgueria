import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SunburstIcon, DiamondBadge } from './PosterOrnaments.tsx';
import { ArrowDown, ChefHat } from 'lucide-react';

export const PosterHero: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Smooth fade-out of the hero poster typography as user scrolls into the exploded burger
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12, 0.22], [1, 0.95, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.97]);

  return (
    <section
      id="topo"
      className="relative min-h-[92vh] flex flex-col justify-center items-center pt-24 pb-12 px-4 sm:px-8 overflow-hidden pointer-events-none select-none z-20"
      aria-label="Apresentação Outland Fire Grill"
    >
      {/* Focused Chiaroscuro Scrim Backdrop behind the title for razor-sharp contrast */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(13,8,20,0.88) 0%, rgba(13,8,20,0.55) 55%, transparent 100%)',
        }}
      />

      <motion.div
        style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
        className="w-full max-w-[1280px] mx-auto flex flex-col items-center text-center pointer-events-auto"
      >
        {/* Subtle, Minimalist Tagline */}
        <div className="inline-flex items-center gap-3 mb-4 text-[11px] font-mono tracking-[0.32em] text-[#E0A95F] uppercase">
          <SunburstIcon size={14} spin={true} />
          <span>ALTA GASTRONOMIA EM FOGO SELVAGEM</span>
          <SunburstIcon size={14} spin={true} />
        </div>

        {/* ===================================================================
            MONUMENTAL POSTER TITLE: "ONDE A BRASA ENCONTRA O PÃO"
            Pure high-contrast minimalism inspired by Reference 2:
            - Ultra-condensed League Gothic in Lavender Violet (#8E6FD1)
            - Wide heavy Archivo in Lilac Cream (#EDE3F7)
            - Golden Sunburst & Diamond Badges
           =================================================================== */}
        <div className="py-2 sm:py-4">
          {/* Linha 1: ONDE [✦] A BRASA [◆20] */}
          <div className="flex flex-wrap items-baseline justify-center gap-x-4 sm:gap-x-6 gap-y-1 leading-none">
            <span className="font-grotesk font-black text-3xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.14em] uppercase text-[#EDE3F7] drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)]">
              ONDE
            </span>

            <div className="inline-flex items-center mx-1 sm:mx-2 text-[#E0A95F] drop-shadow-[0_0_24px_rgba(224,169,95,0.8)]">
              <SunburstIcon
                size={54}
                className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16"
              />
            </div>

            <h1 className="font-poster text-[20vw] sm:text-[17vw] lg:text-[14vw] tracking-[0.02em] uppercase text-[#8E6FD1] drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)] m-0 p-0 leading-[0.82] select-text">
              A BRASA
            </h1>

            <DiamondBadge text="20" className="hidden sm:inline-flex mb-4" />
          </div>

          {/* Linha 2: [◆26] ENCONTRA O PÃO */}
          <div className="flex flex-wrap items-baseline justify-center gap-x-4 sm:gap-x-6 gap-y-1 leading-none mt-1 sm:mt-2">
            <DiamondBadge text="26" className="hidden sm:inline-flex mb-4" />

            <span className="font-poster text-[20vw] sm:text-[17vw] lg:text-[14vw] tracking-[0.02em] uppercase text-[#8E6FD1] drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)] m-0 p-0 leading-[0.82] select-text">
              ENCONTRA
            </span>

            <span className="font-grotesk font-black text-3xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.14em] uppercase text-[#EDE3F7] drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)]">
              O PÃO
            </span>
          </div>
        </div>

        {/* Minimal Subtitle Strip */}
        <p className="max-w-xl font-mono text-xs sm:text-sm text-[#EDE3F7]/85 tracking-[0.2em] uppercase mt-3 mb-8">
          Blend Wagyu & Angus 200g · Lenha de Macieira · Fermentação 24h
        </p>

        {/* Clean, Tactile Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#anatomia"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#8E6FD1] hover:bg-[#FF4FA3] text-[#0D0814] hover:text-white font-grotesk font-black text-xs sm:text-sm uppercase tracking-[0.18em] shadow-[4px_4px_0px_#EDE3F7] hover:shadow-[2px_2px_0px_#EDE3F7] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
          >
            <ArrowDown className="w-4 h-4" />
            <span>EXPLORAR AS 8 CAMADAS</span>
          </a>

          <a
            href="#monte-no-fogo"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#160F22]/90 hover:bg-[#8E6FD1] text-[#EDE3F7] hover:text-[#0D0814] border-2 border-[#8E6FD1] font-grotesk font-bold text-xs sm:text-sm uppercase tracking-[0.18em] shadow-[4px_4px_0px_#E0A95F] hover:shadow-[2px_2px_0px_#E0A95F] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
          >
            <ChefHat className="w-4 h-4 text-[#E0A95F]" />
            <span>MONTAR NA TÁBUA</span>
          </a>
        </div>

        {/* Minimal Scroll Indicator */}
        <div className="mt-8 flex items-center gap-2 font-mono text-[11px] text-[#A797BD] uppercase tracking-[0.24em]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E0A95F] animate-ping" />
          <span>ROLE PARA DESCER</span>
          <span className="text-[#E0A95F]">↓</span>
        </div>
      </motion.div>
    </section>
  );
};
