import Link from 'next/link';

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

/** URL-driven filters — no client state; selecting a filter is a normal navigation. */
export function AlertFilters({ type, minSeverity }: AlertFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6" role="group" aria-label="Filter alerts">
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref({ type, minSeverity }, { type: undefined })}
          aria-current={!type}
          className={`text-xs px-3 py-1 rounded border ${!type ? 'bg-accent text-white border-accent' : 'bg-surface border-border'}`}
        >
          All types
        </Link>
        {TYPES.map((t) => (
          <Link
            key={t}
            href={buildHref({ type, minSeverity }, { type: t })}
            aria-current={type === t}
            className={`text-xs px-3 py-1 rounded border capitalize ${type === t ? 'bg-accent text-white border-accent' : 'bg-surface border-border'}`}
          >
            {t}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref({ type, minSeverity }, { minSeverity: undefined })}
          aria-current={!minSeverity}
          className={`text-xs px-3 py-1 rounded border ${!minSeverity ? 'bg-accent text-white border-accent' : 'bg-surface border-border'}`}
        >
          Any severity
        </Link>
        {SEVERITIES.map((s) => (
          <Link
            key={s}
            href={buildHref({ type, minSeverity }, { minSeverity: s })}
            aria-current={minSeverity === s}
            className={`text-xs px-3 py-1 rounded border capitalize ${minSeverity === s ? 'bg-accent text-white border-accent' : 'bg-surface border-border'}`}
          >
            {s}+
          </Link>
        ))}
      </div>
    </div>
  );
}
