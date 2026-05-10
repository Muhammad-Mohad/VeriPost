import { Badge } from '@/components/ui/Badge';
import { ConfidenceRing } from '@/components/ui/ConfidenceRing';
import { Meter } from '@/components/ui/Meter';
import type { Verdict } from '@/lib/types';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface VerdictHeaderProps {
  verdict: Verdict;
  confidence: number;
  realProbability: number;
}

export const VerdictHeader = ({
  verdict,
  confidence,
  realProbability,
}: VerdictHeaderProps) => {
  const tone = verdict === 'REAL' ? 'real' : 'fake';
  const Icon = verdict === 'REAL' ? ShieldCheck : ShieldAlert;
  return (
    <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center">
      <ConfidenceRing
        value={confidence}
        label="Confidence"
        tone={tone}
      />
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-bold tracking-wider ${
              verdict === 'REAL'
                ? 'bg-success/15 text-success border border-success/40'
                : 'bg-danger/15 text-danger border border-danger/40'
            }`}
          >
            <Icon size={18} />
            {verdict}
          </span>
          <Badge tone="info">Linguistic Analysis</Badge>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-ink-muted mb-1.5">
            <span>Real probability</span>
            <span className="font-semibold text-ink">{realProbability.toFixed(2)}%</span>
          </div>
          <Meter value={realProbability} tone={realProbability >= 50 ? 'real' : 'fake'} />
        </div>
        <p className="text-xs text-ink-muted leading-relaxed">
          {verdict === 'REAL'
            ? 'Linguistic patterns align with credible reporting language.'
            : 'Linguistic patterns resemble misleading or sensationalized content.'}
        </p>
      </div>
    </div>
  );
};
