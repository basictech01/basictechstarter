'use client';

import { useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/constants';

import { alertKeys } from '../queries';
import { fetchActiveAlerts, fetchAlertSummary, fetchAreaAlerts } from '../services';

/** Statewide active-alert count, used for the sidebar badge and the home dashboard tile. */
export function useAlertSummary() {
  return useQuery({
    queryKey: alertKeys.summaries(),
    queryFn: () => fetchAlertSummary(),
    staleTime: STALE_TIME.ALERTS,
    refetchInterval: STALE_TIME.ALERTS,
  });
}

export function useActiveAlerts(
  cursor?: number,
  limit = 20,
  filters?: { type?: string; minSeverity?: string; areaSlug?: string },
) {
  return useQuery({
    queryKey: alertKeys.active(cursor, filters ?? {}),
    queryFn: () => fetchActiveAlerts(cursor, limit, filters),
    staleTime: STALE_TIME.ALERTS,
  });
}

export function useAreaAlerts(slug: string, cursor?: number, limit = 20) {
  return useQuery({
    queryKey: alertKeys.byArea(slug, cursor),
    queryFn: () => fetchAreaAlerts(slug, cursor, limit),
    staleTime: STALE_TIME.ALERTS,
    enabled: slug.length > 0,
  });
}
