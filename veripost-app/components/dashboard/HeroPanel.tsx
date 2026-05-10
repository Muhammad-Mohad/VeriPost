import Link from 'next/link';
import { ScanSearch, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';

export const HeroPanel = () => (
  <Card variant="strong" className="overflow-hidden relative">
    <div className="absolute inset-0 bg-glow-primary pointer-events-none" />
    <CardBody className="relative px-8 py-10 md:py-12">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-primary-soft mb-4">
        <Sparkles size={12} /> Calibrated linguistic ML
      </div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-2xl bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
        Detect fake news instantly with explainable AI.
      </h2>
      <p className="mt-3 text-sm text-ink-muted max-w-xl leading-relaxed">
        VeriPost analyzes linguistic patterns — emotional cues, clickbait phrasing,
        factual density — to flag misleading content. Every prediction comes with the
        words that drove it.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-soft text-white text-sm font-medium shadow-glow transition-colors"
        >
          <ScanSearch size={16} /> Analyze content
          <ArrowRight size={14} />
        </Link>
        <Link
          href="/batch"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-border hover:border-primary/60 text-ink text-sm font-medium transition-colors"
        >
          Run batch CSV
        </Link>
      </div>
    </CardBody>
  </Card>
);
