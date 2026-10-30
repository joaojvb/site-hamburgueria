/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface FireEmberCanvasOverlayProps {
  /** Normalized intensity from 0.25 to 1.0 */
  intensity?: number;
  /** Target number of ember particles */
  emberCount?: number;
  /** CSS animation speed in seconds for rising heat distortion waves */
  shimmerSpeedSec?: number;
  /** Incremented timestamp/counter whenever an ingredient drops or is smashed to trigger an ember burst */
  burstTrigger?: number;
  /** Variant: 'stage' focuses convection around the 3D burger platter; 'section' spans the ambient section backdrop */
  variant?: 'stage' | 'section';
}

interface EmberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
  glowColor: string;
  wobblePhase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  isBurst?: boolean;
}

interface HeatRibbon {
  xRatio: number;
  phase: number;
  speed: number;
  amplitude: number;
  width: number;
}

const EMBER_PALETTE = [
  { core: '#FFF3D1', glow: 'rgba(245, 166, 35, 0.85)' },
  { core: '#F5A623', glow: 'rgba(232, 93, 26, 0.80)' },
  { core: '#E85D1A', glow: 'rgba(232, 93, 26, 0.65)' },
  { core: '#FF7832', glow: 'rgba(255, 120, 50, 0.70)' },
];

export const FireEmberCanvasOverlay: React.FC<FireEmberCanvasOverlayProps> = ({
  intensity = 0.5,
  emberCount = 38,
  shimmerSpeedSec = 4.6,
  burstTrigger = 0,
  variant = 'stage',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intensityRef = useRef(intensity);
  const targetCountRef = useRef(emberCount);
  const burstQueueRef = useRef<number>(0);
  const lastBurstTriggerRef = useRef<number>(burstTrigger);

  useEffect(() => {
    intensityRef.current = intensity;
    targetCountRef.current = emberCount;
  }, [intensity, emberCount]);

  useEffect(() => {
    if (burstTrigger > 0 && burstTrigger !== lastBurstTriggerRef.current) {
      lastBurstTriggerRef.current = burstTrigger;
      burstQueueRef.current += variant === 'stage' ? 18 : 8;
    }
  }, [burstTrigger, variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;

    const createEmber = (spawnAtBottom = true, isBurst = false): EmberParticle => {
      const palette = EMBER_PALETTE[Math.floor(Math.random() * EMBER_PALETTE.length)];
      const currentIntensity = intensityRef.current;

      // Concentrate stage embers around the central wooden platter (16% to 84% width)
      const spreadX = variant === 'stage' ? 0.68 : 0.92;
      const offsetX = (1 - spreadX) / 2;
      const x = width * (offsetX + Math.random() * spreadX);

      const y = spawnAtBottom
        ? height * (0.76 + Math.random() * 0.22)
        : height * Math.random();

      const speedBoost = isBurst ? 1.85 : 0.75 + currentIntensity * 0.65;
      const vy = -(0.45 + Math.random() * 1.15) * speedBoost;
      const vx = (Math.random() - 0.5) * (isBurst ? 1.8 : 0.45);

      const radius = isBurst
        ? 1.5 + Math.random() * 2.5
        : 1.1 + Math.random() * (variant === 'stage' ? 2.4 : 1.9);

      const maxLife = isBurst
        ? 55 + Math.random() * 45
        : 120 + Math.random() * 140;

      return {
        x,
        y,
        vx,
        vy,
        radius,
        alpha: 0.05,
        maxAlpha: isBurst ? 0.95 : 0.55 + Math.random() * 0.4,
        life: spawnAtBottom ? 0 : Math.random() * maxLife,
        maxLife,
        color: palette.core,
        glowColor: palette.glow,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.035,
        wobbleAmp: 0.25 + Math.random() * 0.55,
        isBurst,
      };
    };

    const ribbons: HeatRibbon[] = [
      { xRatio: 0.28, phase: 0.4, speed: 0.026, amplitude: 18, width: 58 },
      { xRatio: 0.5, phase: 2.1, speed: 0.032, amplitude: 22, width: 82 },
      { xRatio: 0.72, phase: 4.0, speed: 0.028, amplitude: 18, width: 58 },
    ];

    const particles: EmberParticle[] = [];

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect ? rect.width : 600);
      height = Math.max(1, rect ? rect.height : 600);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particles.length === 0) {
        const initialCount =
          variant === 'stage' ? targetCountRef.current : Math.round(targetCountRef.current * 0.6);
        for (let i = 0; i < initialCount; i++) {
          particles.push(createEmber(false, false));
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let tick = 0;

    const renderFrame = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      const currentIntensity = intensityRef.current;
      const desiredCount =
        variant === 'stage'
          ? targetCountRef.current
          : Math.round(targetCountRef.current * 0.55);

      // Spawn any queued burst embers from the platter base
      while (burstQueueRef.current > 0) {
        particles.push(createEmber(true, true));
        burstQueueRef.current -= 1;
      }

      // Maintain steady ambient ember population
      while (particles.length < desiredCount) {
        particles.push(createEmber(true, false));
      }

      // 1. Draw rising convective heat distortion waves on the canvas
      if (variant === 'stage') {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        for (const ribbon of ribbons) {
          ribbon.phase += ribbon.speed * (0.85 + currentIntensity * 0.55);
          const baseX = width * ribbon.xRatio;
          const startY = height * 0.88;
          const endY = height * 0.14;

          const grad = ctx.createLinearGradient(baseX, startY, baseX, endY);
          const peakAlpha = 0.045 + currentIntensity * 0.055;
          grad.addColorStop(0, 'rgba(232, 93, 26, 0)');
          grad.addColorStop(0.25, `rgba(232, 93, 26, ${peakAlpha})`);
          grad.addColorStop(0.65, `rgba(245, 166, 35, ${peakAlpha * 0.75})`);
          grad.addColorStop(1, 'rgba(245, 166, 35, 0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = ribbon.width;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(baseX, startY);
          const cp1x = baseX + Math.sin(ribbon.phase) * ribbon.amplitude * 1.4;
          const cp1y = height * 0.64;
          const cp2x = baseX - Math.cos(ribbon.phase * 1.15) * ribbon.amplitude * 1.6;
          const cp2y = height * 0.38;
          const topX = baseX + Math.sin(ribbon.phase * 0.85) * ribbon.amplitude;
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, topX, endY);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 2. Update & draw rising glowing ember particles
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;
        p.wobblePhase += p.wobbleSpeed;

        p.x += p.vx + Math.sin(p.wobblePhase) * p.wobbleAmp;
        p.y += p.vy;

        // Envelope fade-in and fade-out
        const progress = p.life / p.maxLife;
        const flicker = 0.82 + 0.18 * Math.sin(tick * 0.18 + p.wobblePhase * 3);

        if (progress < 0.18) {
          p.alpha = (progress / 0.18) * p.maxAlpha * flicker;
        } else if (progress > 0.72) {
          p.alpha = ((1 - progress) / 0.28) * p.maxAlpha * flicker;
        } else {
          p.alpha = p.maxAlpha * flicker;
        }

        // Remove expired or off-screen particles
        if (p.life >= p.maxLife || p.y < -20) {
          if (p.isBurst || particles.length > desiredCount) {
            particles.splice(i, 1);
          } else {
            particles[i] = createEmber(true, false);
          }
          continue;
        }

        // Soft radial ember glow
        const glowRadius = p.radius * 4.6;
        const radial = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        radial.addColorStop(0, p.color);
        radial.addColorStop(0.35, p.glowColor);
        radial.addColorStop(1, 'rgba(232, 93, 26, 0)');

        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Hot incandescent ember core
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * 1.15));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.75, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    animationFrameId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [variant]);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      style={{ '--heat-speed': `${shimmerSpeedSec}s` } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* CSS Rising Heat-Distortion Plumes behind the Burger Stack */}
      {variant === 'stage' && (
        <>
          <div
            className="heat-shimmer-plume absolute bottom-10 left-1/2 -translate-x-1/2 w-[78%] h-[72%] rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at 50% 80%, rgba(232, 93, 26, 0.22) 0%, rgba(245, 166, 35, 0.11) 45%, transparent 75%)',
            }}
          />
          <div
            className="heat-shimmer-plume-delayed absolute bottom-16 left-1/2 -translate-x-1/2 w-[64%] h-[65%] rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at 50% 75%, rgba(245, 166, 35, 0.16) 0%, rgba(232, 93, 26, 0.08) 50%, transparent 78%)',
            }}
          />
          {/* Glowing Hearth Under-Platter Aura */}
          <div
            className="ember-platter-hearth absolute bottom-6 left-1/2 -translate-x-1/2 w-[82%] h-16 rounded-full blur-xl"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(232, 93, 26, 0.38) 0%, rgba(245, 166, 35, 0.16) 55%, transparent 80%)',
            }}
          />
        </>
      )}

      {/* HTML5 Canvas for Rising Ember Particles & Convective Ribbons */}
      <canvas
        ref={canvasRef}
        data-testid={`fire-ember-canvas-${variant}`}
        className="w-full h-full block"
      />
    </div>
  );
};
