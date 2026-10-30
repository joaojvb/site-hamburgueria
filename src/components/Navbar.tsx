/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, LayoutGrid, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  totalCartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ totalCartCount, onOpenCart }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-5 sm:px-10 py-5">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Expressive Brand Wordmark (WildCrumb / Outland Luxury Style) */}
        <a
          href="#anatomia"
          className="pointer-events-auto flex items-center gap-2.5 text-xl sm:text-2xl font-serif italic font-black tracking-tight text-[#F4EFEA] whitespace-nowrap shrink-0 group drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#0A0706] border border-[#E85D1A]/50 text-[#E85D1A] group-hover:bg-[#E85D1A] group-hover:text-[#110D0B] transition-colors shadow-lg">
            <Flame className="w-4 h-4 fill-current" />
          </span>
          <span className="not-italic font-serif font-black tracking-tight">
            Outland<span className="text-[#F5A623] italic font-normal ml-0.5">Fire</span>
          </span>
        </a>

        {/* Zone 2: Floating Frosted Dock Navigation (Sky Cookie 1:1 Aesthetic) */}
        <nav
          aria-label="Navegação Principal"
          className="pointer-events-auto hidden md:flex items-center gap-2"
        >
          <a
            href="#anatomia"
            className="px-4 py-2.5 rounded-xl bg-[#090706] text-[#F4EFEA] border border-white/15 text-xs font-sans font-semibold flex items-center gap-2 shadow-xl hover:border-[#F5A623]/50 transition-all whitespace-nowrap shrink-0"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>Anatomia 3D</span>
          </a>
          <a
            href="#monte-no-fogo"
            className="px-4 py-2.5 rounded-xl frosted-sky-capsule text-xs font-sans font-medium text-[#F4EFEA]/90 hover:text-white hover:border-[#F5A623]/40 transition-all whitespace-nowrap shrink-0"
          >
            Monte no Fogo
          </a>
          <a
            href="#cardapio"
            className="px-4 py-2.5 rounded-xl frosted-sky-capsule text-xs font-sans font-medium text-[#F4EFEA]/90 hover:text-white hover:border-[#F5A623]/40 transition-all whitespace-nowrap shrink-0"
          >
            Clássicos
          </a>
          <a
            href="#sobre"
            className="px-4 py-2.5 rounded-xl frosted-sky-capsule text-xs font-sans font-medium text-[#F4EFEA]/90 hover:text-white hover:border-[#F5A623]/40 transition-all whitespace-nowrap shrink-0"
          >
            A Brasa
          </a>
        </nav>

        {/* Zone 3: Floating Action Dock + Obsidian Cart Button */}
        <div className="pointer-events-auto flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl frosted-sky-capsule text-[11px] font-mono text-[#F4EFEA]/85">
            <span className="w-2 h-2 rounded-full bg-[#E85D1A] animate-pulse" />
            <span>BRASA 400°C</span>
          </div>

          <button
            onClick={onOpenCart}
            className="px-4 py-2.5 rounded-xl bg-[#090706] hover:bg-[#16100D] text-[#F4EFEA] border border-[#F5A623]/35 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 shadow-2xl transition-all cursor-pointer whitespace-nowrap shrink-0"
            aria-label="Abrir comanda de pedidos"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>Comanda</span>
            <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[#E85D1A] to-[#F5A623] text-[#110D0B] text-[10px] font-black tabular-nums">
              {totalCartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
