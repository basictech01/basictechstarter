import { z } from 'zod';

/**
 * Counters with no connected backend source are `null`, never `0` — a real zero and
 * "we don't have this data source yet" must never look the same on screen.
 */
export const LiveCountersSchema = z.object({
  activeAlerts: z.number(),
  touristsInState: z.number().nullable(),
  closedRoads: z.number().nullable(),
  connectivityPercentage: z.number().nullable(),
});

export type LiveCounters = z.infer<typeof LiveCountersSchema>;

/**
 * Population, area and literacy are real *indicator keys* in the catalogue (`population`,
 * `literacy_rate`), but the values seeded today are dev-only demo data
 * (`007-seed-indicator-catalogue.sql`), not a real government figure. They render as `null`
 * ("Pending") until real values are ingested, rather than show a plausible-looking demo number.
 */
export const StateOverviewSchema = z.object({
  population: z.number().nullable(),
  areaKmSq: z.number().nullable(),
  literacy: z.number().nullable(),
  forestCoverage: z.number().nullable(),
  districts: z.number(),
  villages: z.number(),
});

export type StateOverview = z.infer<typeof StateOverviewSchema>;
