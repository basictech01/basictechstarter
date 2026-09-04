import { z } from 'zod';

const LocalisedTextSchema = z.object({
  en: z.string(),
  hi: z.string(),
});

const CentroidSchema = z.object({
  lat: z.number(),
  lng: z.number(),
}).nullable();

const OfficialIdsSchema = z.object({
  lgd: z.string().nullable(),
  census2011: z.string().nullable(),
});

export const AreaSchema = z.object({
  id: z.number(),
  type: z.enum(['state', 'district', 'tehsil', 'village']),
  code: z.string(),
  slug: z.string(),
  name: LocalisedTextSchema,
  parentId: z.number().nullable(),
  division: z.string().nullable(),
  headquarters: LocalisedTextSchema.nullable(),
  centroid: CentroidSchema,
  officialIds: OfficialIdsSchema,
});

export type Area = z.infer<typeof AreaSchema>;

export const DistrictSummarySchema = AreaSchema.extend({
  counts: z.object({
    tehsils: z.number(),
    villages: z.number(),
  }),
  hasBoundary: z.boolean(),
});

export type DistrictSummary = z.infer<typeof DistrictSummarySchema>;

export const AlertSummarySchema = z.object({
  activeCount: z.number(),
  bySeverity: z.record(z.number()),
});

export type AlertSummary = z.infer<typeof AlertSummarySchema>;

// District Detail Response — GET /areas/districts/:slug
export const DistrictDetailSchema = z.object({
  district: AreaSchema,
  tehsils: z.array(AreaSchema),
  boundary: z.object({
    areaId: z.number(),
    geojson: z.unknown(),
    isPlaceholder: z.boolean(),
    sourceNote: z.string(),
    updatedAt: z.string().datetime(),
  }).nullable(),
});

export type DistrictDetail = z.infer<typeof DistrictDetailSchema>;
