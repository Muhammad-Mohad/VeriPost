import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
    {icon ? (
      <div className="grid place-items-center w-14 h-14 rounded-2xl bg-primary/10 text-primary-soft">
        {icon}
      </div>
    ) : null}
    <div>
      <h4 className="text-sm font-semibold text-ink">{title}</h4>
      {description ? <p className="text-xs text-ink-muted mt-1 max-w-xs">{description}</p> : null}
    </div>
    {action}
  </div>
);
