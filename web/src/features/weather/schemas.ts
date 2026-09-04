import { z } from 'zod';

const LocalisedTextSchema = z.object({
  en: z.string(),
  hi: z.string(),
});

/**
 * One NWDP source's contribution to a snapshot. Note this is an ARRAY on `WeatherSnapshotOut`
 * (`latest.provenance`) — up to seven different `source_id`s can each contribute one field
 * (rainfall, temperature, ...) to the same merged snapshot. This differs from alerts/indicators,
 * where `provenance` is a single nullable object.
 */
const WeatherProvenanceSchema = z.object({
  sourceKey: z.string(),
  department: LocalisedTextSchema,
  url: z.string().nullable(),
  attribution: z.string(),
  vintage: z.string(),
  fetchedAt: z.string(),
  freshness: z.enum(['fresh', 'stale', 'expired', 'unknown']),
  mayRedistribute: z.boolean(),
});

export type WeatherProvenance = z.infer<typeof WeatherProvenanceSchema>;

/** A merged "current conditions" snapshot. Any field is `null` when nothing has reported it. */
export const WeatherSnapshotSchema = z.object({
  rainfallMm: z.number().nullable(),
  temperatureCelsius: z.number().nullable(),
  humidityPercent: z.number().nullable(),
  windSpeedKmh: z.number().nullable(),
  windDirectionDegrees: z.number().nullable(),
  windDirectionCardinal: z.string().nullable(),
  pressureMb: z.number().nullable(),
  solarRadiationWM2: z.number().nullable(),
  observedAt: z.string().nullable(),
  provenance: z.array(WeatherProvenanceSchema),
});

export type WeatherSnapshot = z.infer<typeof WeatherSnapshotSchema>;

export const AreaStationSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  latest: WeatherSnapshotSchema,
});

export type AreaStation = z.infer<typeof AreaStationSchema>;

export const AreaWeatherSchema = z.object({
  district: z.object({ slug: z.string(), name: LocalisedTextSchema }),
  latest: WeatherSnapshotSchema,
  stations: z.array(AreaStationSchema),
});

export type AreaWeather = z.infer<typeof AreaWeatherSchema>;

export const WeatherStationSchema = z.object({
  id: z.number(),
  name: z.string(),
  district: z.object({ slug: z.string(), name: LocalisedTextSchema }),
  latitude: z.number(),
  longitude: z.number(),
  latest: WeatherSnapshotSchema,
});

export type WeatherStation = z.infer<typeof WeatherStationSchema>;

export const WeatherSummarySchema = z.object({
  stationCount: z.number(),
  districtsCovered: z.number(),
  latestObservationAt: z.string().nullable(),
  averageTemperatureCelsius: z.number().nullable(),
  totalRainfallMmLast24h: z.number(),
});

export type WeatherSummary = z.infer<typeof WeatherSummarySchema>;
