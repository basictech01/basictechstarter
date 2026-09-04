import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { AppSidebar } from '@/features/dashboard/components';
import { fetchAllDistricts } from '@/features/dashboard/services';

export const metadata: Metadata = {
  title: 'Select District — Pahad Pulse',
};

export const dynamic = 'force-dynamic';

export default async function DistrictsListPage() {
  let districts = null;
  let error: string | null = null;

  try {
    districts = await fetchAllDistricts();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load districts';
  }

  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <div className="min-h-screen bg-bg-light">
        <div className="bg-bg-dark text-text-dark py-8 px-6">
          <h1 className="font-display text-4xl font-bold">Districts</h1>
          <p className="text-text-dark/70 mt-2">Select a district to view detailed information</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-semibold">Unable to load districts</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {!error && districts === null && (
            <div className="text-center py-12">
              <p className="font-semibold text-text-dark">Loading districts…</p>
            </div>
          )}

          {districts && districts.length === 0 && (
            <div className="text-center py-12">
              <p className="font-semibold text-text-dark">No districts found</p>
            </div>
          )}

          {districts && districts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {districts.map((district) => (
                <Link
                  key={district.id}
                  href={`/districts/${district.slug}`}
                  className="bg-surface border border-border rounded-lg p-6 hover:border-accent hover:shadow-md transition-all hover:bg-surface-hover"
                >
                  <h2 className="font-bold text-lg mb-1 hover:text-accent">{district.name.en}</h2>
                  <p className="text-sm text-text-light/60 mb-4">{district.name.hi}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tehsils</span>
                      <span className="font-semibold">{district.counts.tehsils}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Villages</span>
                      <span className="font-semibold">{district.counts.villages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Map</span>
                      <span>{district.hasBoundary ? '✓' : '—'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
