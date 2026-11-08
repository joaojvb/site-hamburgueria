/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Ticket / Comanda Térmica Spotify Daylist Style
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrencyBRL, IngredientItem, calculateBurgerStats, MeatDoneness, MEAT_DONENESS_OPTIONS } from '../utils/burgerLogic.ts';
import { generateBurgerIdentity, formatWhatsAppOrderMessage } from '../utils/burgerNamer.ts';
import { sound } from '../utils/soundEffects.ts';
import { X, Send, ShoppingBag, Sparkles, Flame, Check } from 'lucide-react';

interface BurgerDaylistTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: IngredientItem[];
  meatDoneness?: MeatDoneness;
  onConfirmAddToCart: (customName: string, doneness?: MeatDoneness) => void;
}

export const BurgerDaylistTicketModal: React.FC<BurgerDaylistTicketModalProps> = ({
  isOpen,
  onClose,
  layers,
  meatDoneness = 'medium',
  onConfirmAddToCart,
}) => {
  if (!isOpen) return null;

  const identity = generateBurgerIdentity(layers);
  const stats = calculateBurgerStats(layers);
  const orderNum = `OUT-${Math.floor(1000 + Math.random() * 9000)}`;
  const currentDoneness = MEAT_DONENESS_OPTIONS.find(d => d.id === meatDoneness) || MEAT_DONENESS_OPTIONS[1];

  const handleSendWhatsApp = () => {
    sound.playSuccess();
    const encoded = formatWhatsAppOrderMessage({
      orderNumber: orderNum,
      orderType: 'dine-in',
      tableNumber: '07',
      items: [
        {
          name: identity.title,
          quantity: 1,
          price: stats.totalPrice,
          isCustom: true,
          layers: layers,
          meatDoneness: stats.hasPatty ? meatDoneness : undefined,
        },
      ],
      totalPrice: stats.totalPrice,
    });
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleAddAndClose = () => {
    sound.playAdd();
    onConfirmAddToCart(identity.title, stats.hasPatty ? meatDoneness : undefined);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0D0814]/85 backdrop-blur-md"
        />

        {/* The Thermal Daylist Ticket Card */}
        <motion.div
          initial={{ scale: 0.9, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 16, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative z-10 w-full max-w-lg bg-[#EDE3F7] text-[#0D0814] p-6 sm:p-8 border-4 border-[#0D0814] shadow-[10px_10px_0px_#8E6FD1] my-8 selection:bg-[#0D0814] selection:text-[#EDE3F7]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-[#0D0814] text-[#EDE3F7] hover:bg-[#FF4FA3] hover:text-white transition-colors cursor-pointer"
            title="Fechar Ticket"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Perforation Teeth Simulation */}
          <div className="flex justify-between items-center pb-4 border-b-2 border-dashed border-[#0D0814]/60">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#FF5B1F] fill-current" />
              <span className="font-grotesk font-black text-sm uppercase tracking-widest text-[#0D0814]">
                OUTLAND FIRE GRILL · COMANDA
              </span>
            </div>
            <span className="font-mono text-xs text-[#0D0814]/70 mr-8">
              {orderNum}
            </span>
          </div>

          {/* SPOTIFY DAYLIST TITLE BANNER */}
          <div className="my-6 p-4 bg-[#0D0814] text-[#EDE3F7] border-2 border-[#0D0814] shadow-[4px_4px_0px_#E0A95F]">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-1.5 py-0.2 bg-[#FF4FA3] text-white font-mono text-[9px] font-black uppercase">
                {identity.personalityTag}
              </span>
              <span className="font-mono text-[10px] text-[#E0A95F] uppercase tracking-widest">
                ✦ TÍTULO DO SEU CORTE
              </span>
            </div>
            <h3 className="font-poster text-3xl sm:text-4xl text-[#EDE3F7] tracking-wider uppercase leading-none mt-1">
              {identity.title}
            </h3>
            <p className="font-grotesk text-xs text-[#A797BD] mt-2 font-bold tracking-wide">
              {identity.subtitle}
            </p>
          </div>

          {/* Meat Doneness Badge on Ticket */}
          {stats.hasPatty && (
            <div className="mb-4 px-3 py-2 bg-[#0D0814]/10 border-l-4 border-[#FF5B1F] flex items-center justify-between font-mono text-xs">
              <span className="text-[#0D0814]/70 uppercase font-bold">PONTO DA CARNE:</span>
              <span className="font-bold text-[#0D0814] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF5B1F]" />
                {currentDoneness.badge} · {currentDoneness.label.toUpperCase()}
              </span>
            </div>
          )}

          {/* Layer by Layer Breakdown */}
          <div className="my-4 space-y-1.5 font-mono text-xs border-b-2 border-dashed border-[#0D0814]/40 pb-4">
            <div className="flex justify-between text-[11px] font-bold text-[#0D0814]/60 pb-1">
              <span>CAMADA / INGREDIENTE</span>
              <span>PREÇO</span>
            </div>
            {layers.map((layer, idx) => (
              <div key={idx} className="flex justify-between items-center py-0.5">
                <span className="truncate pr-2">
                  <span className="font-bold text-[#8E6FD1] mr-1">0{idx + 1}.</span>
                  {layer.name}
                  {layer.weightGrams ? ` (${layer.weightGrams}g)` : ''}
                </span>
                <span className="shrink-0 font-bold">
                  +{formatCurrencyBRL(layer.price)}
                </span>
              </div>
            ))}
          </div>

          {/* Telemetry Summary */}
          <div className="grid grid-cols-3 gap-2 py-3 bg-[#0D0814]/5 border border-[#0D0814]/20 p-3 mb-5 font-mono text-center">
            <div>
              <span className="text-[10px] text-[#0D0814]/60 uppercase block">PESO TOTAL</span>
              <span className="font-bold text-sm text-[#0D0814]">{stats.totalWeightGrams}g</span>
            </div>
            <div className="border-x border-[#0D0814]/20">
              <span className="text-[10px] text-[#0D0814]/60 uppercase block">ENERGIA</span>
              <span className="font-bold text-sm text-[#0D0814]">{stats.totalCalories} kcal</span>
            </div>
            <div>
              <span className="text-[10px] text-[#0D0814]/60 uppercase block">TOTAL</span>
              <span className="font-poster text-xl text-[#0D0814] leading-none block mt-0.5">
                {formatCurrencyBRL(stats.totalPrice)}
              </span>
            </div>
          </div>

          {/* Barcode Simulation */}
          <div className="py-2 text-center border-t border-[#0D0814]/30">
            <div className="font-mono text-[9px] tracking-[0.3em] text-[#0D0814]/50 mb-1">
              ||| | | |||| | ||||| ||| || |||||| | ||| ||
            </div>
            <p className="font-mono text-[10px] text-[#0D0814]/70">
              OUTLAND BANCADA · 400°C GRELHA A CARVÃO
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSendWhatsApp}
              className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-[#0D0814] font-grotesk font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#0D0814] hover:shadow-[1px_1px_0px_#0D0814] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>PEDIR NO WHATSAPP</span>
            </button>

            <button
              onClick={handleAddAndClose}
              className="flex-1 py-3 px-4 bg-[#8E6FD1] hover:bg-[#FF4FA3] text-[#0D0814] hover:text-white font-grotesk font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#0D0814] hover:shadow-[1px_1px_0px_#0D0814] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 fill-current" />
              <span>ADICIONAR À COMANDA</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

