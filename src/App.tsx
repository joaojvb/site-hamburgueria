/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { BurgerScrollytelling } from './components/BurgerScrollytelling.tsx';
import { BurgerCustomizer } from './components/BurgerCustomizer.tsx';
import { BentoGridMenu } from './components/BentoGridMenu.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer, CartItem } from './components/CartDrawer.tsx';
import {
  SequenceScrollBackground,
  SequenceStageInfo,
} from './components/SequenceScrollBackground.tsx';
import { MenuItem } from './data/menuItems.ts';
import { IngredientItem, calculateBurgerStats } from './utils/burgerLogic.ts';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'outland-blooming-seed',
      name: 'The Outland Blooming Burger',
      price: 54.9,
      quantity: 1,
      weightGrams: 480,
      calories: 980,
      isCustom: false,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [stageInfo, setStageInfo] = useState<SequenceStageInfo>({
    stageNumber: 1,
    id: 'facade',
    label: 'Estágio 01 · Fachada Outland',
    subtitle: 'Entrada Principal · Aproximando da Porta',
    progress: 0,
  });

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Add Menu item to cart
  const handleAddMenuItem = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          weightGrams: item.weightGrams,
          calories: item.calories,
          isCustom: false,
          image: item.image,
        },
      ];
    });
  };

  // Add Custom Burger from "Monte no Fogo"
  const handleAddCustomBurger = (customOrder: {
    id: string;
    name: string;
    layers: IngredientItem[];
    stats: ReturnType<typeof calculateBurgerStats>;
  }) => {
    setCartItems(prev => [
      ...prev,
      {
        id: customOrder.id,
        name: customOrder.name,
        price: customOrder.stats.totalPrice,
        quantity: 1,
        weightGrams: customOrder.stats.totalWeightGrams,
        calories: customOrder.stats.totalCalories,
        isCustom: true,
        layers: customOrder.layers,
      },
    ]);
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(i => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleScrollToBuilder = () => {
    const el = document.getElementById('monte-no-fogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative isolate min-h-screen bg-transparent text-[#F4EFEA] selection:bg-[#E85D1A] selection:text-white">
      {/* BACKGROUND FIXO EM PLANO-SEQUÊNCIA (SCROLLYTELLING 4 ESTÁGIOS + VÍDEO FPV HABILITADO POR PADRÃO) */}
      <SequenceScrollBackground
        onStageChange={setStageInfo}
        videoMode={true}
      />

      {/* Architectural Unboxed Top Bar */}
      <Navbar
        totalCartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        stageInfo={stageInfo}
      />

      <main className="relative z-10">
        {/* ESTÁGIOS 1, 2 E 3: ENTRADA NA FACHADA -> SALÃO -> HAMBÚRGUER DESCONSTRUÍDO NA GRELHA */}
        <BurgerScrollytelling onGoToBuilder={handleScrollToBuilder} />

        {/* ESTÁGIO 4: MONTADOR INTERATIVO 3D NA BANCADA RÚSTICA DO CHEF */}
        <BurgerCustomizer onAddToCart={handleAddCustomBurger} />

        {/* CURADORIA DA CASA (GALERIA EDITORIAL ASSIMÉTRICA) */}
        <BentoGridMenu onAddToCart={handleAddMenuItem} />
      </main>

      {/* Brand & Craft Footer */}
      <Footer />

      {/* Slide-over Comanda & Order Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
