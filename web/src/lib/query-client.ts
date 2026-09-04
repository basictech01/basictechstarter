import { QueryClient } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/constants';
import { ApiError } from './api';

/** `useState(makeQueryClient)` on the caller's side — never `new QueryClient()` inline. */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME.DETAIL,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: (failureCount, error) =>
          error instanceof ApiError && error.status >= 500 && failureCount < 2,
      },
      mutations: { retry: false },
    },
  });
}
