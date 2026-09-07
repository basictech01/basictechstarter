import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export default function AlertsLoading() {
  return (
    <DashboardLayout>
      <div className="border-b border-border bg-bg-light/90 px-6 py-4 md:px-8">
        <div className="h-7 w-56 animate-pulse rounded bg-surface-hover" />
      </div>
      <div className="space-y-3 p-6 md:p-8">
        {['a', 'b', 'c', 'd', 'e'].map((key) => (
          <div key={key} className="h-24 animate-pulse rounded-lg bg-surface-hover" />
        ))}
      </div>
    </DashboardLayout>
  );
}
