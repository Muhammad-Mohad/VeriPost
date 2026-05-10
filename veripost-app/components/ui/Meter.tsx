import { cn } from '@/lib/cn';

interface MeterProps {
  value: number;
  max?: number;
  tone?: 'real' | 'fake' | 'neutral';
  showLabel?: boolean;
  className?: string;
}

const toneColors = {
  real: 'from-emerald-400 to-success',
  fake: 'from-rose-400 to-danger',
  neutral: 'from-primary-soft to-primary',
};

export const Meter = ({ value, max = 100, tone = 'neutral', showLabel, className }: MeterProps) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full bg-gradient-to-r transition-[width] duration-500 ease-out',
            toneColors[tone]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel ? (
        <div className="text-[11px] text-ink-dim mt-1.5 text-right">{pct.toFixed(1)}%</div>
      ) : null}
    </div>
  );
};
