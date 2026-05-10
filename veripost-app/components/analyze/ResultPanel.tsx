import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Banner } from '@/components/ui/Banner';
import { VerdictHeader } from './VerdictHeader';
import { SentenceList } from './SentenceList';
import type { PredictionResult } from '@/lib/types';
import { Languages, ListTree, ExternalLink } from 'lucide-react';

export const ResultPanel = ({ result }: { result: PredictionResult }) => (
  <div className="space-y-5 animate-slide-up">
    <Card>
      <CardBody>
        <VerdictHeader
          verdict={result.prediction}
          confidence={result.confidence_score}
          realProbability={result.real_probability}
        />
      </CardBody>
    </Card>

    {result.language_warning ? (
      <Banner tone="warning" icon={<Languages size={14} />}>
        {result.language_warning}
      </Banner>
    ) : null}

    {result.source_url ? (
      <Banner tone="info" icon={<ExternalLink size={14} />}>
        Source:{' '}
        <a
          href={result.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-ink"
        >
          {result.source_url}
        </a>
      </Banner>
    ) : null}

    {result.sentences && result.sentences.length > 0 ? (
      <Card>
        <CardHeader
          title="Sentence-level breakdown"
          subtitle="Per-sentence credibility heatmap"
          icon={<ListTree size={16} />}
        />
        <CardBody>
          <SentenceList sentences={result.sentences} />
        </CardBody>
      </Card>
    ) : null}
  </div>
);
