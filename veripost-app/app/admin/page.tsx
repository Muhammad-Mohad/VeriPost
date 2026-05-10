'use client';

import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { TokenField } from '@/components/admin/TokenField';
import { RetrainPanel } from '@/components/admin/RetrainPanel';
import { VersionTimeline } from '@/components/performance/VersionTimeline';
import { Settings, RefreshCw, Boxes } from 'lucide-react';
import { api } from '@/lib/client';
import type { VersionListResponse } from '@/lib/types';

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [data, setData] = useState<VersionListResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.versions(token || undefined);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load versions.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const onActivate = async (version: string) => {
    try {
      await api.activate(version, token || undefined);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Activate failed.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Admin"
        title="Model management"
        description="Authenticate, switch active versions, and trigger retraining."
        action={
          <Button variant="outline" leftIcon={<RefreshCw size={14} />} onClick={load}>
            Refresh
          </Button>
        }
      />

      <Card>
        <CardHeader title="Authentication" icon={<Settings size={16} />} />
        <CardBody>
          <TokenField value={token} onChange={setToken} />
        </CardBody>
      </Card>

      {error ? <Banner tone="danger">{error}</Banner> : null}

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        <Card>
          <CardHeader
            title="Available versions"
            subtitle="Activate any snapshot to switch the live model instantly"
            icon={<Boxes size={16} />}
          />
          <CardBody>
            {loading && !data ? (
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Spinner /> Loading…
              </div>
            ) : (
              <VersionTimeline
                versions={data?.versions || []}
                activeVersion={data?.current?.version}
                onActivate={onActivate}
              />
            )}
          </CardBody>
        </Card>

        <RetrainPanel token={token} onComplete={load} />
      </div>
    </div>
  );
}
