import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { err, ok, type Result } from 'neverthrow';

import { NWDP_CONFIG } from '../../../config/constants.js';
import { db } from '../../../database/db.js';
import { AreaRepository } from '../../../repositories/area.repository.js';
import { AreaType } from '../../../types/area.js';
import type { RequestError } from '../../../utils/errors.js';
import { ERRORS } from '../../../utils/errors.js';
import { fetchJson } from '../../../utils/http.js';
import createLogger from '../../../utils/logger.js';
import type { ConnectorContext, ConnectorOutcome, SourceConnector } from '../connector.js';
import { degreesToCardinal, NWDP_DATASETS, type NWDPDataset, type NWDPDatastoreRecord } from './nwdp-types.js';

const logger = createLogger('@nwdp.connector');

const NWDP_API_BASE = 'https://www.nwdp.nwic.gov.in/api/3/action';

/**
 * One connector instance per NWDP dataset. Each source (rainfall, temperature, etc.)
 * gets its own connector with the same implementation but different dataset config.
 *
 * NWDP is public, no key required. Endpoint verified reachable and returning real data
 * on 2026-09-04 (see NWDP_DATASETS_VERIFIED.md).
 *
 * All seven datasets have the same cadence (hourly), the same station list, and the
 * same record structure — they differ only in the measurement field name and the
 * storage column.
 */
class NwdpConnector implements SourceConnector {
  readonly sourceKey: string;
  readonly ownerModule = 'hydromet';
  readonly isAvailable = true;
  readonly unavailableReason = null;

  constructor(private dataset: NWDPDataset) {
    this.sourceKey = dataset.sourceKey;
  }

  async fetch(context: ConnectorContext): Promise<Result<ConnectorOutcome, RequestError>> {
    const result: ConnectorOutcome = {
      rowsWritten: 0,
      rowsRejected: 0,
      vintage: null,
      notes: '',
    };

    try {
      // 1. Build a district name → district_id map for quick lookup.
      const districtMap = await getDistrictMap();
      if (districtMap.isErr()) {
        return err(districtMap.error);
      }
      const districts = districtMap.value;

      // 2. Fetch records from CKAN DataStore (paginated, most recent first).
      const recordsResult = await fetchDatastoreRecords(this.dataset.resourceId);
      if (recordsResult.isErr()) {
        return err(recordsResult.error);
      }
      const records = recordsResult.value;
      result.notes = `Fetched ${records.length} record(s) from NWDP DataStore`;

      // 3. Process each record.
      let latestVintage: string | null = null;

      for (const record of records) {
        const outcome = await processRecord(
          record,
          this.dataset,
          context.sourceId,
          districts,
        );

        if (outcome.kind === 'written') {
          result.rowsWritten += 1;
          if (outcome.vintage && (!latestVintage || outcome.vintage > latestVintage)) {
            latestVintage = outcome.vintage;
          }
        } else if (outcome.kind === 'rejected') {
          result.rowsRejected += 1;
        }
      }

      result.vintage = latestVintage;
      return ok(result);
    } catch (error) {
      logger.error(`NWDP connector error (${this.dataset.sourceKey}):`, { error });
      return err(ERRORS.UPSTREAM_UNAVAILABLE);
    }
  }
}

type ProcessOutcome =
  | { kind: 'written'; vintage: string | null }
  | { kind: 'rejected' };

/**
 * Process a single NWDP record: validate, upsert station, upsert observation.
 */
async function processRecord(
  record: NWDPDatastoreRecord,
  dataset: NWDPDataset,
  sourceId: number,
  districtMap: Map<string, number>,
): Promise<ProcessOutcome> {
  // Parse coordinates.
  const latStr = typeof record.Latitude === 'string' ? record.Latitude : '';
  const lonStr = typeof record.Longitude === 'string' ? record.Longitude : '';
  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    logger.warn('Invalid coordinates in NWDP record', {
      station: record.Station,
      latitude: record.Latitude,
      longitude: record.Longitude,
    });
    return { kind: 'rejected' };
  }

  // Resolve district. NWDP's District field casing is inconsistent across stations within
  // the same dataset (observed: "Almora" but also "PAURI GARHWAL" in the same 1000-record
  // page), so the map is keyed by an uppercased name and looked up the same way — never
  // reject a real record over letter casing.
  const districtName = (typeof record.District === 'string' ? record.District : '').trim();
  const districtId = districtMap.get(districtName.toUpperCase());

  if (!districtId) {
    logger.warn('Unknown district in NWDP record', {
      station: record.Station,
      district: districtName,
    });
    return { kind: 'rejected' };
  }

  // Parse timestamp: "DD-MM-YYYY HH:MM" (IST) → UTC.
  const timeStr = typeof record['Data Acquisition Time'] === 'string' ? record['Data Acquisition Time'] : '';
  const observationDate = parseIST(timeStr);
  if (!observationDate) {
    logger.warn('Invalid timestamp in NWDP record', {
      station: record.Station,
      timestamp: record['Data Acquisition Time'],
    });
    return { kind: 'rejected' };
  }

  // Get vintage (the date the observation refers to).
  const isoString = observationDate.toISOString();
  const vintage = isoString.substring(0, 10); // Extract YYYY-MM-DD

  // Parse the measurement value.
  const rawValue = record[dataset.measurementField];
  let measurementStr: string;
  if (typeof rawValue === 'number') {
    measurementStr = rawValue.toString();
  } else if (typeof rawValue === 'string') {
    measurementStr = rawValue;
  } else {
    measurementStr = '';
  }
  const measurementValue = parseFloat(measurementStr);
  if (isNaN(measurementValue)) {
    logger.warn('Invalid measurement in NWDP record', {
      station: record.Station,
      field: dataset.measurementField,
      value: record[dataset.measurementField],
    });
    return { kind: 'rejected' };
  }

  try {
    // Upsert the station.
    const stationResult = await upsertStation({
      name: record.Station.trim(),
      districtId,
      latitude: lat,
      longitude: lon,
      agency: (record.Agency || '').trim() || null,
      sourceId,
    });

    if (stationResult.isErr()) {
      logger.warn('Failed to upsert station', { station: record.Station });
      return { kind: 'rejected' };
    }

    const stationId = stationResult.value;

    // Upsert the observation.
    const qualityFlagRaw = record['quality_flag'];
    const qualityFlag = typeof qualityFlagRaw === 'string' ? qualityFlagRaw : null;

    const obsResult = await upsertObservation({
      stationId,
      districtId,
      sourceId,
      observationDate,
      measurementField: dataset.storageField,
      measurementValue,
      vintage,
      qualityFlag,
      windDirection: dataset.storageField === 'wind_direction_degrees' ? measurementValue : null,
    });

    if (obsResult.isErr()) {
      logger.warn('Failed to upsert observation', { station: record.Station });
      return { kind: 'rejected' };
    }

    return { kind: 'written', vintage };
  } catch (error) {
    logger.warn('Exception processing NWDP record', { station: record.Station, error });
    return { kind: 'rejected' };
  }
}

/**
 * Parse an IST timestamp in the format "DD-MM-YYYY HH:MM" to a UTC Date.
 * IST is UTC+5:30.
 */
function parseIST(timeStr: string): Date | null {
  if (!timeStr || typeof timeStr !== 'string') return null;

  const match = timeStr.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})$/);
  if (!match) return null;

  const [, day, month, year, hour, minute] = match;

  try {
    // Construct an ISO string with IST offset (+05:30).
    const isoString = `${year}-${month}-${day}T${hour}:${minute}:00+05:30`;
    const date = new Date(isoString);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Fetch records from NWDP CKAN DataStore API, paginated with most recent first.
 * Stops after fetching `maxRecords` or when the API returns an empty page.
 */
async function fetchDatastoreRecords(
  resourceId: string,
  maxRecords = NWDP_CONFIG.MAX_RECORDS_PER_RUN,
): Promise<Result<NWDPDatastoreRecord[], RequestError>> {
  const records: NWDPDatastoreRecord[] = [];
  let offset = 0;
  const limit = 100; // CKAN default page size

  try {
    while (records.length < maxRecords) {
      const params = new URLSearchParams({
        resource_id: resourceId,
        limit: String(limit),
        offset: String(offset),
        sort: '_id desc', // Most recent first
      });

      const url = `${NWDP_API_BASE}/datastore_search?${params.toString()}`;
      const response = await fetchJson<{
        success: boolean;
        result?: {
          records: NWDPDatastoreRecord[];
          total: number;
        };
      }>(url, {
        timeoutMs: NWDP_CONFIG.FETCH_TIMEOUT_MS,
        retries: NWDP_CONFIG.FETCH_RETRIES,
      });

      if (response.isErr()) {
        return err(response.error);
      }

      const data = response.value;
      if (!data.success || !data.result) {
        break;
      }

      const batch = data.result.records;
      if (batch.length === 0) {
        break;
      }

      records.push(...batch);
      offset += limit;
    }

    return ok(records.slice(0, maxRecords));
  } catch (error) {
    logger.error('CKAN API fetch failed', { resourceId, error });
    return err(ERRORS.UPSTREAM_UNAVAILABLE);
  }
}

/**
 * Build a map of district names to their area IDs.
 * Used to resolve district names from NWDP records to foreign keys.
 */
async function getDistrictMap(): Promise<Result<Map<string, number>, RequestError>> {
  const result = await AreaRepository.findByType(AreaType.District);
  if (result.isErr()) {
    return err(result.error);
  }

  const map = new Map<string, number>();
  for (const area of result.value) {
    // Keyed uppercase — see the case-normalization note where this map is looked up.
    map.set(area.name.en.toUpperCase(), area.id);
  }

  return ok(map);
}

interface UpsertStationInput {
  name: string;
  districtId: number;
  latitude: number;
  longitude: number;
  agency: string | null;
  sourceId: number;
}

/**
 * Get or create a weather station. Returns the station ID.
 * Idempotent: calling twice with the same name returns the same station ID.
 */
async function upsertStation(
  input: UpsertStationInput,
): Promise<Result<number, RequestError>> {
  try {
    // Try to find existing station by name.
    interface StationRow extends RowDataPacket {
      id: number;
    }

    const [existing] = await db.query<StationRow[]>(
      'SELECT id FROM weather_stations WHERE name = ? LIMIT 1',
      [input.name],
    );

    if (existing && existing.length > 0) {
      const row = existing[0];
      if (row) return ok(row.id);
    }

    // Create new station.
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO weather_stations
        (name, district_id, latitude, longitude, agency, source_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        input.name,
        input.districtId,
        input.latitude,
        input.longitude,
        input.agency,
        input.sourceId,
      ],
    );

    return ok(result.insertId);
  } catch (error) {
    logger.error('upsertStation failed', { name: input.name, error });
    return err(ERRORS.DATABASE_ERROR);
  }
}

interface UpsertObservationInput {
  stationId: number;
  districtId: number;
  sourceId: number;
  observationDate: Date;
  measurementField: string;
  measurementValue: number;
  vintage: string;
  qualityFlag: string | null;
  windDirection: number | null;
}

/**
 * Insert or update a weather observation.
 * Idempotent: re-inserting the same (source_id, station_id, observation_date) updates in place.
 */
async function upsertObservation(
  input: UpsertObservationInput,
): Promise<Result<void, RequestError>> {
  try {
    // Format the observation_date as a MySQL DATETIME string.
    const obsDateTime = input.observationDate.toISOString().replace('T', ' ').substring(0, 19);

    // Prepare the INSERT ... ON DUPLICATE KEY UPDATE statement.
    // The measurement field is dynamic (rainfall_mm, temperature_celsius, etc.),
    // so we can't use a parameterized column name. We whitelist the allowed fields.
    const allowedFields = [
      'rainfall_mm',
      'temperature_celsius',
      'humidity_percent',
      'wind_speed_kmh',
      'wind_direction_degrees',
      'pressure_mb',
      'solar_radiation_w_m2',
    ] as const;

    if (!allowedFields.includes(input.measurementField as (typeof allowedFields)[number])) {
      return err(ERRORS.DATABASE_ERROR);
    }

    const measurementField = input.measurementField;

    // Build the UPDATE clause: only update the measurement column and related fields.
    const windCardinal = input.windDirection !== null
      ? degreesToCardinal(input.windDirection)
      : null;

    let sql = `
      INSERT INTO weather_observations
        (station_id, district_id, source_id, observation_date, ${measurementField}, quality_flag, vintage, fetched_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())
      ON DUPLICATE KEY UPDATE
        ${measurementField} = VALUES(${measurementField}),
        quality_flag = VALUES(quality_flag),
        fetched_at = UTC_TIMESTAMP()
    `;

    // If this is a wind direction measurement, also update the cardinal direction.
    if (measurementField === 'wind_direction_degrees') {
      sql = `
        INSERT INTO weather_observations
          (station_id, district_id, source_id, observation_date, ${measurementField}, wind_direction_cardinal, quality_flag, vintage, fetched_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())
        ON DUPLICATE KEY UPDATE
          ${measurementField} = VALUES(${measurementField}),
          wind_direction_cardinal = VALUES(wind_direction_cardinal),
          quality_flag = VALUES(quality_flag),
          fetched_at = UTC_TIMESTAMP()
      `;

      await db.query<ResultSetHeader>(
        sql,
        [
          input.stationId,
          input.districtId,
          input.sourceId,
          obsDateTime,
          input.measurementValue,
          windCardinal,
          input.qualityFlag,
          input.vintage,
        ],
      );

      return ok(undefined);
    } else {
      await db.query<ResultSetHeader>(
        sql,
        [
          input.stationId,
          input.districtId,
          input.sourceId,
          obsDateTime,
          input.measurementValue,
          input.qualityFlag,
          input.vintage,
        ],
      );

      return ok(undefined);
    }
  } catch (error) {
    logger.error('upsertObservation failed', {
      stationId: input.stationId,
      field: input.measurementField,
      error,
    });
    return err(ERRORS.DATABASE_ERROR);
  }
}

/**
 * Create connector instances for all seven NWDP datasets and export them.
 * Each connector runs on its own schedule and writes to its own storage column.
 */
export const nwdpConnectors: SourceConnector[] = Object.values(NWDP_DATASETS).map(
  (dataset) => new NwdpConnector(dataset),
);
