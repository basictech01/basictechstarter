import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { err, ok } from 'neverthrow';

import type { Area } from '../models/area.model.js';
import type { Source } from '../models/source.model.js';
import type { WeatherReading } from '../models/weather.model.js';
import type { IAreaRepository } from '../repositories/area.repository.js';
import type { ISourceRepository } from '../repositories/source.repository.js';
import type { IWeatherRepository } from '../repositories/weather.repository.js';
import { AreaType } from '../types/area.js';
import { AccessMethod, Cadence, Freshness, MetadataStatus } from '../types/dataset.js';
import { ERRORS } from '../utils/errors.js';

const mockAreaRepo: jest.Mocked<IAreaRepository> = {
  listDistricts: jest.fn(),
  findBySlug: jest.fn(),
  findByCode: jest.fn(),
  listChildren: jest.fn(),
  findBoundaryByAreaId: jest.fn(),
  listMapLayers: jest.fn(),
  countByType: jest.fn(),
  findByType: jest.fn(),
  resolveToDistricts: jest.fn(),
};

const mockWeatherRepo: jest.Mocked<IWeatherRepository> = {
  latestReadings: jest.fn(),
  rainfallSince: jest.fn(),
  countStations: jest.fn(),
};

// provenance.service.js is exercised for real; only its SourceRepository dependency is
// mocked, so these tests see genuine DS-1/DS-6 behaviour (same approach as
// indicator.controller.test.ts).
const mockSourceRepo: jest.Mocked<ISourceRepository> = {
  listAll: jest.fn(),
  findByKey: jest.fn(),
  findRowByKey: jest.fn(),
  findByIds: jest.fn(),
  startRun: jest.fn(),
  completeRun: jest.fn(),
  listRuns: jest.fn(),
  expireStuckRuns: jest.fn(),
};

jest.unstable_mockModule('../repositories/area.repository.js', () => ({
  AreaRepository: mockAreaRepo,
}));
jest.unstable_mockModule('../repositories/weather.repository.js', () => ({
  WeatherRepository: mockWeatherRepo,
}));
jest.unstable_mockModule('../repositories/source.repository.js', () => ({
  SourceRepository: mockSourceRepo,
}));

const controller = await import('./weather.controller.js');

const NOW = new Date('2026-09-02T06:00:00.000Z');

function district(overrides: Partial<Area> = {}): Area {
  return {
    id: 5,
    type: AreaType.District,
    code: 'UK-DD',
    slug: 'dehradun',
    name: { en: 'Dehradun', hi: 'देहरादून' },
    parentId: 1,
    division: null,
    headquarters: null,
    centroid: null,
    officialIds: { lgd: null, census2011: null },
    ...overrides,
  };
}

function nwdpSource(overrides: Partial<Source> = {}): Source {
  return {
    key: 'nwdp-temperature',
    ownerModule: 'hydromet',
    department: { en: 'National Water Data Portal - Temperature', hi: 'एनडब्ल्यूडीपी' },
    url: 'https://www.nwdp.nwic.gov.in',
    attribution: 'Source: National Water Data Portal (NWDP), Uttarakhand Department',
    licence: 'Creative Commons Attribution 4.0',
    accessMethod: AccessMethod.Api,
    cadence: Cadence.Hourly,
    mayRedistribute: true,
    metadataStatus: MetadataStatus.Provisional,
    freshness: Freshness.Fresh,
    lastSuccessAt: '2026-09-02 05:05:00',
    lastVintage: '2026-09-02',
    lastRunStatus: null,
    lastRunAt: null,
    ...overrides,
  };
}

function reading(overrides: Partial<WeatherReading> = {}): WeatherReading {
  return {
    stationId: 12,
    stationName: 'Yamuna Colony',
    latitude: 30.1384,
    longitude: 78.0068,
    districtId: 5,
    districtSlug: 'dehradun',
    districtName: { en: 'Dehradun', hi: 'देहरादून' },
    field: 'temperatureCelsius',
    value: 24.1,
    windDirectionCardinal: null,
    sourceId: 1,
    vintage: '2026-09-02 05:00:00',
    fetchedAt: '2026-09-02 05:05:00',
    ...overrides,
  };
}

beforeEach(() => {
  for (const fn of Object.values(mockAreaRepo)) fn.mockReset();
  for (const fn of Object.values(mockWeatherRepo)) fn.mockReset();
  for (const fn of Object.values(mockSourceRepo)) fn.mockReset();
  mockWeatherRepo.rainfallSince.mockResolvedValue(ok([]));
});

describe('getAreaWeather', () => {
  it('merges per-field readings into a district snapshot and a per-station snapshot', async () => {
    mockAreaRepo.findBySlug.mockResolvedValue(ok(district()));
    mockWeatherRepo.latestReadings.mockResolvedValue(
      ok([
        reading({ field: 'temperatureCelsius', value: 24.1, sourceId: 1, vintage: '2026-09-02 05:00:00' }),
        reading({ field: 'rainfallMm', value: 0.5, sourceId: 2, vintage: '2026-09-02 04:00:00' }),
      ]),
    );
    mockSourceRepo.findByIds.mockResolvedValue(
      ok(
        new Map([
          [1, nwdpSource({ key: 'nwdp-temperature' })],
          [2, nwdpSource({ key: 'nwdp-rainfall' })],
        ]),
      ),
    );

    const result = await controller.getAreaWeather('dehradun', NOW);
    const weather = result._unsafeUnwrap();

    expect(weather.district).toEqual({ slug: 'dehradun', name: { en: 'Dehradun', hi: 'देहरादून' } });
    expect(weather.latest.temperatureCelsius).toBe(24.1);
    expect(weather.latest.rainfallMm).toBe(0.5);
    // observedAt is the freshest of the two contributing fields' own timestamps.
    expect(weather.latest.observedAt).toBe('2026-09-02T05:00:00.000Z');
    expect(weather.stations).toHaveLength(1);
    expect(weather.stations[0]).toMatchObject({ id: 12, name: 'Yamuna Colony' });
    expect(weather.stations[0]?.latest.temperatureCelsius).toBe(24.1);
  });

  /** DS-6 — a reading from a non-redistributable source is dropped, not shown as zero. */
  it('leaves a field null when its only reading comes from a non-redistributable source', async () => {
    mockAreaRepo.findBySlug.mockResolvedValue(ok(district()));
    mockWeatherRepo.latestReadings.mockResolvedValue(
      ok([reading({ field: 'rainfallMm', value: 0.5, sourceId: 2 })]),
    );
    mockSourceRepo.findByIds.mockResolvedValue(
      ok(new Map([[2, nwdpSource({ key: 'nwdp-rainfall', mayRedistribute: false })]])),
    );

    const result = await controller.getAreaWeather('dehradun', NOW);
    const weather = result._unsafeUnwrap();

    expect(weather.latest.rainfallMm).toBeNull();
    expect(weather.latest.observedAt).toBeNull();
    expect(weather.stations).toHaveLength(0);
  });

  it('never fabricates a value for a measurement with no observation at all', async () => {
    mockAreaRepo.findBySlug.mockResolvedValue(ok(district()));
    mockWeatherRepo.latestReadings.mockResolvedValue(ok([]));

    const result = await controller.getAreaWeather('dehradun', NOW);
    const weather = result._unsafeUnwrap();

    expect(weather.latest).toEqual({
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
    });
  });

  it('propagates AREA_NOT_FOUND for an unknown slug', async () => {
    mockAreaRepo.findBySlug.mockResolvedValue(err(ERRORS.AREA_NOT_FOUND));
    const result = await controller.getAreaWeather('nowhere', NOW);
    expect(result._unsafeUnwrapErr().code).toBe(ERRORS.AREA_NOT_FOUND.code);
  });

  it('propagates DATABASE_ERROR from the repository', async () => {
    mockAreaRepo.findBySlug.mockResolvedValue(ok(district()));
    mockWeatherRepo.latestReadings.mockResolvedValue(err(ERRORS.DATABASE_ERROR));
    const result = await controller.getAreaWeather('dehradun', NOW);
    expect(result._unsafeUnwrapErr().code).toBe(ERRORS.DATABASE_ERROR.code);
  });
});

describe('listStations', () => {
  it('returns one snapshot per station, across districts', async () => {
    mockWeatherRepo.latestReadings.mockResolvedValue(
      ok([
        reading({ stationId: 12, districtSlug: 'dehradun', field: 'temperatureCelsius', value: 24.1 }),
        reading({
          stationId: 30,
          stationName: 'Nainital Lake',
          districtId: 6,
          districtSlug: 'nainital',
          districtName: { en: 'Nainital', hi: 'नैनीताल' },
          field: 'humidityPercent',
          value: 70,
          sourceId: 3,
        }),
      ]),
    );
    mockSourceRepo.findByIds.mockResolvedValue(
      ok(
        new Map([
          [1, nwdpSource({ key: 'nwdp-temperature' })],
          [3, nwdpSource({ key: 'nwdp-humidity' })],
        ]),
      ),
    );

    const result = await controller.listStations(NOW);
    const stations = result._unsafeUnwrap();

    expect(stations).toHaveLength(2);
    const nainital = stations.find((s) => s.id === 30);
    expect(nainital?.district).toEqual({ slug: 'nainital', name: { en: 'Nainital', hi: 'नैनीताल' } });
    expect(nainital?.latest.humidityPercent).toBe(70);
  });

  it('propagates DATABASE_ERROR from the repository', async () => {
    mockWeatherRepo.latestReadings.mockResolvedValue(err(ERRORS.DATABASE_ERROR));
    const result = await controller.listStations(NOW);
    expect(result._unsafeUnwrapErr().code).toBe(ERRORS.DATABASE_ERROR.code);
  });
});

describe('getSummary', () => {
  it('averages the latest temperature per station and sums the 24h rainfall window', async () => {
    mockWeatherRepo.latestReadings.mockResolvedValue(
      ok([
        reading({ stationId: 12, field: 'temperatureCelsius', value: 20, sourceId: 1 }),
        reading({ stationId: 30, field: 'temperatureCelsius', value: 30, sourceId: 1 }),
      ]),
    );
    mockWeatherRepo.countStations.mockResolvedValue(ok({ stationCount: 6, districtsCovered: 6 }));
    mockWeatherRepo.rainfallSince.mockResolvedValue(
      ok([
        reading({ field: 'rainfallMm', value: 5, sourceId: 2 }),
        reading({ field: 'rainfallMm', value: 7.5, sourceId: 2 }),
      ]),
    );
    mockSourceRepo.findByIds.mockResolvedValue(
      ok(
        new Map([
          [1, nwdpSource({ key: 'nwdp-temperature' })],
          [2, nwdpSource({ key: 'nwdp-rainfall' })],
        ]),
      ),
    );

    const result = await controller.getSummary(NOW);
    const summary = result._unsafeUnwrap();

    expect(summary.stationCount).toBe(6);
    expect(summary.districtsCovered).toBe(6);
    expect(summary.averageTemperatureCelsius).toBe(25);
    expect(summary.totalRainfallMmLast24h).toBe(12.5);
    expect(summary.latestObservationAt).toBe('2026-09-02T05:00:00.000Z');
  });

  it('returns a null average when there are zero temperature readings', async () => {
    mockWeatherRepo.latestReadings.mockResolvedValue(
      ok([reading({ stationId: 12, field: 'rainfallMm', value: 0.5, sourceId: 2 })]),
    );
    mockWeatherRepo.countStations.mockResolvedValue(ok({ stationCount: 1, districtsCovered: 1 }));
    mockSourceRepo.findByIds.mockResolvedValue(
      ok(new Map([[2, nwdpSource({ key: 'nwdp-rainfall' })]])),
    );

    const result = await controller.getSummary(NOW);
    expect(result._unsafeUnwrap().averageTemperatureCelsius).toBeNull();
  });

  /** It hasn't rained — 0 is a real answer, not "no data" (spec: never null for this field). */
  it('reports zero rainfall, not null, when nothing fell in the window', async () => {
    mockWeatherRepo.latestReadings.mockResolvedValue(ok([]));
    mockWeatherRepo.countStations.mockResolvedValue(ok({ stationCount: 6, districtsCovered: 6 }));
    mockWeatherRepo.rainfallSince.mockResolvedValue(ok([]));

    const result = await controller.getSummary(NOW);
    const summary = result._unsafeUnwrap();

    expect(summary.totalRainfallMmLast24h).toBe(0);
    expect(summary.averageTemperatureCelsius).toBeNull();
    expect(summary.latestObservationAt).toBeNull();
  });

  it('propagates DATABASE_ERROR from countStations', async () => {
    mockWeatherRepo.latestReadings.mockResolvedValue(ok([]));
    mockWeatherRepo.countStations.mockResolvedValue(err(ERRORS.DATABASE_ERROR));
    const result = await controller.getSummary(NOW);
    expect(result._unsafeUnwrapErr().code).toBe(ERRORS.DATABASE_ERROR.code);
  });

  it('propagates DATABASE_ERROR from rainfallSince', async () => {
    mockWeatherRepo.latestReadings.mockResolvedValue(ok([]));
    mockWeatherRepo.countStations.mockResolvedValue(ok({ stationCount: 6, districtsCovered: 6 }));
    mockWeatherRepo.rainfallSince.mockResolvedValue(err(ERRORS.DATABASE_ERROR));
    const result = await controller.getSummary(NOW);
    expect(result._unsafeUnwrapErr().code).toBe(ERRORS.DATABASE_ERROR.code);
  });
});
