import React, { useState } from 'react';
import { Flame, ShoppingBag, Volume2, VolumeX } from 'lucide-react';
import { SequenceStageInfo } from './SequenceScrollBackground.tsx';
import { SunburstIcon, StickerTag } from './PosterOrnaments.tsx';
import { sound } from '../utils/soundEffects.ts';

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
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(() => sound.isEnabled());

  const handleToggleSound = () => {
    const updated = sound.toggle();
    setIsAudioEnabled(updated);
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-4 sm:px-10 pt-5 pb-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Poster Brutal-Pop) */}
        <a
          href="#topo"
          className="pointer-events-auto flex items-center gap-3 group"
          aria-label="Ir para o topo"
        >
          <div className="relative flex items-center justify-center w-8 h-8 bg-[#8E6FD1] text-[#0D0814] border border-[#EDE3F7] shadow-[3px_3px_0px_#E0A95F] group-hover:rotate-6 transition-transform">
            <Flame className="w-5 h-5 fill-current" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-poster text-2xl sm:text-3xl tracking-[0.08em] uppercase text-[#EDE3F7] group-hover:text-[#8E6FD1] transition-colors drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              OUTLAND
            </span>
            <StickerTag variant="pink" rotate="-rotate-2" className="text-[9px] py-0 px-1.5 hidden sm:inline-flex">
              FIRE GRILL
            </StickerTag>
          </div>

          {stageInfo && (
            <span className="hidden xl:inline-flex items-center gap-2 pl-3 ml-2 border-l-2 border-[#8E6FD1]/40 font-mono text-[10px] tracking-[0.2em] text-[#A797BD] uppercase">
              <span className="w-1.5 h-1.5 bg-[#E0A95F]" />
              {stageInfo.label}
            </span>
          )}
        </a>

        {/* Zone 2: Navigation Links Retangular com Sombra Chapada (Alinhado com o Telemetria) */}
        <nav
          aria-label="Navegação Principal"
          className="pointer-events-auto hidden md:flex items-center gap-6 px-6 py-2.5 bg-[#160F22] border-2 border-[#8E6FD1] shadow-[4px_4px_0px_#8E6FD1] backdrop-blur-md"
        >
          {[
            { href: '#anatomia', label: '8 Camadas' },
            { href: '#monte-no-fogo', label: 'Bancada' },
            { href: '#cardapio', label: 'Clássicos' },
            { href: '#sobre', label: 'A Brasa' },
          ].map((item, idx) => (
            <React.Fragment key={item.href}>
              {idx > 0 && (
                <SunburstIcon size={11} color="#E0A95F" spin={false} className="opacity-80" />
              )}
              <a
                href={item.href}
                className="font-grotesk font-black text-xs tracking-[0.22em] uppercase text-[#EDE3F7] hover:text-[#8E6FD1] transition-colors"
              >
                {item.label}
              </a>
            </React.Fragment>
          ))}
        </nav>

        {/* Zone 3: Sound Switch & Tactile Sticker Comanda Trigger */}
        <div className="pointer-events-auto flex items-center gap-3 shrink-0">
          <button
            onClick={handleToggleSound}
            className="px-2.5 py-2 bg-[#160F22] hover:bg-[#231636] text-[#EDE3F7] border-2 border-[#8E6FD1]/50 shadow-[3px_3px_0px_#8E6FD1] hover:shadow-[1px_1px_0px_#8E6FD1] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5"
            title={isAudioEnabled ? 'Desativar som da grelha' : 'Ativar som da grelha'}
            aria-label={isAudioEnabled ? 'Desativar som' : 'Ativar som'}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#E0A95F] animate-pulse" />
                <span className="hidden sm:inline font-mono text-[10px] font-bold text-[#E0A95F]">SOM ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#A797BD]" />
                <span className="hidden sm:inline font-mono text-[10px] font-bold text-[#A797BD]">MUDO</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenCart}
            className="group relative px-4 py-2 bg-[#160F22] hover:bg-[#8E6FD1] text-[#EDE3F7] hover:text-[#0D0814] border-2 border-[#8E6FD1] font-grotesk font-black text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0px_#E0A95F] hover:shadow-[2px_2px_0px_#E0A95F] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer flex items-center gap-2.5"
            aria-label={`Comanda com ${totalCartCount} itens`}
          >
            <ShoppingBag className="w-4 h-4 text-[#E0A95F] group-hover:text-[#0D0814] transition-colors" />
            <span>COMANDA</span>
            <span className="px-1.5 py-0.5 bg-[#FF4FA3] text-white text-[11px] font-mono font-bold leading-none tabular-nums shadow-[1px_1px_0px_#0D0814]">
              {String(totalCartCount).padStart(2, '0')}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
