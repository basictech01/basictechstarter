import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export default function WeatherLoading() {
  return (
    <DashboardLayout>
      <div className="bg-bg-dark py-8 px-6">
        <div className="h-9 w-64 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['a', 'b', 'c', 'd'].map((key) => (
            <div key={key} className="h-20 bg-surface-hover rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-surface-hover rounded-lg animate-pulse" />
      </div>
    </DashboardLayout>
  );
}
