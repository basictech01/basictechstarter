'use client'

import { Card, Bar, Source } from '@/components/pahad/ui'

const GSDP = [
  ['Services', 48.2, '#17372E'],
  ['Industry', 33.6, '#E4681F'],
  ['Agriculture', 9.1, '#2F7A3E'],
  ['Construction', 9.1, '#4F4C8F'],
] as const

const SECTORS = [
  { k: 'Tourism & hospitality', v: 'contributes ~13% of GSDP', pct: 78, c: '#E4681F' },
  { k: 'Hydropower generation', v: '4,200 MW installed capacity', pct: 62, c: '#1D6A8A' },
  { k: 'Horticulture & apples', v: 'apple output up 14% YoY', pct: 54, c: '#2F7A3E' },
  { k: 'SIDCUL manufacturing', v: 'Haridwar & US Nagar hubs', pct: 71, c: '#4F4C8F' },
  { k: 'Medicinal & aromatic plants', v: 'growing export niche', pct: 38, c: '#A8480F' },
]

export default function IntelScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[
          { k: 'GSDP 2023-24', v: '₹3.46 L Cr', c: '#17372E' },
          { k: 'Growth rate', v: '7.6%', c: '#2F7A3E' },
          { k: 'Per-capita income', v: '₹2.60 L', c: '#E4681F' },
          { k: 'Workforce in agri', v: '43%', c: '#4F4C8F' },
        ].map((c) => (
          <Card key={c.k} style={{ padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(20,32,28,.55)' }}>
              {c.k}
            </div>
            <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 26, fontWeight: 600, color: c.c, lineHeight: 1.2 }}>{c.v}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 16, alignItems: 'start' }}>
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Economy composition · GSDP</div>
          <div style={{ display: 'flex', height: 24, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
            {GSDP.map(([k, v, c]) => (
              <div key={k} style={{ width: `${v}%`, background: c }} title={`${k} ${v}%`} />
            ))}
          </div>
          {GSDP.map(([k, v, c]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed rgba(20,32,28,.12)', fontSize: 12.5 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
                {k}
              </span>
              <span style={{ fontFamily: 'var(--font-plex-mono), monospace', fontWeight: 500 }}>{v}%</span>
            </div>
          ))}
          <Source>Source: Directorate of Economics &amp; Statistics, Uttarakhand</Source>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Key sectors · प्रमुख क्षेत्र</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {SECTORS.map((s) => (
              <div key={s.k}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{s.k}</span>
                  <span style={{ color: 'rgba(20,32,28,.6)' }}>{s.v}</span>
                </div>
                <Bar pct={s.pct} color={s.c} />
              </div>
            ))}
          </div>
          <Source>Indicative sector momentum index · state economic survey 2023-24</Source>
        </Card>
      </div>
    </div>
  )
}
