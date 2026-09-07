import Link from 'next/link';

import { Card } from '@/components/molecules/card';
import { Kicker } from '@/components/molecules/kicker';

interface QuickAccessItem {
  label: string;
  href: string;
  icon: string;
  description: string;
}

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  { label: 'Live Alerts', href: '/alerts', icon: '🚨', description: 'Weather, disaster & road alerts' },
  { label: 'District Details', href: '/districts', icon: '📍', description: 'Full dashboard for any district' },
  { label: 'Compare Districts', href: '/compare', icon: '⚖️', description: 'Side-by-side comparison' },
  { label: 'Tourism Live', href: '/tourism', icon: '🏛️', description: 'Char Dham & tourist load' },
  { label: 'Weather & Rivers', href: '/weather', icon: '🌧️', description: 'Temperature, rainfall, levels' },
  { label: 'Roads & Traffic', href: '/roads', icon: '🛣️', description: 'Closures and traffic status' },
  { label: 'Migration Tracker', href: '/migration', icon: '👥', description: 'Ghost villages & trends' },
  { label: 'Connectivity Map', href: '/connectivity', icon: '📡', description: 'Internet speed & coverage' },
  { label: 'Sector Intelligence', href: '/intelligence', icon: '📊', description: 'Health, education, economy' },
];

export function QuickAccessGrid() {
  return (
    <Card tinted className="p-5">
      <h2 className="sr-only">Quick access</h2>
      <Kicker className="mb-3.5">Quick access · त्वरित पहुँच</Kicker>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACCESS_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start gap-3 rounded-lg border border-border/70 bg-surface/80 p-3 transition-colors hover:border-accent hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <span className="text-2xl" aria-hidden="true">
              {item.icon}
            </span>
            <span>
              <span className="block text-sm font-semibold group-hover:text-accent">{item.label}</span>
              <span className="mt-0.5 block text-xs text-text-dark/55">{item.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
