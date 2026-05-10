import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type Tone = 'real' | 'fake' | 'neutral' | 'warning' | 'info';

const toneClass: Record<Tone, string> = {
  real: 'bg-success/12 text-success border-success/40',
  fake: 'bg-danger/12 text-danger border-danger/40',
  neutral: 'bg-white/5 text-ink-muted border-border',
  warning: 'bg-warning/12 text-warning border-warning/40',
  info: 'bg-primary/12 text-primary-soft border-primary/40',
};

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge = ({ tone = 'neutral', children, className, size = 'md' }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 border rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
      toneClass[tone],
      className
    )}
  >
    {children}
  </span>
);
