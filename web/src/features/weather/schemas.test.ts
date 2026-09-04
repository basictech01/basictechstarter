import { describe, expect, it } from 'vitest';
import { AreaWeatherSchema, WeatherSummarySchema } from './schemas';

describe('AreaWeatherSchema', () => {
  it('parses a real GET /areas/:slug/weather payload, including the plural provenance array', () => {
    const payload = {
      district: { slug: 'dehradun', name: { en: 'Dehradun', hi: 'देहरादून' } },
      latest: {
        rainfallMm: 0.5,
        temperatureCelsius: 24.1,
        humidityPercent: 62,
        windSpeedKmh: 8.2,
        windDirectionDegrees: 270,
        windDirectionCardinal: 'W',
        pressureMb: 1012.3,
        solarRadiationWM2: 340.5,
        observedAt: '2026-09-02T05:00:00.000Z',
        provenance: [
          {
            sourceKey: 'nwdp-rainfall',
            department: { en: 'NWDP', hi: 'एनडब्ल्यूडीपी' },
            url: null,
            attribution: 'National Water Data Portal',
            vintage: '2026-09-02',
            fetchedAt: '2026-09-02T06:00:00.000Z',
            freshness: 'fresh',
            mayRedistribute: true,
          },
        ],
      },
      stations: [
        {
          id: 12,
          name: 'Yamuna Colony',
          latitude: 30.1384,
          longitude: 78.0068,
          latest: {
            rainfallMm: null,
            temperatureCelsius: 24.1,
            humidityPercent: null,
            windSpeedKmh: null,
            windDirectionDegrees: null,
            windDirectionCardinal: null,
            pressureMb: null,
            solarRadiationWM2: null,
            observedAt: '2026-09-02T05:00:00.000Z',
            provenance: [],
          },
        },
      ],
    };

    const result = AreaWeatherSchema.parse(payload);
    expect(result.latest.provenance).toHaveLength(1);
    expect(result.stations[0]?.latest.rainfallMm).toBeNull();
  });
});

describe('WeatherSummarySchema', () => {
  it('accepts a legitimate zero for totalRainfallMmLast24h (not the same as "no data")', () => {
    const result = WeatherSummarySchema.parse({
      stationCount: 6,
      districtsCovered: 4,
      latestObservationAt: null,
      averageTemperatureCelsius: null,
      totalRainfallMmLast24h: 0,
    });
    expect(result.totalRainfallMmLast24h).toBe(0);
    expect(result.latestObservationAt).toBeNull();
  });
});
