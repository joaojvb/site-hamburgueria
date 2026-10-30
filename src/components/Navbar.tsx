/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame } from 'lucide-react';
import { SequenceStageInfo } from './SequenceScrollBackground.tsx';

interface NavbarProps {
  totalCartCount: number;
  onOpenCart: () => void;
  stageInfo?: SequenceStageInfo;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalCartCount,
  onOpenCart,
  stageInfo,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-6 sm:px-14 pt-6 pb-4">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Unboxed Engraved Editorial Wordmark */}
        <a
          href="#anatomia"
          className="pointer-events-auto flex items-center gap-3.5 group"
        >
          <Flame className="w-4 h-4 text-[#E85D1A] fill-[#E85D1A]/80 group-hover:scale-110 transition-transform drop-shadow-[0_0_12px_rgba(232,93,26,0.9)]" />
          <div className="flex items-baseline gap-2">
            <span className="font-cinzel font-extrabold text-lg sm:text-xl tracking-[0.26em] text-[#F4EFEA] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              OUTLAND
            </span>
            <span className="font-editorial-serif italic font-normal text-base sm:text-lg text-[#F5A623] tracking-wide drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]">
              Fire Grill
            </span>
          </div>
          <span className="hidden lg:inline-block h-3.5 w-[1px] bg-[#F5A623]/35 mx-1" />
          <span className="hidden lg:inline-block font-mono text-[10px] tracking-[0.22em] text-[#F4EFEA]/65 uppercase">
            {stageInfo ? stageInfo.label : 'I · A Fachada'}
          </span>
        </a>

        {/* Zone 2: Pure Typographic Navigation (Zero Boxes, Diamond Separators & Golden Underline) */}
        <nav
          aria-label="Navegação Principal"
          className="pointer-events-auto hidden md:flex items-center gap-6"
        >
          {[
            { href: '#anatomia', label: 'A Travessia' },
            { href: '#monte-no-fogo', label: 'Bancada do Chef' },
            { href: '#cardapio', label: 'Clássicos' },
            { href: '#sobre', label: 'A Brasa' },
          ].map((item, idx) => (
            <React.Fragment key={item.href}>
              {idx > 0 && (
                <span
                  aria-hidden="true"
                  className="text-[8px] text-[#F5A623]/55 select-none"
                >
                  ◆
                </span>
              )}
              <a
                href={item.href}
                className="relative py-1 font-cinzel text-[11px] font-semibold tracking-[0.24em] uppercase text-[#F4EFEA]/85 hover:text-[#F5A623] transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-gradient-to-r after:from-[#E85D1A] after:to-[#F5A623] hover:after:w-full after:transition-all after:duration-300"
              >
                {item.label}
              </a>
            </React.Fragment>
          ))}
        </nav>

        {/* Zone 3: Unboxed Architectural Comanda Trigger */}
        <div className="pointer-events-auto flex items-center gap-6 shrink-0">
          <button
            onClick={onOpenCart}
            className="group relative py-1 flex items-baseline gap-2.5 cursor-pointer text-left"
            aria-label="Abrir comanda de pedidos"
          >
            <span className="font-cinzel text-[11px] font-bold tracking-[0.26em] uppercase text-[#F4EFEA] group-hover:text-[#F5A623] transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              Comanda
            </span>
            <span className="font-editorial-serif italic text-base font-bold text-[#F5A623] group-hover:text-[#E85D1A] transition-colors tabular-nums">
              /{String(totalCartCount).padStart(2, '0')}
            </span>
            <span className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-[#F5A623]/70 via-[#E85D1A] to-transparent group-hover:from-[#E85D1A] group-hover:to-[#F5A623] transition-all" />
          </button>
        </div>
      </div>

      {/* Delicate Center-Fading Brass Hairline */}
      <div className="max-w-[1440px] mx-auto mt-4 h-[1px] hairline-gold-center opacity-45" />
    </header>
  );
};
