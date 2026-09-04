'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';

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
        const circle = L.circleMarker([marker.lat, marker.lng], {
          radius: 12,
          weight: 2,
          color: '#10241D',
          fillColor: marker.color,
          fillOpacity: 0.85,
        });

        circle.bindPopup(
          `<div class="map-popup"><strong>${marker.name.en}</strong><br/><em>${marker.name.hi}</em><br/><span>${marker.detail}</span></div>`,
        );

        if (clickable) {
          circle.on('click', () => router.push(`/districts/${marker.slug}`));
          circle.on('mouseover', () => circle.setStyle({ weight: 3, fillOpacity: 1 }));
          circle.on('mouseout', () => circle.setStyle({ weight: 2, fillOpacity: 0.85 }));
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
    <div className="map-wrapper relative w-full">
      <div className="flex items-center gap-2 flex-wrap mb-3" role="group" aria-label="Map layer">
        {layers.map((layerOption) => (
          <button
            key={layerOption.key}
            type="button"
            disabled={!layerOption.available}
            aria-pressed={activeLayer === layerOption.key}
            title={layerOption.available ? undefined : 'No verified data source yet'}
            onClick={() => onLayerChange(layerOption.key)}
            className="font-mono text-xs px-3 py-1 rounded border transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: activeLayer === layerOption.key ? '#E4681F' : '#F3F4F6',
              color: activeLayer === layerOption.key ? '#FFFFFF' : '#374151',
              borderColor: activeLayer === layerOption.key ? '#E4681F' : '#E5E7EB',
            }}
          >
            {layerOption.label}
            {!layerOption.available && ' (soon)'}
          </button>
        ))}
      </div>

      <div
        ref={mapContainer}
        className="map-container h-96 md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden"
        style={{ border: '1px solid #D4CCBE' }}
        role="img"
        aria-label="Map of Uttarakhand districts"
      />

      <div className="map-legend absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm z-[400]">
        <div className="legend-title">Legend</div>
        <div className="legend-items">
          {legend.map((item) => (
            <div key={item.label} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: item.color }} />
              <span className="legend-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
