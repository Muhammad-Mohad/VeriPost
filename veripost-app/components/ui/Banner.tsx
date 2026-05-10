import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type Tone = 'info' | 'warning' | 'success' | 'danger';

const toneClass: Record<Tone, string> = {
  info: 'bg-primary/10 border-primary/40 text-primary-soft',
  warning: 'bg-warning/10 border-warning/40 text-warning',
  success: 'bg-success/10 border-success/40 text-success',
  danger: 'bg-danger/10 border-danger/40 text-danger',
};

export const Banner = ({
  tone = 'info',
  icon,
  children,
  className,
}: {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'flex items-start gap-3 rounded-xl border px-4 py-3 text-xs',
      toneClass[tone],
      className
    )}
  >
    {icon}
    <div className="leading-relaxed">{children}</div>
  </div>
);
