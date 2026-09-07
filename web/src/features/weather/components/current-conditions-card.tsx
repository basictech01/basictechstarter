import { Card } from '@/components/molecules/card';
import { cn } from '@/lib/utils';

import type { WeatherSnapshot } from '../schemas';
import { describeObservationAge } from '../utils';

export interface CurrentConditionsCardProps {
  title: string;
  subtitle?: string;
  snapshot: WeatherSnapshot;
}

const FIELDS: ReadonlyArray<{
  key: keyof WeatherSnapshot;
  label: string;
  unit: string;
}> = [
  { key: 'temperatureCelsius', label: 'Temperature', unit: '°C' },
  { key: 'rainfallMm', label: 'Rainfall', unit: 'mm' },
  { key: 'humidityPercent', label: 'Humidity', unit: '%' },
  { key: 'windSpeedKmh', label: 'Wind speed', unit: 'km/h' },
  { key: 'pressureMb', label: 'Pressure', unit: 'mb' },
  { key: 'solarRadiationWM2', label: 'Solar radiation', unit: 'W/m²' },
];

const FRESHNESS_STYLES: Record<string, string> = {
  fresh: 'bg-green/10 text-green',
  stale: 'bg-alert-warning/10 text-alert-warning',
  expired: 'bg-alert-critical/10 text-alert-critical',
  unknown: 'bg-border/40 text-text-dark/60',
};

export function CurrentConditionsCard({ title, subtitle, snapshot }: CurrentConditionsCardProps) {
  const age = describeObservationAge(snapshot.observedAt);
  const windDirection =
    snapshot.windDirectionDegrees !== null
      ? `${snapshot.windDirectionCardinal ?? ''} ${snapshot.windDirectionDegrees}°`.trim()
      : null;

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-text-dark/55">{subtitle}</p>}
        </div>
        <span className={cn('flex-none rounded px-2 py-1 text-xs font-semibold', FRESHNESS_STYLES[age.level])}>
          {age.label}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {FIELDS.map((field) => {
          const value = snapshot[field.key];
          return (
            <div key={field.key}>
              <dt className="text-xs tracking-wide text-text-dark/55 uppercase">{field.label}</dt>
              <dd className="font-mono text-lg font-semibold">
                {typeof value === 'number' ? `${value}${field.unit}` : 'No data'}
              </dd>
            </div>
          );
        })}
        <div>
          <dt className="text-xs tracking-wide text-text-dark/55 uppercase">Wind direction</dt>
          <dd className="font-mono text-lg font-semibold">{windDirection ?? 'No data'}</dd>
        </div>
      </dl>

      {snapshot.provenance.length > 0 && (
        <p className="mt-4 border-t border-border pt-3 font-mono text-xs text-text-dark/50">
          Source{snapshot.provenance.length > 1 ? 's' : ''}: {snapshot.provenance.map((p) => p.department.en).join(', ')}
        </p>
      )}
    </Card>
  );
}
