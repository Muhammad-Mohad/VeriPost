import { StatTile } from '@/components/ui/StatTile';
import { Files, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { BatchResult } from '@/lib/types';

export const BatchSummary = ({ data }: { data: BatchResult }) => {
  const realPct = data.total ? (data.real_count / data.total) * 100 : 0;
  const fakePct = data.total ? (data.fake_count / data.total) * 100 : 0;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatTile
        label="Total posts"
        value={data.total}
        hint="Rows analyzed"
        icon={<Files size={16} />}
        tone="primary"
      />
      <StatTile
        label="Likely Real"
        value={data.real_count}
        hint={`${realPct.toFixed(1)}% of corpus`}
        icon={<ShieldCheck size={16} />}
        tone="success"
      />
      <StatTile
        label="Likely Fake"
        value={data.fake_count}
        hint={`${fakePct.toFixed(1)}% of corpus`}
        icon={<ShieldAlert size={16} />}
        tone="danger"
      />
    </div>
  );
};
