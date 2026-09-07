import { Card } from '@/components/molecules/card';
import { SourceNote } from '@/components/molecules/source-note';
import { cn } from '@/lib/utils';

import type { Alert } from '../schemas';

export interface AlertCardProps {
  alert: Alert;
}

type Tone = 'violet' | 'blue' | 'rust' | 'critical';

/** Real alert `type` values, mapped to a distinct hue each — no fictional categories. */
const TYPE_META: Record<Alert['type'], { label: string; tone: Tone }> = {
  weather: { label: 'Weather', tone: 'violet' },
  river: { label: 'River', tone: 'blue' },
  flood: { label: 'Flood', tone: 'blue' },
  road: { label: 'Road', tone: 'rust' },
  disaster: { label: 'Disaster', tone: 'critical' },
};

const TONE_BORDER: Record<Tone, string> = {
  violet: 'border-l-violet',
  blue: 'border-l-blue',
  rust: 'border-l-rust',
  critical: 'border-l-alert-critical',
};

const TONE_PILL: Record<Tone, string> = {
  violet: 'bg-violet/10 text-violet',
  blue: 'bg-blue/10 text-blue',
  rust: 'bg-rust/10 text-rust',
  critical: 'bg-alert-critical/10 text-alert-critical',
};

const SEVERITY_TEXT: Record<Alert['severity'], string> = {
  minor: 'text-text-dark/55',
  moderate: 'text-alert-warning',
  severe: 'text-rust',
  extreme: 'text-alert-critical font-semibold',
};

const STATUS_LABEL: Record<Alert['status'], string> = {
  active: 'Active',
  expired: 'Expired',
  cancelled: 'Cancelled',
  superseded: 'Superseded',
};

export function AlertCard({ alert }: AlertCardProps) {
  const type = TYPE_META[alert.type];
  const issuedAt = new Date(alert.issuedAt);
  const expiresAt = alert.expiresAt ? new Date(alert.expiresAt) : null;

  return (
    <Card className={cn('border-l-4 p-4', TONE_BORDER[type.tone])}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className={cn('rounded px-2 py-0.5 font-mono text-xs tracking-wide uppercase', TONE_PILL[type.tone])}>
          {type.label}
        </span>
        <span className={cn('text-xs', SEVERITY_TEXT[alert.severity])}>
          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
        </span>
        {alert.status !== 'active' && (
          <span className="rounded bg-border/50 px-2 py-0.5 text-xs text-text-dark/60">
            {STATUS_LABEL[alert.status]}
          </span>
        )}
        <span className="ml-auto font-mono text-xs text-text-dark/50 whitespace-nowrap">
          {issuedAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
      </div>

      <h3 className="text-base font-semibold">{alert.headline}</h3>
      <p className="mt-0.5 text-xs text-text-dark/55">{alert.authority}</p>

      {alert.areas.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {alert.areas.map((area) => (
            <span key={area.id} className="rounded bg-surface-hover px-2 py-0.5 text-xs">
              {area.name.en}
            </span>
          ))}
        </div>
      )}

      {alert.body && <p className="mt-2 line-clamp-2 text-sm text-text-dark/80">{alert.body}</p>}

      <SourceNote>
        Source: {alert.provenance?.department.en ?? alert.authority}
        {expiresAt && ` · Expires ${expiresAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`}
      </SourceNote>
    </Card>
  );
}
