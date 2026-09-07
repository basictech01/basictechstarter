'use client'

import { NAV, type ScreenId } from '@/lib/pahad-data'

export default function Sidebar({
  screen,
  offline,
  syncedAt,
  onNavigate,
  onToggleOffline,
}: {
  screen: ScreenId
  offline: boolean
  syncedAt: string
  onNavigate: (id: ScreenId) => void
  onToggleOffline: () => void
}) {
  return (
    <aside
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        background: '#10241D',
        color: '#EAF0EC',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxShadow: '1px 0 0 rgba(0,0,0,.2)',
      }}
    >
      <div
        style={{
          padding: '24px 22px 20px',
          display: 'flex',
          gap: 13,
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,.12)',
        }}
      >
        <svg viewBox="0 0 40 40" width="44" height="44" style={{ flex: 'none', borderRadius: 12 }} aria-hidden="true">
          <rect width="40" height="40" rx="12" fill="#FAF8F4" />
          <path d="M5 30 L15 14 L21 24 L26 17 L35 30 Z" fill="#10241D" />
          <path
            d="M5 29.5 h4.6 l2.6-4.6 3.2 9.2 3-11.4 2.8 6.8 H35"
            fill="none"
            stroke="#E4681F"
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-anek), sans-serif',
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: '.03em',
              lineHeight: 1,
              color: '#FAF8F4',
            }}
          >
            PAHAD PULSE
          </div>
          <div
            style={{
              fontFamily: 'var(--font-anek), sans-serif',
              fontSize: 14,
              color: '#F0A268',
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            पहाड़ पल्स
          </div>
        </div>
      </div>

      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 12px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {NAV.map((item) => {
          const on = screen === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="pp-nav-item"
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 13px',
                borderRadius: 9,
                fontSize: 14.5,
                fontWeight: on ? 600 : 500,
                color: on ? '#FFFFFF' : 'rgba(234,240,236,.8)',
                background: on ? 'rgba(255,255,255,.13)' : 'transparent',
                borderLeft: `3px solid ${on ? '#E4681F' : 'transparent'}`,
              }}
            >
              <span style={{ flex: 1, lineHeight: 1.25 }}>{item.label}</span>
              {item.badge ? (
                <span
                  style={{
                    fontFamily: 'var(--font-plex-mono), monospace',
                    fontSize: 11,
                    padding: '2px 7px',
                    borderRadius: 5,
                    background: 'rgba(228,104,31,.22)',
                    color: '#F0A268',
                  }}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </nav>

      <div
        style={{
          padding: '16px 20px 20px',
          borderTop: '1px solid rgba(255,255,255,.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
        }}
      >
        <button
          onClick={onToggleOffline}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13.5,
            fontWeight: 600,
            color: '#EAF0EC',
          }}
          aria-pressed={offline}
        >
          <span style={{ whiteSpace: 'nowrap' }}>Offline mode</span>
          <span
            style={{
              flex: 'none',
              width: 40,
              height: 22,
              borderRadius: 12,
              background: offline ? '#E4681F' : 'rgba(20,32,28,.22)',
              position: 'relative',
              transition: 'background .2s',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 2,
                left: offline ? 20 : 2,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#FAF8F4',
                transition: 'left .2s',
              }}
            />
          </span>
        </button>
        <div
          style={{
            fontFamily: 'var(--font-plex-mono), monospace',
            fontSize: 10.5,
            lineHeight: 1.5,
            color: 'rgba(234,240,236,.62)',
          }}
        >
          {offline ? `OFFLINE — data as of ${syncedAt} IST` : 'Online · live feeds active'}
        </div>
      </div>
    </aside>
  )
}
