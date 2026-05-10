'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Meter } from '@/components/ui/Meter';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Activity, ArrowRight } from 'lucide-react';
import { api } from '@/lib/client';
import { formatDate, formatNumber } from '@/lib/format';
import type { ModelMeta } from '@/lib/types';

export const ModelSnapshot = () => {
  const [meta, setMeta] = useState<ModelMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api
      .versions()
      .then((data) => {
        if (active) setMeta(data.current || null);
      })
      .catch((e: Error) => {
        if (active) setError(e.message);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <Card>
      <CardHeader
        title="Active model"
        subtitle="Live snapshot from the inference backend"
        icon={<Activity size={16} />}
        action={
          <Link
            href="/performance"
            className="inline-flex items-center gap-1 text-xs text-primary-soft hover:text-primary"
          >
            Full report <ArrowRight size={12} />
          </Link>
        }
      />
      <CardBody>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <Spinner /> Loading model metadata…
          </div>
        ) : error ? (
          <div className="text-xs text-danger">{error}</div>
        ) : meta ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-ink">{meta.version || '—'}</code>
              <Badge tone="info">{formatDate(meta.trained_at)}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-ink-muted">
                <span>Accuracy</span>
                <span className="text-ink font-medium">{meta.accuracy?.toFixed(2) ?? 'n/a'}%</span>
              </div>
              <Meter value={meta.accuracy ?? 0} tone="real" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-ink-dim uppercase tracking-wider">CV mean</div>
                <div className="text-ink font-medium mt-0.5">{meta.cv_mean?.toFixed(2) ?? '—'}%</div>
              </div>
              <div>
                <div className="text-ink-dim uppercase tracking-wider">Samples</div>
                <div className="text-ink font-medium mt-0.5">{formatNumber(meta.n_samples)}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-ink-muted">Model metadata unavailable.</div>
        )}
      </CardBody>
    </Card>
  );
};
