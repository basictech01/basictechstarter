import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { ComingSoon } from '@/components/molecules/coming-soon';
import { AppSidebar } from '@/features/dashboard/components';

export const metadata: Metadata = {
  title: 'Internet Connectivity — Pahad Pulse',
  description: 'Broadband coverage and internet speed across Uttarakhand.',
};

export default function ConnectivityPage() {
  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <div className="min-h-screen bg-bg-light">
        <div className="bg-bg-dark text-text-dark py-8 px-6">
          <h1 className="font-display text-4xl font-bold">Internet Connectivity</h1>
          <p className="text-text-dark/70 mt-2">Broadband coverage and speed by district</p>
        </div>

        <ComingSoon
          title="Connectivity module — not yet connected"
          description="The catalogue has an `internet_penetration_pct` indicator key, but no real value has been ingested for it yet. Nothing here is estimated or simulated."
          plannedMetrics={['Mobile 4G/5G coverage', 'Fixed broadband penetration', 'Internet speed by district']}
        />
      </div>
    </DashboardLayout>
  );
}
