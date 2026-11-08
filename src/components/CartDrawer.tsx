/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { formatCurrencyBRL, IngredientItem, MeatDoneness, MEAT_DONENESS_OPTIONS } from '../utils/burgerLogic.ts';
import { formatWhatsAppOrderMessage } from '../utils/burgerNamer.ts';
import { sound } from '../utils/soundEffects.ts';
import {
  X,
  Trash2,
  Flame,
  CheckCircle2,
  Receipt,
  Send,
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
  meatDoneness?: MeatDoneness;
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

    sound.playSuccess();
    const orderNum = `OUT-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedOrderId(orderNum);
    setIsSuccessModalOpen(true);
  };

  const handleSendWhatsAppFromCart = () => {
    sound.playSuccess();
    const orderNum = confirmedOrderId || `OUT-${Math.floor(1000 + Math.random() * 9000)}`;
    const encoded = formatWhatsAppOrderMessage({
      orderNumber: orderNum,
      orderType: orderType,
      tableNumber: tableNumber,
      customerName: customerName,
      items: items,
      totalPrice: total,
    });
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
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
          className="w-screen max-w-md bg-[#160F22]/98 backdrop-blur-xl border-l-2 border-[#8E6FD1] text-[#EDE3F7] flex flex-col justify-between shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#8E6FD1]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#8E6FD1] text-[#0D0814] shadow-[2px_2px_0px_#E0A95F]">
                <Receipt className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="font-poster text-2xl uppercase tracking-[0.06em] text-[#EDE3F7] m-0 leading-none">
                  COMANDA DA BRASA
                </h3>
                <p className="text-[11px] font-mono text-[#A797BD] mt-1">
                  {items.length} cortes registrados
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#A797BD] hover:text-[#FF4FA3] transition-colors cursor-pointer"
              aria-label="Fechar gaveta"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Type Toggle — Sticker Tabs */}
          <div className="px-6 pt-4">
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono uppercase tracking-[0.12em]">
              {[
                { key: 'dine-in', label: 'Mesa Salão' },
                { key: 'pickup', label: 'Balcão' },
                { key: 'delivery', label: 'Delivery' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setOrderType(tab.key as 'dine-in' | 'pickup' | 'delivery')}
                  className={`py-2 text-center transition-all cursor-pointer ${
                    orderType === tab.key
                      ? 'bg-[#8E6FD1] text-[#0D0814] font-bold shadow-[2px_2px_0px_#EDE3F7]'
                      : 'bg-[#0D0814] text-[#A797BD] border border-[#8E6FD1]/30 hover:text-white'
                  }`}
                >
                  {tab.label}
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-grotesk font-black text-sm text-[#EDE3F7] tracking-wide">
                          {item.name}
                        </span>
                        {item.isCustom && (
                          <span className="text-[9px] font-mono uppercase tracking-widest text-[#FF4FA3] border-l border-[#FF4FA3] pl-1.5 font-bold">
                            Autoral
                          </span>
                        )}
                        {item.meatDoneness && (
                          <span className="px-1.5 py-0.2 bg-[#E0A95F]/20 text-[#E0A95F] text-[9px] font-mono border border-[#E0A95F]/40 font-bold">
                            {item.meatDoneness === 'rare' ? '52°C Mal Passado' : item.meatDoneness === 'well-done' ? '68°C Bem Passado' : '58°C Ao Ponto'}
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
                  className="w-full py-4 px-5 bg-[#8E6FD1] hover:bg-[#FF4FA3] text-[#0D0814] hover:text-white font-grotesk font-black text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_#EDE3F7] hover:shadow-[2px_2px_0px_#EDE3F7] hover:translate-x-[2px] hover:translate-y-[2px] flex items-center justify-center gap-3 transition-all cursor-pointer"
                >
                  <span>ENVIAR PEDIDO PARA A BRASA</span>
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
          <div className="relative w-full max-w-md p-6 sm:p-8 bg-[#160F22] border-2 border-[#8E6FD1] text-center shadow-[10px_10px_0px_#8E6FD1]">
            <div className="w-12 h-12 bg-[#8E6FD1] text-[#0D0814] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#E0A95F]">
              <Flame className="w-6 h-6 fill-current" />
            </div>

            <p className="text-[10px] font-mono text-[#E0A95F] uppercase tracking-[0.3em] font-bold mb-1">
              ✦ PEDIDO ENVIADO À COZINHA ✦
            </p>
            <h3 className="font-poster text-4xl uppercase tracking-wider text-[#EDE3F7] mb-2 leading-none">
              COMANDA EM BRASA
            </h3>
            <p className="text-xs text-[#A797BD] leading-relaxed mb-6 font-grotesk">
              Seus cortes estão sendo selados no fogo de macieira a 400°C. Tempo estimado: 18 a 22 minutos.
            </p>

            <div className="py-4 border-y border-[#8E6FD1]/30 mb-6 text-left font-mono text-xs space-y-2 bg-[#0D0814]/60 p-3">
              <div className="flex justify-between">
                <span className="text-[#A797BD]">CÓDIGO</span>
                <span className="text-[#E0A95F] font-bold">{confirmedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A797BD]">MODALIDADE</span>
                <span className="text-[#EDE3F7]">
                  {orderType === 'dine-in' ? `Salão (Mesa ${tableNumber})` : orderType === 'pickup' ? 'Retirada Balcão' : 'Delivery'}
                </span>
              </div>
              {customerName && (
                <div className="flex justify-between">
                  <span className="text-[#A797BD]">CLIENTE</span>
                  <span className="text-[#EDE3F7]">{customerName}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-[#8E6FD1]/20">
                <span className="text-[#A797BD]">TOTAL DA CONTA</span>
                <span className="font-poster text-xl text-[#FF4FA3] leading-none">{formatCurrencyBRL(total)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSendWhatsAppFromCart}
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-[#0D0814] font-grotesk font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#0D0814] hover:shadow-[1px_1px_0px_#0D0814] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 fill-current" />
                <span>ENVIAR COMANDA PARA O WHATSAPP</span>
              </button>

              <button
                type="button"
                onClick={handleCloseAll}
                className="w-full py-3 px-4 bg-[#0D0814] hover:bg-[#231636] border border-[#8E6FD1]/60 text-[#EDE3F7] font-grotesk font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#8E6FD1] hover:shadow-[1px_1px_0px_#8E6FD1] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
              >
                FECHAR E ACOMPANHAR NO SALÃO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
