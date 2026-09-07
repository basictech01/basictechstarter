import Link from 'next/link';

import { cn } from '@/lib/utils';

import type { DistrictSummary } from '../schemas';

export interface DistrictSwitcherProps {
  districts: DistrictSummary[];
  currentSlug: string;
}

/** A pill row linking to every other district's real dashboard page. */
export function DistrictSwitcher({ districts, currentSlug }: DistrictSwitcherProps) {
  return (
    <nav className="flex flex-wrap gap-1.5" aria-label="Switch district">
      {districts.map((d) => {
        const isCurrent = d.slug === currentSlug;
        return (
          <Link
            key={d.id}
            href={`/districts/${d.slug}`}
            aria-current={isCurrent ? 'page' : undefined}
            className={cn(
              'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
              isCurrent ? 'border-forest bg-forest text-bg-light' : 'border-border bg-surface/70 text-text-dark/75 hover:border-forest/40',
            )}
          >
            {d.name.en}
          </Link>
        );
      })}
    </nav>
  );
}
