/**
 * NWDP (National Water Data Portal) types and dataset configuration.
 *
 * The NWDP exposes seven weather datasets via a CKAN DataStore API. Each dataset has:
 *   - A unique `resourceId` (Ckan resource UUID)
 *   - A measurement field name (the column that varies per dataset)
 *   - A unit
 *   - A corresponding storage field in the weather_observations table
 *
 * All datasets share:
 *   - The same API endpoint (CKAN DataStore)
 *   - The same record structure (Station, District, Latitude, Longitude, Data Acquisition Time, etc.)
 *   - Hourly cadence
 *   - IST timestamps that must be converted to UTC
 *
 * See NWDP_DATASETS_VERIFIED.md for the complete verification of all seven.
 */

/** The shape of a record returned by the NWDP CKAN DataStore API. */
export interface NWDPDatastoreRecord {
  _id: number;
  SlNo: string;
  Station: string;
  Agency: string;
  'State LGD Code': string;
  State: string;
  'District LGD Code': string;
  District: string;
  Latitude: string;
  Longitude: string;
  'Data Acquisition Time': string; // Format: "DD-MM-YYYY HH:MM" (IST)
  [key: string]: string | number | undefined; // The measurement field varies per dataset
}

/** Metadata for one NWDP dataset. */
export interface NWDPDataset {
  /** Must match a source_key in the sources registry. */
  sourceKey: string;

  /** CKAN DataStore resource UUID. */
  resourceId: string;

  /** The column name in the API response that holds the measurement value. */
  measurementField: string;

  /** Unit of measurement (informational). */
  measurementUnit: string;

  /**
   * The weather_observations column where this value is stored.
   * All other measurement columns in that row will be NULL for this source.
   */
  storageField: 'rainfall_mm' | 'temperature_celsius' | 'humidity_percent' | 'wind_speed_kmh' | 'wind_direction_degrees' | 'pressure_mb' | 'solar_radiation_w_m2';
}

/**
 * The seven NWDP datasets. Each maps to one source_key and will have its own
 * SourceConnector instance and scheduled ingestion run.
 */
export const NWDP_DATASETS: Record<string, NWDPDataset> = {
  rainfall: {
    sourceKey: 'nwdp-rainfall',
    resourceId: '8b406187-0fee-40b9-8cd9-a249e0ce1903',
    measurementField: 'Telemetry Hourly Rainfall (mm)',
    measurementUnit: 'mm',
    storageField: 'rainfall_mm',
  },
  temperature: {
    sourceKey: 'nwdp-temperature',
    resourceId: '85e03a85-cd85-43db-bb56-22d3d3e70319',
    measurementField: 'Air Temperature Telemetry Hourly (AoC)',
    measurementUnit: '°C',
    storageField: 'temperature_celsius',
  },
  humidity: {
    sourceKey: 'nwdp-humidity',
    resourceId: 'c3a24685-4642-4f59-ba3b-bf1602181a22',
    measurementField: 'Relative Humidity (%)',
    measurementUnit: '%',
    storageField: 'humidity_percent',
  },
  windSpeed: {
    sourceKey: 'nwdp-wind-speed',
    resourceId: '70c92f61-e8f3-45e4-8660-940a4664e11f',
    measurementField: 'Wind Speed (km/h)',
    measurementUnit: 'km/h',
    storageField: 'wind_speed_kmh',
  },
  windDirection: {
    sourceKey: 'nwdp-wind-direction',
    resourceId: '51cac61b-12d8-43dd-b609-2a033b3511c5',
    measurementField: 'Wind Direction (°)',
    measurementUnit: 'degrees',
    storageField: 'wind_direction_degrees',
  },
  pressure: {
    sourceKey: 'nwdp-pressure',
    resourceId: '90c6bcb8-dfcc-4363-8575-4b5526d22a3a',
    measurementField: 'Atmospheric Pressure (mb)',
    measurementUnit: 'mb',
    storageField: 'pressure_mb',
  },
  solarRadiation: {
    sourceKey: 'nwdp-solar-radiation',
    resourceId: 'ed4f0384-687b-4582-a46f-3b9c11b97952',
    measurementField: 'Solar Radiation (W/m²)',
    measurementUnit: 'W/m²',
    storageField: 'solar_radiation_w_m2',
  },
};

/**
 * Convert wind direction in degrees to a cardinal abbreviation.
 * Used to populate the wind_direction_cardinal column for readability.
 *
 * @param degrees Wind direction in degrees (0-359)
 * @returns Cardinal direction (N, NE, E, SE, S, SW, W, NW) or null if invalid
 */
export function degreesToCardinal(degrees: number | null): string | null {
  if (degrees === null || typeof degrees !== 'number' || isNaN(degrees)) {
    return null;
  }

  // Normalize to 0-359
  const normalized = ((degrees % 360) + 360) % 360;

  // 8 cardinal directions, 45 degrees each
  const directions: readonly string[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(normalized / 45) % 8;
  const cardinal = directions[index] ?? null;
  return cardinal;
}
