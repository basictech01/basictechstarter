import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export default function AlertsLoading() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-bg-light">
        <div className="bg-bg-dark py-8 px-6">
          <div className="h-9 w-56 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="p-6 space-y-3">
          {['a', 'b', 'c', 'd', 'e'].map((key) => (
            <div key={key} className="h-24 bg-surface-hover rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
