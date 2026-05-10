import { PageHeader } from '@/components/ui/PageHeader';
import { HeroPanel } from '@/components/dashboard/HeroPanel';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ModelSnapshot } from '@/components/dashboard/ModelSnapshot';
import { FeatureBullets } from '@/components/dashboard/FeatureBullets';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="Dashboard"
        title="VeriPost integrity workspace"
        description="Run analyses, validate batches, and audit model performance in one place."
      />
      <HeroPanel />
      <QuickActions />
      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <ModelSnapshot />
        <FeatureBullets />
      </div>
    </div>
  );
}
