'use client';

import { NAV_ROUTES } from '@/lib/nav';
import { NavItem } from './NavItem';
import { Logo } from './Logo';
import { HealthPill } from './HealthPill';

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar = ({ onNavigate }: SidebarProps) => (
  <aside className="flex flex-col h-full w-72 shrink-0 glass-strong border-r border-border">
    <div className="px-5 py-6 border-b border-border">
      <Logo />
    </div>
    <nav className="flex-1 px-3 py-4 space-y-1 scrollbar-thin overflow-y-auto">
      <div className="px-3 mb-2 text-[10px] uppercase tracking-[0.18em] text-ink-dim">
        Workspace
      </div>
      {NAV_ROUTES.map((route) => (
        <NavItem key={route.href} route={route} onNavigate={onNavigate} />
      ))}
    </nav>
    <div className="border-t border-border px-5 py-4">
      <HealthPill />
    </div>
  </aside>
);
