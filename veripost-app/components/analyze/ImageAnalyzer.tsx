'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Banner } from '@/components/ui/Banner';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { runOcr } from '@/lib/ocr';

interface ImageAnalyzerProps {
  onText: (text: string) => void;
}

export const ImageAnalyzer = ({ onText }: ImageAnalyzerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFile = async (file: File) => {
    setError('');
    setStatus('Initializing OCR…');
    setProgress(0);
    try {
      const text = await runOcr(file, (p) => {
        if (p.status === 'recognizing text') {
          setProgress(p.progress);
          setStatus(`Scanning… ${Math.round(p.progress * 100)}%`);
        } else {
          setStatus(p.status);
        }
      });
      setStatus('✓ Text extracted. Switching to Text tab.');
      setProgress(1);
      onText(text);
      setTimeout(() => {
        setProgress(null);
        setStatus('');
      }, 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'OCR failed.');
      setProgress(null);
      setStatus('');
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) void handleFile(f);
        }}
        className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-colors group"
      >
        <div className="grid place-items-center w-14 h-14 rounded-2xl bg-primary/10 mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
          <ImageIcon size={22} className="text-primary-soft" />
        </div>
        <p className="text-sm font-medium">Drop an image here, or click to browse</p>
        <p className="text-xs text-ink-muted mt-1">PNG, JPG, or WEBP — text is extracted in your browser via Tesseract.js</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
      {progress !== null ? (
        <div className="space-y-2">
          <div className="text-xs text-ink-muted">{status}</div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-soft to-primary transition-[width] duration-200"
              style={{ width: `${(progress * 100).toFixed(0)}%` }}
            />
          </div>
        </div>
      ) : null}
      {error ? <Banner tone="danger" icon={<Upload size={14} />}>{error}</Banner> : null}
    </div>
  );
};
