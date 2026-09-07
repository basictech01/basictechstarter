'use client'

import { Card, Bar, Source } from '@/components/pahad/ui'
import { DISTRICTS } from '@/lib/pahad-data'

const DHAM = [
  { name: 'Kedarnath', hi: 'केदारनाथ', load: 92, now: 9420, cap: 'Near capacity' },
  { name: 'Badrinath', hi: 'बद्रीनाथ', load: 81, now: 11260, cap: 'Heavy' },
  { name: 'Gangotri', hi: 'गंगोत्री', load: 58, now: 4180, cap: 'Moderate' },
  { name: 'Yamunotri', hi: 'यमुनोत्री', load: 44, now: 2640, cap: 'Comfortable' },
]

const SPOTS = [
  ['Nainital', 6840, '#1D6A8A'],
  ['Mussoorie', 5210, '#E4681F'],
  ['Rishikesh', 7930, '#2F7A3E'],
  ['Auli', 1420, '#4F4C8F'],
  ['Jim Corbett', 3180, '#A8480F'],
] as const

export default function TourismScreen() {
  const maxSpot = Math.max(...SPOTS.map((s) => s[1]))
  const byLoad = [...DISTRICTS].sort((a, b) => b.tourists - a.tourists).slice(0, 6)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[
          { k: 'Tourists now', v: '41,280', c: '#E4681F' },
          { k: 'Char Dham share', v: '63%', c: '#A8480F' },
          { k: 'Peak district', v: 'Rudraprayag', c: '#17372E' },
          { k: 'YTD arrivals', v: '4.6 Cr', c: '#2F7A3E' },
        ].map((c) => (
          <Card key={c.k} style={{ padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(20,32,28,.55)' }}>
              {c.k}
            </div>
            <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 26, fontWeight: 600, color: c.c, lineHeight: 1.2 }}>{c.v}</div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Char Dham live load · चार धाम</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {DHAM.map((d) => {
            const c = d.load >= 85 ? '#8A1C1C' : d.load >= 60 ? '#E4681F' : '#2F7A3E'
            return (
              <div key={d.name} style={{ border: '1px solid rgba(20,32,28,.12)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 17, fontWeight: 700 }}>{d.name}</div>
                <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 13, color: '#A8480F', marginBottom: 10 }}>{d.hi}</div>
                <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 30, fontWeight: 600, color: c, lineHeight: 1 }}>{d.load}%</div>
                <div style={{ fontSize: 11.5, color: 'rgba(20,32,28,.6)', margin: '4px 0 10px' }}>{d.cap} · {d.now.toLocaleString('en-IN')} present</div>
                <Bar pct={d.load} color={c} />
              </div>
            )
          })}
        </div>
        <Source>Source: Uttarakhand Tourism Development Board · registration gateway counts</Source>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Popular destinations today</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {SPOTS.map(([name, n, c]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 100, fontSize: 12.5, flex: 'none' }}>{name}</div>
                <div style={{ flex: 1 }}>
                  <Bar pct={(n / maxSpot) * 100} color={c} h={14} />
                </div>
                <div style={{ width: 56, textAlign: 'right', fontFamily: 'var(--font-plex-mono), monospace', fontSize: 12, flex: 'none' }}>
                  {n.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Tourist load by district</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {byLoad.map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 120, fontSize: 12.5, flex: 'none' }}>{d.name}</div>
                <div style={{ flex: 1 }}>
                  <Bar pct={d.tourists} color="#E4681F" h={14} />
                </div>
                <div style={{ width: 42, textAlign: 'right', fontFamily: 'var(--font-plex-mono), monospace', fontSize: 12, flex: 'none' }}>{d.tourists}%</div>
              </div>
            ))}
          </div>
          <Source>Percentage of seasonal carrying capacity currently in use.</Source>
        </Card>
      </div>
    </div>
  )
}
