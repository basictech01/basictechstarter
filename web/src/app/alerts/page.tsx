import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageHeader } from '@/components/molecules/page-header';
import { AlertBreakdown, AlertCard, AlertFilters } from '@/features/alerts/components';
import { fetchActiveAlerts, fetchAlertSummary } from '@/features/alerts/services';
import { AppSidebar } from '@/features/dashboard/components';

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
  let summary = null;
  let error: string | null = null;

  try {
    [alerts, summary] = await Promise.all([
      fetchActiveAlerts(undefined, 50, { type, minSeverity }),
      fetchAlertSummary(),
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load alerts';
  }

  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <PageHeader
        title="Live Alerts"
        titleHi="लाइव अलर्ट"
        description="Weather, disaster, road & river alerts across Uttarakhand"
      />

      <div className="grid grid-cols-1 gap-4 p-6 md:p-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <div className="flex flex-col gap-3">
          <AlertFilters type={type} minSeverity={minSeverity} />

          {error && (
            <div className="rounded-lg border border-alert-critical/30 bg-alert-critical/10 px-4 py-3 text-alert-critical">
              <p className="font-semibold">Unable to load alerts</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          {!error && alerts === null && <p className="py-12 text-center font-semibold text-text-dark">Loading alerts…</p>}

          {alerts && alerts.data.length === 0 && (
            <div className="py-12 text-center">
              <p className="mb-2 text-2xl" aria-hidden="true">
                ✨
              </p>
              <p className="mb-1 font-semibold text-text-dark">No active alerts</p>
              <p className="text-text-dark/60">
                {type || minSeverity ? 'No alerts match these filters.' : 'All systems normal across Uttarakhand.'}
              </p>
            </div>
          )}

          {alerts && alerts.data.length > 0 && (
            <>
              <p className="text-sm text-text-dark/70">
                Showing {alerts.data.length} active alert{alerts.data.length !== 1 ? 's' : ''}
              </p>

              <div className="flex flex-col gap-3">
                {alerts.data.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>

              {alerts.pagination.hasMore && (
                <p className="pt-2 text-center text-xs text-text-dark/50">
                  More alerts are available; narrow the filters above to see fewer at a time.
                </p>
              )}
            </>
          )}
        </div>

        {summary && <AlertBreakdown summary={summary} />}
      </div>
    </DashboardLayout>
  );
}
