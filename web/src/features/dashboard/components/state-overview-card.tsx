import type { StateOverview } from '../types';

export interface StateOverviewCardProps {
  data: StateOverview;
  loading?: boolean;
}

const ITEMS: ReadonlyArray<{
  label: string;
  icon: string;
  value: (data: StateOverview) => string | null;
}> = [
  { label: 'Population', icon: '👥', value: (d) => (d.population === null ? null : `${(d.population / 1000000).toFixed(1)}M`) },
  { label: 'Area', icon: '📍', value: (d) => (d.areaKmSq === null ? null : `${d.areaKmSq.toLocaleString('en-IN')} km²`) },
  { label: 'Literacy Rate', icon: '📚', value: (d) => (d.literacy === null ? null : `${d.literacy}%`) },
  { label: 'Districts', icon: '🗺️', value: (d) => String(d.districts) },
  { label: 'Forest Coverage', icon: '🌲', value: (d) => (d.forestCoverage === null ? null : `${d.forestCoverage}%`) },
  { label: 'Villages', icon: '🏘️', value: (d) => d.villages.toLocaleString('en-IN') },
];

export function StateOverviewCard({ data, loading }: StateOverviewCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
      <h2 className="font-display text-2xl font-bold mb-6">Uttarakhand at a Glance</h2>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {ITEMS.map((item) => (
            <div key={item.label} className="h-10 bg-surface-hover rounded" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {ITEMS.map((item) => {
            const value = item.value(data);
            return (
              <div key={item.label} className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className={value === null ? 'text-lg font-semibold text-text-light/50' : 'text-2xl font-bold text-accent'}>
                  {value ?? 'Pending'}
                </p>
                <p className="text-xs text-text-light/60 mt-1">{item.label}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
