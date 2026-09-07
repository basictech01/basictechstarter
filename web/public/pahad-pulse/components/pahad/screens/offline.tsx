'use client'

import { Card, Source } from '@/components/pahad/ui'

const BUNDLES = [
  { k: 'Active alerts', size: '18 KB', ok: true },
  { k: 'River levels', size: '9 KB', ok: true },
  { k: 'Road closures', size: '14 KB', ok: true },
  { k: 'District profiles', size: '46 KB', ok: true },
  { k: 'Interactive map tiles', size: '—', ok: false },
]

export default function OfflineScreen({
  offline,
  syncedAt,
  onToggleOffline,
}: {
  offline: boolean
  syncedAt: string
  onToggleOffline: () => void
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
      <Card style={{ padding: 24 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 12px',
            borderRadius: 20,
            background: offline ? 'rgba(228,104,31,.12)' : 'rgba(47,122,62,.12)',
            color: offline ? '#A8480F' : '#2F7A3E',
            fontFamily: 'var(--font-plex-mono), monospace',
            fontSize: 11,
            marginBottom: 16,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: offline ? '#E4681F' : '#2F7A3E' }} />
          {offline ? 'OFFLINE MODE ON' : 'ONLINE — LIVE FEEDS'}
        </div>
        <h2 style={{ margin: '0 0 10px', fontFamily: 'var(--font-anek), sans-serif', fontSize: 24, fontWeight: 700 }}>
          Built for the hills, works without signal
        </h2>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'rgba(20,32,28,.8)', maxWidth: 620 }}>
          Whenever your phone finds a connection, Pahad Pulse quietly caches the most recent alerts, river levels and road
          status. When you climb into a dead zone, the essentials stay on screen — clearly stamped with the time they were
          last refreshed, so you always know how fresh the picture is.
        </p>
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 12,
            background: 'rgba(23,55,46,.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Offline mode</div>
            <div style={{ fontSize: 12, color: 'rgba(20,32,28,.6)' }}>
              {offline ? `Showing cached data from ${syncedAt} IST` : 'Live data streaming now'}
            </div>
          </div>
          <button
            onClick={onToggleOffline}
            className="pp-cta"
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '9px 16px',
              borderRadius: 8,
              background: '#17372E',
              color: '#FAF8F4',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {offline ? 'Go online' : 'Switch to offline'}
          </button>
        </div>
        <Source>Bundles refresh automatically on any connection · no manual sync needed</Source>
      </Card>

      <Card style={{ padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Cached bundle</div>
        <div style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: 10.5, color: 'rgba(20,32,28,.5)', marginBottom: 12 }}>
          LAST SYNC {syncedAt} IST
        </div>
        {BUNDLES.map((b) => (
          <div key={b.k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px dashed rgba(20,32,28,.12)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: b.ok ? '#2F7A3E' : 'rgba(20,32,28,.25)', flex: 'none' }} />
            <span style={{ flex: 1, fontSize: 12.5 }}>{b.k}</span>
            <span style={{ fontFamily: 'var(--font-plex-mono), monospace', fontSize: 11.5, color: 'rgba(20,32,28,.6)' }}>{b.size}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}
