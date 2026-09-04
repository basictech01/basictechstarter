import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { AppSidebar } from '@/features/dashboard/components';
import { CurrentConditionsCard, StationsTable } from '@/features/weather/components';
import { fetchWeatherStations, fetchWeatherSummary } from '@/features/weather/services';
import { describeObservationAge } from '@/features/weather/utils';

export const metadata: Metadata = {
  title: 'Weather & Rivers — Pahad Pulse',
  description: 'Real-time NWDP weather observations across Uttarakhand.',
};

export const dynamic = 'force-dynamic';

export default async function WeatherPage() {
  let stations = null;
  let summary = null;
  let error: string | null = null;

  try {
    [stations, summary] = await Promise.all([fetchWeatherStations(), fetchWeatherSummary()]);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load weather data';
  }

  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <div className="min-h-screen bg-bg-light">
        <div className="bg-bg-dark text-text-dark py-8 px-6">
          <h1 className="font-display text-4xl font-bold">Weather & Rivers</h1>
          <p className="text-text-dark/70 mt-2">
            Live NWDP telemetry — rainfall, temperature, humidity, wind, pressure and solar radiation
          </p>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-semibold">Unable to load weather data</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {!error && summary === null && (
            <div className="text-center py-12">
              <p className="font-semibold text-text-dark">Loading weather data…</p>
            </div>
          )}

          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface border border-border rounded-lg p-4">
                <p className="text-xs text-text-light/60 uppercase">Stations</p>
                <p className="text-2xl font-bold">{summary.stationCount}</p>
              </div>
              <div className="bg-surface border border-border rounded-lg p-4">
                <p className="text-xs text-text-light/60 uppercase">Districts covered</p>
                <p className="text-2xl font-bold">{summary.districtsCovered} / 13</p>
              </div>
              <div className="bg-surface border border-border rounded-lg p-4">
                <p className="text-xs text-text-light/60 uppercase">Avg. temperature</p>
                <p className="text-2xl font-bold">
                  {summary.averageTemperatureCelsius !== null
                    ? `${summary.averageTemperatureCelsius.toFixed(1)}°C`
                    : 'No data'}
                </p>
              </div>
              <div className="bg-surface border border-border rounded-lg p-4">
                <p className="text-xs text-text-light/60 uppercase">Rainfall, last 24h</p>
                <p className="text-2xl font-bold">{summary.totalRainfallMmLast24h}mm</p>
              </div>
              <div className="col-span-2 md:col-span-4 text-xs text-text-light/60">
                Latest observation statewide: {describeObservationAge(summary.latestObservationAt).label}
              </div>
            </div>
          )}

          {stations && stations.length === 0 && (
            <div className="text-center py-12">
              <p className="font-semibold text-text-dark">No weather stations reporting yet</p>
              <p className="text-text-light/60 text-sm mt-1">
                NWDP telemetry is being onboarded district by district.
              </p>
            </div>
          )}

          {stations && stations.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold mb-4">Stations</h2>
              <StationsTable stations={stations} />
            </div>
          )}

          {stations && stations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stations.slice(0, 4).map((station) => (
                <CurrentConditionsCard
                  key={station.id}
                  title={station.name}
                  subtitle={station.district.name.en}
                  snapshot={station.latest}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
