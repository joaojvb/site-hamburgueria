/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { LayerVideoSlice } from '../data/burgerLayers.ts';

export interface BurgerLayerGraphicProps {
  layerId: string;
  pngUrl?: string | null;
  videoUrl?: string | null;
  videoSlice?: LayerVideoSlice;
  glbUrl?: string | null;
  particleEffect?: 'steam' | 'dewdrops' | 'molten' | 'smoke' | 'none';
  altText?: string;
  className?: string;
  isHovered?: boolean;
  isDimmed?: boolean;
  widthPercent?: number;
  enable3DRotation?: boolean;
}

const DEFAULT_PNG_BY_ID: Record<string, string> = {
  'layer-top-bun': '/assets/ingredients/layer-01-top-bun.png',
  'bun-top': '/assets/ingredients/layer-01-top-bun.png',
  'layer-onion': '/assets/ingredients/layer-02-onion.png',
  'veggie-onion': '/assets/ingredients/layer-02-onion.png',
  'layer-lettuce': '/assets/ingredients/layer-03-lettuce.png',
  'veggie-lettuce': '/assets/ingredients/layer-03-lettuce.png',
  'layer-cheddar': '/assets/ingredients/layer-04-cheddar.png',
  'cheese-cheddar': '/assets/ingredients/layer-04-cheddar.png',
  'layer-patty': '/assets/ingredients/layer-05-patty.png',
  'meat-wagyu': '/assets/ingredients/layer-05-patty.png',
  'layer-bacon': '/assets/ingredients/layer-06-bacon.png',
  'bacon-smoked': '/assets/ingredients/layer-06-bacon.png',
  'layer-bottom-bun': '/assets/ingredients/layer-07-bottom-bun.png',
  'bun-bottom': '/assets/ingredients/layer-07-bottom-bun.png',
};

export const BurgerLayerGraphic: React.FC<BurgerLayerGraphicProps> = ({
  layerId,
  pngUrl,
  videoUrl,
  videoSlice,
  glbUrl,
  particleEffect = 'none',
  altText,
  className = '',
  isHovered = false,
  isDimmed = false,
  widthPercent = 100,
  enable3DRotation = true,
}) => {
  const resolvedPng = pngUrl || DEFAULT_PNG_BY_ID[layerId];
  const videoRef = useRef<HTMLVideoElement>(null);

  // Manage video looping within loopStart and loopEnd if specified
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSlice) return;

    const handleTimeUpdate = () => {
      if (videoSlice.loopEnd && video.currentTime >= videoSlice.loopEnd) {
        video.currentTime = videoSlice.loopStart || 0;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [videoSlice]);

  // Adjust playback speed when hovered for real-time acceleration
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovered) {
      video.playbackRate = 1.6;
    } else if (isDimmed) {
      video.playbackRate = 0.6;
    } else {
      video.playbackRate = 1.0;
    }
  }, [isHovered, isDimmed]);

  // 3D class selection based on hover/dimmed state
  const rotation3DClass = !enable3DRotation
    ? ''
    : isHovered
    ? 'layer-3d-hovered'
    : isDimmed
    ? 'layer-3d-dimmed'
    : 'layer-3d-idle';

  if (resolvedPng || videoUrl) {
    return (
      <div
        className={`relative flex items-center justify-center transition-all duration-300 ${className} ${rotation3DClass}`}
        style={{
          width: `${widthPercent}%`,
          margin: '0 auto',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Support 1: 3D Video Loop (MP4/WebM with mix-blend-mode: screen) */}
        {videoUrl && (
          <div
            className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl flex items-center justify-center"
            style={{ mixBlendMode: 'screen' }}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover select-none pointer-events-none"
              style={{
                objectPosition: videoSlice ? `50% ${videoSlice.objectPositionY}` : 'center',
                transform: videoSlice ? `scale(${videoSlice.scale})` : 'scale(1)',
                filter: isHovered
                  ? 'brightness(1.3) contrast(1.15) saturate(1.2)'
                  : 'brightness(1.05) contrast(1.05)',
              }}
            />
          </div>
        )}

        {/* Support 2: High-Definition Translucent Base PNG with 3D Depth Shadow */}
        {resolvedPng && (
          <img
            src={resolvedPng}
            alt={altText || layerId}
            referrerPolicy="no-referrer"
            draggable={false}
            className={`w-full h-auto object-contain select-none transition-all duration-300 relative z-10 ${
              videoUrl ? 'opacity-90' : 'opacity-100'
            } ${
              isHovered
                ? 'filter drop-shadow-[0_0_35px_rgba(245,166,35,0.85)] drop-shadow-[0_16px_28px_rgba(232,93,26,0.6)] brightness-115'
                : 'filter drop-shadow-[0_16px_24px_rgba(0,0,0,0.88)]'
            }`}
          />
        )}

        {/* Support 3: Optional 3D Model Placeholder if GLB is configured */}
        {glbUrl && (
          <div
            data-glb-model={glbUrl}
            className="absolute inset-0 pointer-events-none z-30 opacity-0"
            aria-hidden="true"
          />
        )}

        {/* ===================================================================
            PARTÍCULAS 3D DINÂMICAS:
            - Carne (Camada 5): Vapor e fumaça viva subindo da grelha
            - Cebola & Salada (Camadas 2 e 3): Gotas d'água brilhando
            - Cheddar (Camada 4): Brilho de fusão quente
            - Bacon (Camada 6): Faíscas defumadas de macieira
           =================================================================== */}
        {particleEffect === 'steam' && (
          <div className="absolute inset-x-0 -top-8 h-20 pointer-events-none overflow-visible z-30">
            {[
              { left: '20%', delay: '0s', dur: '2.1s', drift: '-14px', size: '28px' },
              { left: '38%', delay: '0.6s', dur: '2.6s', drift: '8px', size: '36px' },
              { left: '55%', delay: '1.2s', dur: '2.3s', drift: '-8px', size: '32px' },
              { left: '72%', delay: '0.4s', dur: '2.8s', drift: '16px', size: '38px' },
              { left: '84%', delay: '1.5s', dur: '2.0s', drift: '6px', size: '24px' },
            ].map((p, i) => (
              <span
                key={i}
                className="steam-smoke-whisps absolute rounded-full"
                style={
                  {
                    left: p.left,
                    bottom: '10px',
                    width: p.size,
                    height: p.size,
                    animationDelay: p.delay,
                    '--steam-duration': isHovered ? '1.5s' : p.dur,
                    '--drift-x': p.drift,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}

        {particleEffect === 'dewdrops' && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {[
              { top: '35%', left: '22%', dur: '1.6s', delay: '0s' },
              { top: '55%', left: '44%', dur: '2.1s', delay: '0.5s' },
              { top: '38%', left: '68%', dur: '1.8s', delay: '1.0s' },
              { top: '62%', left: '80%', dur: '2.4s', delay: '0.3s' },
            ].map((d, idx) => (
              <span
                key={idx}
                className="dewdrop-sparkle absolute w-2 h-2 rounded-full"
                style={
                  {
                    top: d.top,
                    left: d.left,
                    animationDelay: d.delay,
                    '--sparkle-duration': d.dur,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}

        {particleEffect === 'molten' && (
          <div
            className={`absolute inset-0 pointer-events-none z-25 cheddar-molten-glow ${
              isHovered ? 'opacity-100' : 'opacity-75'
            }`}
          />
        )}

        {particleEffect === 'smoke' && (
          <div className="absolute inset-x-0 -top-4 h-12 pointer-events-none z-30">
            {[
              { left: '28%', delay: '0.2s', dur: '1.9s', drift: '-10px' },
              { left: '64%', delay: '0.8s', dur: '2.2s', drift: '12px' },
            ].map((s, idx) => (
              <span
                key={idx}
                className="steam-smoke-whisps absolute w-6 h-6 rounded-full"
                style={
                  {
                    left: s.left,
                    bottom: '4px',
                    animationDelay: s.delay,
                    '--steam-duration': s.dur,
                    '--drift-x': s.drift,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback Molten Outback Bloom Sauce graphic for the customizer
  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-300 ${className}`}
      style={{ width: '84%', margin: '0 auto' }}
    >
      <svg
        viewBox="0 0 420 75"
        className="w-full h-auto filter drop-shadow-[0_10px_18px_rgba(0,0,0,0.85)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="outlandSauceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5A623" />
            <stop offset="45%" stopColor="#E85D1A" />
            <stop offset="100%" stopColor="#9A2B0B" />
          </linearGradient>
          <linearGradient id="sauceHighlight" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#FFF7ED" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#FED7AA" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 35 28 C 85 14, 335 14, 385 28 C 402 34, 396 48, 378 52 C 362 56, 355 70, 344 70 C 334 70, 326 52, 305 50 C 275 48, 258 68, 245 68 C 232 68, 222 48, 195 48 C 170 48, 154 71, 142 71 C 130 71, 122 50, 96 49 C 74 48, 62 63, 52 62 C 42 61, 38 48, 30 43 C 22 38, 24 31, 35 28 Z"
          fill="url(#outlandSauceGrad)"
        />
        <path
          d="M 58 29 C 120 20, 300 20, 362 29 C 325 36, 190 36, 58 29 Z"
          fill="url(#sauceHighlight)"
        />
        <circle cx="115" cy="34" r="1.8" fill="#431407" opacity="0.75" />
        <circle cx="165" cy="39" r="1.5" fill="#431407" opacity="0.7" />
        <circle cx="220" cy="33" r="2.0" fill="#431407" opacity="0.75" />
        <circle cx="280" cy="37" r="1.7" fill="#431407" opacity="0.7" />
        <circle cx="330" cy="35" r="1.6" fill="#431407" opacity="0.75" />
      </svg>
    </div>
  );
};
