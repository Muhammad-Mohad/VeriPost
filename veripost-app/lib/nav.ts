import {
  LayoutDashboard,
  ScanSearch,
  FileSpreadsheet,
  Activity,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavRoute {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const NAV_ROUTES: NavRoute[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview & quick actions',
  },
  {
    href: '/analyze',
    label: 'Analyze',
    icon: ScanSearch,
    description: 'Text, image, or URL',
  },
  {
    href: '/batch',
    label: 'Batch CSV',
    icon: FileSpreadsheet,
    description: 'Multi-post authenticity',
  },
  {
    href: '/performance',
    label: 'Check Model Performance',
    icon: Activity,
    description: 'Accuracy & versions',
  },
  {
    href: '/admin',
    label: 'Admin',
    icon: Settings,
    description: 'Retrain & manage',
  },
];
