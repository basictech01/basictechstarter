'use client'

import { useState } from 'react'
import { Card, Source } from '@/components/pahad/ui'
import { ALERTS, ALERT_KIND, type AlertKind } from '@/lib/pahad-data'

const FILTERS: { id: AlertKind | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'weather', label: 'Weather' },
  { id: 'road', label: 'Road' },
  { id: 'river', label: 'River' },
  { id: 'disaster', label: 'Disaster' },
]

export default function AlertsScreen() {
  const [filter, setFilter] = useState<AlertKind | 'all'>('all')
  const list = ALERTS.filter((a) => filter === 'all' || a.kind === filter)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {FILTERS.map((f) => {
            const on = filter === f.id
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 12.5,
                  fontWeight: on ? 600 : 500,
                  border: `1px solid ${on ? '#17372E' : 'rgba(20,32,28,.16)'}`,
                  background: on ? '#17372E' : 'rgba(255,255,255,.7)',
                  color: on ? '#FAF8F4' : 'rgba(20,32,28,.75)',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {list.map((a, i) => {
          const c = ALERT_KIND[a.kind]
          return (
            <Card key={i} style={{ padding: 18, borderLeft: `4px solid ${c.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-plex-mono), monospace',
                    fontSize: 10,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: 5,
                    color: c.color,
                    background: c.bg,
                  }}
                >
                  {a.kind}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: c.color }}>{a.status}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-plex-mono), monospace', fontSize: 11, color: 'rgba(20,32,28,.5)' }}>
                  {a.time}
                </span>
              </div>
              <div style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 4 }}>{a.title}</div>
              <div style={{ fontSize: 12.5, color: 'rgba(20,32,28,.55)', marginBottom: 8 }}>{a.place}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'rgba(20,32,28,.82)' }}>{a.body}</div>
              <Source>Source: {a.source}</Source>
            </Card>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Alert breakdown · वर्गीकरण</div>
          {[
            ['Weather', 9, '#4F4C8F'],
            ['Road', 11, '#8A1C1C'],
            ['River', 4, '#1D6A8A'],
            ['Disaster', 2, '#C2410C'],
          ].map(([k, v, c]) => (
            <div
              key={k as string}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '9px 0',
                borderBottom: '1px dashed rgba(20,32,28,.12)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: c as string }} />
                {k as string}
              </span>
              <span style={{ fontFamily: 'var(--font-plex-mono), monospace', fontWeight: 500 }}>{v as number}</span>
            </div>
          ))}
        </Card>

        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Get alerts on your phone</div>
          <div style={{ fontSize: 12.5, color: 'rgba(20,32,28,.65)', lineHeight: 1.5, marginBottom: 12 }}>
            Free SMS and app notifications for the districts you choose. Issued in Hindi and English.
          </div>
          <button
            className="pp-cta-orange"
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'block',
              textAlign: 'center',
              padding: '10px',
              borderRadius: 8,
              background: '#E4681F',
              color: '#FAF8F4',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Sign up for alerts
          </button>
        </Card>
      </div>
    </div>
  )
}
