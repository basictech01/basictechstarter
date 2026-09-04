import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
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
      <div className="min-h-screen bg-bg-light">
        <div className="bg-bg-dark text-text-dark py-8 px-6">
          <h1 className="font-display text-4xl font-bold">Compare Districts</h1>
          <p className="text-text-dark/70 mt-2">Side-by-side comparison across recorded indicators</p>
        </div>

        <div className="p-6 space-y-6">
          {districts === null ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Unable to load the district list.
            </div>
          ) : (
            <DistrictPicker districts={districts} a={a} b={b} />
          )}

          {a && b && a === b && (
            <p className="text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-4 py-3 text-sm">
              Pick two different districts to compare.
            </p>
          )}

          {comparisonError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {comparisonError}
            </div>
          )}

          {comparison && <ComparisonTable result={comparison} nameA={nameA} nameB={nameB} />}

          {!a || !b ? (
            <p className="text-text-light/60 text-sm">Select two districts above to compare their indicators.</p>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
}
