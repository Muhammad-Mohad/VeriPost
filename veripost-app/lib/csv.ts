import type { BatchRow } from './types';

const escape = (v: unknown) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const downloadBatchCsv = (rows: BatchRow[], filename = 'veripost-batch.csv') => {
  const headers: (keyof BatchRow)[] = [
    'index',
    'prediction',
    'real_probability',
    'confidence',
    'snippet',
  ];
  const lines = [headers.join(',')];
  rows.forEach((r) => lines.push(headers.map((h) => escape(r[h])).join(',')));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
