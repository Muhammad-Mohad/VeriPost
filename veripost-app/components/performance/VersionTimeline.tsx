import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Boxes } from 'lucide-react';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { ModelMeta } from '@/lib/types';

interface VersionTimelineProps {
  versions: ModelMeta[];
  activeVersion?: string;
  onActivate?: (v: string) => void;
}

export const VersionTimeline = ({ versions, activeVersion, onActivate }: VersionTimelineProps) => {
  if (!versions.length) {
    return (
      <EmptyState
        icon={<Boxes size={20} />}
        title="No versions yet"
        description="Trigger a retrain to create your first model snapshot."
      />
    );
  }
  return (
    <ol className="space-y-0">
      {versions.map((v, idx) => {
        const isActive = v.version === activeVersion;
        const isLast = idx === versions.length - 1;
        return (
          <li key={v.version} className="flex gap-4 min-w-0">
            <div className="flex flex-col items-center shrink-0 w-6">
              <span
                className={cn(
                  'mt-1 w-3 h-3 rounded-full border-2 shrink-0 z-10',
                  isActive
                    ? 'bg-primary border-primary shadow-glow'
                    : 'bg-bg-soft border-border-strong'
                )}
              />
              {!isLast && (
                <span className="flex-1 w-px bg-border my-1" />
              )}
            </div>
            <div className={cn('flex-1 min-w-0 pb-5', isLast && 'pb-0')}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-sm font-mono text-ink truncate">{v.version}</code>
                    {isActive ? <Badge tone="info">active</Badge> : null}
                  </div>
                  <div className="text-xs text-ink-muted mt-0.5">
                    {formatDate(v.trained_at)} · {v.accuracy?.toFixed(2) ?? '—'}% acc ·{' '}
                    {v.cv_mean?.toFixed(2) ?? '—'}% CV
                  </div>
                </div>
                {onActivate && !isActive ? (
                  <button
                    onClick={() => v.version && onActivate(v.version)}
                    className="shrink-0 px-3 py-1.5 text-xs rounded-lg border border-border hover:border-primary/60 hover:bg-primary/5 transition-colors"
                  >
                    Activate
                  </button>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
};
