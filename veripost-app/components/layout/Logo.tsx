import { ShieldCheck } from 'lucide-react';

export const Logo = ({ compact = false }: { compact?: boolean }) => (
  <div className="flex items-center gap-2.5">
    <div className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-deep shadow-glow">
      <ShieldCheck size={18} className="text-white" />
    </div>
    {compact ? null : (
      <div className="leading-tight">
        <div className="text-base font-bold tracking-tight">VeriPost</div>
        <div className="text-[10px] uppercase tracking-[0.16em] text-ink-dim">Integrity Engine</div>
      </div>
    )}
  </div>
);
