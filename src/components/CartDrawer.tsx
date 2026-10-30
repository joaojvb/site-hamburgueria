/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrencyBRL, IngredientItem } from '../utils/burgerLogic.ts';
import { MenuItem } from '../data/menuItems.ts';
import {
  X,
  Trash2,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
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
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-screen max-w-md bg-[#16110E] border-l border-[#F5A623]/25 text-[#F4EFEA] flex flex-col justify-between shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#F5A623]/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E85D1A]/20 text-[#E85D1A] border border-[#E85D1A]/40">
                <Receipt className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F4EFEA]">Comanda da Brasa</h3>
                <p className="text-xs font-mono text-[#A39B95]">{items.length} itens registrados</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-[#A39B95] hover:text-[#F4EFEA] transition-colors cursor-pointer"
              aria-label="Fechar gaveta"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Type Toggle */}
          <div className="px-6 pt-4">
            <div className="p-1 rounded-xl bg-black/40 border border-white/10 grid grid-cols-3 gap-1 text-xs font-mono">
              <button
                onClick={() => setOrderType('dine-in')}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                  orderType === 'dine-in'
                    ? 'bg-[#E85D1A] text-[#110D0B] font-bold shadow-sm'
                    : 'text-[#A39B95] hover:text-[#F4EFEA]'
                }`}
              >
                Mesa Salão
              </button>
              <button
                onClick={() => setOrderType('pickup')}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                  orderType === 'pickup'
                    ? 'bg-[#E85D1A] text-[#110D0B] font-bold shadow-sm'
                    : 'text-[#A39B95] hover:text-[#F4EFEA]'
                }`}
              >
                Balcão
              </button>
              <button
                onClick={() => setOrderType('delivery')}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-[#E85D1A] text-[#110D0B] font-bold shadow-sm'
                    : 'text-[#A39B95] hover:text-[#F4EFEA]'
                }`}
              >
                Delivery
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <Flame className="w-12 h-12 text-[#E85D1A]/40 mb-3 animate-pulse" />
                <h4 className="font-serif text-lg font-bold text-[#F4EFEA]">Sua comanda está vazia</h4>
                <p className="text-xs text-[#A39B95] max-w-xs mt-1">
                  Adicione hambúrgueres do cardápio Bento ou use o "Monte no Fogo" para criar sua própria receita.
                </p>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#F5A623]/30 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-sm text-[#F4EFEA]">
                          {item.name}
                        </span>
                        {item.isCustom && (
                          <span className="px-1.5 py-0.2 rounded bg-[#F5A623]/20 text-[#F5A623] text-[9px] font-mono uppercase">
                            Artesanal
                          </span>
                        )}
                      </div>

                      {item.isCustom && item.layers && (
                        <p className="text-[11px] text-[#A39B95] mt-1 line-clamp-2 font-mono">
                          {item.layers.map(l => l.name).join(' · ')}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs font-mono text-[#A39B95] mt-1">
                        <span>{formatCurrencyBRL(item.price)} cada</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Remover item"
                      aria-label="Remover item da comanda"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1 font-mono text-xs">
                    <div className="flex items-center gap-2 bg-black/60 rounded-lg p-1 border border-white/5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 text-white cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-[#F4EFEA]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 text-white cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold text-[#F5A623] text-sm tabular-nums">
                      {formatCurrencyBRL(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#F5A623]/20 bg-black/50 space-y-4">
              <div className="space-y-1.5 font-mono text-xs text-[#A39B95]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#F4EFEA]">{formatCurrencyBRL(subtotal)}</span>
                </div>
                {orderType === 'dine-in' && (
                  <div className="flex justify-between">
                    <span>Taxa de Serviço Salão (10%)</span>
                    <span className="text-[#F4EFEA]">{formatCurrencyBRL(serviceTax)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#F4EFEA] pt-2 border-t border-white/10">
                  <span className="font-serif">Total Geral</span>
                  <span className="text-[#E85D1A] font-mono">{formatCurrencyBRL(total)}</span>
                </div>
              </div>

              <form onSubmit={handleFinishOrder} className="space-y-3">
                {orderType === 'dine-in' ? (
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#A39B95] mb-1">
                      Identificação da Mesa
                    </label>
                    <input
                      type="text"
                      required
                      value={tableNumber}
                      onChange={e => setTableNumber(e.target.value)}
                      placeholder="Mesa 07"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white font-mono focus:border-[#E85D1A] outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#A39B95] mb-1">
                      Seu Nome para a Comanda
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Ex: João Vitor"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white font-mono focus:border-[#E85D1A] outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E85D1A] to-[#F5A623] text-[#110D0B] font-bold font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#E85D1A]/25 cursor-pointer"
                >
                  <span>Enviar Pedido para a Brasa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md p-8 rounded-3xl glass-outback border border-[#E85D1A]/40 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#E85D1A]/20 border border-[#E85D1A] text-[#F5A623] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <p className="text-xs font-mono text-[#E85D1A] uppercase tracking-widest font-bold mb-1">
              Pedido Enviado à Cozinha
            </p>
            <h3 className="text-2xl font-serif font-black text-[#F4EFEA] mb-2">
              COMUTADOR EM BRASA!
            </h3>
            <p className="text-xs text-[#A39B95] leading-relaxed mb-6 font-sans">
              Seus cortes estão sendo selados no fogo de macieira a 400°C. O tempo estimado de preparo é de 18 a 22 minutos.
            </p>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 mb-6 text-left font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#A39B95]">Código da Comanda</span>
                <span className="text-[#F5A623] font-bold">{confirmedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A39B95]">Modalidade</span>
                <span className="text-[#F4EFEA]">
                  {orderType === 'dine-in' ? `Salão (Mesa ${tableNumber})` : orderType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A39B95]">Valor Total</span>
                <span className="text-[#E85D1A] font-bold">{formatCurrencyBRL(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCloseAll}
              className="w-full py-3 rounded-xl bg-[#E85D1A] text-[#110D0B] font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity cursor-pointer"
            >
              Entendido · Acompanhar no Salão
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
