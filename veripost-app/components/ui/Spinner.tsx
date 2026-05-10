import { cn } from '@/lib/cn';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner = ({ size = 16, className }: SpinnerProps) => (
  <span
    className={cn(
      'inline-block rounded-full border-2 border-white/20 border-t-primary animate-spin',
      className
    )}
    style={{ width: size, height: size }}
  />
);

export const InlineLoader = ({ label = 'Loading…' }: { label?: string }) => (
  <div className="flex items-center gap-2 text-sm text-ink-muted">
    <Spinner />
    <span>{label}</span>
  </div>
);
