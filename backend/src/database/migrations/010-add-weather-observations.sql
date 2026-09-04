-- 010 — weather stations and observations tables.
--
-- Hydromet owns measurements of water and weather: temperature, rainfall, river levels.
-- Everything here is a time series from a monitoring station — a value, a timestamp, and a unit.
--
-- This migration creates the tables for NWDP (National Water Data Portal) weather telemetry.
-- The NWDP provides hourly observations for seven datasets: rainfall, temperature, humidity,
-- wind speed, wind direction, atmospheric pressure, and solar radiation — each as a separate
-- source in the sources registry.
--
-- See project/modules/hydromet.md.

CREATE TABLE IF NOT EXISTS weather_stations (
  id                INT AUTO_INCREMENT PRIMARY KEY,

  -- The station name as reported by NWDP (e.g., "Shimla Meteorology").
  name              VARCHAR(255) NOT NULL,

  -- The district this station belongs to. Multiple stations can serve one district.
  district_id       INT NOT NULL,

  -- Geographic coordinates (WGS84).
  latitude          DECIMAL(10,8) NOT NULL,
  longitude         DECIMAL(10,8) NOT NULL,

  -- Optional agency name from NWDP metadata.
  agency            VARCHAR(255) NULL,

  -- The source that brought this station into the system. Null if manually registered.
  source_id         INT NULL,

  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Uniqueness ensures re-ingestion does not duplicate.
  UNIQUE KEY uq_station_name (name),

  CONSTRAINT fk_station_district
    FOREIGN KEY (district_id) REFERENCES areas(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT fk_station_source
    FOREIGN KEY (source_id) REFERENCES sources(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  KEY idx_station_district (district_id),
  KEY idx_station_source (source_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- The time series: one row per measurement per station per observation_date.
-- Multiple sources can contribute observations for the same station.
-- Upsert by (source_id, station_id, observation_date) — the connector re-fetches the latest
-- data for each vintage and updates in place, never duplicates.
CREATE TABLE IF NOT EXISTS weather_observations (
  id                INT AUTO_INCREMENT PRIMARY KEY,

  -- Which station this measurement comes from.
  station_id        INT NOT NULL,

  -- The district, denormalized for query performance (typical queries are "weather for this
  -- district"). Kept in sync with station_id -> station.district_id.
  district_id       INT NOT NULL,

  -- What upstream source provided this observation. NWDP has seven sources (rainfall,
  -- temperature, etc.), each with its own source_id.
  source_id         INT NOT NULL,

  -- When the measurement was taken (IST converted to UTC). Uniqueness is per source and station.
  observation_date  DATETIME NOT NULL,

  -- The seven measurement columns from NWDP datasets.
  -- Each source's connector populates only its column; others stay NULL.
  -- NULL means this dataset did not provide a reading at this time.
  rainfall_mm                  DECIMAL(10,2) NULL,
  temperature_celsius          DECIMAL(10,2) NULL,
  humidity_percent             DECIMAL(10,2) NULL,
  wind_speed_kmh               DECIMAL(10,2) NULL,
  wind_direction_degrees       INT NULL,
  wind_direction_cardinal      VARCHAR(3) NULL,     -- N, NE, E, SE, S, SW, W, NW
  pressure_mb                  DECIMAL(10,2) NULL,
  solar_radiation_w_m2         DECIMAL(10,2) NULL,

  -- Data quality flag from upstream. NWDP marks observations as provisional, final, etc.
  quality_flag      VARCHAR(5) NULL,

  -- What date the data DESCRIBES. The data for 2026-09-04 may be fetched on 2026-09-05.
  -- Allows us to distinguish what day a measurement refers to. Distinct from fetched_at.
  vintage           DATE NULL,

  -- When we retrieved this record. Drives freshness computation (DS-2).
  fetched_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_obs_station
    FOREIGN KEY (station_id) REFERENCES weather_stations(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_obs_district
    FOREIGN KEY (district_id) REFERENCES areas(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT fk_obs_source
    FOREIGN KEY (source_id) REFERENCES sources(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  -- Idempotent upsert: re-fetching the same vintage for a station from the same source
  -- must not duplicate. This composite key also serves the most common queries.
  UNIQUE KEY uq_nwdp_record (source_id, station_id, observation_date),

  -- "Latest reading from this station" and chart series — the two queries that exist.
  KEY idx_obs_station_date (station_id, observation_date DESC),

  -- "All readings for a district" — dashboards fetch weather for a district.
  KEY idx_obs_district_date (district_id, observation_date DESC),

  -- "Health check: are we still ingesting from this source?" — the data freshness query.
  KEY idx_obs_source_date (source_id, observation_date DESC),

  -- "Which observations are old?" — for archival or cleanup queries.
  KEY idx_obs_fetched (fetched_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ROLLBACK
-- DROP TABLE IF EXISTS weather_observations;
-- DROP TABLE IF EXISTS weather_stations;
