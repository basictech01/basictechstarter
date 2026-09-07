'use client'

import { Card, Bar, Source } from '@/components/pahad/ui'
import { DISTRICTS } from '@/lib/pahad-data'

const CAUSES = [
  ['Employment', 50.16, '#4F4C8F'],
  ['Education', 15.21, '#1D6A8A'],
  ['Healthcare', 8.83, '#2F7A3E'],
  ['Poor infrastructure', 6.29, '#A8480F'],
  ['Other', 19.51, '#8A8577'],
] as const

export default function MigrationScreen() {
  const byMig = [...DISTRICTS].sort((a, b) => b.mig - a.mig)
  const byGhost = [...DISTRICTS].sort((a, b) => b.ghosts - a.ghosts)
  const totalGhost = DISTRICTS.reduce((s, d) => s + d.ghosts, 0)
  const maxGhost = Math.max(...DISTRICTS.map((d) => d.ghosts))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {[
          { kicker: 'Ghost villages', v: fmtNum(totalGhost + 1315), sub: 'fully depopulated across state', color: '#8A1C1C' },
          { kicker: 'Out-migration', v: '3.5L+', sub: 'people left hill districts 2011–2022', color: '#4F4C8F' },
          { kicker: 'For employment', v: '50%', sub: 'of migration driven by jobs', color: '#A8480F' },
        ].map((c) => (
          <Card key={c.kicker} style={{ padding: 18 }}>
            <div style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(20,32,28,.55)' }}>
              {c.kicker}
            </div>
            <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 34, fontWeight: 600, color: c.color, lineHeight: 1.1 }}>{c.v}</div>
            <div style={{ fontSize: 12, color: 'rgba(20,32,28,.6)' }}>{c.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Out-migration pressure by district</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {byMig.map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 120, fontSize: 12.5, flex: 'none' }}>{d.name}</div>
                <div style={{ flex: 1 }}>
                  <Bar pct={d.mig} color="#4F4C8F" h={14} />
                </div>
                <div style={{ width: 42, textAlign: 'right', fontFamily: 'var(--font-plex-mono), monospace', fontSize: 12, flex: 'none' }}>{d.mig}%</div>
              </div>
            ))}
          </div>
          <Source>Source: Rural Development &amp; Migration Commission (Palayan Aayog)</Source>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Ghost villages by district</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {byGhost.map((d) => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 120, fontSize: 12.5, flex: 'none' }}>{d.name}</div>
                <div style={{ flex: 1 }}>
                  <Bar pct={(d.ghosts / maxGhost) * 100} color="#8A1C1C" h={14} />
                </div>
                <div style={{ width: 42, textAlign: 'right', fontFamily: 'var(--font-plex-mono), monospace', fontSize: 12, flex: 'none' }}>{d.ghosts}</div>
              </div>
            ))}
          </div>
          <Source>Pauri Garhwal and Almora lead the state on abandoned settlements.</Source>
        </Card>
      </div>

      <Card style={{ padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Reasons for migration · पलायन के कारण</div>
        <div style={{ display: 'flex', height: 24, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
          {CAUSES.map(([k, v, c]) => (
            <div key={k} style={{ width: `${v}%`, background: c }} title={`${k} ${v}%`} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {CAUSES.map(([k, v, c]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
              <span style={{ width: 11, height: 11, borderRadius: 3, background: c }} />
              <span>{k}</span>
              <span style={{ fontFamily: 'var(--font-plex-mono), monospace', color: 'rgba(20,32,28,.6)' }}>{v}%</span>
            </div>
          ))}
        </div>
        <Source>Source: Palayan Aayog interim report on rural out-migration, 2022</Source>
      </Card>
    </div>
  )
}

function fmtNum(n: number) {
  return n.toLocaleString('en-IN')
}
