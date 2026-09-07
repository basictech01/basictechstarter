import { Card } from '@/components/molecules/card';
import { Kicker } from '@/components/molecules/kicker';
import { cn } from '@/lib/utils';

import type { AlertSummary } from '../schemas';

export interface AlertBreakdownProps {
  summary: AlertSummary;
}

const SEVERITY_ORDER: ReadonlyArray<{ key: string; label: string; tone: string }> = [
  { key: 'extreme', label: 'Extreme', tone: 'bg-alert-critical' },
  { key: 'severe', label: 'Severe', tone: 'bg-rust' },
  { key: 'moderate', label: 'Moderate', tone: 'bg-alert-warning' },
  { key: 'minor', label: 'Minor', tone: 'bg-blue' },
];

/** Statewide active-alert counts by severity — real, from `GET /alerts/summary`. */
export function AlertBreakdown({ summary }: AlertBreakdownProps) {
  return (
    <Card className="p-5">
      <h2 className="sr-only">Alert breakdown</h2>
      <Kicker className="mb-3.5">Alert breakdown · वर्गीकरण</Kicker>

      <div className="flex flex-col">
        {SEVERITY_ORDER.map((s) => (
          <div
            key={s.key}
            className="flex items-center justify-between border-b border-dashed border-border py-2 text-sm last:border-b-0"
          >
            <span className="flex items-center gap-2">
              <span className={cn('size-2.5 flex-none rounded-sm', s.tone)} aria-hidden="true" />
              {s.label}
            </span>
            <span className="font-mono font-medium">{summary.bySeverity[s.key] ?? 0}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-text-dark/55">{summary.activeCount} active statewide</p>
    </Card>
  );
}
