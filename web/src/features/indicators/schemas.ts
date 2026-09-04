import { z } from 'zod';

const LocalisedTextSchema = z.object({
  en: z.string(),
  hi: z.string(),
});

export const IndicatorSchema = z.object({
  key: z.string(),
  category: z.string(),
  scope: z.enum(['state', 'district', 'village']),
  label: LocalisedTextSchema,
  unit: z.string(),
  decimals: z.number(),
  higherIsBetter: z.boolean().nullable(),
});

export type Indicator = z.infer<typeof IndicatorSchema>;

const ProvenanceSchema = z
  .object({
    sourceKey: z.string().optional(),
    department: LocalisedTextSchema,
    url: z.string().nullable(),
    attribution: z.string(),
    vintage: z.string(),
    fetchedAt: z.string(),
  })
  .nullable();

const RawValuePointSchema = z.object({
  value: z.number(),
  vintage: z.string(),
  sourceId: z.number(),
  fetchedAt: z.string(),
});

/** One area's value for one indicator, provenance-stamped — `GET /areas/:slug/indicators`. */
export const AreaIndicatorValueSchema = RawValuePointSchema.extend({
  indicator: IndicatorSchema,
  provenance: ProvenanceSchema,
});

export type AreaIndicatorValue = z.infer<typeof AreaIndicatorValueSchema>;

export const AreaIndicatorsSchema = z.array(AreaIndicatorValueSchema);

/** One row of a two-area comparison — only present when both areas have a value (IND-5). */
export const ComparisonRowSchema = z.object({
  indicator: IndicatorSchema,
  areaA: RawValuePointSchema.extend({ provenance: ProvenanceSchema }),
  areaB: RawValuePointSchema.extend({ provenance: ProvenanceSchema }),
});

export type ComparisonRow = z.infer<typeof ComparisonRowSchema>;

export const ComparisonResultSchema = z.object({
  rows: z.array(ComparisonRowSchema),
  omittedCount: z.number(),
});

export type ComparisonResult = z.infer<typeof ComparisonResultSchema>;
