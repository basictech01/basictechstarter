import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { ComingSoon } from '@/components/molecules/coming-soon';
import { AppSidebar } from '@/features/dashboard/components';

export const metadata: Metadata = {
  title: 'Roads & Traffic — Pahad Pulse',
  description: 'Road closures and traffic status in Uttarakhand.',
};

export default function RoadsPage() {
  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <div className="min-h-screen bg-bg-light">
        <div className="bg-bg-dark text-text-dark py-8 px-6">
          <h1 className="font-display text-4xl font-bold">Roads & Traffic</h1>
          <p className="text-text-dark/70 mt-2">Highway closures and traffic status</p>
        </div>

        <ComingSoon
          title="Roads module — not yet connected"
          description="PWD and NHAI don't have an ingestion connector built yet, so this module has no data to show. Nothing here is estimated or simulated."
          plannedMetrics={['National Highway (NH) closures', 'State Highway (SH) closures', 'Live traffic (Google Maps, client-side only)']}
        />
      </div>
    </DashboardLayout>
  );
}
