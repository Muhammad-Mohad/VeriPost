'use client';

import { useState } from 'react';
import { Field, Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Globe, Link as LinkIcon } from 'lucide-react';
import { api } from '@/lib/client';
import type { PredictionResult } from '@/lib/types';

interface UrlAnalyzerProps {
  onResult: (r: PredictionResult) => void;
  onError: (msg: string) => void;
}

export const UrlAnalyzer = ({ onResult, onError }: UrlAnalyzerProps) => {
  const [url, setUrl] = useState('');
  const [sentenceMode, setSentenceMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!url.trim()) {
      onError('Enter a URL.');
      return;
    }
    setLoading(true);
    try {
      const result = await api.predictUrl(url.trim(), sentenceMode);
      onResult(result);
    } catch (e) {
      onError(e instanceof Error ? e.message : 'URL fetch failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Field
        label="Article URL"
        hint={
          <label className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={sentenceMode}
              onChange={(e) => setSentenceMode(e.target.checked)}
              className="accent-primary"
            />
            Sentence-level breakdown
          </label>
        }
      >
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/news-article"
          leftIcon={<LinkIcon size={14} />}
        />
      </Field>
      <Button
        onClick={submit}
        loading={loading}
        leftIcon={<Globe size={16} />}
        size="lg"
        className="w-full"
      >
        Fetch & analyze
      </Button>
    </div>
  );
};
