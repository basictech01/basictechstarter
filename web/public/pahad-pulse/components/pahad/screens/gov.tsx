'use client'

import { Card, Bar, DashRow, Source } from '@/components/pahad/ui'

const SCHEMES = [
  { k: 'Mukhyamantri Saur Swarozgar', v: 'rooftop solar self-employment', pct: 64, c: '#E4681F' },
  { k: 'Homestay development scheme', v: '4,900+ registered homestays', pct: 72, c: '#2F7A3E' },
  { k: 'CM Palayan roll-back grants', v: 'reverse-migration support', pct: 41, c: '#4F4C8F' },
  { k: 'Atal Ayushman Uttarakhand', v: 'health cover up to ₹5 L', pct: 88, c: '#1D6A8A' },
  { k: 'Har Ghar Nal (JJM)', v: 'functional tap connections', pct: 79, c: '#A8480F' },
]

const BUDGET = [
  { k: 'Total outlay 2024-25', v: '₹89,230 Cr' },
  { k: 'Capital expenditure', v: '₹15,190 Cr' },
  { k: 'Disaster management fund', v: '₹1,842 Cr' },
  { k: 'Tourism development', v: '₹302 Cr' },
  { k: 'Rural development', v: '₹2,970 Cr' },
]

export default function GovScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[
          { k: 'Gram panchayats', v: '7,791', c: '#17372E' },
          { k: 'Grievances resolved', v: '92%', c: '#2F7A3E' },
          { k: 'e-Services live', v: '243', c: '#1D6A8A' },
          { k: 'Fund utilisation', v: '81%', c: '#E4681F' },
        ].map((c) => (
          <Card key={c.k} style={{ padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(20,32,28,.55)' }}>
              {c.k}
            </div>
            <div style={{ fontFamily: 'var(--font-anek), sans-serif', fontSize: 28, fontWeight: 600, color: c.c, lineHeight: 1.2 }}>{c.v}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Flagship schemes · प्रमुख योजनाएँ</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {SCHEMES.map((s) => (
              <div key={s.k}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{s.k}</span>
                  <span style={{ fontFamily: 'var(--font-plex-mono), monospace', color: 'rgba(20,32,28,.6)' }}>{s.pct}%</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'rgba(20,32,28,.55)', marginBottom: 6 }}>{s.v}</div>
                <Bar pct={s.pct} color={s.c} />
              </div>
            ))}
          </div>
          <Source>Source: Department dashboards · CM dashboard, Government of Uttarakhand</Source>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>State budget · बजट</div>
          {BUDGET.map((b) => (
            <DashRow key={b.k} k={b.k} v={b.v} />
          ))}
          <Source>Source: Uttarakhand Budget 2024-25 at a glance</Source>
        </Card>
      </div>
    </div>
  )
}
