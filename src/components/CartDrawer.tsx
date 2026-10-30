/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { formatCurrencyBRL, IngredientItem } from '../utils/burgerLogic.ts';
import {
  X,
  Trash2,
  Flame,
  CheckCircle2,
  Receipt,
} from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weightGrams?: number;
  calories?: number;
  isCustom?: boolean;
  layers?: IngredientItem[];
  image?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}) => {
  const [orderType, setOrderType] = useState<'dine-in' | 'pickup' | 'delivery'>('dine-in');
  const [tableNumber, setTableNumber] = useState('07');
  const [customerName, setCustomerName] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const serviceTax = orderType === 'dine-in' ? subtotal * 0.1 : 0;
  const total = subtotal + serviceTax;

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const orderNum = `OUT-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrderId(orderNum);
    setIsSuccessModalOpen(true);
  };

  const handleCloseAll = () => {
    setIsSuccessModalOpen(false);
    onClearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-screen max-w-md bg-[#0C0806]/95 backdrop-blur-xl border-l border-[#F5A623]/30 text-[#F4EFEA] flex flex-col justify-between shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#F5A623]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Receipt className="w-5 h-5 text-[#F5A623]" />
              <div>
                <h3 className="font-cinzel font-bold text-base uppercase tracking-[0.2em] text-[#F4EFEA]">
                  Comanda da Brasa
                </h3>
                <p className="text-[11px] font-mono text-[#A39B95]">
                  {items.length} cortes registrados
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#A39B95] hover:text-[#F5A623] transition-colors cursor-pointer"
              aria-label="Fechar gaveta"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Type Toggle — Architectural Underline Tabs */}
          <div className="px-6 pt-4">
            <div className="grid grid-cols-3 border-b border-white/10 text-[11px] font-cinzel uppercase tracking-[0.18em]">
              {[
                { key: 'dine-in', label: 'Mesa Salão' },
                { key: 'pickup', label: 'Balcão' },
                { key: 'delivery', label: 'Delivery' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setOrderType(tab.key as 'dine-in' | 'pickup' | 'delivery')}
                  className={`py-2.5 text-center transition-colors relative cursor-pointer ${
                    orderType === tab.key
                      ? 'text-[#F5A623] font-bold'
                      : 'text-[#A39B95] hover:text-[#F4EFEA]'
                  }`}
                >
                  {tab.label}
                  {orderType === tab.key && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#E85D1A]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Items Ledger */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-white/10">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <Flame className="w-10 h-10 text-[#E85D1A]/40 mb-3 animate-pulse" />
                <h4 className="font-cinzel text-base font-bold uppercase tracking-widest text-[#F4EFEA]">
                  Sua comanda está vazia
                </h4>
                <p className="text-xs text-[#A39B95] max-w-xs mt-2">
                  Selecione um corte autoral ou monte sua própria receita na Bancada do Chef.
                </p>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="py-4 first:pt-0 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-cinzel font-bold text-sm text-[#F4EFEA] tracking-wide">
                          {item.name}
                        </span>
                        {item.isCustom && (
                          <span className="text-[9px] font-mono uppercase tracking-widest text-[#F5A623] border-l border-[#F5A623] pl-1.5">
                            Autoral
                          </span>
                        )}
                      </div>

                      {item.isCustom && item.layers && (
                        <p className="text-[11px] text-[#A39B95] mt-1 line-clamp-2 font-mono">
                          {item.layers.map(l => l.name).join(' · ')}
                        </p>
                      )}

                      <div className="text-[11px] font-mono text-[#A39B95] mt-1">
                        {formatCurrencyBRL(item.price)} cada
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-[#A39B95] hover:text-red-400 transition-colors cursor-pointer"
                      title="Remover item"
                      aria-label="Remover item da comanda"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 font-mono text-xs">
                    <div className="flex items-center gap-3 border-b border-white/15 pb-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-1.5 text-[#A39B95] hover:text-white cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-bold text-[#F4EFEA]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-1.5 text-[#A39B95] hover:text-white cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-editorial-serif italic font-bold text-[#F5A623] text-base tabular-nums">
                      {formatCurrencyBRL(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#F5A623]/25 bg-black/60 space-y-5">
              <div className="space-y-1.5 font-mono text-xs text-[#A39B95]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#F4EFEA]">{formatCurrencyBRL(subtotal)}</span>
                </div>
                {orderType === 'dine-in' && (
                  <div className="flex justify-between">
                    <span>Serviço Salão (10%)</span>
                    <span className="text-[#F4EFEA]">{formatCurrencyBRL(serviceTax)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-base font-bold text-[#F4EFEA] pt-3 border-t border-white/10">
                  <span className="font-cinzel uppercase tracking-widest text-xs">Total Geral</span>
                  <span className="text-2xl font-editorial-serif italic text-molten-gold tabular-nums">
                    {formatCurrencyBRL(total)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleFinishOrder} className="space-y-4">
                {orderType === 'dine-in' ? (
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#A39B95] mb-1">
                      Identificação da Mesa
                    </label>
                    <input
                      type="text"
                      required
                      value={tableNumber}
                      onChange={e => setTableNumber(e.target.value)}
                      placeholder="Mesa 07"
                      className="w-full py-2 bg-transparent border-b border-[#F5A623]/40 text-xs text-white font-mono focus:border-[#E85D1A] outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#A39B95] mb-1">
                      Seu Nome para a Comanda
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Ex: João Vitor"
                      className="w-full py-2 bg-transparent border-b border-[#F5A623]/40 text-xs text-white font-mono focus:border-[#E85D1A] outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 clip-chamfer bg-gradient-to-r from-[#E85D1A] to-[#F5A623] text-[#110D0B] font-cinzel font-black text-xs uppercase tracking-[0.22em] flex items-center justify-center gap-3 hover:brightness-110 transition-all cursor-pointer"
                >
                  <span>Enviar Pedido para a Brasa</span>
                  <span>──►</span>
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md p-8 bg-[#0E0907] border-t-2 border-b-2 border-[#F5A623]/50 text-center shadow-2xl">
            <CheckCircle2 className="w-10 h-10 text-[#F5A623] mx-auto mb-4" />

            <p className="text-[10px] font-mono text-[#E85D1A] uppercase tracking-[0.3em] font-bold mb-1">
              Pedido Enviado à Cozinha
            </p>
            <h3 className="text-2xl font-cinzel font-black text-[#F4EFEA] tracking-wider mb-2">
              COMANDA EM BRASA
            </h3>
            <p className="text-xs text-[#A39B95] leading-relaxed mb-6 font-sans">
              Seus cortes estão sendo selados no fogo de macieira a 400°C. Tempo estimado: 18 a 22 minutos.
            </p>

            <div className="py-4 border-y border-white/10 mb-6 text-left font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#A39B95]">Código</span>
                <span className="text-[#F5A623] font-bold">{confirmedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A39B95]">Modalidade</span>
                <span className="text-[#F4EFEA]">
                  {orderType === 'dine-in' ? `Salão (Mesa ${tableNumber})` : orderType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A39B95]">Total</span>
                <span className="text-[#E85D1A] font-bold">{formatCurrencyBRL(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCloseAll}
              className="w-full py-3 clip-chamfer bg-[#E85D1A] text-[#110D0B] font-cinzel font-bold text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all cursor-pointer"
            >
              Entendido · Acompanhar no Salão
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
