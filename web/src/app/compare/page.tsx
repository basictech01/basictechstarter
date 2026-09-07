import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { PageHeader } from '@/components/molecules/page-header';
import { AppSidebar } from '@/features/dashboard/components';
import { fetchAllDistricts } from '@/features/dashboard/services';
import { ComparisonTable, DistrictPicker } from '@/features/indicators/components';
import { fetchIndicatorComparison } from '@/features/indicators/services';
import { ApiError } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Compare Districts — Pahad Pulse',
  description: 'Side-by-side comparison of two districts across key indicators.',
};

export const dynamic = 'force-dynamic';

interface ComparePageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { a, b } = await searchParams;

  const districts = await fetchAllDistricts().catch(() => null);
  const nameA = districts?.find((d) => d.slug === a)?.name.en ?? a ?? '';
  const nameB = districts?.find((d) => d.slug === b)?.name.en ?? b ?? '';

  let comparisonError: string | null = null;
  const comparison =
    a && b && a !== b
      ? await fetchIndicatorComparison(a, b).catch((err: unknown) => {
          comparisonError = err instanceof ApiError ? err.message : 'Failed to load the comparison';
          return null;
        })
      : null;

  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <PageHeader title="Compare Districts" titleHi="जिलों की तुलना" description="Side-by-side comparison across recorded indicators" />

      <div className="space-y-5 p-6 md:p-8">
        {districts === null ? (
          <div className="rounded-lg border border-alert-critical/30 bg-alert-critical/10 px-4 py-3 text-alert-critical">
            Unable to load the district list.
          </div>
        ) : (
          <DistrictPicker districts={districts} a={a} b={b} />
        )}

        {a && b && a === b && (
          <p className="rounded-lg border border-alert-warning/30 bg-alert-warning/10 px-4 py-3 text-sm text-alert-warning">
            Pick two different districts to compare.
          </p>
        )}

        {comparisonError && (
          <div className="rounded-lg border border-alert-critical/30 bg-alert-critical/10 px-4 py-3 text-alert-critical">
            {comparisonError}
          </div>
        )}

        {comparison && <ComparisonTable result={comparison} nameA={nameA} nameB={nameB} />}

        {(!a || !b) && <p className="text-sm text-text-dark/60">Select two districts above to compare their indicators.</p>}
      </div>
    </DashboardLayout>
  );
}
