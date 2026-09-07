'use client'

import { Card, Bar, Source } from '@/components/pahad/ui'
import { DISTRICTS } from '@/lib/pahad-data'

export default function NetScreen() {
  const byNet = [...DISTRICTS].sort((a, b) => b.net - a.net)
  const maxNet = Math.max(...DISTRICTS.map((d) => d.net))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[
          { k: 'Usable connectivity', v: '71%', c: '#17372E' },
          { k: 'Avg mobile speed', v: '18 Mbps', c: '#1D6A8A' },
          { k: 'No-network villages', v: '1,042', c: '#8A1C1C' },
          { k: 'BharatNet gram panchayats', v: '7,791', c: '#2F7A3E' },
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
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Data connectivity by district · कनेक्टिविटी</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {byNet.map((d) => {
            const c = d.net >= 20 ? '#2F7A3E' : d.net >= 8 ? '#1D6A8A' : '#8A1C1C'
            return (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 140, fontSize: 12.5, flex: 'none' }}>{d.name}</div>
                <div style={{ flex: 1 }}>
                  <Bar pct={(d.net / maxNet) * 100} color={c} h={14} />
                </div>
                <div style={{ width: 52, textAlign: 'right', fontFamily: 'var(--font-plex-mono), monospace', fontSize: 12, flex: 'none' }}>{d.net}%</div>
              </div>
            )
          })}
        </div>
        <Source>Source: NIC district connectivity survey · TRAI performance indicators 2023</Source>
      </Card>

      <Card style={{ padding: 20, background: 'rgba(138,28,28,.05)' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Why connectivity matters here</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(20,32,28,.8)', maxWidth: 760 }}>
          Chamoli and Uttarkashi record the lowest usable-data figures in the state. During monsoon disruptions these are
          precisely the districts where alerts must travel fastest, so Pahad Pulse ships an offline mode that caches the
          latest advisory bundle whenever a signal is available.
        </div>
      </Card>
    </div>
  )
}
