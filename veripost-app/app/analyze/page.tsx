'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { Banner } from '@/components/ui/Banner';
import { EmptyState } from '@/components/ui/EmptyState';
import { TextAnalyzer } from '@/components/analyze/TextAnalyzer';
import { ImageAnalyzer } from '@/components/analyze/ImageAnalyzer';
import { UrlAnalyzer } from '@/components/analyze/UrlAnalyzer';
import { ResultPanel } from '@/components/analyze/ResultPanel';
import { FileText, ImageIcon, Globe, ScanSearch } from 'lucide-react';
import type { PredictionResult } from '@/lib/types';

type Mode = 'text' | 'image' | 'url';

const TABS: TabItem<Mode>[] = [
  { key: 'text', label: 'Text', icon: <FileText size={14} /> },
  { key: 'image', label: 'Image', icon: <ImageIcon size={14} /> },
  { key: 'url', label: 'URL', icon: <Globe size={14} /> },
];

export default function AnalyzePage() {
  const [mode, setMode] = useState<Mode>('text');
  const [extractedText, setExtractedText] = useState('');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState('');

  const handleResult = (r: PredictionResult) => {
    setResult(r);
    setError('');
    if (r.extracted_text) setExtractedText(r.extracted_text);
  };

  const handleError = (msg: string) => {
    setError(msg);
    setResult(null);
  };

  const switchToText = (text: string) => {
    setExtractedText(text);
    setMode('text');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Analyze"
        title="Single-post integrity check"
        description="Choose a source — paste text, upload an image, or fetch a URL — and get a calibrated verdict with explainability."
      />

      <Card>
        <CardHeader title="Input source" icon={<ScanSearch size={16} />} />
        <CardBody className="space-y-5">
          <Tabs tabs={TABS} active={mode} onChange={setMode} />
          {mode === 'text' ? (
            <TextAnalyzer
              initialText={extractedText}
              onResult={handleResult}
              onError={handleError}
            />
          ) : null}
          {mode === 'image' ? <ImageAnalyzer onText={switchToText} /> : null}
          {mode === 'url' ? <UrlAnalyzer onResult={handleResult} onError={handleError} /> : null}
        </CardBody>
      </Card>

      {error ? <Banner tone="danger">{error}</Banner> : null}

      {result ? (
        <ResultPanel result={result} />
      ) : (
        <Card>
          <CardBody>
            <EmptyState
              icon={<ScanSearch size={20} />}
              title="No analysis yet"
              description="Submit a piece of content above to view the verdict, explanation, and (optionally) sentence-level breakdown."
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
