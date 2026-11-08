import React from 'react';

/**
 * 16-ray radiating starburst / sunburst ornament
 * Directly inspired by Reference 2 ("ONDE MONTANHAS ENCONTRAM O MAR")
 */
export const SunburstIcon: React.FC<{
  className?: string;
  size?: number;
  color?: string;
  spin?: boolean;
}> = ({ className = '', size = 32, color = 'currentColor', spin = true }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none pointer-events-none ${spin ? 'star-spin' : ''} ${className}`}
      aria-hidden="true"
    >
      <g fill={color}>
        {/* 16 rays radiating outward */}
        {Array.from({ length: 16 }).map((_, i) => (
          <polygon
            key={i}
            points="50,12 52.5,42 47.5,42"
            transform={`rotate(${i * 22.5} 50 50)`}
          />
        ))}
        {/* Central hub */}
        <circle cx="50" cy="50" r="8" />
      </g>
    </svg>
  );
};

/**
 * Small diamond badge with year / mark (e.g. "20", "26")
 * Inspired by Reference 2
 */
export const DiamondBadge: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={{ minWidth: '22px', height: '26px' }}
    >
      <svg
        viewBox="0 0 30 38"
        className="w-full h-full fill-[#E0A95F] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
        aria-hidden="true"
      >
        <polygon points="15,2 28,19 15,36 2,19" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[9px] text-[#0D0814] tracking-tight">
        {text}
      </span>
    </span>
  );
};

/**
 * Sticker-style stamp pill with hard drop-shadow
 * Inspired by Reference 1 (Spotify Daylist)
 */
export const StickerTag: React.FC<{
  children: React.ReactNode;
  variant?: 'violet' | 'gold' | 'pink' | 'ember' | 'dark';
  className?: string;
  rotate?: string;
}> = ({ children, variant = 'violet', className = '', rotate = 'rotate-0' }) => {
  const styles = {
    violet: 'bg-[#8E6FD1] text-[#0D0814] shadow-[3px_3px_0px_#EDE3F7]',
    gold: 'bg-[#E0A95F] text-[#0D0814] shadow-[3px_3px_0px_#8E6FD1]',
    pink: 'bg-[#FF4FA3] text-white shadow-[3px_3px_0px_#0D0814]',
    ember: 'bg-[#FF5B1F] text-white shadow-[3px_3px_0px_#E0A95F]',
    dark: 'bg-[#160F22] text-[#EDE3F7] border border-[#8E6FD1]/50 shadow-[3px_3px_0px_#8E6FD1]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider transition-transform ${styles[variant]} ${rotate} ${className}`}
    >
      {children}
    </span>
  );
};

/**
 * Animated Marquee ribbon tape
 */
export const MarqueeRibbon: React.FC<{
  items?: string[];
  className?: string;
  tilt?: string;
}> = ({
  items = [
    'BRASA VIVA A 400°C',
    'WAGYU DEFUMADO EM MACIEIRA',
    'BRIOCHE DE FERMENTAÇÃO 24H',
    'CHEDDAR INGLÊS NO VAPOR',
    'OUTLAND FIRE GRILL',
    'ANATOMIA EM FOGO ABERTO',
    'MISTURA PERFEITA',
  ],
  className = '',
  tilt = 'rotate-0',
}) => {
  const repeated = [...items, ...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden py-2 bg-gradient-to-r from-[#8E6FD1] via-[#FF4FA3] to-[#FF5B1F] text-[#0D0814] select-none shadow-[0_4px_20px_rgba(0,0,0,0.6)] ${tilt} ${className}`}
    >
      <div className="flex w-max marquee-track font-poster text-xl tracking-[0.14em] uppercase font-bold">
        {repeated.map((item, idx) => (
          <span key={idx} className="flex items-center gap-3 px-4 shrink-0">
            <span>{item}</span>
            <span className="text-white text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

