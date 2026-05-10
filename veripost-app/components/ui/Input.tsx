import { cn } from '@/lib/cn';
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

const baseField =
  'w-full bg-bg-soft/70 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-ink-dim text-ink transition-all focus-ring focus:border-primary/60';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
}

export const Input = ({ leftIcon, className, ...rest }: InputProps) => {
  if (leftIcon) {
    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim pointer-events-none">
          {leftIcon}
        </div>
        <input className={cn(baseField, 'pl-10', className)} {...rest} />
      </div>
    );
  }
  return <input className={cn(baseField, className)} {...rest} />;
};

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = ({ className, ...rest }: TextareaProps) => (
  <textarea className={cn(baseField, 'min-h-[180px] resize-y', className)} {...rest} />
);

export const Field = ({
  label,
  hint,
  children,
}: {
  label?: string;
  hint?: ReactNode;
  children: ReactNode;
}) => (
  <div className="space-y-1.5">
    {label ? <label className="text-xs font-medium text-ink-muted">{label}</label> : null}
    {children}
    {hint ? <div className="text-[11px] text-ink-dim">{hint}</div> : null}
  </div>
);
