import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Sparkles } from 'lucide-react';

const ITEMS = [
  { title: 'Calibrated probabilities', body: 'Platt-scaled SVM produces true 0–100% confidence.' },
  { title: 'Word-level explainability', body: 'Top words pushing toward REAL or FAKE for every prediction.' },
  { title: 'Sentence-level breakdown', body: 'Per-sentence credibility heatmap for long articles.' },
  { title: 'Multi-language detection', body: 'Flags non-English content where accuracy may degrade.' },
  { title: 'OCR & URL ingestion', body: 'Scan images via Tesseract.js or fetch articles from URLs.' },
  { title: 'Batch CSV authenticity', body: 'Validate hundreds of posts in a single upload.' },
];

export const FeatureBullets = () => (
  <Card>
    <CardHeader title="What VeriPost analyzes" icon={<Sparkles size={16} />} />
    <CardBody>
      <ul className="grid sm:grid-cols-2 gap-4">
        {ITEMS.map((it) => (
          <li key={it.title} className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-soft shrink-0" />
            <div>
              <div className="text-sm font-medium text-ink">{it.title}</div>
              <div className="text-xs text-ink-muted leading-relaxed">{it.body}</div>
            </div>
          </li>
        ))}
      </ul>
    </CardBody>
  </Card>
);
