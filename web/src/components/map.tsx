'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';

import { Card } from '@/components/molecules/card';
import { Kicker } from '@/components/molecules/kicker';
import { cn } from '@/lib/utils';

export interface MapMarker {
  slug: string;
  name: { en: string; hi: string };
  lat: number;
  lng: number;
  /** Resolved colour for this marker under the currently active layer. */
  color: string;
  /** Short line shown in the marker's popup, e.g. "2 active alerts (severe)". */
  detail: string;
}

export interface MapLegendItem {
  label: string;
  color: string;
}

export interface MapLayerOption {
  key: string;
  label: string;
  /** False when no backend module supplies real data for this layer yet. */
  available: boolean;
}

export interface InteractiveMapProps {
  markers: MapMarker[];
  legend: MapLegendItem[];
  layers: MapLayerOption[];
  activeLayer: string;
  onLayerChange: (key: string) => void;
  /** Clicking a marker navigates to its district page. */
  clickable?: boolean;
}

const UTTARAKHAND_BOUNDS: [[number, number], [number, number]] = [
  [28.6, 77.3],
  [31.3, 81.2],
];

export function InteractiveMap({
  markers,
  legend,
  layers,
  activeLayer,
  onLayerChange,
  clickable = false,
}: InteractiveMapProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    let cancelled = false;

    void (async () => {
      const L = await import('leaflet');
      if (cancelled || !mapContainer.current) return;

      const map = L.map(mapContainer.current).setView([29.8, 79.2], 8);
      map.setMaxBounds(L.latLngBounds(UTTARAKHAND_BOUNDS));
      map.fitBounds(L.latLngBounds(UTTARAKHAND_BOUNDS));

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        opacity: 0.5,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    let cancelled = false;

    void (async () => {
      const L = await import('leaflet');
      if (cancelled || !markersLayerRef.current) return;

      markersLayerRef.current.clearLayers();

      for (const marker of markers) {
        const baseStyle = { weight: 2, fillOpacity: 0.85 };
        const circle = L.circleMarker([marker.lat, marker.lng], {
          radius: 12,
          color: '#10241D',
          fillColor: marker.color,
          ...baseStyle,
        });

        // A hover-following tooltip rather than a click-to-open popup: `clickable` markers
        // already navigate away on click, so a popup requiring a click would never get a
        // chance to render. The tooltip previews the same content without needing a click.
        circle.bindTooltip(
          `<strong>${marker.name.en}</strong><br/><em>${marker.name.hi}</em><br/><span>${marker.detail}</span>`,
          { direction: 'top', sticky: true, opacity: 0.97 },
        );

        if (clickable) {
          circle.on('click', () => router.push(`/districts/${marker.slug}`));
          circle.on('mouseover', () => circle.setStyle({ weight: 3, fillOpacity: 1 }));
          circle.on('mouseout', () => circle.setStyle(baseStyle));
        }

        circle.addTo(markersLayerRef.current);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, clickable]);

  return (
    <div className="relative w-full">
      <div className="mb-3 flex flex-wrap items-center gap-2" role="group" aria-label="Map layer">
        {layers.map((layerOption) => {
          const isActive = activeLayer === layerOption.key;
          return (
            <button
              key={layerOption.key}
              type="button"
              disabled={!layerOption.available}
              aria-pressed={isActive}
              title={layerOption.available ? undefined : 'No verified data source yet'}
              onClick={() => onLayerChange(layerOption.key)}
              className={cn(
                'rounded-md border px-3 py-1 font-mono text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                'focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
                isActive ? 'border-accent bg-accent text-white' : 'border-border bg-surface-hover text-text-dark/70 hover:border-accent/40',
              )}
            >
              {layerOption.label}
              {!layerOption.available && ' (soon)'}
            </button>
          );
        })}
      </div>

      <div
        ref={mapContainer}
        className="h-96 overflow-hidden rounded-lg border border-border md:h-[500px] lg:h-[600px]"
        role="img"
        aria-label="Map of Uttarakhand districts"
      />

      <Card className="absolute bottom-4 left-4 z-[400] p-3 text-sm">
        <Kicker className="mb-2">Legend</Kicker>
        <div className="flex flex-col gap-1.5">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="size-3 flex-none rounded-sm" style={{ backgroundColor: item.color }} aria-hidden="true" />
              <span className="text-xs text-text-dark/70">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
