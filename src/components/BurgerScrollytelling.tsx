/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  BURGER_ANATOMY_LAYERS,
  ScrollytellingLayer,
  HERO_ASSEMBLED_BURGER_IMAGE,
} from '../data/burgerLayers.ts';
import { computeHeroScrollChoreography } from '../utils/burgerLogic.ts';
import { BurgerLayerGraphic } from './BurgerLayerGraphic.tsx';
import {
  Flame,
  Sparkles,
  ArrowUpRight,
  Eye,
  X,
  Wheat,
  Leaf,
  Zap,
} from 'lucide-react';

interface BurgerScrollytellingProps {
  onGoToBuilder?: () => void;
}

interface OrbitNodeConfig {
  id: string;
  layerIndex: number;
  title: string;
  subtitle: string;
  position: 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right';
  icon: 'flame' | 'wheat' | 'leaf' | 'zap';
}

const ORBIT_ATTRIBUTE_NODES: OrbitNodeConfig[] = [
  {
    id: 'orbit-wagyu',
    layerIndex: 5,
    title: 'Blend 200g Angus & Wagyu',
    subtitle: 'Grelhado no Fogo Aberto a 400°C',
    position: 'top-left',
    icon: 'flame',
  },
  {
    id: 'orbit-brioche',
    layerIndex: 1,
    title: 'Brioche Australiano & Mel',
    subtitle: 'Fermentação Natural 24h · Fubá',
    position: 'bottom-left',
    icon: 'wheat',
  },
  {
    id: 'orbit-cheddar',
    layerIndex: 4,
    title: 'Cheddar Inglês Duplo',
    subtitle: 'Derretido no Vapor de Lenha',
    position: 'top-right',
    icon: 'zap',
  },
  {
    id: 'orbit-bacon',
    layerIndex: 6,
    title: 'Bacon em Lenha de Macieira',
    subtitle: 'Defumação Lenta Artesanal 8h',
    position: 'bottom-right',
    icon: 'leaf',
  },
];

// Kinetic letters for Act 1 ('SINTA A BRASA') that tilt and fly off on scroll like 'Taste The Sky'
const SKY_TITLE_WORDS = [
  {
    word: 'SINTA',
    letters: [
      { char: 'S', tx: -220, ty: -380, rot: -28 },
      { char: 'I', tx: -140, ty: -420, rot: -16 },
      { char: 'N', tx: -60, ty: -460, rot: -8 },
      { char: 'T', tx: 20, ty: -440, rot: 12 },
      { char: 'A', tx: 90, ty: -390, rot: 22 },
    ],
  },
  {
    word: 'A',
    letters: [{ char: 'A', tx: 40, ty: -510, rot: -18 }],
  },
  {
    word: 'BRASA',
    letters: [
      { char: 'B', tx: 110, ty: -360, rot: 14 },
      { char: 'R', tx: 180, ty: -410, rot: 24 },
      { char: 'A', tx: 240, ty: -340, rot: 19 },
      { char: 'S', tx: 310, ty: -380, rot: 29 },
      { char: 'A', tx: 380, ty: -310, rot: 35 },
    ],
  },
];

export const BurgerScrollytelling: React.FC<BurgerScrollytellingProps> = ({
  onGoToBuilder,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [manualOverride, setManualOverride] = useState<number | null>(null);
  const [activeLayerId, setActiveLayerId] = useState<string>('layer-patty');
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const [hoveredOrbitId, setHoveredOrbitId] = useState<string | null>(null);
  const [showStudioPhotoModal, setShowStudioPhotoModal] = useState<boolean>(false);
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

  const effectiveProgress = manualOverride !== null ? manualOverride : scrollProgress;
  const choreography = computeHeroScrollChoreography(effectiveProgress);

  const displayedLayerId = hoveredLayerId || activeLayerId;
  const activeLayer: ScrollytellingLayer =
    BURGER_ANATOMY_LAYERS.find(l => l.id === displayedLayerId) ||
    BURGER_ANATOMY_LAYERS[4];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    setMouseOffset({ x: nx, y: ny });
  };

  const renderOrbitIcon = (icon: OrbitNodeConfig['icon']) => {
    switch (icon) {
      case 'flame':
        return <Flame className="w-5 h-5 text-[#F4EFEA] fill-[#E85D1A]" />;
      case 'wheat':
        return <Wheat className="w-5 h-5 text-[#F5A623]" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-[#F4EFEA] fill-[#F5A623]" />;
      case 'leaf':
        return <Leaf className="w-5 h-5 text-[#F5A623]" />;
    }
  };

  // Compute active layer Y in the SVG viewBox (0..640) for the dotted technical callout line
  const activeLayerYOffset =
    activeLayer.closedY +
    (activeLayer.explodedY - activeLayer.closedY) * choreography.layerExplosionProgress;
  const svgStartY = Math.max(100, Math.min(540, 320 + activeLayerYOffset * 0.82));

  return (
    <section
      id="anatomia"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[300vh] w-full bg-[#0D0907] select-none"
    >
      {/* Sticky Full-Screen Awwwards Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* =====================================================================
            LAYER 0: TWO-REALM ATMOSPHERIC ENVIRONMENT (SMOKE SKY -> EMBER HEARTH)
           ===================================================================== */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Deep Atmospheric Sky Gradient that shifts from Smoky Amber Sky to Glowing Crimson Forge */}
          <div
            className="absolute inset-0 transition-colors duration-500"
            style={{
              background: `radial-gradient(ellipse 85% 65% at 50% ${
                38 + effectiveProgress * 28
              }%, rgba(232, 93, 26, ${0.28 + effectiveProgress * 0.14}) 0%, rgba(168, 56, 12, 0.16) 42%, #0D0907 82%)`,
            }}
          />

          {/* Volumetric Smoke Clouds (Act 1 & Act 2 - drifting with scroll & parallax) */}
          <div
            className="absolute inset-0"
            style={{
              transform: `translate3d(${mouseOffset.x * -18}px, ${
                -effectiveProgress * 180 + mouseOffset.y * -12
              }px, 0)`,
              opacity: Math.max(0.2, 1 - effectiveProgress * 0.65),
            }}
          >
            {/* Left Lit Smoke Cloud */}
            <div
              className="absolute top-[14%] left-[4%] w-[520px] h-[320px] rounded-full blur-[65px]"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(244, 239, 234, 0.16) 0%, rgba(245, 166, 35, 0.12) 45%, transparent 75%)',
              }}
            />
            {/* Right Lit Smoke Cloud (behind 'BRASA') */}
            <div
              className="absolute top-[10%] right-[8%] w-[580px] h-[380px] rounded-full blur-[70px]"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255, 236, 214, 0.22) 0%, rgba(232, 93, 26, 0.15) 48%, transparent 78%)',
              }}
            />
            {/* Lower Left Smoke Bank */}
            <div
              className="absolute bottom-[6%] left-[-4%] w-[640px] h-[280px] rounded-full blur-[60px]"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(244, 239, 234, 0.14) 0%, rgba(232, 93, 26, 0.08) 55%, transparent 80%)',
              }}
            />
          </div>

          {/* =================================================================
              ACT 1 MONUMENTAL KINETIC DISPLAY TITLE: "SINTA A BRASA"
              Breaks apart & flies off on scroll just like "Taste The Sky"
             ================================================================= */}
          <div
            className="absolute inset-x-0 top-[13%] sm:top-[14%] flex items-center justify-center z-0 pointer-events-none"
            aria-hidden={choreography.skyTitleExitProgress > 0.9}
          >
            <h1
              aria-label="Sinta a Brasa"
              className="font-kinetic-display text-[15vw] sm:text-[11.5vw] lg:text-[10.2rem] uppercase text-[#F4EFEA] flex flex-wrap items-center justify-center gap-x-[0.26em] px-4 select-none drop-shadow-[0_18px_45px_rgba(0,0,0,0.85)]"
            >
              {SKY_TITLE_WORDS.map((wordObj, wIdx) => (
                <span key={wIdx} className="inline-flex items-center">
                  {wordObj.letters.map((l, lIdx) => {
                    const p = choreography.skyTitleExitProgress;
                    // Stagger each letter slightly so right-side letters linger and tilt like "he Sky"
                    const stagger = Math.max(
                      0,
                      Math.min(1, p * 1.25 - (wIdx * 0.08 + lIdx * 0.025))
                    );
                    const ease = stagger * stagger;
                    const tx = l.tx * ease;
                    const ty = l.ty * ease;
                    const rot = l.rot * ease;
                    const opacity = Math.max(0, 1 - ease * 1.15);

                    return (
                      <span
                        key={lIdx}
                        style={{
                          transform: `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg)`,
                          opacity,
                        }}
                        className="inline-block"
                      >
                        {l.char}
                      </span>
                    );
                  })}
                </span>
              ))}
            </h1>
          </div>

          {/* =================================================================
              ACT 2 & 3 FOREGROUND ENVIRONMENT: CHARCOAL BOULDERS & EMBER FIELD
              Rises from the bottom as you scroll down (like the meadow & rocks)
             ================================================================= */}
          <div
            className="absolute inset-x-0 bottom-0 h-[55vh] pointer-events-none transition-transform duration-150"
            style={{
              transform: `translate3d(0, ${
                (1 - Math.min(1, effectiveProgress * 1.65)) * 180
              }px, 0)`,
              opacity: Math.min(1, 0.25 + effectiveProgress * 1.2),
            }}
          >
            {/* Left Volcanic Charcoal Boulder Silhouette with Glowing Magma Veins */}
            <div
              className="absolute -bottom-16 -left-16 w-[340px] sm:w-[460px] h-[270px] sm:h-[340px] rounded-tr-[140px] rounded-tl-[60px]"
              style={{
                background:
                  'radial-gradient(circle at 75% 25%, #3A2218 0%, #1C110C 48%, #090605 90%)',
                boxShadow:
                  'inset -18px 18px 40px rgba(245, 166, 35, 0.22), 0 -10px 50px rgba(232, 93, 26, 0.25)',
                transform: `translate3d(${mouseOffset.x * -14}px, 0, 0) rotate(-6deg)`,
              }}
            />

            {/* Right Volcanic Charcoal Crag Silhouette */}
            <div
              className="absolute -bottom-12 -right-16 w-[360px] sm:w-[500px] h-[290px] sm:h-[380px] rounded-tl-[160px] rounded-tr-[50px]"
              style={{
                background:
                  'radial-gradient(circle at 25% 25%, #42261A 0%, #1E130D 50%, #090605 92%)',
                boxShadow:
                  'inset 20px 20px 45px rgba(232, 93, 26, 0.28), 0 -12px 60px rgba(245, 166, 35, 0.2)',
                transform: `translate3d(${mouseOffset.x * -18}px, 0, 0) rotate(5deg)`,
              }}
            />

            {/* Glowing Bed of Golden-Orange Embers Across the Bottom Horizon */}
            <div
              className="absolute inset-x-0 bottom-0 h-[190px]"
              style={{
                background:
                  'linear-gradient(to top, rgba(232, 93, 26, 0.38) 0%, rgba(245, 166, 35, 0.16) 45%, transparent 100%)',
              }}
            />
          </div>

          {/* =================================================================
              ACT 2 MONUMENTAL BOTTOM HEADLINE: "A DIFERENÇA"
              Rises from the bottom edge like "The Difference" in Sky Cookie
             ================================================================= */}
          <div
            className="absolute inset-x-0 bottom-[5%] sm:bottom-[6%] flex items-center justify-center z-20 pointer-events-none"
            style={{
              opacity: choreography.differenceTitleProgress,
              transform: `translate3d(0, ${
                (1 - choreography.differenceTitleProgress) * 120
              }px, 0) rotate(${(1 - choreography.differenceTitleProgress) * 6}deg)`,
            }}
          >
            <h2 className="font-kinetic-display text-[14vw] sm:text-[10vw] lg:text-[8.6rem] uppercase text-[#F4EFEA] tracking-tight select-none drop-shadow-[0_14px_40px_rgba(0,0,0,0.95)]">
              A Diferença
            </h2>
          </div>
        </div>

        {/* =====================================================================
            MAIN INTERACTIVE STAGE (CENTER 3D BURGER + ORBITING NODES + ANATOMY)
           ===================================================================== */}
        <div className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-10 pt-20 pb-8 flex flex-col justify-center">
          <div className="relative w-full h-[640px] flex items-center justify-center">
            {/* ===============================================================
                4 SYMMETRICAL ORBITING NODES + FROSTED CAPSULES (SKY COOKIE 1:1)
                Appear around the burger in Act 2 with generous breathing room
               =============================================================== */}
            <div
              className={`hidden lg:block absolute inset-0 z-30 transition-transform duration-200 ${
                choreography.orbitNodesOpacity > 0.15
                  ? 'pointer-events-auto'
                  : 'pointer-events-none'
              }`}
              style={{
                opacity: choreography.orbitNodesOpacity,
                transform: `scale(${0.92 + choreography.orbitNodesOpacity * 0.08})`,
              }}
            >
              {ORBIT_ATTRIBUTE_NODES.map(node => {
                const correspondingLayer = BURGER_ANATOMY_LAYERS.find(
                  l => l.index === node.layerIndex
                )!;
                const isNodeActive =
                  displayedLayerId === correspondingLayer.id || hoveredOrbitId === node.id;

                const isLeft = node.position.endsWith('left');
                const isTop = node.position.startsWith('top');

                // Positioned cleanly outside the burger silhouette (63% offset from opposite edge)
                const posClasses =
                  node.position === 'top-left'
                    ? 'top-[22%] right-[63%]'
                    : node.position === 'bottom-left'
                    ? 'bottom-[28%] right-[63%]'
                    : node.position === 'top-right'
                    ? 'top-[22%] left-[63%]'
                    : 'bottom-[28%] left-[63%]';

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
                    onClick={() => {
                      setActiveLayerId(correspondingLayer.id);
                      setManualOverride(0.92);
                    }}
                    className={`absolute ${posClasses} flex items-center gap-3.5 cursor-pointer group transition-transform duration-300 ${
                      isLeft ? 'flex-row' : 'flex-row-reverse'
                    } ${isTop ? 'hover:-translate-y-1' : 'hover:translate-y-1'}`}
                  >
                    {/* Frosted Glass Attribute Capsule */}
                    <div
                      className={`px-5 py-3.5 rounded-2xl frosted-sky-capsule transition-all duration-300 min-w-[235px] ${
                        isLeft ? 'text-right' : 'text-left'
                      } ${
                        isNodeActive
                          ? 'border-[#F5A623]/70 bg-[#1C1410]/85 shadow-[0_0_30px_rgba(232,93,26,0.3)]'
                          : 'hover:border-white/35'
                      }`}
                    >
                      <p className="text-xs sm:text-sm font-sans font-bold text-[#F4EFEA] leading-tight">
                        {node.title}
                      </p>
                      <p className="text-[11px] font-mono text-[#F5A623] mt-0.5">
                        {node.subtitle}
                      </p>
                    </div>

                    {/* Obsidian Squircle Icon Button (54x54) */}
                    <button
                      type="button"
                      aria-label={node.title}
                      className={`w-14 h-14 rounded-2xl obsidian-node-btn flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isNodeActive
                          ? 'scale-110 border-[#E85D1A] shadow-[0_0_25px_rgba(232,93,26,0.55)]'
                          : 'group-hover:scale-105 group-hover:border-[#F5A623]/60'
                      }`}
                    >
                      {renderOrbitIcon(node.icon)}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ===============================================================
                CENTER 3D BURGER STACK (ROTATES IN SKY -> EXPLODES INTO 7 PNGS)
               =============================================================== */}
            <div
              className="relative w-full max-w-[460px] h-[580px] flex items-center justify-center z-20"
              style={{
                transform: `translate3d(${mouseOffset.x * 10}px, ${
                  mouseOffset.y * 8 +
                  (effectiveProgress < 0.35 ? 45 * (1 - effectiveProgress * 2.5) : 0)
                }px, 0) rotate(${choreography.burgerRotationDeg}deg) scale(${
                  choreography.burgerScale
                })`,
              }}
            >
              {/* Warm Rim-Light Halo behind the Burger */}
              <div
                className="absolute w-[340px] h-[340px] rounded-full blur-[70px] pointer-events-none transition-all duration-300"
                style={{
                  background:
                    'radial-gradient(circle, rgba(245, 166, 35, 0.32) 0%, rgba(232, 93, 26, 0.18) 55%, transparent 75%)',
                }}
              />

              {/* Render all 7 Real PNG Burger Layers */}
              {BURGER_ANATOMY_LAYERS.map((layer, index) => {
                const currentY =
                  layer.closedY +
                  (layer.explodedY - layer.closedY) * choreography.layerExplosionProgress;

                // Subtle 3D tilt per layer as it explodes
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
                      if (effectiveProgress < 0.7) {
                        setManualOverride(0.92);
                      }
                    }}
                    style={{
                      transform: `translate3d(0, ${currentY}px, 0) rotate(${layerRot}deg) scale(${
                        isSelected && choreography.layerExplosionProgress > 0.2 ? 1.07 : 1
                      })`,
                      zIndex,
                      opacity: isDimmed ? 0.45 : 1,
                    }}
                    className="absolute w-full flex items-center justify-center cursor-pointer transition-all duration-200 ease-out group"
                  >
                    {/* Layer Number Badge on the Left ONLY when Exploded in Act 3 */}
                    <div
                      className={`hidden sm:flex items-center gap-2 absolute -left-10 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none ${
                        choreography.layerExplosionProgress > 0.42
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 translate-x-3'
                      }`}
                    >
                      <span
                        className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold tracking-wider border ${
                          isSelected
                            ? 'bg-[#E85D1A] text-[#110D0B] border-[#F5A623] shadow-lg shadow-[#E85D1A]/40'
                            : 'bg-[#0A0706]/90 text-[#A39B95] border-white/15'
                        }`}
                      >
                        {layer.numberPrefix}
                      </span>
                    </div>

                    {/* Transparent PNG Packshot */}
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
                ACT 3: SVG DOTTED CALLOUT LINE + FLOATING GLASSMORPHISM CARD
                Appears when layers deconstruct in Act 3
               =============================================================== */}
            <div
              className={`hidden xl:block absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 ${
                choreography.layerExplosionProgress > 0.45 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <svg className="w-full h-full" viewBox="0 0 1360 640" fill="none">
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
                <circle
                  cx="820"
                  cy={svgStartY}
                  r="4.5"
                  fill="#F5A623"
                  stroke="#110D0B"
                  strokeWidth="2"
                />
                <path
                  d={`M 825 ${svgStartY} L 910 ${svgStartY} L 945 450 L 980 450`}
                  stroke="#E85D1A"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  markerEnd="url(#outland-arrowhead)"
                />
              </svg>
            </div>

            {/* Compact Floating Glassmorphism Card for Active Layer Inspection */}
            <div
              className={`absolute right-0 bottom-2 z-40 w-full max-w-[380px] rounded-3xl glass-outback border border-[#F5A623]/35 p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] transition-all duration-300 ${
                choreography.layerExplosionProgress > 0.42
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 translate-y-8 pointer-events-none'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono font-bold text-[#E85D1A] uppercase tracking-wider">
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
                  <h3 className="text-xl font-serif font-black text-[#F4EFEA] leading-tight">
                    {activeLayer.title}
                  </h3>
                  <p className="text-[11px] font-mono text-[#F5A623]">
                    {activeLayer.subtitle}
                  </p>
                </div>
              </div>

              {/* Exact Prompt Callout Copy */}
              <div className="p-3 rounded-xl bg-black/55 border border-[#F5A623]/20 mb-3 font-mono text-xs text-[#F4EFEA] leading-relaxed">
                {activeLayer.description}
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[11px] font-mono border-t border-white/10 pt-3 mb-4">
                <div>
                  <span className="text-[#A39B95] block text-[9px] uppercase">Origem</span>
                  <span className="text-[#F4EFEA]">{activeLayer.details.origin}</span>
                </div>
                <div>
                  <span className="text-[#A39B95] block text-[9px] uppercase">Temperatura</span>
                  <span className="text-[#F5A623]">{activeLayer.details.temperature}</span>
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
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E85D1A] to-[#F5A623] text-[#110D0B] font-mono font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-95 transition-opacity"
              >
                <span>Montar no Fogo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* =====================================================================
            BOTTOM INTERACTIVE BAR: SCROLL STAGE SWITCHER & LAYER SELECTOR PILLS
           ===================================================================== */}
        <div className="relative z-30 max-w-[1400px] w-full mx-auto px-6 sm:px-10 pb-5 flex flex-wrap items-center justify-between gap-4">
          {/* Left: 3-Act Stage Indicator Pills */}
          <div className="flex items-center gap-2">
            {[
              { id: 'sky', label: '01 · Sinta a Brasa', target: 0 },
              { id: 'difference', label: '02 · A Diferença', target: 0.42 },
              { id: 'anatomy', label: '03 · 7 Camadas (Explodir)', target: 0.95 },
            ].map(stage => {
              const isCurrent = choreography.activeAct === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() =>
                    setManualOverride(prev => (prev === stage.target ? null : stage.target))
                  }
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-[11px] transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#E85D1A] text-[#110D0B] font-bold shadow-lg shadow-[#E85D1A]/30'
                      : 'frosted-sky-capsule text-[#F4EFEA]/80 hover:text-white'
                  }`}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>

          {/* Right: Interactive Slider + Studio Packshot Trigger */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl frosted-sky-capsule text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
              <span className="text-[#F4EFEA]/80">Abertura:</span>
              <span className="text-[#F5A623] font-bold tabular-nums w-9">
                {Math.round(choreography.layerExplosionProgress * 100)}%
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(effectiveProgress * 100)}
                onChange={e => setManualOverride(Number(e.target.value) / 100)}
                aria-label="Controlar rotação e explosão das camadas do hambúrguer"
                className="w-20 accent-[#E85D1A] cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowStudioPhotoModal(true)}
              className="px-3.5 py-1.5 rounded-xl obsidian-node-btn text-xs font-mono text-[#F5A623] hover:border-[#E85D1A] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Packshot 8K</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Studio Levitating Burger Photo */}
      {showStudioPhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowStudioPhotoModal(false)}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl glass-outback border border-[#F5A623]/40 overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono text-[#E85D1A] uppercase tracking-wider">
                  Fotografia Oficial de Estúdio · Low-Key Chiaroscuro
                </span>
                <h4 className="text-lg font-serif font-bold text-[#F4EFEA]">
                  The Outland Signature Burger na Brasa Viva
                </h4>
              </div>
              <button
                onClick={() => setShowStudioPhotoModal(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#F4EFEA] cursor-pointer"
                aria-label="Fechar foto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-[16/9] w-full bg-black">
              <img
                src={HERO_ASSEMBLED_BURGER_IMAGE}
                alt="The Outland Signature Burger levitando sobre tábua rústica com brasa"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
