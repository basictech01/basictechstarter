import Link from 'next/link';

import { cn } from '@/lib/utils';

export interface AlertFiltersProps {
  type?: string;
  minSeverity?: string;
}

const TYPES = ['weather', 'river', 'flood', 'road', 'disaster'] as const;
const SEVERITIES = ['minor', 'moderate', 'severe', 'extreme'] as const;

function buildHref(current: AlertFiltersProps, patch: Partial<AlertFiltersProps>): string {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  if (next.type) params.set('type', next.type);
  if (next.minSeverity) params.set('minSeverity', next.minSeverity);
  const query = params.toString();
  return query ? `/alerts?${query}` : '/alerts';
}

const PILL_BASE =
  'rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';
const PILL_ON = 'border-forest bg-forest text-bg-light';
const PILL_OFF = 'border-border bg-surface/70 text-text-dark/75 hover:border-forest/40';

/** URL-driven filters — no client state; selecting a filter is a normal navigation. */
export function AlertFilters({ type, minSeverity }: AlertFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-4" role="group" aria-label="Filter alerts">
      <div className="flex flex-wrap gap-2">
        <Link href={buildHref({ type, minSeverity }, { type: undefined })} aria-current={!type} className={cn(PILL_BASE, !type ? PILL_ON : PILL_OFF)}>
          All types
        </Link>
        {TYPES.map((t) => (
          <Link
            key={t}
            href={buildHref({ type, minSeverity }, { type: t })}
            aria-current={type === t}
            className={cn(PILL_BASE, type === t ? PILL_ON : PILL_OFF)}
          >
            {t}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref({ type, minSeverity }, { minSeverity: undefined })}
          aria-current={!minSeverity}
          className={cn(PILL_BASE, !minSeverity ? PILL_ON : PILL_OFF)}
        >
          Any severity
        </Link>
        {SEVERITIES.map((s) => (
          <Link
            key={s}
            href={buildHref({ type, minSeverity }, { minSeverity: s })}
            aria-current={minSeverity === s}
            className={cn(PILL_BASE, minSeverity === s ? PILL_ON : PILL_OFF)}
          >
            {s}+
          </Link>
        ))}
      </div>
    </div>
  );
}
