import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { ComingSoon } from '@/components/molecules/coming-soon';
import { AppSidebar } from '@/features/dashboard/components';

export const metadata: Metadata = {
  title: 'Migration Tracker — Pahad Pulse',
  description: 'Rural-to-urban migration patterns in Uttarakhand.',
};

export default function MigrationPage() {
  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <div className="min-h-screen bg-bg-light">
        <div className="bg-bg-dark text-text-dark py-8 px-6">
          <h1 className="font-display text-4xl font-bold">Palayan — Migration Tracker</h1>
          <p className="text-text-dark/70 mt-2">Rural-to-urban migration in hill villages</p>
        </div>

        <ComingSoon
          title="Migration module — deferred to v2"
          description="This module is out of v1 scope (see project/overview.md). The Palayan Ayog data request is filed but has no SLA, so there is nothing to show yet."
          plannedMetrics={['Household out-migration', 'Ghost villages', 'Multi-year trends', 'Remittance impact']}
        />
      </div>
    </DashboardLayout>
  );
}
