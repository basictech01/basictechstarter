'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface MapProps {
  layer?: 'alerts' | 'roads' | 'tourism' | 'rainfall' | 'migration' | 'population';
  clickable?: boolean;
}

const districtData = [
  { id: 1, name: 'Uttarkashi', nameHi: 'उत्तरकाशी', slug: 'uttarkashi' },
  { id: 2, name: 'Chamoli', nameHi: 'चमोली', slug: 'chamoli' },
  { id: 3, name: 'Rudraprayag', nameHi: 'रुद्रप्रयाग', slug: 'rudraprayag' },
  { id: 4, name: 'Pauri Garhwal', nameHi: 'पौड़ी गढ़वाल', slug: 'pauri-garhwal' },
  { id: 5, name: 'Tehri Garhwal', nameHi: 'टेहरी गढ़वाल', slug: 'tehri-garhwal' },
  { id: 6, name: 'Dehradun', nameHi: 'देहरादून', slug: 'dehradun' },
  { id: 7, name: 'Almora', nameHi: 'अल्मोड़ा', slug: 'almora' },
  { id: 8, name: 'Bageshwar', nameHi: 'बागेश्वर', slug: 'bageshwar' },
  { id: 9, name: 'Nainital', nameHi: 'नैनीताल', slug: 'nainital' },
  { id: 10, name: 'Pithoragarh', nameHi: 'पिथौरागढ़', slug: 'pithoragarh' },
  { id: 11, name: 'Champawat', nameHi: 'चम्पावत', slug: 'champawat' },
];

const layerColors: { [key: string]: { [key: string]: string } } = {
  alerts: { high: '#991B1B', medium: '#DC2626', low: '#FCA5A5' },
  roads: { clear: '#10B981', caution: '#FBBF24', closed: '#EF4444' },
  tourism: { high: '#E4681F', medium: '#FFA500', low: '#FFD700' },
  rainfall: { high: '#0369A1', medium: '#0EA5E9', low: '#BAE6FD' },
  migration: { high: '#7F1D1D', medium: '#DC2626', low: '#FECACA' },
  population: { high: '#000000', medium: '#4B5563', low: '#D1D5DB' },
};

const mockDistrictData: { [key: string]: string } = {
  Uttarkashi: 'high',
  Chamoli: 'high',
  Rudraprayag: 'medium',
  'Pauri Garhwal': 'low',
  'Tehri Garhwal': 'medium',
  Dehradun: 'high',
  Almora: 'low',
  Bageshwar: 'low',
  Nainital: 'high',
  Pithoragarh: 'low',
  Champawat: 'medium',
};

const districtBoundaries = {
  Uttarkashi: { center: [30.7, 78.8], bounds: [[30.3, 78.5], [31.2, 79.2]] },
  Chamoli: { center: [30.2, 79.6], bounds: [[30.0, 79.2], [30.8, 80.2]] },
  Rudraprayag: { center: [30.3, 79.2], bounds: [[30.0, 78.8], [30.6, 79.6]] },
  'Pauri Garhwal': { center: [30.1, 78.6], bounds: [[29.6, 78.2], [30.6, 79.0]] },
  'Tehri Garhwal': { center: [30.4, 78.4], bounds: [[30.0, 78.0], [30.8, 78.8]] },
  Dehradun: { center: [30.1, 78.1], bounds: [[29.6, 77.6], [30.6, 78.6]] },
  Almora: { center: [29.6, 79.8], bounds: [[29.2, 79.4], [30.0, 80.2]] },
  Bageshwar: { center: [29.9, 80.2], bounds: [[29.6, 79.8], [30.2, 80.6]] },
  Nainital: { center: [29.4, 79.4], bounds: [[29.0, 79.0], [29.8, 79.8]] },
  Pithoragarh: { center: [29.6, 80.4], bounds: [[29.2, 80.0], [30.0, 80.8]] },
  Champawat: { center: [29.8, 80.6], bounds: [[29.4, 80.2], [30.2, 81.0]] },
};

export function InteractiveMap({ layer = 'alerts', clickable = false }: MapProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const initMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      mapRef.current = L.map(mapContainer.current!).setView([29.8, 79.2], 8);

      const bounds = L.latLngBounds([28.6, 77.3], [31.3, 81.2]);
      mapRef.current.setMaxBounds(bounds);
      mapRef.current.fitBounds(bounds);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        opacity: 0.2,
      }).addTo(mapRef.current);

      addDistrictPolygons(mapRef.current, L);
    };

    initMap().catch(console.error);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const geoJsonLayers = (mapRef.current as any)._layers;
    Object.values(geoJsonLayers).forEach((lyr: any) => {
      if (lyr.setStyle && lyr.feature) {
        const districtName = lyr.feature.properties?.name_en || '';
        const color = getColorForDistrict(districtName);
        lyr.setStyle({ fillColor: color, color: '#10241D', weight: 2 });
      }
    });
  }, [layer]);

  const getColorForDistrict = (districtName: string): string => {
    const colors = layerColors[layer];
    const intensity = mockDistrictData[districtName] || 'low';
    return colors[intensity] || '#CCCCCC';
  };

  const addDistrictPolygons = (map: any, L: any) => {
    districtData.forEach((district) => {
      const boundary = districtBoundaries[district.name as keyof typeof districtBoundaries];
      if (!boundary) return;

      const polygon = L.rectangle(
        [[boundary.bounds[0][0], boundary.bounds[0][1]], [boundary.bounds[1][0], boundary.bounds[1][1]]],
        {
          fillColor: getColorForDistrict(district.name),
          weight: 2,
          opacity: 1,
          color: '#10241D',
          fillOpacity: 0.7,
        }
      );

      polygon.on('click', () => {
        if (clickable) {
          router.push(`/districts/${district.slug}`);
        }
      });

      polygon.on('mouseover', function (this: any) {
        this.setStyle({
          weight: 3,
          opacity: 1,
          fillOpacity: 0.9,
        });
        if (clickable) {
          const container = (polygon as any)._container;
          if (container) container.style.cursor = 'pointer';
        }
      });

      polygon.on('mouseout', function (this: any) {
        this.setStyle({
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7,
        });
        if (clickable) {
          const container = (polygon as any)._container;
          if (container) container.style.cursor = 'default';
        }
      });

      const popup = L.popup().setContent(
        `<div class="p-2">
          <strong>${district.name}</strong><br>
          <em class="text-sm">${district.nameHi}</em><br>
          <span class="text-xs">Click to view details</span>
        </div>`
      );

      polygon.bindPopup(popup);
      polygon.addTo(map);
    });
  };

  return (
    <div className="map-wrapper relative w-full">
      <div ref={mapContainer} className="map-container h-96 md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden border border-border-color" />
      <div className="map-legend absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm z-400">
        <div className="font-semibold mb-2">Layer: {layer}</div>
        <div className="space-y-1">
          {Object.entries(layerColors[layer] || {}).map(([intensity, color]) => (
            <div key={intensity} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs capitalize">{intensity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
