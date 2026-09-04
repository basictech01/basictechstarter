import type { RowDataPacket } from 'mysql2';

import type { Provenance } from './source.model.js';

export const WEATHER_STATIONS_TABLE = 'weather_stations';
export const WEATHER_OBSERVATIONS_TABLE = 'weather_observations';

export interface LocalisedText {
  en: string;
  hi: string;
}

/**
 * One row of the "latest reading per (station, source)" query — see
 * `WeatherRepository.latestReadings`. Exactly one of the seven measurement columns is
 * non-null on a given row: each NWDP source populates only its own column
 * (010-add-weather-observations.sql).
 */
export interface WeatherReadingRow extends RowDataPacket {
  station_id: number;
  station_name: string;
  latitude: string;
  longitude: string;
  district_id: number;
  district_slug: string;
  district_name_en: string;
  district_name_hi: string;
  source_id: number;
  observation_date: string;
  fetched_at: string;
  rainfall_mm: string | null;
  temperature_celsius: string | null;
  humidity_percent: string | null;
  wind_speed_kmh: string | null;
  wind_direction_degrees: number | null;
  wind_direction_cardinal: string | null;
  pressure_mb: string | null;
  solar_radiation_w_m2: string | null;
}

/** Result of the `COUNT(*)` / `COUNT(DISTINCT district_id)` aggregate over weather_stations. */
export interface WeatherStationCountRow extends RowDataPacket {
  station_count: number;
  districts_covered: number;
}

export type WeatherField =
  | 'rainfallMm'
  | 'temperatureCelsius'
  | 'humidityPercent'
  | 'windSpeedKmh'
  | 'windDirectionDegrees'
  | 'pressureMb'
  | 'solarRadiationWM2';

const FIELD_COLUMNS: ReadonlyArray<{
  field: WeatherField;
  value: (row: WeatherReadingRow) => string | number | null;
}> = [
  { field: 'rainfallMm', value: (row) => row.rainfall_mm },
  { field: 'temperatureCelsius', value: (row) => row.temperature_celsius },
  { field: 'humidityPercent', value: (row) => row.humidity_percent },
  { field: 'windSpeedKmh', value: (row) => row.wind_speed_kmh },
  { field: 'windDirectionDegrees', value: (row) => row.wind_direction_degrees },
  { field: 'pressureMb', value: (row) => row.pressure_mb },
  { field: 'solarRadiationWM2', value: (row) => row.solar_radiation_w_m2 },
];

/**
 * One measurement, from one source, for one station — before provenance is attached.
 * Matches `HasProvenance` (services/provenance.service.ts) directly via `sourceId`,
 * `vintage`, `fetchedAt`, the same shape `RawValuePoint` uses for indicators.
 */
export interface WeatherReading {
  stationId: number;
  stationName: string;
  latitude: number;
  longitude: number;
  districtId: number;
  districtSlug: string;
  districtName: LocalisedText;
  field: WeatherField;
  value: number;
  /** Only meaningful when `field === 'windDirectionDegrees'`; null otherwise. */
  windDirectionCardinal: string | null;
  sourceId: number;
  /** The observation's own timestamp, used as its vintage (mirrors alerts' issuedAt-as-vintage). */
  vintage: string;
  fetchedAt: string;
}

export type WeatherReadingOut = WeatherReading & { provenance: Provenance | null };

/**
 * Maps one joined row to the single measurement it carries. Returns null on a row where
 * every measurement column is null or unparseable — defensive; should not occur given the
 * ingestion connector always writes exactly one column per row.
 */
export function toWeatherReading(row: WeatherReadingRow): WeatherReading | null {
  const match = FIELD_COLUMNS.find((column) => column.value(row) !== null);
  if (match === undefined) return null;

  const raw = match.value(row);
  const value = Number(raw);
  if (Number.isNaN(value)) return null;

  return {
    stationId: row.station_id,
    stationName: row.station_name,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    districtId: row.district_id,
    districtSlug: row.district_slug,
    districtName: { en: row.district_name_en, hi: row.district_name_hi },
    field: match.field,
    value,
    windDirectionCardinal:
      match.field === 'windDirectionDegrees' ? row.wind_direction_cardinal : null,
    sourceId: row.source_id,
    vintage: row.observation_date,
    fetchedAt: row.fetched_at,
  };
}

/** A merged "current conditions" object — one value per measurement type, never fabricated. */
export interface WeatherSnapshot {
  rainfallMm: number | null;
  temperatureCelsius: number | null;
  humidityPercent: number | null;
  windSpeedKmh: number | null;
  windDirectionDegrees: number | null;
  windDirectionCardinal: string | null;
  pressureMb: number | null;
  solarRadiationWM2: number | null;
  /** The most recent of the contributing fields' own timestamps; null when nothing contributed. */
  observedAt: string | null;
}

/** The sources that actually contributed a currently-displayed field, deduped by sourceKey. */
export type WeatherSnapshotOut = WeatherSnapshot & { provenance: Provenance[] };

function toIsoUtc(value: string): string {
  const iso = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
  return new Date(iso).toISOString();
}

/**
 * Merges a flat list of already-provenance-filtered readings into one snapshot: for each of
 * the seven measurement types, picks whichever reading is freshest (by vintage) among those
 * for that type. Readings for different stations may be passed together (a district-wide
 * "latest across all its stations" snapshot) or pre-filtered to one station (a per-station
 * snapshot) — the merge logic is identical either way.
 */
export function mergeSnapshot(readings: readonly WeatherReadingOut[]): WeatherSnapshotOut {
  const latestByField = new Map<WeatherField, WeatherReadingOut & { provenance: Provenance }>();

  for (const reading of readings) {
    if (reading.provenance === null) continue; // DS-1 — no source, not displayed
    const current = latestByField.get(reading.field);
    if (current === undefined || reading.vintage > current.vintage) {
      latestByField.set(reading.field, { ...reading, provenance: reading.provenance });
    }
  }

  const rainfall = latestByField.get('rainfallMm');
  const temperature = latestByField.get('temperatureCelsius');
  const humidity = latestByField.get('humidityPercent');
  const windSpeed = latestByField.get('windSpeedKmh');
  const windDirection = latestByField.get('windDirectionDegrees');
  const pressure = latestByField.get('pressureMb');
  const solar = latestByField.get('solarRadiationWM2');

  const contributing = [...latestByField.values()];
  const observedAt =
    contributing.length === 0
      ? null
      : toIsoUtc(contributing.reduce((max, r) => (r.vintage > max ? r.vintage : max), contributing[0]?.vintage ?? ''));

  const provenanceByKey = new Map<string, Provenance>();
  for (const reading of contributing) provenanceByKey.set(reading.provenance.sourceKey, reading.provenance);

  return {
    rainfallMm: rainfall?.value ?? null,
    temperatureCelsius: temperature?.value ?? null,
    humidityPercent: humidity?.value ?? null,
    windSpeedKmh: windSpeed?.value ?? null,
    windDirectionDegrees: windDirection?.value ?? null,
    windDirectionCardinal: windDirection?.windDirectionCardinal ?? null,
    pressureMb: pressure?.value ?? null,
    solarRadiationWM2: solar?.value ?? null,
    observedAt,
    provenance: [...provenanceByKey.values()],
  };
}

export interface WeatherStationOut {
  id: number;
  name: string;
  district: { slug: string; name: LocalisedText };
  latitude: number;
  longitude: number;
  latest: WeatherSnapshotOut;
}

export type AreaStationOut = Omit<WeatherStationOut, 'district'>;

export interface AreaWeatherOut {
  district: { slug: string; name: LocalisedText };
  latest: WeatherSnapshotOut;
  stations: AreaStationOut[];
}

export interface WeatherSummary {
  stationCount: number;
  districtsCovered: number;
  latestObservationAt: string | null;
  averageTemperatureCelsius: number | null;
  /** Legitimately 0 when nothing has fallen in the window — never null for "no rain". */
  totalRainfallMmLast24h: number;
}
