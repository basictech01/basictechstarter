import { err, ok, type Result } from 'neverthrow';

import { db } from '../database/db.js';
import {
  toWeatherReading,
  WEATHER_OBSERVATIONS_TABLE,
  WEATHER_STATIONS_TABLE,
  type WeatherReading,
  type WeatherReadingRow,
  type WeatherStationCountRow,
} from '../models/weather.model.js';
import { ERRORS, type RequestError } from '../utils/errors.js';
import createLogger from '../utils/logger.js';

const logger = createLogger('@weather.repository');

/**
 * The seven NWDP source keys, exactly as seeded in
 * 011-seed-nwdp-sources.sql. Not imported from the ingestion connector (repositories never
 * depend on services/ingestion — 01-folder-structure.md §3) — this list is the SQL-side
 * counterpart of `NWDP_DATASETS` in services/ingestion/connectors/nwdp-types.ts.
 */
const NWDP_WEATHER_SOURCE_KEYS = [
  'nwdp-rainfall',
  'nwdp-temperature',
  'nwdp-humidity',
  'nwdp-wind-speed',
  'nwdp-wind-direction',
  'nwdp-pressure',
  'nwdp-solar-radiation',
] as const;

const READING_COLUMNS = `
  ws.id AS station_id, ws.name AS station_name, ws.latitude, ws.longitude,
  a.id AS district_id, a.slug AS district_slug, a.name_en AS district_name_en, a.name_hi AS district_name_hi,
  wo.source_id, wo.observation_date, wo.fetched_at,
  wo.rainfall_mm, wo.temperature_celsius, wo.humidity_percent, wo.wind_speed_kmh,
  wo.wind_direction_degrees, wo.wind_direction_cardinal, wo.pressure_mb, wo.solar_radiation_w_m2
`;

/** Bounds any single response: 7 sources x a generous station ceiling. */
const MAX_READING_ROWS = 5_000;

export interface IWeatherRepository {
  /**
   * The latest reading per (station, source) across the seven NWDP datasets — one row per
   * measurement type per station, never a merged snapshot (that merge happens in the
   * controller, once provenance has been attached and filtered).
   */
  latestReadings(districtId?: number): Promise<Result<WeatherReading[], RequestError>>;
  /** Every rainfall reading (not just the latest) since `since`, for the 24h-total rollup. */
  rainfallSince(since: Date): Promise<Result<WeatherReading[], RequestError>>;
  countStations(): Promise<Result<{ stationCount: number; districtsCovered: number }, RequestError>>;
}

class WeatherRepositoryImpl implements IWeatherRepository {
  async latestReadings(districtId?: number): Promise<Result<WeatherReading[], RequestError>> {
    try {
      const filterByDistrict = districtId !== undefined;
      const [rows] = await db.query<WeatherReadingRow[]>(
        `SELECT ${READING_COLUMNS}
           FROM ${WEATHER_OBSERVATIONS_TABLE} wo
           JOIN ${WEATHER_STATIONS_TABLE} ws ON ws.id = wo.station_id
           JOIN areas a ON a.id = ws.district_id
           JOIN sources s ON s.id = wo.source_id
          WHERE s.source_key IN (?)
            ${filterByDistrict ? 'AND ws.district_id = ?' : ''}
            AND wo.observation_date = (
              SELECT MAX(wo2.observation_date)
                FROM ${WEATHER_OBSERVATIONS_TABLE} wo2
               WHERE wo2.source_id = wo.source_id AND wo2.station_id = wo.station_id
            )
          ORDER BY ws.id ASC, wo.source_id ASC
          LIMIT ?`,
        filterByDistrict
          ? [NWDP_WEATHER_SOURCE_KEYS, districtId, MAX_READING_ROWS]
          : [NWDP_WEATHER_SOURCE_KEYS, MAX_READING_ROWS],
      );
      const readings = rows.map(toWeatherReading).filter((r): r is WeatherReading => r !== null);
      return ok(readings);
    } catch (error) {
      logger.error('latestReadings failed', { districtId, error });
      return err(ERRORS.DATABASE_ERROR);
    }
  }

  async rainfallSince(since: Date): Promise<Result<WeatherReading[], RequestError>> {
    try {
      const sinceUtc = since.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
      const [rows] = await db.query<WeatherReadingRow[]>(
        `SELECT ${READING_COLUMNS}
           FROM ${WEATHER_OBSERVATIONS_TABLE} wo
           JOIN ${WEATHER_STATIONS_TABLE} ws ON ws.id = wo.station_id
           JOIN areas a ON a.id = ws.district_id
           JOIN sources s ON s.id = wo.source_id
          WHERE s.source_key = 'nwdp-rainfall'
            AND wo.rainfall_mm IS NOT NULL
            AND wo.observation_date >= ?
          ORDER BY wo.observation_date DESC
          LIMIT ?`,
        [sinceUtc, MAX_READING_ROWS],
      );
      const readings = rows.map(toWeatherReading).filter((r): r is WeatherReading => r !== null);
      return ok(readings);
    } catch (error) {
      logger.error('rainfallSince failed', { since: since.toISOString(), error });
      return err(ERRORS.DATABASE_ERROR);
    }
  }

  async countStations(): Promise<
    Result<{ stationCount: number; districtsCovered: number }, RequestError>
  > {
    try {
      const [rows] = await db.query<WeatherStationCountRow[]>(
        `SELECT COUNT(*) AS station_count, COUNT(DISTINCT district_id) AS districts_covered
           FROM ${WEATHER_STATIONS_TABLE}`,
      );
      const row = rows[0];
      return ok({
        stationCount: row?.station_count ?? 0,
        districtsCovered: row?.districts_covered ?? 0,
      });
    } catch (error) {
      logger.error('countStations failed', { error });
      return err(ERRORS.DATABASE_ERROR);
    }
  }
}

export const WeatherRepository: IWeatherRepository = new WeatherRepositoryImpl();
