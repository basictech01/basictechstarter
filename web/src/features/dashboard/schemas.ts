import { z } from 'zod';

const LocalisedTextSchema = z.object({
  en: z.string(),
  hi: z.string(),
});

const CentroidSchema = z.object({
  lat: z.number(),
  lng: z.number(),
}).nullable();

const OfficeialIdsSchema = z.object({
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
  officialIds: OfficeialIdsSchema,
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

// Indicator schemas
export const IndicatorValueSchema = z.object({
  indicator_key: z.string(),
  area_id: z.number(),
  vintage: z.number(),
  value: z.number(),
  source_id: z.number(),
  fetched_at: z.string().datetime(),
});

export type IndicatorValue = z.infer<typeof IndicatorValueSchema>;

// Observation/Weather schemas
export const ObservationSchema = z.object({
  station_id: z.number(),
  metric: z.string(),
  observed_at: z.string().datetime(),
  value: z.number(),
  unit: z.string(),
  source_id: z.number(),
  fetched_at: z.string().datetime(),
});

export type Observation = z.infer<typeof ObservationSchema>;

// Road schemas
export const RoadStatusSchema = z.object({
  segment_id: z.number(),
  status: z.enum(['open', 'restricted', 'closed', 'unknown']),
  cause: z.string().nullable(),
  reported_at: z.string().datetime(),
});

export type RoadStatus = z.infer<typeof RoadStatusSchema>;

// District Detail Response
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

// Alert Response with pagination
export const AlertResponseSchema = z.object({
  data: z.array(z.object({
    id: z.number(),
    headline: z.string(),
    severity: z.enum(['info', 'warning', 'alert', 'emergency']),
    areaId: z.number(),
    type: z.string(),
    body: z.string(),
    validFrom: z.string().datetime(),
    validUntil: z.string().datetime().nullable(),
  })),
  pagination: z.object({
    cursor: z.number(),
    hasMore: z.boolean(),
  }),
});

export type AlertResponse = z.infer<typeof AlertResponseSchema>;

// Weather/Hydro Response
export const WeatherResponseSchema = z.object({
  temperature: z.object({
    value: z.number(),
    unit: z.string(),
  }).nullable(),
  rainfall: z.object({
    value: z.number(),
    unit: z.string(),
  }).nullable(),
  humidity: z.object({
    value: z.number(),
    unit: z.string(),
  }).nullable(),
});

export type WeatherResponse = z.infer<typeof WeatherResponseSchema>;

// Indicators/Statistics Response
export const IndicatorsResponseSchema = z.array(z.object({
  indicatorKey: z.string(),
  label: LocalisedTextSchema.optional(),
  value: z.number(),
  unit: z.string().optional(),
  vintage: z.number().optional(),
  sourceId: z.number().optional(),
}));

export type IndicatorsResponse = z.infer<typeof IndicatorsResponseSchema>;
