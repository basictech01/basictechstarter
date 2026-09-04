import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { AlertCard, AlertFilters } from '@/features/alerts/components';
import { AppSidebar } from '@/features/dashboard/components';
import { fetchActiveAlerts } from '@/features/alerts/services';

export const metadata: Metadata = {
  title: 'Live Alerts — Pahad Pulse',
  description: 'Active weather, disaster, road, and river alerts across Uttarakhand.',
};

export const dynamic = 'force-dynamic';

interface AlertsPageProps {
  searchParams: Promise<{ type?: string; minSeverity?: string }>;
}

export default async function AlertsPage({ searchParams }: AlertsPageProps) {
  const { type, minSeverity } = await searchParams;

  let alerts = null;
  let error: string | null = null;

  try {
    alerts = await fetchActiveAlerts(undefined, 50, { type, minSeverity });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load alerts';
  }

  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <div className="min-h-screen bg-bg-light">
        <div className="bg-bg-dark text-text-dark py-8 px-6">
          <h1 className="font-display text-4xl font-bold">Live Alerts</h1>
          <p className="text-text-dark/70 mt-2">
            Weather, disaster, road & river alerts across Uttarakhand
          </p>
        </div>

        <div className="p-6">
          <AlertFilters type={type} minSeverity={minSeverity} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-semibold">Unable to load alerts</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {!error && alerts === null && (
            <div className="text-center py-12">
              <p className="font-semibold text-text-dark">Loading alerts…</p>
            </div>
          )}

          {alerts && alerts.data.length === 0 && (
            <div className="text-center py-12">
              <p className="text-2xl mb-2">✨</p>
              <p className="font-semibold text-text-dark mb-1">No active alerts</p>
              <p className="text-text-light/60">
                {type || minSeverity ? 'No alerts match these filters.' : 'All systems normal across Uttarakhand.'}
              </p>
            </div>
          )}

          {alerts && alerts.data.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-text-light/70">
                Showing {alerts.data.length} active alert{alerts.data.length !== 1 ? 's' : ''}
              </p>

              <div className="space-y-3">
                {alerts.data.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>

              {alerts.pagination.hasMore && (
                <p className="text-center text-xs text-text-light/50 pt-2">
                  More alerts are available; narrow the filters above to see fewer at a time.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
