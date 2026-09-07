import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export default function WeatherLoading() {
  return (
    <DashboardLayout>
      <div className="border-b border-border bg-bg-light/90 px-6 py-4 md:px-8">
        <div className="h-7 w-64 animate-pulse rounded bg-surface-hover" />
      </div>
      <div className="space-y-6 p-6 md:p-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {['a', 'b', 'c', 'd'].map((key) => (
            <div key={key} className="h-20 animate-pulse rounded-lg bg-surface-hover" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-lg bg-surface-hover" />
      </div>
    </DashboardLayout>
  );
}
