/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  BURGER_ANATOMY_LAYERS,
  ScrollytellingLayer,
} from '../data/burgerLayers.ts';
import { computeHeroScrollChoreography } from '../utils/burgerLogic.ts';
import { BurgerLayerGraphic } from './BurgerLayerGraphic.tsx';
import { ArrowUpRight } from 'lucide-react';

interface BurgerScrollytellingProps {
  onGoToBuilder?: () => void;
}

interface OrbitNodeConfig {
  id: string;
  roman: string;
  layerIndex: number;
  title: string;
  subtitle: string;
  position: 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right';
}

const ORBIT_ATTRIBUTE_NODES: OrbitNodeConfig[] = [
  {
    id: 'orbit-wagyu',
    roman: 'I',
    layerIndex: 5,
    title: 'Blend 200g Angus & Wagyu',
    subtitle: 'Grelhado no Fogo Aberto a 400°C',
    position: 'top-left',
  },
  {
    id: 'orbit-brioche',
    roman: 'II',
    layerIndex: 1,
    title: 'Brioche Australiano & Mel',
    subtitle: 'Fermentação Natural 24h · Fubá',
    position: 'bottom-left',
  },
  {
    id: 'orbit-cheddar',
    roman: 'III',
    layerIndex: 4,
    title: 'Cheddar Inglês Duplo',
    subtitle: 'Derretido no Vapor de Lenha',
    position: 'top-right',
  },
  {
    id: 'orbit-bacon',
    roman: 'IV',
    layerIndex: 6,
    title: 'Bacon em Lenha de Macieira',
    subtitle: 'Defumação Lenta Artesanal 8h',
    position: 'bottom-right',
  },
];

export const BurgerScrollytelling: React.FC<BurgerScrollytellingProps> = ({
  onGoToBuilder,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeLayerId, setActiveLayerId] = useState<string>('layer-patty');
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const [hoveredOrbitId, setHoveredOrbitId] = useState<string | null>(null);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const currentScrolled = -rect.top;
      const clamped = Math.min(1, Math.max(0, currentScrolled / totalScrollable));
      setScrollProgress(clamped);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const choreography = computeHeroScrollChoreography(scrollProgress);

  const displayedLayerId = hoveredLayerId || activeLayerId;
  const activeLayer: ScrollytellingLayer =
    BURGER_ANATOMY_LAYERS.find(l => l.id === displayedLayerId) ||
    BURGER_ANATOMY_LAYERS[4];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    setMouseOffset({ x: nx, y: ny });
  };

  // In Stage 1 (0%..20% of page scroll = scrollProgress 0..0.28), keep the facade doorway
  // completely clean and unobstructed. Materialize the burger as the camera crosses into the dining hall
  const burgerEntranceOpacity = Math.min(
    1,
    Math.max(0, (scrollProgress - 0.14) / 0.2)
  );
  const burgerEntranceScale =
    (0.45 + 0.55 * Math.min(1, Math.max(0, (scrollProgress - 0.1) / 0.25))) *
    choreography.burgerScale;

  return (
    <section
      id="anatomia"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[450vh] w-full bg-transparent select-none"
    >
      {/* Semantic H1 for SEO & Accessibility without visually cluttering the camera flythrough */}
      <h1 className="sr-only">OUTLAND FIRE GRILL — Alta Gastronomia na Brasa Viva</h1>

      {/* Sticky Full-Screen Plano-Sequência Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        {/* =====================================================================
            ESTÁGIO 1 (0% a 20% Scroll): A FACHADA PURA & O VÍDEO FPV
            Sem textos bloqueando as portas ou competindo por contraste.
            A câmera em plano-sequência voa livre pela entrada do restaurante.
           ===================================================================== */}

        {/* =====================================================================
            ESTÁGIO 2 (20% a 40% Scroll - Corredor do Salão):
            Tipografia Editorial de Alto Luxo "A Arte da Diferença"
           ===================================================================== */}
        <div
          className="absolute inset-x-0 bottom-[7%] sm:bottom-[8%] flex flex-col items-center justify-center z-20 pointer-events-none px-4"
          style={{
            opacity: choreography.differenceTitleProgress,
            transform: `translate3d(0, ${
              (1 - choreography.differenceTitleProgress) * 80
            }px, 0)`,
          }}
        >
          <div className="flex items-center gap-3 mb-1.5">
            <span className="w-10 sm:w-16 h-[1px] hairline-gold-l" />
            <span className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.38em] uppercase text-[#F5A623] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              II · Travessia pelo Salão
            </span>
            <span className="w-10 sm:w-16 h-[1px] hairline-gold-r" />
          </div>
          <h2 className="text-center flex items-baseline justify-center gap-3 sm:gap-5 select-none">
            <span className="font-luxury italic font-normal text-[8vw] sm:text-[4.5vw] lg:text-[4.2rem] text-molten-gold drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]">
              A Arte da
            </span>
            <span className="font-cinzel font-black text-[9vw] sm:text-[6vw] lg:text-[5.2rem] tracking-[0.18em] uppercase text-engraved-cream">
              Diferença
            </span>
          </h2>
        </div>

        {/* =====================================================================
            ESTÁGIO 3 (40% a 65% Scroll - Grelha de Fogo e Fumaça):
            Assinatura Editorial Superior na Churrasqueira (Sem Pílulas/Caixas)
           ===================================================================== */}
        <div
          className="absolute inset-x-0 top-[11%] flex flex-col items-center justify-center z-20 pointer-events-none"
          style={{
            opacity: Math.max(0, (choreography.layerExplosionProgress - 0.25) / 0.55),
            transform: `translate3d(0, ${
              (1 - Math.min(1, choreography.layerExplosionProgress * 1.3)) * -20
            }px, 0)`,
          }}
        >
          <div className="flex items-center gap-4">
            <span className="w-12 sm:w-20 h-[1px] hairline-gold-l" />
            <span className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.36em] uppercase text-[#F5A623] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              III · Anatomia Desconstruída na Grelha a 400°C
            </span>
            <span className="w-12 sm:w-20 h-[1px] hairline-gold-r" />
          </div>
        </div>

        {/* =====================================================================
            PALCO INTERATIVO CENTRAL (HAMBÚRGUER 3D + SETAS EDITORIAIS ABERTAS)
           ===================================================================== */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-12 flex flex-col justify-center">
          <div className="relative w-full h-[640px] flex items-center justify-center">
            {/* ===============================================================
                4 CHAMADAS ARQUITETÔNICAS ABERTAS (ESTÁGIO 2 - ZERO CAIXAS!)
               =============================================================== */}
            <div
              className={`hidden lg:block absolute inset-0 z-30 transition-transform duration-200 ${
                choreography.orbitNodesOpacity > 0.15
                  ? 'pointer-events-auto'
                  : 'pointer-events-none'
              }`}
              style={{
                opacity: choreography.orbitNodesOpacity,
                transform: `scale(${0.94 + choreography.orbitNodesOpacity * 0.06})`,
              }}
            >
              {ORBIT_ATTRIBUTE_NODES.map(node => {
                const correspondingLayer = BURGER_ANATOMY_LAYERS.find(
                  l => l.index === node.layerIndex
                )!;
                const isNodeActive =
                  displayedLayerId === correspondingLayer.id || hoveredOrbitId === node.id;

                const isLeft = node.position.endsWith('left');

                const posClasses =
                  node.position === 'top-left'
                    ? 'top-[23%] right-[62%]'
                    : node.position === 'bottom-left'
                    ? 'bottom-[27%] right-[62%]'
                    : node.position === 'top-right'
                    ? 'top-[23%] left-[62%]'
                    : 'bottom-[27%] left-[62%]';

                return (
                  <div
                    key={node.id}
                    onMouseEnter={() => {
                      setHoveredOrbitId(node.id);
                      setHoveredLayerId(correspondingLayer.id);
                      setActiveLayerId(correspondingLayer.id);
                    }}
                    onMouseLeave={() => {
                      setHoveredOrbitId(null);
                      setHoveredLayerId(null);
                    }}
                    className={`absolute ${posClasses} cursor-pointer group transition-transform duration-300 min-w-[270px] ${
                      isLeft ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`flex items-baseline gap-2.5 ${
                        isLeft ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span className="font-luxury italic text-xl font-bold text-molten-gold">
                        {node.roman}.
                      </span>
                      <span
                        className={`font-cinzel text-xs sm:text-sm font-bold tracking-[0.16em] uppercase transition-colors drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] ${
                          isNodeActive
                            ? 'text-[#F5A623]'
                            : 'text-[#F4EFEA] group-hover:text-[#F5A623]'
                        }`}
                      >
                        {node.title}
                      </span>
                    </div>

                    <p className="font-luxury italic text-sm text-[#F4EFEA]/85 mt-0.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                      {node.subtitle}
                    </p>

                    {/* Linha Fina Arquitetônica com Diamante na Ponta (Sem Retângulo) */}
                    <div
                      className={`mt-2 flex items-center gap-2 ${
                        isLeft ? 'flex-row' : 'flex-row-reverse'
                      }`}
                    >
                      <div
                        className={`flex-1 h-[1px] transition-all duration-300 ${
                          isLeft ? 'hairline-gold-r' : 'hairline-gold-l'
                        } ${isNodeActive ? 'opacity-100' : 'opacity-65 group-hover:opacity-100'}`}
                      />
                      <span
                        className={`text-[9px] transition-transform duration-300 ${
                          isNodeActive
                            ? 'text-[#E85D1A] scale-125'
                            : 'text-[#F5A623] group-hover:scale-125'
                        }`}
                      >
                        ◆
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===============================================================
                HAMBÚRGUER 3D DE 7 CAMADAS + SETAS DE HOVER ALTERNADAS (SEM CAIXAS)
               =============================================================== */}
            <div
              className="relative w-full max-w-[430px] h-[580px] flex items-center justify-center z-20 transition-opacity duration-200"
              style={{
                opacity: burgerEntranceOpacity,
                transform: `translate3d(${mouseOffset.x * 10}px, ${
                  mouseOffset.y * 8
                }px, 0) rotate(${choreography.burgerRotationDeg}deg) scale(${burgerEntranceScale})`,
              }}
            >
              {/* Halo Quente atrás do Hambúrguer na Grelha */}
              <div
                className="absolute w-[360px] h-[360px] rounded-full blur-[75px] pointer-events-none transition-all duration-300"
                style={{
                  background:
                    'radial-gradient(circle, rgba(245, 166, 35, 0.34) 0%, rgba(232, 93, 26, 0.2) 55%, transparent 78%)',
                }}
              />

              {/* Renderiza as 7 Camadas Reais PNG + Setas de Hover Abertas sobre a Grelha */}
              {BURGER_ANATOMY_LAYERS.map((layer, index) => {
                const currentY =
                  layer.closedY +
                  (layer.explodedY - layer.closedY) * choreography.layerExplosionProgress;

                const layerRot =
                  layer.explodedRotate * choreography.layerExplosionProgress;

                const isSelected = displayedLayerId === layer.id;
                const isAnyHovered = hoveredLayerId !== null;
                const isDimmed =
                  choreography.layerExplosionProgress > 0.25 &&
                  isAnyHovered &&
                  hoveredLayerId !== layer.id;

                const zIndex = isSelected ? 40 : 25 - index;
                const showCalloutArrows = choreography.layerExplosionProgress > 0.38;

                // Alterna esquerda/direita nas camadas pares/ímpares para leitura limpa e orgânica
                const isLeftCallout = index % 2 === 0;

                return (
                  <div
                    key={layer.id}
                    data-testid={`burger-layer-${layer.index}`}
                    onMouseEnter={() => {
                      setHoveredLayerId(layer.id);
                      setActiveLayerId(layer.id);
                    }}
                    onMouseLeave={() => setHoveredLayerId(null)}
                    onClick={() => {
                      setActiveLayerId(layer.id);
                    }}
                    style={{
                      transform: `translate3d(0, ${currentY}px, 0) rotate(${layerRot}deg) scale(${
                        isSelected && choreography.layerExplosionProgress > 0.2 ? 1.08 : 1
                      })`,
                      zIndex,
                      opacity: isDimmed ? 0.38 : 1,
                    }}
                    className="absolute w-full flex items-center justify-center cursor-pointer transition-all duration-200 ease-out group"
                  >
                    {/* SETA DE HOVER EDITORIAL ABERTA (SEM RETÂNGULO DE FUNDO) */}
                    <div
                      className={`hidden sm:flex items-center gap-3 absolute top-1/2 -translate-y-1/2 transition-all duration-300 ${
                        isLeftCallout
                          ? 'right-[92%] lg:right-[95%] flex-row'
                          : 'left-[92%] lg:left-[95%] flex-row-reverse xl:hidden'
                      } ${
                        showCalloutArrows
                          ? 'opacity-100 translate-x-0 pointer-events-auto'
                          : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      {/* Texto Tipográfico Flutuante com Sombra Chiaroscuro para Contraste Perfeito */}
                      <div
                        className={`${
                          isLeftCallout ? 'text-right' : 'text-left'
                        } whitespace-nowrap drop-shadow-[0_4px_14px_rgba(0,0,0,0.98)]`}
                      >
                        <div
                          className={`flex items-baseline gap-2 ${
                            isLeftCallout ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <span
                            className={`font-luxury italic text-base font-bold ${
                              isSelected ? 'text-[#E85D1A]' : 'text-[#F5A623]'
                            }`}
                          >
                            {layer.numberPrefix}.
                          </span>
                          <span
                            className={`font-cinzel text-[11px] lg:text-xs font-bold tracking-[0.18em] uppercase transition-colors ${
                              isSelected
                                ? 'text-[#F5A623]'
                                : 'text-[#F4EFEA] group-hover:text-[#F5A623]'
                            }`}
                          >
                            {layer.title}
                          </span>
                        </div>
                        <p className="font-luxury italic text-xs text-[#F4EFEA]/80 hidden md:block">
                          {layer.subtitle} ·{' '}
                          <span className="text-[#F5A623]">{layer.details.temperature}</span>
                        </p>
                      </div>

                      {/* Linha Fina + Ponta de Seta Apontando para a Camada */}
                      <div
                        className={`flex items-center ${
                          isLeftCallout ? 'flex-row' : 'flex-row-reverse'
                        }`}
                      >
                        <div
                          className={`h-[1px] transition-all duration-300 ${
                            isSelected
                              ? 'w-10 lg:w-16 bg-gradient-to-r from-[#F5A623] to-[#E85D1A]'
                              : 'w-6 lg:w-10 bg-[#F5A623]/55 group-hover:w-12 group-hover:bg-[#F5A623]'
                          }`}
                        />
                        <div
                          className={`w-0 h-0 border-y-[4px] border-y-transparent transition-colors duration-200 ${
                            isLeftCallout
                              ? isSelected
                                ? 'border-l-[7px] border-l-[#E85D1A]'
                                : 'border-l-[6px] border-l-[#F5A623]/80'
                              : isSelected
                              ? 'border-r-[7px] border-r-[#E85D1A]'
                              : 'border-r-[6px] border-r-[#F5A623]/80'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Packshot PNG Transparente da Camada */}
                    <BurgerLayerGraphic
                      layerId={layer.id}
                      pngUrl={layer.pngUrl}
                      altText={`${layer.numberPrefix}. ${layer.title} - ${layer.subtitle}`}
                      isHovered={isSelected && choreography.layerExplosionProgress > 0.2}
                      widthPercent={layer.widthPercent}
                    />
                  </div>
                );
              })}
            </div>

            {/* ===============================================================
                ESTÁGIO 3: ANOTAÇÃO EDITORIAL ABERTA À DIREITA (SEM CAIXA/CARD!)
                Apenas uma linha vertical de latão e tipografia de alta gastronomia
               =============================================================== */}
            <div
              className={`hidden xl:flex flex-col justify-center absolute right-0 top-1/2 -translate-y-1/2 z-40 w-full max-w-[350px] pl-7 border-l border-[#F5A623]/45 transition-all duration-300 ${
                choreography.layerExplosionProgress > 0.4
                  ? 'opacity-100 translate-x-0 pointer-events-auto'
                  : 'opacity-0 translate-x-8 pointer-events-none'
              }`}
              style={{
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.95)',
              }}
            >
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-luxury italic text-5xl font-black text-molten-gold">
                  {activeLayer.numberPrefix}
                </span>
                <span className="font-cinzel text-[10px] font-bold tracking-[0.28em] text-[#F5A623] uppercase">
                  / 07 · {activeLayer.badge}
                </span>
              </div>

              <h3 className="font-cinzel text-2xl font-black tracking-[0.14em] text-[#F4EFEA] uppercase leading-tight">
                {activeLayer.title}
              </h3>
              <p className="font-luxury italic text-lg text-[#F5A623] mt-0.5 mb-4">
                {activeLayer.subtitle}
              </p>

              <p className="font-sans text-xs text-[#F4EFEA]/90 leading-relaxed mb-5">
                {activeLayer.quote}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#F5A623]/25 mb-6">
                <div>
                  <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#A39B95] block uppercase">
                    Origem
                  </span>
                  <span className="font-luxury italic text-base text-[#F4EFEA]">
                    {activeLayer.details.origin}
                  </span>
                </div>
                <div>
                  <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#A39B95] block uppercase">
                    Temperatura
                  </span>
                  <span className="font-luxury italic text-base text-[#F5A623] font-bold">
                    {activeLayer.details.temperature}
                  </span>
                </div>
              </div>

              <a
                href="#monte-no-fogo"
                onClick={e => {
                  if (onGoToBuilder) {
                    e.preventDefault();
                    onGoToBuilder();
                  }
                }}
                className="group inline-flex items-center gap-3 py-1 font-cinzel text-[11px] font-bold tracking-[0.26em] uppercase text-[#F5A623] hover:text-[#E85D1A] transition-colors"
              >
                <span>Montar na Tábua do Chef</span>
                <span className="w-8 h-[1px] bg-[#F5A623] group-hover:w-12 group-hover:bg-[#E85D1A] transition-all" />
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
