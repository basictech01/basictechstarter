'use client';

import Link from 'next/link';
import { useWeatherSummary } from '@/features/weather/hooks';
import { describeObservationAge } from '@/features/weather/utils';

/** Home-dashboard tile summarising statewide NWDP weather telemetry. */
export function WeatherSummaryTile() {
  const { data, isPending, isError } = useWeatherSummary();

  if (isPending) {
    return <div className="bg-white rounded-lg p-4 shadow-sm h-24 animate-pulse" style={{ borderLeft: '4px solid #D1D5DB' }} />;
  }

  if (isError || data === undefined) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm" style={{ borderLeft: '4px solid #9CA3AF' }}>
        <div className="text-3xl mb-2">🌡️</div>
        <div className="font-display font-bold text-lg mb-1">Unavailable</div>
        <div className="font-mono text-xs text-gray-600">Weather Data</div>
      </div>
    );
  }

  return (
    <Link
      href="/weather"
      className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
      style={{ borderLeft: '4px solid #0369A1' }}
    >
      <div className="text-3xl mb-2">🌡️</div>
      <div className="font-display font-bold text-2xl mb-1">
        {data.averageTemperatureCelsius !== null ? `${data.averageTemperatureCelsius.toFixed(1)}°C` : 'No data'}
      </div>
      <div className="font-mono text-xs text-gray-600">
        {data.stationCount} station{data.stationCount === 1 ? '' : 's'} · {data.districtsCovered}/13 districts ·{' '}
        {describeObservationAge(data.latestObservationAt).label}
      </div>
    </Link>
  );
}
