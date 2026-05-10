import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const PageHeader = ({ eyebrow, title, description, action }: PageHeaderProps) => (
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 animate-fade-in">
    <div>
      {eyebrow ? (
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary-soft mb-2">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-white via-white to-slate-400 bg-clip-text text-transparent">
        {title}
      </h1>
      {description ? (
        <p className="text-sm text-ink-muted mt-2 max-w-2xl">{description}</p>
      ) : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);
