/** Deliberate `staleTime` per data shape (frontend/05 §4). Mirrors backend cache TTLs where one exists. */
export const STALE_TIME = {
  /** Alert feed — backend caches 60s (CACHE_TTL_ALERTS). */
  ALERTS: 60 * 1000,
  /** Weather observations — backend caches 10m (CACHE_TTL_WEATHER). */
  WEATHER: 10 * 60 * 1000,
  /** Indicator values / comparisons — backend caches 1h (CACHE_TTL_INDICATORS). */
  INDICATORS: 60 * 60 * 1000,
  /** District/area list and detail — geography changes only by migration. */
  DETAIL: 10 * 60 * 1000,
  STATIC: Infinity,
} as const;

export const PAGE_SIZE = {
  ALERTS: 20,
  DISTRICTS_GRID: 13,
} as const;

/**
 * NWDP telemetry lands with a normal lag of roughly two days (see hydromet.md §8), so
 * "stale" here means well beyond that cadence, not sub-hour freshness. Thresholds are in hours.
 */
export const WEATHER_FRESHNESS_HOURS = {
  STALE: 72,
  EXPIRED: 168,
} as const;

export const ROUTES = {
  home: '/',
  alerts: '/alerts',
  districts: '/districts',
  district: (slug: string) => `/districts/${slug}`,
  compare: '/compare',
  weather: '/weather',
  roads: '/roads',
  tourism: '/tourism',
  migration: '/migration',
  connectivity: '/connectivity',
  intelligence: '/intelligence',
  governance: '/governance',
  offline: '/offline',
} as const;
