import { cn } from '@/lib/cn';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'strong' | 'plain';
}

export const Card = ({ children, variant = 'default', className, ...rest }: CardProps) => {
  const styles =
    variant === 'strong'
      ? 'glass-strong shadow-card'
      : variant === 'plain'
      ? 'bg-bg-soft/60 border border-border'
      : 'glass shadow-card';
  return (
    <div className={cn('rounded-2xl', styles, className)} {...rest}>
      {children}
    </div>
  );
};

export const CardHeader = ({
  title,
  subtitle,
  icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3 border-b border-border">
    <div className="flex items-center gap-3">
      {icon ? (
        <div className="grid place-items-center w-9 h-9 rounded-xl bg-primary/12 text-primary-soft">
          {icon}
        </div>
      ) : null}
      <div>
        <h3 className="text-sm font-semibold tracking-wide text-ink">{title}</h3>
        {subtitle ? <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p> : null}
      </div>
    </div>
    {action}
  </div>
);

export const CardBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <div className={cn('px-6 py-5', className)}>{children}</div>;
