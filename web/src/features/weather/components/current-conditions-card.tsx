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
  format?: (value: number) => string;
}> = [
  { key: 'temperatureCelsius', label: 'Temperature', unit: '°C' },
  { key: 'rainfallMm', label: 'Rainfall', unit: 'mm' },
  { key: 'humidityPercent', label: 'Humidity', unit: '%' },
  { key: 'windSpeedKmh', label: 'Wind speed', unit: 'km/h' },
  { key: 'pressureMb', label: 'Pressure', unit: 'mb' },
  { key: 'solarRadiationWM2', label: 'Solar radiation', unit: 'W/m²' },
];

const FRESHNESS_STYLES: Record<string, string> = {
  fresh: 'bg-green-100 text-green-800',
  stale: 'bg-yellow-100 text-yellow-800',
  expired: 'bg-red-100 text-red-800',
  unknown: 'bg-gray-100 text-gray-600',
};

export function CurrentConditionsCard({ title, subtitle, snapshot }: CurrentConditionsCardProps) {
  const age = describeObservationAge(snapshot.observedAt);
  const windDirection =
    snapshot.windDirectionDegrees !== null
      ? `${snapshot.windDirectionCardinal ?? ''} ${snapshot.windDirectionDegrees}°`.trim()
      : null;

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          {subtitle && <p className="text-xs text-text-light/60">{subtitle}</p>}
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${FRESHNESS_STYLES[age.level]}`}>
          {age.label}
        </span>
      </div>

      <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {FIELDS.map((field) => {
          const value = snapshot[field.key];
          return (
            <div key={field.key}>
              <dt className="text-xs text-text-light/60 uppercase tracking-wide">{field.label}</dt>
              <dd className="text-lg font-semibold">
                {typeof value === 'number' ? `${value}${field.unit}` : 'No data'}
              </dd>
            </div>
          );
        })}
        <div>
          <dt className="text-xs text-text-light/60 uppercase tracking-wide">Wind direction</dt>
          <dd className="text-lg font-semibold">{windDirection ?? 'No data'}</dd>
        </div>
      </dl>

      {snapshot.provenance.length > 0 && (
        <p className="text-xs text-text-light/50 mt-4 pt-3 border-t border-border">
          Source{snapshot.provenance.length > 1 ? 's' : ''}:{' '}
          {snapshot.provenance.map((p) => p.department.en).join(', ')}
        </p>
      )}
    </div>
  );
}
