import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { ComingSoon } from '@/components/molecules/coming-soon';
import { AppSidebar } from '@/features/dashboard/components';

export const metadata: Metadata = {
  title: 'Sector Intelligence — Pahad Pulse',
  description: 'Consolidated analytics across demographics, health, education, economy, and industry.',
};

export default function IntelligencePage() {
  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <div className="min-h-screen bg-bg-light">
        <div className="bg-bg-dark text-text-dark py-8 px-6">
          <h1 className="font-display text-4xl font-bold">Sector Intelligence</h1>
          <p className="text-text-dark/70 mt-2">Consolidated analytics across development sectors</p>
        </div>

        <ComingSoon
          title="Sector intelligence — not yet connected"
          description="The indicator catalogue defines demography, education, health, economy, industry and connectivity keys, but real values haven't been ingested for most of them yet — today's rows are dev-only seed data. Visit a district page to see which indicators already have a real value."
          plannedMetrics={['Demographics', 'Health', 'Education', 'Economy', 'Industry', 'Connectivity']}
        />
      </div>
    </DashboardLayout>
  );
}
