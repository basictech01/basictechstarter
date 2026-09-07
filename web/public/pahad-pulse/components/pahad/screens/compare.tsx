'use client'

import { useState } from 'react'
import { Card, Bar, Source } from '@/components/pahad/ui'
import { DISTRICTS, type District, fmt, money } from '@/lib/pahad-data'

type MetricKey = 'pop' | 'lit' | 'pci' | 'net' | 'mig' | 'ghosts' | 'tourists' | 'alerts'
const METRICS: { key: MetricKey; label: string; color: string; fmt: (d: District) => string }[] = [
  { key: 'pop', label: 'Population', color: '#17372E', fmt: (d) => fmt(d.pop) },
  { key: 'lit', label: 'Literacy %', color: '#E4681F', fmt: (d) => `${d.lit}%` },
  { key: 'pci', label: 'Per-capita income', color: '#2F7A3E', fmt: (d) => money(d.pci) },
  { key: 'net', label: 'Connectivity %', color: '#1D6A8A', fmt: (d) => `${d.net}%` },
  { key: 'mig', label: 'Out-migration %', color: '#4F4C8F', fmt: (d) => `${d.mig}%` },
  { key: 'ghosts', label: 'Ghost villages', color: '#8A1C1C', fmt: (d) => `${d.ghosts}` },
  { key: 'tourists', label: 'Tourist load %', color: '#A8480F', fmt: (d) => `${d.tourists}%` },
  { key: 'alerts', label: 'Active alerts', color: '#C2410C', fmt: (d) => `${d.alerts}` },
]

export default function CompareScreen() {
  const [metric, setMetric] = useState<MetricKey>('mig')
  const m = METRICS.find((x) => x.key === metric)!
  const ranked = [...DISTRICTS].sort((a, b) => (b[metric] as number) - (a[metric] as number))
  const max = Math.max(...ranked.map((d) => d[metric] as number))

  const [a, setA] = useState('chamoli')
  const [b, setB] = useState('dehradun')
  const da = DISTRICTS.find((d) => d.id === a)!
  const db = DISTRICTS.find((d) => d.id === b)!

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginRight: 'auto' }}>Ranking by metric · जिलों की तुलना</div>
          {METRICS.map((x) => {
            const on = x.key === metric
            return (
              <button
                key={x.key}
                onClick={() => setMetric(x.key)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  fontSize: 11.5,
                  fontWeight: on ? 600 : 500,
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: `1px solid ${on ? x.color : 'rgba(20,32,28,.16)'}`,
                  background: on ? x.color : 'rgba(255,255,255,.7)',
                  color: on ? '#FAF8F4' : 'rgba(20,32,28,.7)',
                }}
              >
                {x.label}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {ranked.map((d) => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 130, fontSize: 12.5, flex: 'none' }}>{d.name}</div>
              <div style={{ flex: 1 }}>
                <Bar pct={((d[metric] as number) / max) * 100} color={m.color} h={16} />
              </div>
              <div style={{ width: 92, textAlign: 'right', fontFamily: 'var(--font-plex-mono), monospace', fontSize: 12, fontWeight: 500, flex: 'none' }}>
                {m.fmt(d)}
              </div>
            </div>
          ))}
        </div>
        <Source>Source: Census 2011 · Palayan Aayog · State connectivity survey 2023</Source>
      </Card>

      <Card style={{ padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Head to head · आमने-सामने</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            { d: da, set: setA, side: 'A', c: '#17372E' },
            { d: db, set: setB, side: 'B', c: '#E4681F' },
          ].map(({ d, set, side, c }) => (
            <div key={side}>
              <select
                value={d.id}
                onChange={(e) => set(e.target.value)}
                className="pp-focus"
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  borderRadius: 8,
                  border: `1px solid ${c}`,
                  background: 'rgba(255,255,255,.8)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: c,
                  marginBottom: 14,
                }}
              >
                {DISTRICTS.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
              {METRICS.map((x) => (
                <div
                  key={x.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px dashed rgba(20,32,28,.12)',
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ color: 'rgba(20,32,28,.65)' }}>{x.label}</span>
                  <span style={{ fontFamily: 'var(--font-plex-mono), monospace', fontWeight: 500 }}>{x.fmt(d)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
