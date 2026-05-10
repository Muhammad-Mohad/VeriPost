import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'outline' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary:
    'bg-primary hover:bg-primary-soft text-white shadow-glow disabled:opacity-50 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent hover:bg-white/5 text-ink-muted hover:text-ink',
  outline:
    'bg-transparent border border-border hover:border-primary/60 hover:bg-primary/5 text-ink',
  danger:
    'bg-danger/15 border border-danger/40 text-danger hover:bg-danger/25',
  success:
    'bg-success/15 border border-success/40 text-success hover:bg-success/25',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-sm rounded-2xl',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) => (
  <button
    className={cn(
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-ring',
      'active:scale-[0.98]',
      variantClass[variant],
      sizeClass[size],
      className
    )}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? (
      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
    ) : leftIcon}
    {children}
    {rightIcon}
  </button>
);
