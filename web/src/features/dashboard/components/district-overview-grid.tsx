import Link from 'next/link';

import { Card, CardTitle } from '@/components/molecules/card';

import type { DistrictSummary } from '../schemas';

export interface DistrictOverviewGridProps {
  districts: DistrictSummary[];
  loading?: boolean;
}

export function DistrictOverviewGrid({ districts, loading }: DistrictOverviewGridProps) {
  return (
    <Card className="overflow-hidden">
      <CardTitle>
        Districts at a glance ·{' '}
        <span className="font-display font-normal text-text-dark/55">तेरह जिले</span>
      </CardTitle>

      {loading ? (
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {(districts.length > 0 ? districts : Array.from({ length: 13 }, (_, i) => `placeholder-${i}`)).map((d) => (
            <div key={typeof d === 'string' ? d : d.id} className="h-24 animate-pulse bg-surface" />
          ))}
        </div>
      ) : districts.length === 0 ? (
        <p className="p-5 text-sm text-text-dark/60">No districts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {districts.map((district) => (
            <Link
              key={district.id}
              href={`/districts/${district.slug}`}
              className="group flex flex-col gap-0.5 border-r border-b border-border/70 p-4 transition-colors last:border-r-0 hover:bg-accent/5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <span className="text-sm font-semibold group-hover:text-accent">{district.name.en}</span>
              <span className="font-display text-xs text-text-dark/50">{district.name.hi}</span>
              <span className="mt-2 flex gap-3 font-mono text-[11px] text-text-dark/55">
                <span>{district.counts.tehsils} tehsils</span>
                <span>{district.counts.villages.toLocaleString('en-IN')} villages</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
