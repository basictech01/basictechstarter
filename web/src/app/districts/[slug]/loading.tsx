import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export default function DistrictDetailLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-5 p-6 md:p-8">
        <div className="flex gap-1.5">
          {['a', 'b', 'c', 'd'].map((key) => (
            <div key={key} className="h-7 w-24 animate-pulse rounded-md bg-surface-hover" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
          <div className="h-64 animate-pulse rounded-xl bg-surface-hover" />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
              {['a', 'b', 'c', 'd'].map((key) => (
                <div key={key} className="h-20 animate-pulse rounded-xl bg-surface-hover" />
              ))}
            </div>
            <div className="h-40 animate-pulse rounded-xl bg-surface-hover" />
            <div className="h-40 animate-pulse rounded-xl bg-surface-hover" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
