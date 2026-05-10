import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/Badge';
import type { SentenceResult } from '@/lib/types';

export const SentenceList = ({ sentences }: { sentences: SentenceResult[] }) => {
  if (!sentences.length) {
    return <div className="text-sm text-ink-muted">No sentences detected.</div>;
  }
  return (
    <div className="rounded-xl border border-border overflow-hidden divide-y divide-border max-h-[420px] overflow-y-auto scrollbar-thin">
      {sentences.map((s, i) => {
        const tone = s.prediction === 'REAL' ? 'real' : 'fake';
        return (
          <div
            key={i}
            className={cn(
              'flex gap-3 px-4 py-3 text-sm leading-relaxed transition-colors',
              s.prediction === 'REAL' ? 'bg-success/4 hover:bg-success/8' : 'bg-danger/4 hover:bg-danger/8'
            )}
          >
            <Badge tone={tone} size="sm" className="shrink-0 min-w-[56px] justify-center">
              {s.real_probability.toFixed(0)}%
            </Badge>
            <p className="text-ink/95">{s.text}</p>
          </div>
        );
      })}
    </div>
  );
};
