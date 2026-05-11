import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Meter } from '@/components/ui/Meter';
import { CircuitBoard, Calendar } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/format';
import type { ModelMeta } from '@/lib/types';

const Row = ({ label, value }: { label: React.ReactNode; value: React.ReactNode }) => (
  <div className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
    <span className="text-ink-muted">{label}</span>
    <span className="font-medium text-ink">{value}</span>
  </div>
);

export const ActiveModelCard = ({ meta }: { meta: ModelMeta }) => (
  <Card>
    <CardHeader
      title="Active Model"
      subtitle="Currently serving predictions"
      icon={<CircuitBoard size={16} />}
      action={<Badge tone="info">v{meta.version || '—'}</Badge>}
    />
    <CardBody className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>Accuracy</span>
          <span>{meta.accuracy?.toFixed(2) ?? 'n/a'}%</span>
        </div>
        <Meter value={meta.accuracy ?? 0} tone="real" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>CV Mean</span>
          <span>{meta.cv_mean?.toFixed(2) ?? 'n/a'}%</span>
        </div>
        <Meter value={meta.cv_mean ?? 0} tone="neutral" />
      </div>
      <div className="pt-2">
        <Row
          label={
            <span className="flex items-center gap-2">
              <Calendar size={12} /> Trained
            </span>
          }
          value={formatDate(meta.trained_at)}
        />
        <Row label="Samples" value={formatNumber(meta.n_samples)} />
        <Row label="Features" value={formatNumber(meta.n_features)} />
      </div>
    </CardBody>
  </Card>
);
