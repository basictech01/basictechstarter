import { z } from 'zod';
import { apiClient } from '@/lib/api';
import type { LiveCounters, StateOverview } from '../types';
import { DistrictDetailSchema, DistrictSummarySchema, AlertSummarySchema } from '../schemas';

export async function fetchAllDistricts() {
  return apiClient.get('/areas/districts', z.array(DistrictSummarySchema));
}

export async function fetchDistrictDetail(slug: string) {
  return apiClient.get(`/areas/districts/${slug}`, DistrictDetailSchema);
}

/**
 * Counters with no connected backend source (tourists, closed roads, connectivity) are `null`
 * — see `LiveCountersSchema`. Only `activeAlerts` has a real source today (`/alerts/summary`).
 */
export async function fetchLiveCounters(): Promise<LiveCounters> {
  const alerts = await apiClient.get('/alerts/summary', AlertSummarySchema);

  return {
    activeAlerts: alerts.activeCount,
    touristsInState: null, // no tourism data source connected — see tourism.md
    closedRoads: null, // no roads data source connected — see roads.md
    connectivityPercentage: null, // no connectivity indicator populated with real values yet
  };
}

/**
 * Population, area and literacy have no real ingested values yet (see `StateOverviewSchema`
 * doc comment) so they render `null`. `districts` and `villages` are real geography counts,
 * summed from the district list.
 */
export async function fetchStateOverview(): Promise<StateOverview> {
  const districts = await apiClient.get('/areas/districts', z.array(DistrictSummarySchema));

  return {
    population: null,
    areaKmSq: null,
    literacy: null,
    forestCoverage: null,
    districts: districts.length,
    villages: districts.reduce((sum, d) => sum + d.counts.villages, 0),
  };
}
