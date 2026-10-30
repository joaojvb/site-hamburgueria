/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BurgerLayerGraphicProps {
  layerId: string;
  pngUrl?: string | null;
  altText?: string;
  className?: string;
  isHovered?: boolean;
  widthPercent?: number;
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
  altText,
  className = '',
  isHovered = false,
  widthPercent = 100,
}) => {
  const resolvedPng = pngUrl || DEFAULT_PNG_BY_ID[layerId];

  if (resolvedPng) {
    return (
      <div
        className={`relative flex items-center justify-center transition-all duration-300 ${className}`}
        style={{ width: `${widthPercent}%`, margin: '0 auto' }}
      >
        <img
          src={resolvedPng}
          alt={altText || layerId}
          referrerPolicy="no-referrer"
          draggable={false}
          className={`w-full h-auto object-contain select-none transition-all duration-300 ${
            isHovered
              ? 'filter drop-shadow-[0_0_28px_rgba(245,166,35,0.68)] drop-shadow-[0_14px_24px_rgba(232,93,26,0.45)] brightness-110'
              : 'filter drop-shadow-[0_16px_24px_rgba(0,0,0,0.88)]'
          }`}
        />
      </div>
    );
  }

  // Rich Molten Outback Bloom Sauce graphic for the customizer
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
        {/* Black pepper & smoked paprika flecks */}
        <circle cx="115" cy="34" r="1.8" fill="#431407" opacity="0.75" />
        <circle cx="165" cy="39" r="1.5" fill="#431407" opacity="0.7" />
        <circle cx="220" cy="33" r="2.0" fill="#431407" opacity="0.75" />
        <circle cx="280" cy="37" r="1.7" fill="#431407" opacity="0.7" />
        <circle cx="330" cy="35" r="1.6" fill="#431407" opacity="0.75" />
      </svg>
    </div>
  );
};
