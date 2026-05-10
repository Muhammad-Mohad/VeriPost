'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Banner } from '@/components/ui/Banner';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { CsvDropzone } from '@/components/batch/CsvDropzone';
import { BatchSummary } from '@/components/batch/BatchSummary';
import { BatchTable } from '@/components/batch/BatchTable';
import { FileSpreadsheet, Download, Upload } from 'lucide-react';
import { api } from '@/lib/client';
import { downloadBatchCsv } from '@/lib/csv';
import type { BatchResult } from '@/lib/types';

export default function BatchPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BatchResult | null>(null);
  const [error, setError] = useState('');

  const run = async (selected: File) => {
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const r = await api.predictBatch(selected);
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Batch run failed.');
    } finally {
      setLoading(false);
    }
  };

  const onFile = (f: File) => {
    setFile(f);
    void run(f);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Batch"
        title="Bulk authenticity for many posts"
        description="Upload a CSV with one row per post. We classify each row and return downloadable results — perfect for journalists and researchers."
      />

      <Card>
        <CardHeader
          title="Upload CSV"
          subtitle="The file must include a 'text' column. An optional 'title' column is concatenated automatically."
          icon={<FileSpreadsheet size={16} />}
          action={
            file && !loading ? (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Upload size={12} />}
                onClick={() => run(file)}
              >
                Re-run
              </Button>
            ) : null
          }
        />
        <CardBody>
          <CsvDropzone onFile={onFile} disabled={loading} />
        </CardBody>
      </Card>

      {error ? <Banner tone="danger">{error}</Banner> : null}

      {loading ? (
        <Card>
          <CardBody>
            <div className="flex items-center gap-3 text-sm text-ink-muted">
              <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-primary animate-spin" />
              Classifying rows…
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-white/5 overflow-hidden shimmer" />
          </CardBody>
        </Card>
      ) : null}

      {result ? (
        <>
          <BatchSummary data={result} />
          <Card>
            <CardHeader
              title="Per-post results"
              subtitle={`${result.total.toLocaleString()} rows analyzed`}
              icon={<FileSpreadsheet size={16} />}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Download size={12} />}
                  onClick={() => downloadBatchCsv(result.rows)}
                >
                  Download CSV
                </Button>
              }
            />
            <CardBody>
              <BatchTable rows={result.rows} />
            </CardBody>
          </Card>
        </>
      ) : !loading && !error ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={<FileSpreadsheet size={20} />}
              title="No batch run yet"
              description="Upload a CSV above to validate many posts at once."
            />
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
