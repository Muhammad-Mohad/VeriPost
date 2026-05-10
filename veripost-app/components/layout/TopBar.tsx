'use client';

import { Menu } from 'lucide-react';
import { Logo } from './Logo';

export const TopBar = ({ onMenu }: { onMenu: () => void }) => (
  <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-bg-soft/80 backdrop-blur-md sticky top-0 z-30">
    <Logo />
    <button
      onClick={onMenu}
      className="grid place-items-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 focus-ring"
      aria-label="Open navigation"
    >
      <Menu size={18} />
    </button>
  </div>
);
