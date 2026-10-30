/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { FireEmberCanvasOverlay } from './FireEmberCanvasOverlay.tsx';

export interface SequenceStageInfo {
  stageNumber: 1 | 2 | 3 | 4;
  id: 'facade' | 'hallway' | 'grill' | 'counter';
  label: string;
  subtitle: string;
  progress: number;
}

interface SequenceScrollBackgroundProps {
  onStageChange?: (info: SequenceStageInfo) => void;
  videoMode?: boolean;
}

export const SEQUENCE_BACKGROUNDS = {
  stage1Facade: '/assets/sequence/stage-1-facade.jpg',
  stage2Hallway: '/assets/sequence/stage-2-hallway.jpg',
  stage3Grill: '/assets/sequence/stage-3-grill.jpg',
  stage4Counter: '/assets/sequence/stage-4-counter.jpg',
  flythroughVideo: '/assets/sequence/camera-flythrough.mp4',
};

// Pre-generated deterministic CSS ember sparks for Stage 3 (Grill)
const CSS_GRILL_SPARKS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${12 + ((i * 37) % 76)}%`,
  size: 2 + (i % 4) * 1.5,
  delay: `${(i * 0.35) % 4.5}s`,
  duration: `${2.8 + (i % 5) * 0.65}s`,
  drift: (i % 2 === 0 ? 1 : -1) * (12 + ((i * 7) % 28)),
}));

export function resolveSequenceStage(progress: number): SequenceStageInfo {
  const p = Math.min(1, Math.max(0, progress));
  if (p < 0.2) {
    return {
      stageNumber: 1,
      id: 'facade',
      label: 'I · A Fachada',
      subtitle: 'Entrada Principal',
      progress: p,
    };
  }
  if (p < 0.4) {
    return {
      stageNumber: 2,
      id: 'hallway',
      label: 'II · O Salão',
      subtitle: 'Travessia rumo à Cozinha',
      progress: p,
    };
  }
  if (p < 0.65) {
    return {
      stageNumber: 3,
      id: 'grill',
      label: 'III · A Grelha 400°C',
      subtitle: 'Anatomia no Fogo Vivo',
      progress: p,
    };
  }
  return {
    stageNumber: 4,
    id: 'counter',
    label: 'IV · Bancada do Chef',
    subtitle: 'Tábua de Carvalho',
    progress: p,
  };
}

export const SequenceScrollBackground: React.FC<SequenceScrollBackgroundProps> = ({
  onStageChange,
  videoMode = true,
}) => {
  const { scrollYProgress } = useScroll();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 4>(1);

  // ===========================================================================
  // ESTÁGIO 1 (0% a 20% do Scroll - Topo/Hero): Fachada da Loja
  // Zoom in contínuo (scale 1 -> 1.35) simulando entrada pela porta da frente;
  // Opacidade vai de 1 para 0 entre 15% e 25%.
  // ===========================================================================
  const stage1Scale = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1.35, 1.42]);
  const stage1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);

  // ===========================================================================
  // ESTÁGIO 2 (20% a 40% do Scroll - Transição Salão): Corredor do Salão
  // Zoom contínuo (scale 1 -> 1.3), fazendo crossfade suave para a cozinha.
  // ===========================================================================
  const stage2Scale = useTransform(scrollYProgress, [0.15, 0.4, 0.45], [1, 1.3, 1.36]);
  const stage2Opacity = useTransform(
    scrollYProgress,
    [0.15, 0.25, 0.35, 0.45],
    [0, 1, 1, 0]
  );

  // ===========================================================================
  // ESTÁGIO 3 (40% a 65% do Scroll - Hambúrguer Desconstruído na Grelha):
  // Exibe a Grelha de Fogo e Fumaça + overlay escuro sutil (bg-black/50 backdrop-blur-[2px])
  // + partículas de brasa/fogo subindo em CSS/Canvas.
  // ===========================================================================
  const stage3Scale = useTransform(scrollYProgress, [0.35, 0.65, 0.72], [1, 1.16, 1.22]);
  const stage3Opacity = useTransform(
    scrollYProgress,
    [0.35, 0.45, 0.6, 0.7],
    [0, 1, 1, 0]
  );

  // ===========================================================================
  // ESTÁGIO 4 (65% a 100% do Scroll - Monte seu Lanche e Cardápio):
  // Transição suave para a Bancada Rústica do Chef (60%-70% -> 100%).
  // ===========================================================================
  const stage4Scale = useTransform(scrollYProgress, [0.6, 0.72, 1], [1.14, 1.0, 1.05]);
  const stage4Opacity = useTransform(scrollYProgress, [0.6, 0.7, 1], [0, 1, 1]);

  // Overlay de contraste do Estágio 3 (ativo mesmo sobre o vídeo FPV para leitura perfeita das 7 camadas)
  const grillAtmosphereOpacity = useTransform(
    scrollYProgress,
    [0.36, 0.44, 0.6, 0.68],
    [0, 1, 1, 0]
  );

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    const info = resolveSequenceStage(latest);
    if (info.stageNumber !== currentStage) {
      setCurrentStage(info.stageNumber);
    }
    if (onStageChange) {
      onStageChange(info);
    }

    const video = videoRef.current;
    if (video && video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
      // Map page scroll [0..0.75] across the full camera flythrough video duration, holding on the chef counter from 0.75..1.0
      const normalizedVideoProgress = Math.min(1, Math.max(0, latest / 0.78));
      const targetTime = Math.min(
        video.duration - 0.04,
        Math.max(0, normalizedVideoProgress * video.duration)
      );
      if (Math.abs(video.currentTime - targetTime) > 0.03) {
        video.currentTime = targetTime;
      }
    }
  });

  useEffect(() => {
    const initial = resolveSequenceStage(scrollYProgress.get());
    setCurrentStage(initial.stageNumber);
    if (onStageChange) {
      onStageChange(initial);
    }
  }, []);

  return (
    <div
      data-testid="sequence-scroll-background"
      className="fixed inset-0 -z-10 overflow-hidden bg-[#080504] pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* =====================================================================
          ESTÁGIO 1 (0% a 20% do Scroll): IMAGEM DE FUNDO 1 (FACHADA DA LOJA)
          Scale: 1 -> 1.35 | Opacity: 1 -> 0 entre 15% e 25%
         ===================================================================== */}
      <motion.div
        data-testid="bg-stage-1-facade"
        style={{
          scale: stage1Scale,
          opacity: stage1Opacity,
          transformOrigin: '50% 56%',
        }}
        className="absolute inset-0 w-full h-full will-change-transform"
      >
        <img
          src={SEQUENCE_BACKGROUNDS.stage1Facade}
          alt="Fachada da Hamburgueria Outland Steak & Burger"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
        />
      </motion.div>

      {/* =====================================================================
          ESTÁGIO 2 (20% a 40% do Scroll): IMAGEM DE FUNDO 2 (CORREDOR DO SALÃO)
          Scale: 1 -> 1.3 | Crossfade suave para a cozinha
         ===================================================================== */}
      <motion.div
        data-testid="bg-stage-2-hallway"
        style={{
          scale: stage2Scale,
          opacity: stage2Opacity,
          transformOrigin: '50% 48%',
        }}
        className="absolute inset-0 w-full h-full will-change-transform"
      >
        <img
          src={SEQUENCE_BACKGROUNDS.stage2Hallway}
          alt="Corredor do Salão rumo à Cozinha de Brasa"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* =====================================================================
          ESTÁGIO 3 (40% a 65% do Scroll): IMAGEM DE FUNDO 3 (GRELHA DE FOGO E FUMAÇA)
         ===================================================================== */}
      <motion.div
        data-testid="bg-stage-3-grill"
        style={{
          scale: stage3Scale,
          opacity: stage3Opacity,
          transformOrigin: '50% 58%',
        }}
        className="absolute inset-0 w-full h-full will-change-transform"
      >
        <img
          src={SEQUENCE_BACKGROUNDS.stage3Grill}
          alt="Grelha de Fogo e Fumaça a 400°C"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* =====================================================================
          ESTÁGIO 4 (65% a 100% do Scroll): IMAGEM DE FUNDO 4 (BANCADA RÚSTICA DO CHEF)
         ===================================================================== */}
      <motion.div
        data-testid="bg-stage-4-counter"
        style={{
          scale: stage4Scale,
          opacity: stage4Opacity,
          transformOrigin: '50% 65%',
        }}
        className="absolute inset-0 w-full h-full will-change-transform"
      >
        <img
          src={SEQUENCE_BACKGROUNDS.stage4Counter}
          alt="Bancada Rústica do Chef com Tábua de Madeira"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* =====================================================================
          VÍDEO EM PLANO-SEQUÊNCIA (HABILITADO POR PADRÃO E SINCRONIZADO AO SCROLL)
         ===================================================================== */}
      <video
        ref={videoRef}
        src={SEQUENCE_BACKGROUNDS.flythroughVideo}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
          videoMode ? 'opacity-100 z-10' : 'opacity-0 -z-10'
        }`}
      />

      {/* =====================================================================
          ATMOSFERA DO ESTÁGIO 3 (40% a 65%): OVERLAY ESCURO SUTIL + BRASAS
          Garante contraste e leitura perfeitos para as 7 camadas e setas de Hover
          tanto sobre a imagem quanto sobre o vídeo FPV!
         ===================================================================== */}
      <motion.div
        style={{ opacity: grillAtmosphereOpacity }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 50% at 50% 68%, rgba(232, 93, 26, 0.22) 0%, rgba(245, 166, 35, 0.08) 45%, rgba(0, 0, 0, 0.55) 100%)',
          }}
        />

        {/* Partículas sutis de brasa/fogo subindo em CSS */}
        <div className="absolute inset-0 overflow-hidden">
          {CSS_GRILL_SPARKS.map(spark => (
            <span
              key={spark.id}
              className="grill-ember-spark absolute bottom-[12%] rounded-full"
              style={
                {
                  left: spark.left,
                  width: `${spark.size}px`,
                  height: `${spark.size}px`,
                  animationDelay: spark.delay,
                  animationDuration: spark.duration,
                  '--spark-drift': `${spark.drift}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Partículas de brasa/fogo e ondas térmicas em Canvas HTML5 */}
        {currentStage === 3 && (
          <FireEmberCanvasOverlay
            variant="stage"
            intensity={0.85}
            emberCount={48}
            shimmerSpeedSec={3.5}
          />
        )}
      </motion.div>

      {/* Vinheta Chiaroscuro Global (Sem Caixas, Apenas Luz e Sombra Cinematográfica) */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 85% 80% at 50% 52%, transparent 35%, rgba(6, 4, 3, 0.68) 100%)',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-36 z-20 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 z-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
    </div>
  );
};
