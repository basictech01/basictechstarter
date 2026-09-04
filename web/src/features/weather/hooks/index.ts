'use client';

import { useQuery } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/constants';

import { weatherKeys } from '../queries';
import { fetchAreaWeather, fetchWeatherStations, fetchWeatherSummary } from '../services';

export function useWeatherSummary() {
  return useQuery({
    queryKey: weatherKeys.summary(),
    queryFn: () => fetchWeatherSummary(),
    staleTime: STALE_TIME.WEATHER,
  });
}

export function useWeatherStations() {
  return useQuery({
    queryKey: weatherKeys.stations(),
    queryFn: () => fetchWeatherStations(),
    staleTime: STALE_TIME.WEATHER,
  });
}

export function useAreaWeather(slug: string) {
  return useQuery({
    queryKey: weatherKeys.area(slug),
    queryFn: () => fetchAreaWeather(slug),
    staleTime: STALE_TIME.WEATHER,
    enabled: slug.length > 0,
  });
}
