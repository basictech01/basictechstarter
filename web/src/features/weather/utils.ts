import { WEATHER_FRESHNESS_HOURS } from '@/config/constants';

import type { WeatherStation } from './schemas';

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

export interface DistrictRainfall {
  slug: string;
  name: string;
  rainfallMm: number;
}

/**
 * Rolls up the real per-station rainfall snapshot (`GET /weather/stations`) into one figure per
 * district — the maximum reported by any station in that district — for the rainfall
 * comparison bars. Districts with no station reporting a rainfall value are omitted, not
 * shown as zero (a real 0mm and "no data" must never look the same).
 */
export function aggregateRainfallByDistrict(stations: WeatherStation[]): DistrictRainfall[] {
  const byDistrict = new Map<string, DistrictRainfall>();

  for (const station of stations) {
    if (station.latest.rainfallMm === null) continue;

    const existing = byDistrict.get(station.district.slug);
    if (existing === undefined || station.latest.rainfallMm > existing.rainfallMm) {
      byDistrict.set(station.district.slug, {
        slug: station.district.slug,
        name: station.district.name.en,
        rainfallMm: station.latest.rainfallMm,
      });
    }
  }

  return Array.from(byDistrict.values()).sort((a, b) => b.rainfallMm - a.rainfallMm);
}
