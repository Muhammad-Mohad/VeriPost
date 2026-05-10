'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react';
import type { BatchRow } from '@/lib/types';
import { cn } from '@/lib/cn';

type Filter = 'all' | 'REAL' | 'FAKE';

export const BatchTable = ({ rows }: { rows: BatchRow[] }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== 'all' && r.prediction !== filter) return false;
      if (q && !r.snippet.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, filter, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <Input
          placeholder="Search snippets…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search size={14} />}
          className="sm:max-w-xs"
        />
        <div className="inline-flex p-1 rounded-xl bg-bg-soft/60 border border-border gap-1 shrink-0">
          {(['all', 'REAL', 'FAKE'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-lg transition-colors',
                filter === f
                  ? 'bg-primary/20 text-ink'
                  : 'text-ink-muted hover:text-ink hover:bg-white/5'
              )}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] text-[11px] uppercase tracking-widest text-ink-dim bg-bg-soft/40 px-4 py-2.5 border-b border-border">
          <span className="w-16">#</span>
          <span>Snippet</span>
          <span className="w-32 text-right">Confidence</span>
        </div>
        <div className="max-h-[480px] overflow-y-auto scrollbar-thin divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-ink-muted">No matches.</div>
          ) : (
            filtered.map((r) => (
              <div
                key={r.index}
                className={cn(
                  'grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-sm',
                  r.prediction === 'REAL' ? 'bg-success/3' : 'bg-danger/3'
                )}
              >
                <span className="w-16 text-xs text-ink-dim font-mono">{r.index}</span>
                <span className="text-ink/95 truncate">{r.snippet}</span>
                <span className="w-32 flex items-center justify-end gap-2">
                  <Badge tone={r.prediction === 'REAL' ? 'real' : 'fake'} size="sm">
                    {r.prediction}
                  </Badge>
                  <span className="text-xs text-ink-muted font-mono">
                    {r.confidence.toFixed(0)}%
                  </span>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="text-xs text-ink-muted">
        Showing {filtered.length.toLocaleString()} of {rows.length.toLocaleString()}
      </div>
    </div>
  );
};
