import React, { useEffect, useRef } from 'react';
import { initBurgerScroll } from './burgerScrollCore.js';

/**
 * Hambúrguer que se separa no scroll, com setas e etiquetas por ingrediente.
 * Frames (fundo transparente) em /public/assets/burger-frames/frame_000.webp ... frame_144.webp
 */
const FRAME_COUNT = 145;
const frameUrls = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/assets/burger-frames/frame_${String(i).padStart(3, '0')}.webp`
);

export const BurgerExplodedScroll: React.FC<{ heightVh?: number; id?: string }> = ({
  heightVh = 600,
  id = 'anatomia',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => initBurgerScroll(ref.current!, { frames: frameUrls, heightVh }), [heightVh]);
  return <div id={id} ref={ref} />;
};
