import { WEATHER_FRESHNESS_HOURS } from '@/config/constants';

export type ObservationAge = {
  label: string;
  level: 'unknown' | 'fresh' | 'stale' | 'expired';
};

/**
 * NWDP telemetry normally lags ~2 days behind real time (hydromet.md §8), so "stale" is
 * calibrated to that reality rather than to a sub-hour freshness assumption.
 */
export function describeObservationAge(observedAt: string | null, now: Date = new Date()): ObservationAge {
  if (observedAt === null) return { label: 'No data', level: 'unknown' };

  const observed = new Date(observedAt);
  const hours = (now.getTime() - observed.getTime()) / (60 * 60 * 1000);
  const level = hours >= WEATHER_FRESHNESS_HOURS.EXPIRED ? 'expired' : hours >= WEATHER_FRESHNESS_HOURS.STALE ? 'stale' : 'fresh';

  const days = hours / 24;
  const label =
    days >= 1 ? `Observed ${days.toFixed(1)} days ago` : `Observed ${Math.max(0, Math.round(hours))} hours ago`;

  return { label, level };
}
