'use client'

import { Card, Bar, Source } from '@/components/pahad/ui'
import { DISTRICTS } from '@/lib/pahad-data'

const BLOCKS = [
  { road: 'NH-7 (Rishikesh–Badrinath)', at: 'Sirobagad, Rudraprayag', cause: 'Debris slide', status: 'Blocked', c: '#8A1C1C' },
  { road: 'NH-94 (Gangotri highway)', at: 'Bhatwari, Uttarkashi', cause: 'Landslide', status: 'Single lane', c: '#C2410C' },
  { road: 'NH-9 (Almora–Pithoragarh)', at: 'Ghat, Pithoragarh', cause: 'Road sinking', status: 'Restricted', c: '#C2410C' },
  { road: 'Yamunotri approach', at: 'Janki Chatti', cause: 'Snow', status: 'Closed', c: '#8A1C1C' },
  { road: 'SH-9 (Lansdowne link)', at: 'Kotdwar side', cause: 'Boulder fall', status: 'Blocked', c: '#8A1C1C' },
  { road: 'Munsyari–Milam trek road', at: 'Lilam', cause: 'Flash flood damage', status: 'Closed', c: '#8A1C1C' },
]

export default function RoadsScreen() {
  const byClosed = [...DISTRICTS].sort((a, b) => b.closed - a.closed)
  const maxClosed = Math.max(...DISTRICTS.map((d) => d.closed))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[
          { k: 'Roads affected', v: '38', c: '#8A1C1C' },
          { k: 'National highways', v: '6', c: '#C2410C' },
          { k: 'Fully closed', v: '14', c: '#8A1C1C' },
          { k: 'Under clearance', v: '24', c: '#A8480F' },
        ].map((c) => (
          <Card key={c.k} style={{ padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(20,32,28,.55)' }}>
              {c.k}
            </div>
            <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 30, fontWeight: 600, color: c.c, lineHeight: 1.2 }}>{c.v}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
        <Card style={{ overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid rgba(20,32,28,.1)', fontSize: 13, fontWeight: 600 }}>
            Major blockages · मार्ग अवरोध
          </div>
          {BLOCKS.map((b) => (
            <div key={b.road} style={{ display: 'flex', gap: 12, padding: '14px 16px', borderBottom: '1px solid rgba(20,32,28,.08)' }}>
              <span style={{ width: 4, alignSelf: 'stretch', borderRadius: 4, background: b.c, flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{b.road}</div>
                <div style={{ fontSize: 12, color: 'rgba(20,32,28,.6)' }}>{b.at} · {b.cause}</div>
              </div>
              <span style={{ alignSelf: 'center', fontFamily: 'var(--font-plex-mono), monospace', fontSize: 11, color: b.c, background: `${b.c}18`, padding: '3px 9px', borderRadius: 6, flex: 'none' }}>
                {b.status}
              </span>
            </div>
          ))}
          <Source>
            <span style={{ padding: '10px 16px', display: 'block' }}>Source: PWD Uttarakhand · BRO · District Disaster Management authorities</span>
          </Source>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Closures by district</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {byClosed.map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 92, fontSize: 12, flex: 'none' }}>{d.name}</div>
                <div style={{ flex: 1 }}>
                  <Bar pct={maxClosed ? (d.closed / maxClosed) * 100 : 0} color="#8A1C1C" h={12} />
                </div>
                <div style={{ width: 18, textAlign: 'right', fontFamily: 'var(--font-plex-mono), monospace', fontSize: 12, flex: 'none' }}>{d.closed}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
