'use client'

import { Card, Bar, Source } from '@/components/pahad/ui'
import { DISTRICTS } from '@/lib/pahad-data'

const RIVERS = [
  { name: 'Alaknanda', place: 'Srinagar', level: 535.6, warn: 535.0, danger: 536.0, status: 'Warning' },
  { name: 'Bhagirathi', place: 'Uttarkashi', level: 1122.4, warn: 1123.0, danger: 1124.5, status: 'Normal' },
  { name: 'Ganga', place: 'Haridwar', level: 293.2, warn: 293.8, danger: 294.5, status: 'Normal' },
  { name: 'Kali', place: 'Dharchula', level: 889.7, warn: 889.0, danger: 890.5, status: 'Warning' },
  { name: 'Mandakini', place: 'Rudraprayag', level: 621.1, warn: 621.5, danger: 622.5, status: 'Normal' },
  { name: 'Sharda', place: 'Banbasa', level: 217.4, warn: 218.0, danger: 219.0, status: 'Normal' },
]

const STATUS_C: Record<string, string> = { Warning: '#C2410C', Danger: '#8A1C1C', Normal: '#2F7A3E' }

export default function WeatherScreen() {
  const byRain = [...DISTRICTS].sort((a, b) => b.rain - a.rain)
  const maxRain = Math.max(...DISTRICTS.map((d) => d.rain))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ padding: '13px 16px', borderBottom: '1px solid rgba(20,32,28,.1)', fontSize: 13, fontWeight: 600 }}>
          River levels · नदी जलस्तर
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
          {RIVERS.map((r) => {
            const range = r.danger - (r.warn - 1.5)
            const pct = Math.max(6, Math.min(100, ((r.level - (r.warn - 1.5)) / range) * 100))
            const c = STATUS_C[r.status]
            return (
              <div key={r.name} style={{ padding: 18, borderRight: '1px solid rgba(20,32,28,.08)', borderBottom: '1px solid rgba(20,32,28,.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600 }}>{r.name}</span>
                  <span style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: 10.5, color: c, background: `${c}18`, padding: '2px 7px', borderRadius: 5 }}>
                    {r.status}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(20,32,28,.55)', marginBottom: 10 }}>{r.place}</div>
                <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 24, fontWeight: 600, color: c }}>
                  {r.level} <span style={{ fontSize: 13, color: 'rgba(20,32,28,.5)' }}>m</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Bar pct={pct} color={c} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-plex-mono), monospace', fontSize: 10, color: 'rgba(20,32,28,.5)', marginTop: 5 }}>
                  <span>warn {r.warn}</span>
                  <span>danger {r.danger}</span>
                </div>
              </div>
            )
          })}
        </div>
        <Source>
          <span style={{ padding: '0 16px 12px', display: 'block' }}>Source: Central Water Commission flood forecasting network</span>
        </Source>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Rainfall last 24h by district</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {byRain.map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 130, fontSize: 12.5, flex: 'none' }}>{d.name}</div>
                <div style={{ flex: 1 }}>
                  <Bar pct={(d.rain / maxRain) * 100} color="#4F4C8F" h={14} />
                </div>
                <div style={{ width: 56, textAlign: 'right', fontFamily: 'var(--font-plex-mono), monospace', fontSize: 12, flex: 'none' }}>{d.rain} mm</div>
              </div>
            ))}
          </div>
          <Source>Source: IMD Dehradun automatic weather stations</Source>
        </Card>

        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Active warnings</div>
          {[
            ['Orange', 'Chamoli, Rudraprayag', '#C2410C'],
            ['Yellow', 'Uttarkashi, Pithoragarh', '#B7791F'],
            ['Thunderstorm', 'Nainital, Almora', '#4F4C8F'],
          ].map(([lvl, area, c]) => (
            <div key={lvl} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px dashed rgba(20,32,28,.12)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: c, marginTop: 4, flex: 'none' }} />
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{lvl} alert</div>
                <div style={{ fontSize: 11.5, color: 'rgba(20,32,28,.6)' }}>{area}</div>
              </div>
            </div>
          ))}
          <Source>Source: IMD colour-coded impact-based forecast</Source>
        </Card>
      </div>
    </div>
  )
}
