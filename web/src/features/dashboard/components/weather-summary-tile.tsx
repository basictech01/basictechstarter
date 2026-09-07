'use client';

import Link from 'next/link';

import { Card } from '@/components/molecules/card';
import { useWeatherSummary } from '@/features/weather/hooks';
import { describeObservationAge } from '@/features/weather/utils';

/** Home-dashboard tile summarising statewide NWDP weather telemetry. */
export function WeatherSummaryTile() {
  const { data, isPending, isError } = useWeatherSummary();

  if (isPending) {
    return <Card className="h-24 animate-pulse border-l-4 border-l-border p-4" />;
  }

  if (isError || data === undefined) {
    return (
      <Card className="border-l-4 border-l-text-dark/30 p-4">
        <div className="mb-2 text-3xl" aria-hidden="true">
          🌡️
        </div>
        <div className="font-display mb-1 text-lg font-bold">Unavailable</div>
        <div className="font-mono text-xs text-text-dark/55">Weather Data</div>
      </Card>
    );
  }

  return (
    <Link href="/weather" className="block">
      <Card className="border-l-4 border-l-blue p-4 transition-colors hover:bg-surface">
        <div className="mb-2 text-3xl" aria-hidden="true">
          🌡️
        </div>
        <div className="font-display mb-1 text-2xl font-bold">
          {data.averageTemperatureCelsius !== null ? `${data.averageTemperatureCelsius.toFixed(1)}°C` : 'No data'}
        </div>
        <div className="font-mono text-xs text-text-dark/55">
          {data.stationCount} station{data.stationCount === 1 ? '' : 's'} · {data.districtsCovered}/13 districts ·{' '}
          {describeObservationAge(data.latestObservationAt).label}
        </div>
      </Card>
    </Link>
  );
}
