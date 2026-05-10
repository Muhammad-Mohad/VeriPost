import Link from 'next/link';
import { ScanSearch, FileSpreadsheet, Activity, Settings, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Action {
  href: string;
  title: string;
  description: string;
  icon: typeof ScanSearch;
  tone: 'primary' | 'success' | 'warning' | 'neutral';
}

const ACTIONS: Action[] = [
  {
    href: '/analyze',
    title: 'Analyze single post',
    description: 'Text, image, or URL',
    icon: ScanSearch,
    tone: 'primary',
  },
  {
    href: '/batch',
    title: 'Bulk authenticity check',
    description: 'Upload CSV with hundreds of posts',
    icon: FileSpreadsheet,
    tone: 'success',
  },
  {
    href: '/performance',
    title: 'Check model performance',
    description: 'Live accuracy & version history',
    icon: Activity,
    tone: 'warning',
  },
  {
    href: '/admin',
    title: 'Manage & retrain',
    description: 'Trigger training, switch versions',
    icon: Settings,
    tone: 'neutral',
  },
];

const toneRing: Record<Action['tone'], string> = {
  primary: 'group-hover:border-primary/50 group-hover:bg-primary/8',
  success: 'group-hover:border-success/50 group-hover:bg-success/8',
  warning: 'group-hover:border-warning/50 group-hover:bg-warning/8',
  neutral: 'group-hover:border-border-strong group-hover:bg-white/5',
};

const toneIcon: Record<Action['tone'], string> = {
  primary: 'bg-primary/12 text-primary-soft',
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/12 text-warning',
  neutral: 'bg-white/5 text-ink-muted',
};

export const QuickActions = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {ACTIONS.map((a) => {
      const Icon = a.icon;
      return (
        <Link
          key={a.href}
          href={a.href}
          className={cn(
            'group relative glass rounded-2xl p-5 flex items-start gap-4 transition-all',
            toneRing[a.tone]
          )}
        >
          <div className={cn('grid place-items-center w-11 h-11 rounded-xl shrink-0', toneIcon[a.tone])}>
            <Icon size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-ink">{a.title}</h3>
              <ArrowUpRight
                size={14}
                className="text-ink-dim group-hover:text-primary-soft transition-colors"
              />
            </div>
            <p className="text-xs text-ink-muted mt-1">{a.description}</p>
          </div>
        </Link>
      );
    })}
  </div>
);
