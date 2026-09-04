import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { ComingSoon } from '@/components/molecules/coming-soon';
import { AppSidebar } from '@/features/dashboard/components';

export const metadata: Metadata = {
  title: 'Tourism & Pilgrim Load — Pahad Pulse',
  description: 'Visitor tracking for Char Dham and tourist destinations in Uttarakhand.',
};

export default function TourismPage() {
  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <div className="min-h-screen bg-bg-light">
        <div className="bg-bg-dark text-text-dark py-8 px-6">
          <h1 className="font-display text-4xl font-bold">Tourism & Pilgrim Load</h1>
          <p className="text-text-dark/70 mt-2">Visitor tracking for Char Dham and tourist destinations</p>
        </div>

        <ComingSoon
          title="Tourism module — not yet connected"
          description="Char Dham registration and footfall data isn't ingested yet, so this module has no data to show. Nothing here is estimated or simulated."
          plannedMetrics={['Char Dham daily visitor counts', 'Destination capacity load', 'Peak-season forecasts']}
        />
      </div>
    </DashboardLayout>
  );
}
