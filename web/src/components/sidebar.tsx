'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <aside id="sidebar" className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">🏔️</span>
          <span className="logo-name">Pahad Pulse</span>
        </div>
        <p className="tagline">Uttarakhand Intelligence Platform</p>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const badge = item.showAlertBadge && alertCount !== null && alertCount > 0 ? alertCount : null;

          return (
            <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-label">{item.label}</span>
              {badge !== null && (
                <span className="badge" aria-label={`${badge} active alerts`}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <p className="footer-text">Real government data, live updates</p>
      </div>
    </aside>
  );
}
