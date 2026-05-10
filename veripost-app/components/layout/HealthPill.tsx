'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/client';
import type { HealthResponse } from '@/lib/types';
import { cn } from '@/lib/cn';

export const HealthPill = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const tick = async () => {
      try {
        const h = await api.health();
        if (active) {
          setHealth(h);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const ok = !error && health?.ok;
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          'relative inline-flex h-2.5 w-2.5 rounded-full',
          ok ? 'bg-success' : 'bg-danger'
        )}
      >
        <span
          className={cn(
            'absolute inset-0 rounded-full animate-ping opacity-60',
            ok ? 'bg-success' : 'bg-danger'
          )}
        />
      </span>
      <div className="leading-tight">
        <div className="text-xs font-medium text-ink">
          {ok ? 'Backend online' : 'Backend offline'}
        </div>
        <div className="text-[10px] text-ink-dim">
          {ok ? `v${health?.version || '—'} · ${health?.accuracy ?? '—'}%` : 'Start Flask app'}
        </div>
      </div>
    </div>
  );
};
