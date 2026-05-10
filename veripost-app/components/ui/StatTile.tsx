import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral';
  className?: string;
}

const toneAccent: Record<NonNullable<StatTileProps['tone']>, string> = {
  primary: 'text-primary-soft bg-primary/10 border-primary/30',
  success: 'text-success bg-success/10 border-success/30',
  danger: 'text-danger bg-danger/10 border-danger/30',
  warning: 'text-warning bg-warning/10 border-warning/30',
  neutral: 'text-ink-muted bg-white/5 border-border',
};

export const StatTile = ({
  label,
  value,
  hint,
  icon,
  tone = 'primary',
  className,
}: StatTileProps) => (
  <div
    className={cn(
      'glass rounded-2xl p-5 flex flex-col gap-3 hover:border-border-strong transition-all',
      className
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <span className="text-[11px] uppercase tracking-widest text-ink-muted">{label}</span>
      {icon ? (
        <div
          className={cn(
            'grid place-items-center w-9 h-9 rounded-xl border',
            toneAccent[tone]
          )}
        >
          {icon}
        </div>
      ) : null}
    </div>
    <div className="text-2xl font-bold tracking-tight text-ink">{value}</div>
    {hint ? <div className="text-xs text-ink-muted">{hint}</div> : null}
  </div>
);
