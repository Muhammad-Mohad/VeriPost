'use client';

import { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { MetricsGrid } from '@/components/performance/MetricsGrid';
import { ActiveModelCard } from '@/components/performance/ActiveModelCard';
import { VersionTimeline } from '@/components/performance/VersionTimeline';
import { Activity, RefreshCw, History } from 'lucide-react';
import { api } from '@/lib/client';
import type { VersionListResponse } from '@/lib/types';

export default function PerformancePage() {
  const [data, setData] = useState<VersionListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.versions();
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch performance data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const current = data?.current ?? {};

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Performance"
        title="Check Model Performance"
        description="Live view of the active classifier’s accuracy, calibration, and version history."
        action={
          <Button variant="outline" leftIcon={<RefreshCw size={14} />} onClick={load}>
            Refresh
          </Button>
        }
      />

      {error ? <Banner tone="danger">{error}</Banner> : null}

      {loading && !data ? (
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <Spinner /> Loading performance data…
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          <MetricsGrid meta={current} />
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
            <ActiveModelCard meta={current} />
            <Card>
              <CardHeader
                title="Version history"
                subtitle="Every retrain creates a snapshot you can roll back to"
                icon={<History size={16} />}
              />
              <CardBody>
                <VersionTimeline
                  versions={data?.versions || []}
                  activeVersion={current.version}
                />
              </CardBody>
            </Card>
          </div>
          <Card>
            <CardHeader
              title="What these metrics mean"
              subtitle="Quick reference"
              icon={<Activity size={16} />}
            />
            <CardBody>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <li>
                  <b className="text-ink">Test Accuracy:</b>{' '}
                  <span className="text-ink-muted">
                    fraction of held-out samples (20%) classified correctly.
                  </span>
                </li>
                <li>
                  <b className="text-ink">CV Mean:</b>{' '}
                  <span className="text-ink-muted">
                    averaged accuracy across 3 cross-validation folds — a more robust estimate.
                  </span>
                </li>
                <li>
                  <b className="text-ink">Training samples:</b>{' '}
                  <span className="text-ink-muted">
                    documents kept after cleaning &amp; minimum-length filtering.
                  </span>
                </li>
                <li>
                  <b className="text-ink">TF-IDF features:</b>{' '}
                  <span className="text-ink-muted">
                    capped at 20,000 unigrams + bigrams; rare and ubiquitous tokens removed.
                  </span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
