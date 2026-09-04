'use client';

import { useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/constants';

import { dashboardKeys } from '../queries';
import { fetchAllDistricts } from '../services';

/** The real 13-district list — geography changes only by migration, so this is cached hard. */
export function useDistricts() {
  return useQuery({
    queryKey: dashboardKeys.districts(),
    queryFn: () => fetchAllDistricts(),
    staleTime: STALE_TIME.STATIC,
  });
}
