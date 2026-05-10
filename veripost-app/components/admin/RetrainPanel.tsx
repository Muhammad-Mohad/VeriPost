'use client';

import { useEffect, useRef, useState } from 'react';
import { Field, Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Banner } from '@/components/ui/Banner';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Play, Tag, Terminal } from 'lucide-react';
import { api } from '@/lib/client';
import type { TrainStatus } from '@/lib/types';

interface RetrainPanelProps {
  token: string;
  onComplete?: () => void;
}

export const RetrainPanel = ({ token, onComplete }: RetrainPanelProps) => {
  const [versionTag, setVersionTag] = useState('');
  const [status, setStatus] = useState<TrainStatus | null>(null);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => () => stopPolling(), []);

  const tick = async () => {
    try {
      const s = await api.trainStatus(token || undefined);
      setStatus(s);
      if (!s.running && !completedRef.current && s.last_log) {
        completedRef.current = true;
        stopPolling();
        onComplete?.();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Status fetch failed');
      stopPolling();
    }
  };

  const start = async () => {
    setError('');
    setStarting(true);
    completedRef.current = false;
    try {
      await api.retrain(versionTag.trim() || null, token || undefined);
      stopPolling();
      pollRef.current = setInterval(tick, 3000);
      tick();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start retraining');
    } finally {
      setStarting(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Retrain Model"
        subtitle="Spawns trainModel.py in the background and snapshots a new version"
        icon={<Terminal size={16} />}
      />
      <CardBody className="space-y-4">
        <Field label="Optional version tag" hint="Leave empty for an auto-generated timestamp tag.">
          <Input
            value={versionTag}
            onChange={(e) => setVersionTag(e.target.value)}
            placeholder="e.g. v2-weighted"
            leftIcon={<Tag size={14} />}
          />
        </Field>
        <Button
          onClick={start}
          loading={starting || status?.running}
          leftIcon={<Play size={14} />}
          disabled={status?.running}
        >
          {status?.running ? 'Training in progress…' : 'Start retraining'}
        </Button>
        {error ? <Banner tone="danger">{error}</Banner> : null}
        {status ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-ink-muted px-1">
              <span>Last version: <span className="font-mono text-ink">{status.last_version || '—'}</span></span>
              <span className={status.running ? 'text-warning animate-pulse-soft' : 'text-success'}>
                {status.running ? 'Running…' : 'Idle'}
              </span>
            </div>
            <div className="rounded-xl border border-border bg-black/40 overflow-hidden">
              <pre className="p-4 text-[11px] font-mono text-ink-muted max-h-72 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-all scrollbar-thin leading-relaxed">
                {status.last_log || 'No training log yet.'}
              </pre>
            </div>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
};
