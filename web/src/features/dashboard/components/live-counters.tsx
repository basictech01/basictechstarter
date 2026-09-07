import { Card } from '@/components/molecules/card';
import { Kicker } from '@/components/molecules/kicker';
import { cn } from '@/lib/utils';

import type { LiveCounters } from '../types';

export interface LiveCountersProps {
  data: LiveCounters;
  loading?: boolean;
}

type Tone = 'rust' | 'accent' | 'forest' | 'blue';

const TONE_DOT: Record<Tone, string> = {
  rust: 'bg-rust',
  accent: 'bg-accent',
  forest: 'bg-forest',
  blue: 'bg-blue',
};

const TONE_TEXT: Record<Tone, string> = {
  rust: 'text-rust',
  accent: 'text-accent',
  forest: 'text-forest',
  blue: 'text-blue',
};

const COUNTERS: ReadonlyArray<{
  label: string;
  unit: string;
  tone: Tone;
  value: (data: LiveCounters) => number | null;
  format: (value: number) => string;
}> = [
  { label: 'Active alerts', unit: 'now', tone: 'rust', value: (d) => d.activeAlerts, format: (v) => v.toLocaleString('en-IN') },
  {
    label: 'Tourists in state',
    unit: 'people',
    tone: 'accent',
    value: (d) => d.touristsInState,
    format: (v) => v.toLocaleString('en-IN'),
  },
  { label: 'Closed roads', unit: 'segments', tone: 'forest', value: (d) => d.closedRoads, format: (v) => v.toLocaleString('en-IN') },
  { label: 'Connectivity', unit: 'online', tone: 'blue', value: (d) => d.connectivityPercentage, format: (v) => `${v}%` },
];

export function LiveCounters({ data, loading }: LiveCountersProps) {
  return (
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-4">
      {COUNTERS.map((counter) => {
        const value = counter.value(data);
        return (
          <Card key={counter.label} className="p-4">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 w-1/2 rounded bg-border" />
                <div className="h-8 w-3/4 rounded bg-border" />
              </div>
            ) : (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <span className={cn('size-1.5 flex-none rounded-full', TONE_DOT[counter.tone])} aria-hidden="true" />
                  <Kicker>{counter.label}</Kicker>
                </div>
                {value === null ? (
                  <>
                    <p className="font-display text-2xl font-semibold text-text-dark/35">Pending</p>
                    <p className="mt-1 text-xs text-text-dark/45">No data source connected</p>
                  </>
                ) : (
                  <>
                    <p className={cn('font-display text-4xl leading-none font-semibold', TONE_TEXT[counter.tone])}>
                      {counter.format(value)}
                    </p>
                    <p className="mt-1.5 text-xs text-text-dark/50">{counter.unit}</p>
                  </>
                )}
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}
