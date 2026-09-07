'use client'

import UKMap from '@/components/pahad/uk-map'
import { Card, CARD } from '@/components/pahad/ui'
import {
  DISTRICTS,
  LAYER_LABELS,
  type MapLayer,
  type ScreenId,
  pill,
} from '@/lib/pahad-data'

const COUNTERS = [
  { kicker: 'Live tourism', value: '41,280', label: 'Tourists in Uttarakhand now', sub: 'Char Dham routes carrying 63% of movement', color: '#E4681F' },
  { kicker: 'Live alerts', value: '26', label: 'Active alerts statewide', sub: '9 weather · 11 road · 4 river · 2 disaster', color: '#C2410C' },
  { kicker: 'Road status', value: '38', label: 'Roads closed or blocked', sub: '6 national highway stretches affected', color: '#8A1C1C' },
  { kicker: 'Connectivity', value: '71%', label: 'Habitations with usable data', sub: 'Lowest in Chamoli and Uttarkashi', color: '#17372E' },
]

const STATE_STATS = [
  { k: 'Population (2011)', v: '1,00,86,292' },
  { k: 'Geographical area', v: '53,483 km²' },
  { k: 'Literacy rate', v: '78.8%' },
  { k: 'Districts', v: '13' },
  { k: 'Forest cover', v: '45.4% of area' },
  { k: 'Villages', v: '16,793' },
]

const QUICK: [string, ScreenId][] = [
  ['Live alerts', 'alerts'],
  ['District dashboard', 'district'],
  ['District comparison', 'compare'],
  ['Migration tracker', 'migration'],
  ['Tourism live', 'tourism'],
  ['Weather & rivers', 'weather'],
  ['Traffic & roads', 'roads'],
  ['Speed & connectivity', 'net'],
  ['Offline mode', 'offline'],
]

export default function HomeScreen({
  layer,
  districtId,
  onLayer,
  onSelectDistrict,
  onNavigate,
}: {
  layer: MapLayer
  districtId: string
  onLayer: (l: MapLayer) => void
  onSelectDistrict: (id: string) => void
  onNavigate: (id: ScreenId) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {COUNTERS.map((c) => (
          <Card key={c.kicker} style={{ padding: '18px 18px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.color }} />
              <span
                style={{
                  fontFamily: 'var(--font-plex-mono), monospace',
                  fontSize: 10,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(20,32,28,.55)',
                }}
              >
                {c.kicker}
              </span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-anek), sans-serif',
                fontSize: 38,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: '-.01em',
                color: c.color,
              }}
            >
              {c.value}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: 'rgba(20,32,28,.55)', marginTop: 3, lineHeight: 1.4 }}>{c.sub}</div>
          </Card>
        ))}
      </div>

      {/* map + right column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
        <Card style={{ overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '13px 16px',
              borderBottom: '1px solid rgba(20,32,28,.1)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginRight: 'auto' }}>
              Interactive state map ·{' '}
              <span style={{ fontFamily: 'var(--font-anek), sans-serif', color: 'rgba(20,32,28,.55)', fontWeight: 500 }}>
                जिलेवार नक्शा
              </span>
            </div>
            {(Object.keys(LAYER_LABELS) as MapLayer[]).map((k) => {
              const p = pill(layer === k, '#17372E')
              return (
                <button
                  key={k}
                  onClick={() => onLayer(k)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-plex-mono), monospace',
                    fontSize: 10.5,
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                    padding: '5px 10px',
                    borderRadius: 6,
                    border: `1px solid ${p.border}`,
                    background: p.bg,
                    color: p.fg,
                  }}
                >
                  {LAYER_LABELS[k]}
                </button>
              )
            })}
          </div>
          <UKMap layer={layer} selected={districtId} height={470} onSelect={onSelectDistrict} />
          <div
            style={{
              padding: '10px 16px',
              borderTop: '1px solid rgba(20,32,28,.1)',
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              fontFamily: 'var(--font-plex-mono), monospace',
              fontSize: 10.5,
              color: 'rgba(20,32,28,.55)',
            }}
          >
            <span>Click any district to open its dashboard</span>
            <span style={{ marginLeft: 'auto' }}>Layer: {LAYER_LABELS[layer]}</span>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 18 }}>
            <div
              style={{
                fontFamily: 'var(--font-plex-mono), monospace',
                fontSize: 10,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: 'rgba(20,32,28,.5)',
                marginBottom: 14,
              }}
            >
              State overview · राज्य
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {STATE_STATS.map((s) => (
                <div
                  key={s.k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 10,
                    paddingBottom: 9,
                    borderBottom: '1px dashed rgba(20,32,28,.14)',
                  }}
                >
                  <span style={{ fontSize: 12.5, color: 'rgba(20,32,28,.7)' }}>{s.k}</span>
                  <span style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: 13, fontWeight: 500, textAlign: 'right' }}>
                    {s.v}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-plex-mono), monospace',
                fontSize: 10,
                color: 'rgba(20,32,28,.45)',
                marginTop: 12,
                lineHeight: 1.5,
              }}
            >
              Source: Census of India 2011 · Directorate of Economics &amp; Statistics, Uttarakhand
            </div>
          </Card>

          <div style={{ ...CARD, padding: 18, background: 'rgba(23,55,46,.05)' }}>
            <div
              style={{
                fontFamily: 'var(--font-plex-mono), monospace',
                fontSize: 10,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: 'rgba(20,32,28,.5)',
                marginBottom: 12,
              }}
            >
              Quick access · त्वरित पहुँच
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              {QUICK.map(([label, id]) => (
                <button
                  key={label}
                  onClick={() => onNavigate(id)}
                  className="pp-quick"
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '10px 11px',
                    borderRadius: 9,
                    border: '1px solid rgba(20,32,28,.14)',
                    background: 'rgba(255,255,255,.75)',
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* districts at a glance */}
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ padding: '13px 16px', borderBottom: '1px solid rgba(20,32,28,.1)', fontSize: 13, fontWeight: 600 }}>
          Districts at a glance ·{' '}
          <span style={{ fontFamily: 'var(--font-anek), sans-serif', color: 'rgba(20,32,28,.55)', fontWeight: 500 }}>तेरह जिले</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(196px,1fr))' }}>
          {DISTRICTS.map((d) => {
            const alertFg = d.alerts >= 4 ? '#8A1C1C' : d.alerts >= 2 ? '#A8480F' : '#17372E'
            const alertBg = d.alerts >= 4 ? 'rgba(138,28,28,.1)' : d.alerts >= 2 ? 'rgba(228,104,31,.12)' : 'rgba(23,55,46,.08)'
            return (
              <button
                key={d.id}
                onClick={() => onSelectDistrict(d.id)}
                className="pp-district-card"
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '14px 16px',
                  borderRight: '1px solid rgba(20,32,28,.08)',
                  borderBottom: '1px solid rgba(20,32,28,.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{d.name}</div>
                <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 12.5, color: 'rgba(20,32,28,.5)' }}>{d.hi}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 7, fontFamily: 'var(--font-plex-mono), monospace', fontSize: 10.5 }}>
                  <span style={{ color: alertFg, background: alertBg, padding: '2px 6px', borderRadius: 4 }}>{d.alerts} alerts</span>
                  <span style={{ color: 'rgba(20,32,28,.55)' }}>{(d.pop / 100000).toFixed(1)}L people</span>
                </div>
              </button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
