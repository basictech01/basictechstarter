'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { InteractiveMap, type MapLayerOption, type MapLegendItem, type MapMarker } from '@/components/map';
import { useActiveAlerts } from '@/features/alerts/hooks';
import type { Alert } from '@/features/alerts/schemas';
import { useWeatherStations } from '@/features/weather/hooks';
import { useDistricts } from '../hooks';
import type { DistrictSummary } from '../schemas';

const NEUTRAL = '#D1D5DB'; // gray-300 — "no data for this district", never a fabricated status

const ALERT_SEVERITY_COLOR: Record<Alert['severity'], string> = {
  extreme: '#7F1D1D',
  severe: '#DC2626',
  moderate: '#F97316',
  minor: '#FCD34D',
};

const SEVERITY_RANK: Record<Alert['severity'], number> = {
  minor: 1,
  moderate: 2,
  severe: 3,
  extreme: 4,
};

function rainfallColor(mm: number): string {
  if (mm <= 0) return '#BAE6FD';
  if (mm < 5) return '#7DD3FC';
  if (mm < 20) return '#0EA5E9';
  return '#075985';
}

const LAYER_OPTIONS: MapLayerOption[] = [
  { key: 'alerts', label: 'Alerts', available: true },
  { key: 'rainfall', label: 'Rainfall', available: true },
  { key: 'roads', label: 'Roads', available: false },
  { key: 'tourism', label: 'Tourism', available: false },
  { key: 'migration', label: 'Migration', available: false },
];

function buildMarkers(
  layer: string,
  districts: DistrictSummary[],
  alerts: Alert[] | undefined,
  stations: ReturnType<typeof useWeatherStations>['data'],
): { markers: MapMarker[]; legend: MapLegendItem[] } {
  const withCentroid = districts.filter((d) => d.centroid !== null);

  if (layer === 'alerts') {
    const worstByArea = new Map<string, Alert['severity']>();
    for (const alert of alerts ?? []) {
      for (const area of alert.areas) {
        const current = worstByArea.get(area.slug);
        if (current === undefined || SEVERITY_RANK[alert.severity] > SEVERITY_RANK[current]) {
          worstByArea.set(area.slug, alert.severity);
        }
      }
    }

    const markers = withCentroid.map((d) => {
      const severity = worstByArea.get(d.slug);
      return {
        slug: d.slug,
        name: d.name,
        lat: d.centroid!.lat,
        lng: d.centroid!.lng,
        color: severity ? ALERT_SEVERITY_COLOR[severity] : NEUTRAL,
        detail: severity ? `Active alert — ${severity}` : 'No active alerts',
      };
    });

    return {
      markers,
      legend: [
        { label: 'Extreme', color: ALERT_SEVERITY_COLOR.extreme },
        { label: 'Severe', color: ALERT_SEVERITY_COLOR.severe },
        { label: 'Moderate', color: ALERT_SEVERITY_COLOR.moderate },
        { label: 'Minor', color: ALERT_SEVERITY_COLOR.minor },
        { label: 'No active alerts', color: NEUTRAL },
      ],
    };
  }

  if (layer === 'rainfall') {
    const maxRainfallByDistrict = new Map<string, number>();
    for (const station of stations ?? []) {
      if (station.latest.rainfallMm === null) continue;
      const current = maxRainfallByDistrict.get(station.district.slug);
      if (current === undefined || station.latest.rainfallMm > current) {
        maxRainfallByDistrict.set(station.district.slug, station.latest.rainfallMm);
      }
    }

    const markers = withCentroid.map((d) => {
      const mm = maxRainfallByDistrict.get(d.slug);
      return {
        slug: d.slug,
        name: d.name,
        lat: d.centroid!.lat,
        lng: d.centroid!.lng,
        color: mm !== undefined ? rainfallColor(mm) : NEUTRAL,
        detail: mm !== undefined ? `${mm}mm rainfall` : 'No weather station data',
      };
    });

    return {
      markers,
      legend: [
        { label: '0mm', color: rainfallColor(0) },
        { label: '< 5mm', color: rainfallColor(1) },
        { label: '5–20mm', color: rainfallColor(10) },
        { label: '20mm+', color: rainfallColor(25) },
        { label: 'No station data', color: NEUTRAL },
      ],
    };
  }

  // Unavailable layers (roads, tourism, migration): every district neutral, no source yet.
  return {
    markers: withCentroid.map((d) => ({
      slug: d.slug,
      name: d.name,
      lat: d.centroid!.lat,
      lng: d.centroid!.lng,
      color: NEUTRAL,
      detail: 'No verified data source yet',
    })),
    legend: [{ label: 'No verified data source yet', color: NEUTRAL }],
  };
}

export function InteractiveMapSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeLayer = searchParams.get('layer') ?? 'alerts';

  const districtsQuery = useDistricts();
  const alertsQuery = useActiveAlerts(undefined, 100);
  const stationsQuery = useWeatherStations();

  const setLayer = useCallback(
    (key: string) => {
      const next = new URLSearchParams(searchParams);
      next.set('layer', key);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const { markers, legend } = useMemo(
    () =>
      buildMarkers(activeLayer, districtsQuery.data ?? [], alertsQuery.data?.data, stationsQuery.data),
    [activeLayer, districtsQuery.data, alertsQuery.data, stationsQuery.data],
  );

  if (districtsQuery.isPending) {
    return <div className="h-96 md:h-[500px] lg:h-[600px] rounded-lg bg-surface-hover animate-pulse" />;
  }

  if (districtsQuery.isError) {
    return (
      <div className="h-96 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg text-red-700">
        Unable to load the district map.
      </div>
    );
  }

  return (
    <InteractiveMap
      markers={markers}
      legend={legend}
      layers={LAYER_OPTIONS}
      activeLayer={activeLayer}
      onLayerChange={setLayer}
      clickable
    />
  );
}
