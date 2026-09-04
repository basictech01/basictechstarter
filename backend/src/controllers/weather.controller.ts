import { err, ok, type Result } from 'neverthrow';

import {
  mergeSnapshot,
  type AreaStationOut,
  type AreaWeatherOut,
  type WeatherReading,
  type WeatherReadingOut,
  type WeatherStationOut,
  type WeatherSummary,
} from '../models/weather.model.js';
import { AreaRepository } from '../repositories/area.repository.js';
import { WeatherRepository } from '../repositories/weather.repository.js';
import { attachProvenance, publiclyDisplayable } from '../services/provenance.service.js';
import type { RequestError } from '../utils/errors.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Attaches provenance and drops readings from a source that may not be redistributed (DS-6). */
async function visibleReadings(
  readings: readonly WeatherReading[],
  now?: Date,
): Promise<Result<WeatherReadingOut[], RequestError>> {
  const stamped = await attachProvenance(readings, now);
  if (stamped.isErr()) return err(stamped.error);
  return ok(publiclyDisplayable(stamped.value));
}

/** Groups readings by station and merges each group into one snapshot per station (§ spec). */
function buildStationSnapshots(readings: readonly WeatherReadingOut[]): WeatherStationOut[] {
  const byStation = new Map<number, WeatherReadingOut[]>();
  for (const reading of readings) {
    const group = byStation.get(reading.stationId);
    if (group === undefined) byStation.set(reading.stationId, [reading]);
    else group.push(reading);
  }

  return [...byStation.entries()].flatMap(([stationId, group]) => {
    const first = group[0];
    if (first === undefined) return [];
    return [
      {
        id: stationId,
        name: first.stationName,
        district: { slug: first.districtSlug, name: first.districtName },
        latitude: first.latitude,
        longitude: first.longitude,
        latest: mergeSnapshot(group),
      },
    ];
  });
}

async function statewideStationSnapshots(
  now?: Date,
): Promise<Result<WeatherStationOut[], RequestError>> {
  const readings = await WeatherRepository.latestReadings();
  if (readings.isErr()) return err(readings.error);

  const visible = await visibleReadings(readings.value, now);
  if (visible.isErr()) return err(visible.error);

  return ok(buildStationSnapshots(visible.value));
}

/**
 * A district's current weather: the district-wide "latest across all its stations" snapshot
 * plus each contributing station's own snapshot. Per-station and district snapshots are
 * built from the same provenance-filtered reading list, merged independently — see
 * `mergeSnapshot`'s doc comment on why the same merge serves both.
 */
export async function getAreaWeather(
  areaSlug: string,
  now: Date = new Date(),
): Promise<Result<AreaWeatherOut, RequestError>> {
  const area = await AreaRepository.findBySlug(areaSlug);
  if (area.isErr()) return err(area.error);

  const readings = await WeatherRepository.latestReadings(area.value.id);
  if (readings.isErr()) return err(readings.error);

  const visible = await visibleReadings(readings.value, now);
  if (visible.isErr()) return err(visible.error);

  const stations: AreaStationOut[] = buildStationSnapshots(visible.value).map(
    ({ district: _district, ...rest }) => rest,
  );

  return ok({
    district: { slug: area.value.slug, name: area.value.name },
    latest: mergeSnapshot(visible.value),
    stations,
  });
}

/** Every weather station statewide with its latest full snapshot — for map rendering. */
export async function listStations(now?: Date): Promise<Result<WeatherStationOut[], RequestError>> {
  return statewideStationSnapshots(now);
}

/** Statewide rollup for the home dashboard counters. */
export async function getSummary(now: Date = new Date()): Promise<Result<WeatherSummary, RequestError>> {
  const stations = await statewideStationSnapshots(now);
  if (stations.isErr()) return err(stations.error);

  const counts = await WeatherRepository.countStations();
  if (counts.isErr()) return err(counts.error);

  const since = new Date(now.getTime() - DAY_MS);
  const rainfallReadings = await WeatherRepository.rainfallSince(since);
  if (rainfallReadings.isErr()) return err(rainfallReadings.error);

  const visibleRainfall = await visibleReadings(rainfallReadings.value, now);
  if (visibleRainfall.isErr()) return err(visibleRainfall.error);
  const totalRainfallMmLast24h = visibleRainfall.value.reduce((sum, r) => sum + r.value, 0);

  const temperatures = stations.value
    .map((s) => s.latest.temperatureCelsius)
    .filter((v): v is number => v !== null);
  const averageTemperatureCelsius =
    temperatures.length === 0
      ? null
      : temperatures.reduce((sum, v) => sum + v, 0) / temperatures.length;

  const observedTimestamps = stations.value
    .map((s) => s.latest.observedAt)
    .filter((v): v is string => v !== null);
  const latestObservationAt =
    observedTimestamps.length === 0
      ? null
      : observedTimestamps.reduce((max, v) => (v > max ? v : max));

  return ok({
    stationCount: counts.value.stationCount,
    districtsCovered: counts.value.districtsCovered,
    latestObservationAt,
    averageTemperatureCelsius,
    totalRainfallMmLast24h,
  });
}
