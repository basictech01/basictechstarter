'use client'

export default function TopHeader({
  title,
  titleHi,
  clock,
  onAccount,
}: {
  title: string
  titleHi: string
  clock: string
  onAccount: () => void
}) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '14px 32px',
        borderBottom: '1px solid rgba(20,32,28,.12)',
        background: 'rgba(250,248,244,.9)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-anek), sans-serif',
            fontSize: 21,
            fontWeight: 600,
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>
        <div
          style={{
            fontFamily: 'var(--font-anek), sans-serif',
            fontSize: 13.5,
            color: 'rgba(20,32,28,.55)',
            lineHeight: 1.3,
          }}
        >
          {titleHi}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 11px',
          border: '1px solid rgba(228,104,31,.4)',
          borderRadius: 20,
          background: 'rgba(228,104,31,.08)',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#E4681F',
            animation: 'pp-pulse 1.8s ease-in-out infinite',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-plex-mono), monospace',
            fontSize: 11,
            color: '#A8480F',
            whiteSpace: 'nowrap',
          }}
        >
          LIVE · {clock} IST
        </span>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-plex-mono), monospace',
          fontSize: 10.5,
          padding: '5px 10px',
          borderRadius: 6,
          background: 'rgba(20,32,28,.06)',
          color: 'rgba(20,32,28,.6)',
        }}
      >
        DEMO DATA
      </div>
      <button
        onClick={onAccount}
        className="pp-cta"
        style={{
          all: 'unset',
          cursor: 'pointer',
          flex: 'none',
          whiteSpace: 'nowrap',
          fontSize: 12.5,
          fontWeight: 600,
          padding: '8px 14px',
          borderRadius: 8,
          background: '#17372E',
          color: '#FAF8F4',
        }}
      >
        Alert sign-up
      </button>
    </header>
  )
}
