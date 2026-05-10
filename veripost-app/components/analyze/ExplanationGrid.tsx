import type { Explanation, ExplanationWord } from '@/lib/types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/cn';

const WordChip = ({ word, tone }: { word: ExplanationWord; tone: 'real' | 'fake' }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border',
      tone === 'real'
        ? 'bg-success/8 text-success border-success/30'
        : 'bg-danger/8 text-danger border-danger/30'
    )}
  >
    <span className="font-medium">{word.word}</span>
    <span className="text-[10px] opacity-60 font-mono">{word.weight.toFixed(3)}</span>
  </span>
);

const Column = ({
  title,
  words,
  tone,
  icon,
}: {
  title: string;
  words: ExplanationWord[];
  tone: 'real' | 'fake';
  icon: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-ink-muted">
      {icon}
      {title}
    </div>
    <div className="flex flex-wrap gap-1.5">
      {words.length > 0 ? (
        words.map((w) => <WordChip key={w.word} word={w} tone={tone} />)
      ) : (
        <span className="text-xs text-ink-dim">No strong signals</span>
      )}
    </div>
  </div>
);

export const ExplanationGrid = ({ explanation }: { explanation: Explanation }) => (
  <div className="grid md:grid-cols-2 gap-6">
    <Column
      title="Pushed REAL"
      words={explanation.top_real}
      tone="real"
      icon={<TrendingUp size={14} className="text-success" />}
    />
    <Column
      title="Pushed FAKE"
      words={explanation.top_fake}
      tone="fake"
      icon={<TrendingDown size={14} className="text-danger" />}
    />
  </div>
);
