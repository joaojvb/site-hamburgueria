/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Floating Mini-Comanda Sticky Trigger (Mobile & Desktop Scroll)
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Flame } from 'lucide-react';
import { formatCurrencyBRL } from '../utils/burgerLogic.ts';
import { sound } from '../utils/soundEffects.ts';

interface FloatingStickyCartProps {
  totalCartCount: number;
  totalPrice: number;
  onOpenCart: () => void;
  isCartOpen: boolean;
}

export const FloatingStickyCart: React.FC<FloatingStickyCartProps> = ({
  totalCartCount,
  totalPrice,
  onOpenCart,
  isCartOpen,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 380);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldShow = isScrolled && totalCartCount > 0 && !isCartOpen;

  const handleClick = () => {
    sound.playHover();
    onOpenCart();
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="fixed bottom-6 right-4 sm:right-8 z-40"
        >
          <button
            onClick={handleClick}
            className="group relative px-4 py-3 bg-[#160F22] hover:bg-[#8E6FD1] text-[#EDE3F7] hover:text-[#0D0814] border-2 border-[#E0A95F] shadow-[4px_4px_0px_#8E6FD1] hover:shadow-[2px_2px_0px_#8E6FD1] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center gap-3"
            aria-label={`Abrir comanda com ${totalCartCount} itens, total de ${formatCurrencyBRL(totalPrice)}`}
          >
            {/* Animated Beacon */}
            <div className="relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#FF4FA3] animate-ping absolute" />
              <div className="w-6 h-6 bg-[#8E6FD1] group-hover:bg-[#0D0814] text-[#0D0814] group-hover:text-[#E0A95F] flex items-center justify-center transition-colors shadow-[1px_1px_0px_#0D0814]">
                <ShoppingBag className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            <div className="flex flex-col text-left">
              <span className="font-grotesk font-black text-xs uppercase tracking-wider leading-none">
                VER COMANDA ({totalCartCount})
              </span>
              <span className="font-poster text-base text-[#E0A95F] group-hover:text-[#0D0814] transition-colors leading-none mt-1">
                {formatCurrencyBRL(totalPrice)}
              </span>
            </div>

            <span className="px-1.5 py-0.5 bg-[#FF4FA3] text-white text-[9px] font-mono font-bold uppercase shadow-[1px_1px_0px_#0D0814] shrink-0">
              ABRIR
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

