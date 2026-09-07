import { describe, expect, it } from 'vitest';
import { aggregateRainfallByDistrict, describeObservationAge } from './utils';
import type { WeatherStation } from './schemas';

function station(overrides: Partial<WeatherStation> & { district: WeatherStation['district'] }): WeatherStation {
  return {
    id: 1,
    name: 'Test station',
    latitude: 0,
    longitude: 0,
    latest: {
      rainfallMm: null,
      temperatureCelsius: null,
      humidityPercent: null,
      windSpeedKmh: null,
      windDirectionDegrees: null,
      windDirectionCardinal: null,
      pressureMb: null,
      solarRadiationWM2: null,
      observedAt: null,
      provenance: [],
    },
    ...overrides,
  };
}

describe('describeObservationAge', () => {
  it('returns "No data" when there is no observation', () => {
    expect(describeObservationAge(null)).toEqual({ label: 'No data', level: 'unknown' });
  });

  it('is "fresh" well inside the NWDP cadence (a few hours old)', () => {
    const now = new Date('2026-09-04T12:00:00.000Z');
    const observedAt = new Date('2026-09-04T09:00:00.000Z').toISOString();
    expect(describeObservationAge(observedAt, now).level).toBe('fresh');
  });

  it('is "stale" once well past the ~2 day NWDP lag', () => {
    const now = new Date('2026-09-04T12:00:00.000Z');
    const observedAt = new Date('2026-09-01T00:00:00.000Z').toISOString(); // ~84h
    expect(describeObservationAge(observedAt, now).level).toBe('stale');
  });

  it('is "expired" once far beyond the expected cadence', () => {
    const now = new Date('2026-09-04T12:00:00.000Z');
    const observedAt = new Date('2026-08-20T00:00:00.000Z').toISOString(); // > 168h
    expect(describeObservationAge(observedAt, now).level).toBe('expired');
  });
});

describe('aggregateRainfallByDistrict', () => {
  const dehradun = { slug: 'dehradun', name: { en: 'Dehradun', hi: 'देहरादून' } };
  const nainital = { slug: 'nainital', name: { en: 'Nainital', hi: 'नैनीताल' } };

  it('omits districts where no station has a rainfall reading', () => {
    const stations = [station({ district: dehradun, latest: { ...station({ district: dehradun }).latest, rainfallMm: null } })];
    expect(aggregateRainfallByDistrict(stations)).toEqual([]);
  });

  it('takes the maximum reading across multiple stations in the same district', () => {
    const stations = [
      station({ id: 1, district: dehradun, latest: { ...station({ district: dehradun }).latest, rainfallMm: 4 } }),
      station({ id: 2, district: dehradun, latest: { ...station({ district: dehradun }).latest, rainfallMm: 11 } }),
    ];
    const result = aggregateRainfallByDistrict(stations);
    expect(result).toEqual([{ slug: 'dehradun', name: 'Dehradun', rainfallMm: 11 }]);
  });

  it('sorts districts by rainfall, highest first', () => {
    const stations = [
      station({ id: 1, district: dehradun, latest: { ...station({ district: dehradun }).latest, rainfallMm: 3 } }),
      station({ id: 2, district: nainital, latest: { ...station({ district: nainital }).latest, rainfallMm: 20 } }),
    ];
    const result = aggregateRainfallByDistrict(stations);
    expect(result.map((d) => d.slug)).toEqual(['nainital', 'dehradun']);
  });
});
