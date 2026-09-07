import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card } from '@/components/molecules/card';
import { Kicker } from '@/components/molecules/kicker';
import { PageHeader } from '@/components/molecules/page-header';
import { AppSidebar } from '@/features/dashboard/components';
import { CurrentConditionsCard, RainfallByDistrict, StationsTable } from '@/features/weather/components';
import { fetchWeatherStations, fetchWeatherSummary } from '@/features/weather/services';
import { aggregateRainfallByDistrict, describeObservationAge } from '@/features/weather/utils';

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

  const rainfallByDistrict = stations ? aggregateRainfallByDistrict(stations) : [];

  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <PageHeader
        title="Weather & Rivers"
        titleHi="मौसम एवं नदियाँ"
        description="Live NWDP telemetry — rainfall, temperature, humidity, wind, pressure and solar radiation"
      />

      <div className="space-y-6 p-6 md:p-8">
        {error && (
          <div className="rounded-lg border border-alert-critical/30 bg-alert-critical/10 px-4 py-3 text-alert-critical">
            <p className="font-semibold">Unable to load weather data</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!error && summary === null && (
          <p className="py-12 text-center font-semibold text-text-dark">Loading weather data…</p>
        )}

        {summary && (
          <Card className="p-5">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <Kicker>Stations</Kicker>
                <p className="font-display mt-1 text-2xl font-semibold">{summary.stationCount}</p>
              </div>
              <div>
                <Kicker>Districts covered</Kicker>
                <p className="font-display mt-1 text-2xl font-semibold">{summary.districtsCovered} / 13</p>
              </div>
              <div>
                <Kicker>Avg. temperature</Kicker>
                <p className="font-display mt-1 text-2xl font-semibold">
                  {summary.averageTemperatureCelsius !== null
                    ? `${summary.averageTemperatureCelsius.toFixed(1)}°C`
                    : 'No data'}
                </p>
              </div>
              <div>
                <Kicker>Rainfall, last 24h</Kicker>
                <p className="font-display mt-1 text-2xl font-semibold">{summary.totalRainfallMmLast24h}mm</p>
              </div>
            </div>
            <p className="mt-4 border-t border-border pt-3 text-xs text-text-dark/55">
              Latest observation statewide: {describeObservationAge(summary.latestObservationAt).label}
            </p>
          </Card>
        )}

        {/*
          No CWC / India-WRIS river-level source is connected yet (hydromet.md §8) — the ZIP's
          "River levels" card used fabricated river names and levels, so it is intentionally
          omitted rather than restyled. This rainfall comparison is built entirely from the real
          per-station snapshot already fetched above.
        */}
        {stations && stations.length > 0 && <RainfallByDistrict data={rainfallByDistrict} />}

        {stations && stations.length === 0 && (
          <div className="py-12 text-center">
            <p className="font-semibold text-text-dark">No weather stations reporting yet</p>
            <p className="mt-1 text-sm text-text-dark/60">NWDP telemetry is being onboarded district by district.</p>
          </div>
        )}

        {stations && stations.length > 0 && (
          <div>
            <h2 className="font-display mb-4 text-2xl font-bold">Stations</h2>
            <StationsTable stations={stations} />
          </div>
        )}

        {stations && stations.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
    </DashboardLayout>
  );
}
