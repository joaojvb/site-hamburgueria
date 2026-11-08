/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { PosterHero } from './components/PosterHero.tsx';
import { BurgerExplodedScroll } from './components/BurgerExplodedScroll.tsx';
import { BurgerCustomizer } from './components/BurgerCustomizer.tsx';
import { BentoGridMenu } from './components/BentoGridMenu.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer, CartItem } from './components/CartDrawer.tsx';
import { FloatingStickyCart } from './components/FloatingStickyCart.tsx';
import {
  SequenceScrollBackground,
  SequenceStageInfo,
} from './components/SequenceScrollBackground.tsx';
import { MenuItem } from './data/menuItems.ts';
import { IngredientItem, calculateBurgerStats, MeatDoneness } from './utils/burgerLogic.ts';

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
  const totalCartPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
    meatDoneness?: MeatDoneness;
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
        meatDoneness: customOrder.meatDoneness,
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

  return (
    <div className="relative isolate min-h-screen bg-transparent text-[#EDE3F7] selection:bg-[#8E6FD1] selection:text-[#0D0814]">
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
        {/* ATO I: HERO POSTER EDITORIAL (ONDE A BRASA ENCONTRA O PÃO) */}
        <PosterHero />

        {/* ATO II & III: HAMBÚRGUER QUE SE SEPARA NO SCROLL (145 FRAMES WEBP CALIBRADOS) */}
        <BurgerExplodedScroll />

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

      {/* Floating Sticky Mini-Comanda Trigger */}
      <FloatingStickyCart
        totalCartCount={totalCartCount}
        totalPrice={totalCartPrice}
        onOpenCart={() => setIsCartOpen(true)}
        isCartOpen={isCartOpen}
      />
    </div>
  );
}
