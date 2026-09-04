import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { ComingSoon } from '@/components/molecules/coming-soon';
import { AppSidebar } from '@/features/dashboard/components';

export const metadata: Metadata = {
  title: 'Governance Dashboard — Pahad Pulse',
  description: 'Authenticated officer dashboard for crisis management and policy coordination.',
};

export default function GovernancePage() {
  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <div className="min-h-screen bg-bg-light">
        <div className="bg-bg-dark text-text-dark py-8 px-6">
          <h1 className="font-display text-4xl font-bold">Governance Dashboard</h1>
          <p className="text-text-dark/70 mt-2">Authenticated official situation room</p>
        </div>

        <ComingSoon
          title="Governance module — deferred to v2"
          description="This is out of v1 scope (see project/overview.md). It will become a /gov route group once the officer role and authentication are built."
          plannedMetrics={['Crisis management', 'Resource coordination', 'Cross-department analytics', 'Officer & team management']}
        />
      </div>
    </DashboardLayout>
  );
}
