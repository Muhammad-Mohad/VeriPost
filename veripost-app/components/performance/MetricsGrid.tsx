import { StatTile } from '@/components/ui/StatTile';
import { Target, Activity, Database, Layers } from 'lucide-react';
import { formatNumber, formatPercent } from '@/lib/format';
import type { ModelMeta } from '@/lib/types';

export const MetricsGrid = ({ meta }: { meta: ModelMeta }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <StatTile
      label="Test Accuracy"
      value={meta.accuracy !== undefined ? formatPercent(meta.accuracy) : 'n/a'}
      hint="Held-out evaluation"
      icon={<Target size={16} />}
      tone="success"
    />
    <StatTile
      label="Cross-Val Mean"
      value={meta.cv_mean !== undefined ? formatPercent(meta.cv_mean) : 'n/a'}
      hint="3-fold cross-validation"
      icon={<Activity size={16} />}
      tone="primary"
    />
    <StatTile
      label="Training Samples"
      value={formatNumber(meta.n_samples)}
      hint="After cleaning & filtering"
      icon={<Database size={16} />}
      tone="warning"
    />
    <StatTile
      label="TF-IDF Features"
      value={formatNumber(meta.n_features)}
      hint="Unigrams + bigrams"
      icon={<Layers size={16} />}
      tone="neutral"
    />
  </div>
);
