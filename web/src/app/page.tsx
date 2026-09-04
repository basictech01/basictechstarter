import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import {
  AppSidebar,
  DistrictOverviewGrid,
  InteractiveMapSection,
  LiveCounters,
  QuickAccessGrid,
  StateOverviewCard,
  WeatherSummaryTile,
} from '@/features/dashboard/components';
import { fetchAllDistricts, fetchLiveCounters, fetchStateOverview } from '@/features/dashboard/services';

export const metadata: Metadata = {
  title: 'Pahad Pulse — Uttarakhand Home Dashboard',
  description: 'Live government data for Uttarakhand: alerts, weather, and district statistics.',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let counters = null;
  let overview = null;
  let districts = null;
  let error: string | null = null;

  try {
    [counters, overview, districts] = await Promise.all([
      fetchLiveCounters(),
      fetchStateOverview(),
      fetchAllDistricts(),
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load dashboard data';
  }

  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <header
        className="sticky top-0 z-40 backdrop-blur-sm px-8 py-4 shadow-sm"
        style={{ backgroundColor: 'rgba(250,248,244,.9)', borderBottom: '1px solid rgba(20,32,28,.12)' }}
      >
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-dark)' }}>
            Uttarakhand Home Dashboard
          </h1>
          <p className="font-display text-sm text-gray-600">उत्तराखंड होम डैशबोर्ड</p>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold">Unable to load dashboard data</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {counters && (
          <div className="space-y-4">
            <LiveCounters data={counters} />
            <div className="px-6">
              <WeatherSummaryTile />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden p-4" style={{ border: '1px solid #D4CCBE' }}>
            <div className="font-semibold text-sm mb-3">
              Interactive state map · <span className="font-display text-gray-600">किलवार नक्शा</span>
            </div>
            <InteractiveMapSection />
            <p className="text-xs text-gray-500 mt-2">Click any district marker to open its dashboard.</p>
          </div>

          {overview && <StateOverviewCard data={overview} />}
        </div>

        {districts && <DistrictOverviewGrid districts={districts} />}

        <QuickAccessGrid />
      </div>
    </DashboardLayout>
  );
}
