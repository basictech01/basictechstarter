'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  labelHi?: string;
  href: string;
  icon: string;
  /** Only 'Live Alerts' currently has a real, connected counter. */
  showAlertBadge?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home Dashboard', labelHi: 'होम डैशबोर्ड', href: '/', icon: '🏠' },
  { label: 'Live Alerts', labelHi: 'लाइव अलर्ट', href: '/alerts', icon: '🚨', showAlertBadge: true },
  { label: 'District Dashboard', labelHi: 'जिला डैशबोर्ड', href: '/districts', icon: '📍' },
  { label: 'Compare Districts', labelHi: 'तुलना करें', href: '/compare', icon: '⚖️' },
  { label: 'Traffic & Roads', labelHi: 'ट्रैफिक', href: '/roads', icon: '🚗' },
  { label: 'Weather & Rivers', labelHi: 'मौसम', href: '/weather', icon: '🌊' },
  { label: 'Tourism Live', labelHi: 'पर्यटन', href: '/tourism', icon: '🏛️' },
  { label: 'Migration Tracker', labelHi: 'प्रवासन', href: '/migration', icon: '🔄' },
  { label: 'Speed & Connectivity', labelHi: 'कनेक्टिविटी', href: '/connectivity', icon: '📡' },
  { label: 'Sector Intelligence', labelHi: 'खुफिया', href: '/intelligence', icon: '🧠' },
  { label: 'Governance Dashboard', labelHi: 'शासन', href: '/governance', icon: '⚙️' },
  { label: 'Offline Mode', labelHi: 'ऑफलाइन', href: '/offline', icon: '📱' },
];

export interface SidebarProps {
  /** Real active-alert count for the Live Alerts badge. `null` while loading or unavailable. */
  alertCount?: number | null;
}

export function Sidebar({ alertCount = null }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-none flex-col bg-bg-dark text-text-light">
      <div className="flex items-center gap-3 border-b border-text-light/10 px-5 py-5">
        <Image
          src="/pahad-pulse/public/logo.png"
          alt="Pahad Pulse logo"
          width={40}
          height={40}
          className="flex-none rounded-xl"
          priority
        />
        <div className="min-w-0">
          <div className="font-display text-lg leading-none font-bold tracking-wide text-bg-light">PAHAD PULSE</div>
          <div className="font-display text-sm leading-tight font-semibold text-orange-200">पहाड़ पल्स</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-3.5" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const badge = item.showAlertBadge && alertCount !== null && alertCount > 0 ? alertCount : null;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg border-l-[3px] px-3 py-2.5 text-sm transition-colors',
                'focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
                isActive
                  ? 'border-l-accent bg-text-light/10 font-semibold text-bg-light'
                  : 'border-l-transparent text-text-light/80 hover:bg-text-light/10 hover:text-bg-light',
              )}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span className="flex-1 leading-tight">{item.label}</span>
              {badge !== null && (
                <span
                  className="rounded-md bg-accent/25 px-1.5 py-0.5 font-mono text-xs text-orange-200"
                  aria-label={`${badge} active alerts`}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-text-light/10 px-5 py-4">
        <p className="text-center text-xs text-text-light/60">Real government data, live updates</p>
      </div>
    </aside>
  );
}
