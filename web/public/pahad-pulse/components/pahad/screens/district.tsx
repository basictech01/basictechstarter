'use client'

import UKMap from '@/components/pahad/uk-map'
import { Card, Bar, DashRow, Source } from '@/components/pahad/ui'
import { DISTRICTS, districtById, fmt, money, type MapLayer } from '@/lib/pahad-data'

export default function DistrictScreen({
  districtId,
  onSelectDistrict,
}: {
  districtId: string
  onSelectDistrict: (id: string) => void
}) {
  const d = districtById(districtId)
  const layer: MapLayer = 'alerts'

  const services = [
    { k: 'Health facilities', v: d.health, max: 400, c: '#17372E' },
    { k: 'Schools', v: d.schools, max: 2700, c: '#4F4C8F' },
    { k: 'Net connectivity', v: d.net, max: 40, c: '#1D6A8A', suffix: '%' },
    { k: 'Literacy', v: d.lit, max: 100, c: '#E4681F', suffix: '%' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* district selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {DISTRICTS.map((x) => {
          const on = x.id === d.id
          return (
            <button
              key={x.id}
              onClick={() => onSelectDistrict(x.id)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '7px 13px',
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: on ? 600 : 500,
                border: `1px solid ${on ? '#17372E' : 'rgba(20,32,28,.16)'}`,
                background: on ? '#17372E' : 'rgba(255,255,255,.7)',
                color: on ? '#FAF8F4' : 'rgba(20,32,28,.75)',
              }}
            >
              {x.name}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 16, alignItems: 'start' }}>
        {/* profile + map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 30, fontWeight: 700, lineHeight: 1 }}>{d.name}</div>
            <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 18, color: '#A8480F', fontWeight: 600, marginBottom: 12 }}>
              {d.hi}
            </div>
            <DashRow k="Population (2011)" v={fmt(d.pop)} />
            <DashRow k="Literacy rate" v={`${d.lit}%`} />
            <DashRow k="Per-capita income" v={money(d.pci)} />
            <DashRow k="Primary industry" v={d.ind} />
            <Source>Source: Census 2011 · State Domestic Product estimates 2022-23</Source>
          </Card>

          <Card style={{ overflow: 'hidden' }}>
            <div style={{ padding: '11px 14px', borderBottom: '1px solid rgba(20,32,28,.1)', fontSize: 12.5, fontWeight: 600 }}>
              Location in state
            </div>
            <UKMap layer={layer} selected={d.id} height={230} onSelect={onSelectDistrict} />
          </Card>
        </div>

        {/* metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { kicker: 'Active alerts', v: d.alerts, sub: 'across all categories', color: d.alerts >= 4 ? '#8A1C1C' : '#A8480F' },
              { kicker: 'Roads closed', v: d.closed, sub: 'blocked stretches now', color: '#8A1C1C' },
              { kicker: 'Tourist load', v: `${d.tourists}%`, sub: 'of seasonal capacity', color: '#E4681F' },
            ].map((c) => (
              <Card key={c.kicker} style={{ padding: 16 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-plex-mono), monospace',
                    fontSize: 10,
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(20,32,28,.55)',
                  }}
                >
                  {c.kicker}
                </div>
                <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 32, fontWeight: 600, color: c.color, lineHeight: 1.1 }}>
                  {c.v}
                </div>
                <div style={{ fontSize: 11.5, color: 'rgba(20,32,28,.55)' }}>{c.sub}</div>
              </Card>
            ))}
          </div>

          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Services &amp; development · सेवाएँ</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              {services.map((s) => (
                <div key={s.k}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
                    <span style={{ color: 'rgba(20,32,28,.72)' }}>{s.k}</span>
                    <span style={{ fontFamily: 'var(--font-plex-mono), monospace', fontWeight: 500 }}>
                      {s.v}
                      {s.suffix || ''}
                    </span>
                  </div>
                  <Bar pct={Math.min(100, (s.v / s.max) * 100)} color={s.c} />
                </div>
              ))}
            </div>
            <Source>Source: District statistical handbook · NIC connectivity survey 2023</Source>
          </Card>

          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Migration &amp; ghost villages · पलायन</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 30, fontWeight: 600, color: '#4F4C8F' }}>{d.mig}%</div>
                <div style={{ fontSize: 12, color: 'rgba(20,32,28,.6)' }}>households reporting out-migration</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 30, fontWeight: 600, color: '#8A1C1C' }}>{d.ghosts}</div>
                <div style={{ fontSize: 12, color: 'rgba(20,32,28,.6)' }}>fully depopulated (ghost) villages</div>
              </div>
            </div>
            <Source>Source: Rural Development &amp; Migration Commission (Palayan Aayog), Pauri</Source>
          </Card>
        </div>
      </div>
    </div>
  )
}
