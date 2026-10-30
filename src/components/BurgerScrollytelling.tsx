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
import { ArrowUpRight, Flame } from 'lucide-react';

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

  // Materialize the burger as the camera enters the restaurant
  const burgerEntranceOpacity = Math.min(
    1,
    Math.max(0, (scrollProgress - 0.14) / 0.2)
  );
  const burgerEntranceScale =
    (0.45 + 0.55 * Math.min(1, Math.max(0, (scrollProgress - 0.1) / 0.25))) *
    choreography.burgerScale;

  // Real-time calculation of active layer Y in the SVG viewBox (0..640) for the dotted technical line
  const activeLayerYOffset =
    activeLayer.closedY +
    (activeLayer.explodedY - activeLayer.closedY) * choreography.layerExplosionProgress;
  const svgStartY = Math.max(90, Math.min(550, 320 + activeLayerYOffset * 0.82));

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
            Assinatura Editorial Superior na Churrasqueira
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
            PALCO INTERATIVO CENTRAL (HAMBÚRGUER 3D + LINHA PONTILHADA + CARD)
           ===================================================================== */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-12 flex flex-col justify-center">
          <div className="relative w-full h-[640px] flex items-center justify-center">
            {/* ===============================================================
                CHAMADAS ORBITAIS DO ESTÁGIO 2 (SALÃO)
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
                HAMBÚRGUER CENTRAL COM ANIMAÇÃO 3D REAL (VÍDEO / MALHA 3D / CSS)
               =============================================================== */}
            <div
              className="relative w-full max-w-[440px] h-[580px] flex items-center justify-center z-20 transition-opacity duration-200"
              style={{
                opacity: burgerEntranceOpacity,
                transform: `translate3d(${mouseOffset.x * 10}px, ${
                  mouseOffset.y * 8
                }px, 0) rotate(${choreography.burgerRotationDeg}deg) scale(${burgerEntranceScale})`,
              }}
            >
              {/* Halo Quente de Brasa atrás do Hambúrguer */}
              <div
                className="absolute w-[360px] h-[360px] rounded-full blur-[75px] pointer-events-none transition-all duration-300"
                style={{
                  background:
                    'radial-gradient(circle, rgba(245, 166, 35, 0.34) 0%, rgba(232, 93, 26, 0.2) 55%, transparent 78%)',
                }}
              />

              {/* Renderiza as 7 Camadas 3D Animadas */}
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
                        isSelected && choreography.layerExplosionProgress > 0.2 ? 1.15 : 1
                      })`,
                      zIndex,
                    }}
                    className="absolute w-full flex items-center justify-center cursor-pointer transition-all duration-300 ease-out group"
                  >
                    {/* ETIQUETAS 01 A 07 NA ESQUERDA (AO LADO DE CADA CAMADA) */}
                    <div
                      onClick={e => {
                        e.stopPropagation();
                        setActiveLayerId(layer.id);
                      }}
                      onMouseEnter={() => {
                        setHoveredLayerId(layer.id);
                        setActiveLayerId(layer.id);
                      }}
                      onMouseLeave={() => setHoveredLayerId(null)}
                      className={`hidden sm:flex items-center gap-2.5 absolute -left-12 lg:-left-24 top-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer z-30 ${
                        choreography.layerExplosionProgress > 0.35
                          ? 'opacity-100 translate-x-0 pointer-events-auto'
                          : 'opacity-0 translate-x-4 pointer-events-none'
                      }`}
                    >
                      <span
                        className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-bold tracking-wider border transition-all ${
                          isSelected
                            ? 'bg-[#E85D1A] text-[#110D0B] border-[#F5A623] shadow-lg shadow-[#E85D1A]/50 scale-110'
                            : 'bg-[#0A0706]/90 text-[#A39B95] border-white/20 hover:border-[#F5A623] hover:text-[#F4EFEA]'
                        }`}
                      >
                        {layer.numberPrefix}
                      </span>
                      <span
                        className={`hidden md:inline font-cinzel text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                          isSelected
                            ? 'text-[#F5A623] drop-shadow-[0_2px_10px_rgba(245,166,35,0.8)]'
                            : 'text-[#F4EFEA]/75 group-hover:text-[#F4EFEA]'
                        }`}
                      >
                        {layer.title}
                      </span>
                    </div>

                    {/* COMPONENTE 3D DA CAMADA: SUPORTE A VÍDEO LOOP / 3D GLB / PERSPECTIVA REAL */}
                    <BurgerLayerGraphic
                      layerId={layer.id}
                      pngUrl={layer.pngUrl}
                      videoUrl={layer.videoUrl}
                      videoSlice={layer.videoSlice}
                      particleEffect={layer.particleEffect}
                      glbUrl={layer.glbUrl}
                      altText={`${layer.numberPrefix}. ${layer.title} - ${layer.subtitle}`}
                      isHovered={isSelected && choreography.layerExplosionProgress > 0.2}
                      isDimmed={isDimmed}
                      widthPercent={layer.widthPercent}
                      enable3DRotation={true}
                    />
                  </div>
                );
              })}
            </div>

            {/* ===============================================================
                LINHA PONTILHADA LARANJA DA DIREITA (APONTA EM TEMPO REAL)
               =============================================================== */}
            <div
              className={`hidden xl:block absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 ${
                choreography.layerExplosionProgress > 0.4 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <svg className="w-full h-full" viewBox="0 0 1440 640" fill="none">
                <defs>
                  <marker
                    id="outland-arrowhead"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M0,0 L8,4 L0,8 Z" fill="#E85D1A" />
                  </marker>
                </defs>

                {/* Ponto inicial sobre a camada ativa */}
                <circle
                  cx="835"
                  cy={svgStartY}
                  r="4.5"
                  fill="#F5A623"
                  stroke="#110D0B"
                  strokeWidth="2"
                />

                {/* Trajeto pontilhado laranja conectando até o Card detalhado da direita */}
                <path
                  d={`M 840 ${svgStartY} L 930 ${svgStartY} L 970 320 L 1030 320`}
                  stroke="#E85D1A"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  markerEnd="url(#outland-arrowhead)"
                />
              </svg>
            </div>

            {/* ===============================================================
                CARD DETALHADO NA DIREITA (ATUALIZAÇÃO EM TEMPO REAL)
               =============================================================== */}
            <div
              className={`hidden xl:flex flex-col justify-between absolute right-0 top-1/2 -translate-y-1/2 z-40 w-full max-w-[370px] bg-[#0E0907]/90 backdrop-blur-xl border border-[#F5A623]/35 p-6 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.92)] transition-all duration-300 ${
                choreography.layerExplosionProgress > 0.4
                  ? 'opacity-100 translate-x-0 pointer-events-auto'
                  : 'opacity-0 translate-x-8 pointer-events-none'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="font-cinzel text-[10px] font-bold tracking-[0.28em] text-[#E85D1A] uppercase">
                  CAMADA {activeLayer.numberPrefix} / 07 · {activeLayer.badge}
                </span>
                <Flame className="w-4 h-4 text-[#F5A623]" />
              </div>

              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-14 h-12 rounded-xl bg-black/60 border border-[#F5A623]/25 p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={activeLayer.pngUrl}
                    alt={activeLayer.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-cinzel text-xl font-black text-[#F4EFEA] leading-tight uppercase">
                    {activeLayer.title}
                  </h3>
                  <p className="font-luxury italic text-sm text-[#F5A623]">
                    {activeLayer.subtitle}
                  </p>
                </div>
              </div>

              <p className="font-sans text-xs text-[#F4EFEA]/85 leading-relaxed mb-4 bg-black/45 p-3 rounded-lg border border-white/5">
                {activeLayer.description}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F5A623]/20 mb-5 font-mono text-xs">
                <div>
                  <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#A39B95] block uppercase">
                    Origem
                  </span>
                  <span className="text-xs text-[#F4EFEA]">
                    {activeLayer.details.origin}
                  </span>
                </div>
                <div>
                  <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#A39B95] block uppercase">
                    Temperatura
                  </span>
                  <span className="text-xs text-[#F5A623] font-bold">
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
                className="group inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[#E85D1A] to-[#F5A623] text-[#110D0B] font-cinzel text-[10px] font-black tracking-[0.22em] uppercase rounded-lg hover:brightness-110 transition-all cursor-pointer"
              >
                <span>Montar na Tábua do Chef</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
