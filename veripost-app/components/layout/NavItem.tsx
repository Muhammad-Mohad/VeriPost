'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import type { NavRoute } from '@/lib/nav';

const isActiveRoute = (pathname: string, href: string) => {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
};

export const NavItem = ({ route, onNavigate }: { route: NavRoute; onNavigate?: () => void }) => {
  const pathname = usePathname();
  const active = isActiveRoute(pathname, route.href);
  const Icon = route.icon;
  return (
    <Link
      href={route.href}
      onClick={onNavigate}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all',
        active
          ? 'bg-primary/12 text-ink shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]'
          : 'text-ink-muted hover:text-ink hover:bg-white/5'
      )}
    >
      <span
        className={cn(
          'grid place-items-center w-8 h-8 rounded-lg transition-colors',
          active ? 'bg-primary/20 text-primary-soft' : 'bg-white/3 text-ink-muted group-hover:text-ink'
        )}
      >
        <Icon size={16} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{route.label}</div>
        <div className="text-[10px] text-ink-dim truncate">{route.description}</div>
      </div>
      {active ? (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r bg-primary" />
      ) : null}
    </Link>
  );
};
