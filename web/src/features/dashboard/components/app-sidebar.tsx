'use client';

import { Sidebar } from '@/components/sidebar';
import { useAlertSummary } from '@/features/alerts/hooks';

/** Composes the shared, presentational `Sidebar` with the real active-alert count. */
export function AppSidebar() {
  const { data } = useAlertSummary();

  return <Sidebar alertCount={data?.activeCount ?? null} />;
}
