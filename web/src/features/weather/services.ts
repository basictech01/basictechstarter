import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { AreaWeatherSchema, WeatherStationSchema, WeatherSummarySchema } from './schemas';

/** District current conditions + its contributing stations — `GET /api/areas/:slug/weather`. */
export async function fetchAreaWeather(slug: string) {
  return apiClient.get(`/areas/${slug}/weather`, AreaWeatherSchema);
}

/** Every weather station statewide, for the map — `GET /api/weather/stations`. */
export async function fetchWeatherStations() {
  return apiClient.get('/weather/stations', z.array(WeatherStationSchema));
}

/** Statewide rollup for the home dashboard tile — `GET /api/weather/summary`. */
export async function fetchWeatherSummary() {
  return apiClient.get('/weather/summary', WeatherSummarySchema);
}
