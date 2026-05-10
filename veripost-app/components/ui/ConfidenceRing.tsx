import { cn } from '@/lib/cn';

interface ConfidenceRingProps {
  value: number;
  label?: string;
  tone?: 'real' | 'fake';
  size?: number;
  className?: string;
}

export const ConfidenceRing = ({
  value,
  label,
  tone = 'real',
  size = 140,
  className,
}: ConfidenceRingProps) => {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.max(0, Math.min(100, value)) / 100) * circumference;
  const color = tone === 'real' ? '#10b981' : '#ef4444';
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(148,163,184,0.12)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold tracking-tight">{value.toFixed(1)}%</div>
        {label ? <div className="text-[10px] uppercase tracking-widest text-ink-muted mt-0.5">{label}</div> : null}
      </div>
    </div>
  );
};
