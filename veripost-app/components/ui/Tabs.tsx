'use client';

import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

export interface TabItem<K extends string = string> {
  key: K;
  label: string;
  icon?: ReactNode;
}

interface TabsProps<K extends string> {
  tabs: TabItem<K>[];
  active: K;
  onChange: (key: K) => void;
  className?: string;
}

export function Tabs<K extends string>({ tabs, active, onChange, className }: TabsProps<K>) {
  return (
    <div
      className={cn(
        'inline-flex p-1 rounded-2xl bg-bg-soft/60 border border-border gap-1',
        className
      )}
    >
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-all focus-ring',
              isActive
                ? 'bg-primary/15 text-ink shadow-glow'
                : 'text-ink-muted hover:text-ink hover:bg-white/5'
            )}
          >
            {t.icon}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
