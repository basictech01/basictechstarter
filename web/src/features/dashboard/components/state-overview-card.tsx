import { Card } from '@/components/molecules/card';
import { DashRow } from '@/components/molecules/dash-row';
import { Kicker } from '@/components/molecules/kicker';
import { SourceNote } from '@/components/molecules/source-note';

import type { StateOverview } from '../types';

export interface StateOverviewCardProps {
  data: StateOverview;
  loading?: boolean;
}

const ROWS: ReadonlyArray<{
  label: string;
  value: (d: StateOverview) => number | null;
  format: (v: number) => string;
}> = [
  { label: 'Population (2011)', value: (d) => d.population, format: (v) => v.toLocaleString('en-IN') },
  { label: 'Geographical area', value: (d) => d.areaKmSq, format: (v) => `${v.toLocaleString('en-IN')} km²` },
  { label: 'Literacy rate', value: (d) => d.literacy, format: (v) => `${v}%` },
  { label: 'Districts', value: (d) => d.districts, format: (v) => String(v) },
  { label: 'Forest cover', value: (d) => d.forestCoverage, format: (v) => `${v}% of area` },
  { label: 'Villages', value: (d) => d.villages, format: (v) => v.toLocaleString('en-IN') },
];

export function StateOverviewCard({ data, loading }: StateOverviewCardProps) {
  return (
    <Card className="p-5">
      <h2 className="sr-only">Uttarakhand at a glance</h2>
      <Kicker className="mb-3.5">State overview · राज्य</Kicker>

      {loading ? (
        <div className="animate-pulse space-y-2.5">
          {ROWS.map((row) => (
            <div key={row.label} className="h-8 rounded bg-border/50" />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            {ROWS.map((row) => {
              const raw = row.value(data);
              return (
                <DashRow
                  key={row.label}
                  label={row.label}
                  value={raw === null ? <span className="text-text-dark/40">Pending</span> : row.format(raw)}
                />
              );
            })}
          </div>
          <SourceNote>Source: Census of India 2011 · Directorate of Economics &amp; Statistics, Uttarakhand</SourceNote>
        </>
      )}
    </Card>
  );
}
