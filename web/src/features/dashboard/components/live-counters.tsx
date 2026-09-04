import type { LiveCounters } from '../types';

export interface LiveCountersProps {
  data: LiveCounters;
  loading?: boolean;
}

const COUNTERS: ReadonlyArray<{
  label: string;
  unit: string;
  color: string;
  value: (data: LiveCounters) => number | null;
}> = [
  { label: 'Active Alerts', unit: 'now', color: 'bg-red-100 text-red-700', value: (d) => d.activeAlerts },
  { label: 'Tourists in State', unit: 'people', color: 'bg-blue-100 text-blue-700', value: (d) => d.touristsInState },
  { label: 'Closed Roads', unit: 'segments', color: 'bg-orange-100 text-orange-700', value: (d) => d.closedRoads },
  {
    label: 'Connectivity',
    unit: 'online',
    color: 'bg-green-100 text-green-700',
    value: (d) => d.connectivityPercentage,
  },
];

export function LiveCounters({ data, loading }: LiveCountersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      {COUNTERS.map((counter) => {
        const value = counter.value(data);
        return (
          <div
            key={counter.label}
            className={`${counter.color} p-6 rounded-lg shadow-sm border border-current border-opacity-20`}
          >
            {loading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-8 bg-current opacity-20 rounded w-3/4" />
                <div className="h-4 bg-current opacity-20 rounded w-1/2" />
              </div>
            ) : (
              <>
                <p className="text-sm font-medium opacity-75">{counter.label}</p>
                {value === null ? (
                  <>
                    <p className="text-2xl font-bold mt-2">Pending</p>
                    <p className="text-xs opacity-60 mt-1">no data source connected</p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold mt-2">
                      {counter.label === 'Connectivity' ? `${value}%` : value.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs opacity-60 mt-1">{counter.unit}</p>
                  </>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
