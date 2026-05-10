'use client';

import { useState } from 'react';
import { Field, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ScanSearch } from 'lucide-react';
import { api } from '@/lib/client';
import type { PredictionResult } from '@/lib/types';

const MAX = 50000;

interface TextAnalyzerProps {
  initialText?: string;
  onResult: (r: PredictionResult) => void;
  onError: (msg: string) => void;
}

export const TextAnalyzer = ({ initialText = '', onResult, onError }: TextAnalyzerProps) => {
  const [text, setText] = useState(initialText);
  const [sentenceMode, setSentenceMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const value = text.trim();
    if (!value) {
      onError('Please paste or extract some text first.');
      return;
    }
    if (value.length > MAX) {
      onError(`Text exceeds the ${MAX.toLocaleString()} character limit.`);
      return;
    }
    setLoading(true);
    try {
      const result = await api.predict(value, { explain: false, sentences: sentenceMode });
      onResult(result);
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Field
        label="Article or headline"
        hint={
          <div className="flex justify-between">
            <span>{text.length.toLocaleString()} / {MAX.toLocaleString()}</span>
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={sentenceMode}
                onChange={(e) => setSentenceMode(e.target.checked)}
                className="accent-primary"
              />
              Sentence-level breakdown
            </label>
          </div>
        }
      >
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a news article or headline to analyze its linguistic integrity…"
          maxLength={MAX}
        />
      </Field>
      <Button
        onClick={submit}
        loading={loading}
        leftIcon={<ScanSearch size={16} />}
        size="lg"
        className="w-full"
      >
        Analyze validity
      </Button>
    </div>
  );
};
