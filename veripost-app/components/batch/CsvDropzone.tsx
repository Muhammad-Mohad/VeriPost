'use client';

import { useRef, useState, type DragEvent } from 'react';
import { cn } from '@/lib/cn';
import { FileSpreadsheet } from 'lucide-react';

interface CsvDropzoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export const CsvDropzone = ({ onFile, disabled }: CsvDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [name, setName] = useState<string>('');

  const handle = (file: File | undefined) => {
    if (!file) return;
    setName(file.name);
    onFile(file);
  };

  const drop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOver(false);
    handle(e.dataTransfer.files?.[0]);
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={drop}
      className={cn(
        'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
        disabled && 'opacity-60 cursor-not-allowed',
        over
          ? 'border-primary bg-primary/8'
          : 'border-border hover:border-primary/60 hover:bg-primary/5'
      )}
    >
      <div className="grid place-items-center w-12 h-12 rounded-xl bg-primary/10 mx-auto mb-3">
        <FileSpreadsheet size={20} className="text-primary-soft" />
      </div>
      <p className="text-sm font-medium">
        {name ? `Selected: ${name}` : 'Drop a CSV file or click to browse'}
      </p>
      <p className="text-xs text-ink-muted mt-1">
        Required column: <code className="text-primary-soft">text</code> · Optional:{' '}
        <code className="text-primary-soft">title</code> · Up to 500 rows · 5 MB max
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
        disabled={disabled}
      />
    </div>
  );
};
