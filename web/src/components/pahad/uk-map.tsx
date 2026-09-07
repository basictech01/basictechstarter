'use client'

import { useEffect, useRef } from 'react'
import type { GeoJSON as LeafletGeoJSON, Map as LeafletMap, Path } from 'leaflet'
import { DISTRICTS, type MapLayer } from '@/lib/pahad-data'

const BY_NAME: Record<string, (typeof DISTRICTS)[number]> = {}
DISTRICTS.forEach((d) => {
  BY_NAME[d.name] = d
})

type LayerConf = { key: keyof (typeof DISTRICTS)[number]; label: string; unit: string; max: number }

const LAYERS: Record<MapLayer, LayerConf> = {
  alerts: { key: 'alerts', label: 'Active alerts', unit: '', max: 6 },
  roads: { key: 'closed', label: 'Closed / blocked roads', unit: '', max: 8 },
  tourism: { key: 'tourists', label: 'Tourist load', unit: '%', max: 100 },
  weather: { key: 'rain', label: 'Rainfall 24h', unit: 'mm', max: 150 },
  migration: { key: 'mig', label: 'Migration pressure', unit: '', max: 100 },
  population: { key: 'pop', label: 'Population 2011', unit: '', max: 1900000 },
}

const RAMP: Record<MapLayer, string[]> = {
  alerts: ['#F2E4D4', '#EFC59B', '#E79A5E', '#D9702E', '#A8480F'],
  roads: ['#F0DFDF', '#E4B2B2', '#D07E7E', '#B04545', '#8A1C1C'],
  tourism: ['#F6E7D8', '#F2CFA6', '#EDAE6E', '#E4681F', '#B44D12'],
  weather: ['#E6E5F0', '#C7C5E0', '#A3A0CD', '#7B78B8', '#4F4C8F'],
  migration: ['#EAE4F0', '#D2C4E0', '#B49FCD', '#8E76B4', '#6B4E8F'],
  population: ['#E2E8E5', '#C0D0CA', '#95AFA6', '#5C7F73', '#17372E'],
}

let geoCache: unknown = null

export default function UKMap({
  layer = 'alerts',
  selected,
  height = '100%',
  onSelect,
}: {
  layer?: MapLayer
  selected?: string
  height?: number | string
  onSelect?: (id: string) => void
}) {
  const holderRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const geoRef = useRef<LeafletGeoJSON | null>(null)
  const labelRef = useRef<import('leaflet').LayerGroup | null>(null)
  const layerRef = useRef<MapLayer>(layer)
  const selectedRef = useRef<string | undefined>(selected)
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  // boot map once
  useEffect(() => {
    let cancelled = false
    let ro: ResizeObserver | null = null

    async function boot() {
      const L = (await import('leaflet')).default
      if (cancelled || !holderRef.current || mapRef.current) return

      const map = L.map(holderRef.current, {
        center: [30.06, 79.2],
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
        zoomSnap: 0.1,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: false,
        keyboard: false,
        boxZoom: false,
        touchZoom: false,
      })
      mapRef.current = map

      if (!geoCache) {
        geoCache = await fetch('/uttarakhand-districts.geojson').then((r) => r.json())
      }
      if (cancelled) return

      const paint = () => {
        const conf = LAYERS[layerRef.current] || LAYERS.alerts
        const ramp = RAMP[layerRef.current] || RAMP.alerts
        const sel = selectedRef.current
        geoRef.current?.eachLayer((lyr) => {
          const d = (lyr as unknown as { _uk?: (typeof DISTRICTS)[number] })._uk
          if (!d) return
          const raw = d[conf.key] as number
          const t = Math.min(1, (raw || 0) / conf.max)
          ;(lyr as Path).setStyle({
            fillColor: ramp[Math.min(4, Math.round(t * 4))],
            fillOpacity: 1,
            weight: sel === d.id ? 3 : 1.2,
            color: sel === d.id ? '#14201C' : '#FAF8F4',
          })
          if (sel === d.id) (lyr as Path).bringToFront()
        })
      }

      const geo = L.geoJSON(geoCache as GeoJSON.GeoJsonObject, {
        style: () => ({ weight: 1.2, color: '#FAF8F4', fillOpacity: 1 }),
        onEachFeature: (f, lyr) => {
          const d = BY_NAME[(f.properties as { district: string }).district]
          if (!d) return
          ;(lyr as unknown as { _uk?: (typeof DISTRICTS)[number] })._uk = d
          lyr.on('click', () => onSelectRef.current?.(d.id))
          lyr.on('mouseover', () => {
            ;(lyr as Path).setStyle({ weight: 2.6, color: '#14201C' })
            ;(lyr as Path).bringToFront()
          })
          lyr.on('mouseout', () => paint())
          lyr.bindTooltip(
            () => {
              const conf = LAYERS[layerRef.current] || LAYERS.alerts
              const v = d[conf.key] as number
              return (
                '<b>' +
                d.name +
                '</b> · ' +
                d.hi +
                '<br>' +
                conf.label +
                ': ' +
                (conf.key === 'pop' ? (v / 100000).toFixed(1) + ' lakh' : v + conf.unit)
              )
            },
            { sticky: true, direction: 'top', opacity: 1 },
          )
        },
      }).addTo(map)
      geoRef.current = geo

      const labels = () => {
        const el = holderRef.current
        if (!el) return
        const wide = el.clientWidth >= 460
        if (labelRef.current) {
          map.removeLayer(labelRef.current)
          labelRef.current = null
        }
        if (!wide) return
        const group = L.layerGroup()
        geo.eachLayer((lyr) => {
          const d = (lyr as unknown as { _uk?: (typeof DISTRICTS)[number] })._uk
          if (!d) return
          L.marker((lyr as Path & { getBounds: () => import('leaflet').LatLngBounds }).getBounds().getCenter(), {
            interactive: false,
            icon: L.divIcon({
              className: '',
              iconSize: [110, 16],
              iconAnchor: [55, 8],
              html:
                '<div style="font:600 10.5px/1.1 var(--font-plex-sans),system-ui;color:#14201C;text-align:center;text-shadow:0 1px 2px rgba(255,255,255,.9),0 0 4px rgba(255,255,255,.9)">' +
                d.name +
                '</div>',
            }),
          }).addTo(group)
        })
        labelRef.current = group.addTo(map)
      }

      const fit = () => {
        const el = holderRef.current
        if (!el || el.clientWidth < 8 || el.clientHeight < 8) return
        map.invalidateSize()
        const b = geo.getBounds()
        if (b && b.isValid()) map.fitBounds(b, { padding: [12, 12] })
        labels()
      }

      // expose for attribute-style updates
      ;(map as unknown as { _ppPaint: () => void })._ppPaint = paint
      ;(map as unknown as { _ppLabels: () => void })._ppLabels = labels

      fit()
      ro = new ResizeObserver(() => fit())
      ro.observe(holderRef.current)
      paint()
      labels()
    }

    boot()

    return () => {
      cancelled = true
      ro?.disconnect()
      mapRef.current?.remove()
      mapRef.current = null
      geoRef.current = null
      labelRef.current = null
    }
  }, [])

  // repaint when layer / selection changes
  useEffect(() => {
    layerRef.current = layer
    selectedRef.current = selected
    const map = mapRef.current as unknown as { _ppPaint?: () => void } | null
    map?._ppPaint?.()
  }, [layer, selected])

  return (
    <div
      style={{ display: 'block', position: 'relative', width: '100%', height }}
      role="img"
      aria-label="Interactive district map of Uttarakhand"
    >
      <div ref={holderRef} style={{ position: 'absolute', inset: 0, background: 'transparent' }} />
    </div>
  )
}
