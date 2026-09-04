import { describe, it, expect } from '@jest/globals';

import { NWDP_DATASETS, degreesToCardinal } from './nwdp-types.js';

describe('NWDP Connector', () => {
  describe('degreesToCardinal', () => {
    it('converts 0 degrees to N', () => {
      expect(degreesToCardinal(0)).toBe('N');
    });

    it('converts 45 degrees to NE', () => {
      expect(degreesToCardinal(45)).toBe('NE');
    });

    it('converts 90 degrees to E', () => {
      expect(degreesToCardinal(90)).toBe('E');
    });

    it('converts 135 degrees to SE', () => {
      expect(degreesToCardinal(135)).toBe('SE');
    });

    it('converts 180 degrees to S', () => {
      expect(degreesToCardinal(180)).toBe('S');
    });

    it('converts 225 degrees to SW', () => {
      expect(degreesToCardinal(225)).toBe('SW');
    });

    it('converts 270 degrees to W', () => {
      expect(degreesToCardinal(270)).toBe('W');
    });

    it('converts 315 degrees to NW', () => {
      expect(degreesToCardinal(315)).toBe('NW');
    });

    it('handles negative degrees', () => {
      expect(degreesToCardinal(-45)).toBe('NW');
    });

    it('handles degrees > 360', () => {
      expect(degreesToCardinal(405)).toBe('NE');
    });

    it('returns null for null input', () => {
      expect(degreesToCardinal(null)).toBeNull();
    });

    it('returns null for NaN', () => {
      expect(degreesToCardinal(NaN)).toBeNull();
    });

    it('returns null for non-number', () => {
      // @ts-expect-error testing type mismatch
      expect(degreesToCardinal('45')).toBeNull();
    });
  });

  describe('NWDP_DATASETS', () => {
    it('defines exactly seven datasets', () => {
      expect(Object.keys(NWDP_DATASETS)).toHaveLength(7);
    });

    it('includes rainfall with correct properties', () => {
      const rainfall = NWDP_DATASETS.rainfall;
      expect(rainfall).toBeDefined();
      if (rainfall) {
        expect(rainfall.sourceKey).toBe('nwdp-rainfall');
        expect(rainfall.storageField).toBe('rainfall_mm');
      }
    });

    it('includes temperature with correct properties', () => {
      const temperature = NWDP_DATASETS.temperature;
      expect(temperature).toBeDefined();
      if (temperature) {
        expect(temperature.sourceKey).toBe('nwdp-temperature');
        expect(temperature.storageField).toBe('temperature_celsius');
      }
    });

    it('includes humidity with correct properties', () => {
      const humidity = NWDP_DATASETS.humidity;
      expect(humidity).toBeDefined();
      if (humidity) {
        expect(humidity.sourceKey).toBe('nwdp-humidity');
        expect(humidity.storageField).toBe('humidity_percent');
      }
    });

    it('includes wind speed with correct properties', () => {
      const windSpeed = NWDP_DATASETS.windSpeed;
      expect(windSpeed).toBeDefined();
      if (windSpeed) {
        expect(windSpeed.sourceKey).toBe('nwdp-wind-speed');
        expect(windSpeed.storageField).toBe('wind_speed_kmh');
      }
    });

    it('includes wind direction with correct properties', () => {
      const windDirection = NWDP_DATASETS.windDirection;
      expect(windDirection).toBeDefined();
      if (windDirection) {
        expect(windDirection.sourceKey).toBe('nwdp-wind-direction');
        expect(windDirection.storageField).toBe('wind_direction_degrees');
      }
    });

    it('includes pressure with correct properties', () => {
      const pressure = NWDP_DATASETS.pressure;
      expect(pressure).toBeDefined();
      if (pressure) {
        expect(pressure.sourceKey).toBe('nwdp-pressure');
        expect(pressure.storageField).toBe('pressure_mb');
      }
    });

    it('includes solar radiation with correct properties', () => {
      const solarRadiation = NWDP_DATASETS.solarRadiation;
      expect(solarRadiation).toBeDefined();
      if (solarRadiation) {
        expect(solarRadiation.sourceKey).toBe('nwdp-solar-radiation');
        expect(solarRadiation.storageField).toBe('solar_radiation_w_m2');
      }
    });

    it('each dataset has a unique resourceId', () => {
      const ids = new Set();
      for (const dataset of Object.values(NWDP_DATASETS)) {
        expect(ids.has(dataset.resourceId)).toBe(false);
        ids.add(dataset.resourceId);
      }
    });

    it('each dataset has a unique sourceKey', () => {
      const keys = new Set();
      for (const dataset of Object.values(NWDP_DATASETS)) {
        expect(keys.has(dataset.sourceKey)).toBe(false);
        keys.add(dataset.sourceKey);
      }
    });

    it('each dataset has a measurementField', () => {
      for (const dataset of Object.values(NWDP_DATASETS)) {
        expect(dataset.measurementField).toBeTruthy();
      }
    });

    it('each dataset has a measurementUnit', () => {
      for (const dataset of Object.values(NWDP_DATASETS)) {
        expect(dataset.measurementUnit).toBeTruthy();
      }
    });
  });

  describe('NWDP_DATASETS measurement fields', () => {
    it('rainfall has correct measurementField and unit', () => {
      const rainfall = NWDP_DATASETS.rainfall;
      if (rainfall) {
        expect(rainfall.measurementField).toBe('Telemetry Hourly Rainfall (mm)');
        expect(rainfall.measurementUnit).toBe('mm');
      }
    });

    it('temperature has correct measurementField and unit', () => {
      const temperature = NWDP_DATASETS.temperature;
      if (temperature) {
        expect(temperature.measurementField).toBe('Air Temperature Telemetry Hourly (AoC)');
        expect(temperature.measurementUnit).toBe('°C');
      }
    });

    // These five field names were corrected on 2026-09-04 after a live ingestion run against
    // the real NWDP DataStore API rejected 100% of records for each: the original guesses
    // didn't match the upstream column names. Verified directly via datastore_search.
    it('humidity has correct measurementField and unit', () => {
      const humidity = NWDP_DATASETS.humidity;
      if (humidity) {
        expect(humidity.measurementField).toBe('Telemetry Hourly Relative Humidity (%)');
        expect(humidity.measurementUnit).toBe('%');
      }
    });

    it('wind speed has correct measurementField and unit', () => {
      const windSpeed = NWDP_DATASETS.windSpeed;
      if (windSpeed) {
        expect(windSpeed.measurementField).toBe('Telemetry Hourly Wind Speed (Km/Hr)');
        expect(windSpeed.measurementUnit).toBe('km/h');
      }
    });

    it('wind direction has correct measurementField and unit', () => {
      const windDirection = NWDP_DATASETS.windDirection;
      if (windDirection) {
        expect(windDirection.measurementField).toBe('Telemetry Hourly Wind Direction (Degree)');
        expect(windDirection.measurementUnit).toBe('degrees');
      }
    });

    it('pressure has correct measurementField and unit', () => {
      const pressure = NWDP_DATASETS.pressure;
      if (pressure) {
        // Note the literal underscores — upstream's own inconsistent naming, not a typo here.
        expect(pressure.measurementField).toBe('Telemetry_Hourly_Atmospheric Pressure (mb)');
        expect(pressure.measurementUnit).toBe('mb');
      }
    });

    it('solar radiation has correct measurementField and unit', () => {
      const solarRadiation = NWDP_DATASETS.solarRadiation;
      if (solarRadiation) {
        expect(solarRadiation.measurementField).toBe('Solar Radiation (Watt/m2)');
        expect(solarRadiation.measurementUnit).toBe('W/m²');
      }
    });
  });
});
