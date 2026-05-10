'use client';

import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { cn } from '@/lib/cn';

export const AppShell = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-grid">
      <TopBar onMenu={() => setOpen(true)} />
      <div className="hidden lg:flex h-screen sticky top-0">
        <Sidebar />
      </div>
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden transition-opacity',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
        <div
          className={cn(
            'absolute left-0 top-0 h-full transition-transform duration-300',
            open ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar onNavigate={close} />
        </div>
      </div>
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-8 lg:py-10 max-w-[1400px] w-full mx-auto">
        {children}
      </main>
    </div>
  );
};
