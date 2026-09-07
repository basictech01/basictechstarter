'use client'

import type { CSSProperties, ReactNode } from 'react'

export const CARD: CSSProperties = {
  border: '1px solid rgba(20,32,28,.13)',
  borderRadius: 14,
  background: 'rgba(255,255,255,.72)',
}

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ ...CARD, ...style }}>{children}</div>
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: '13px 16px',
        borderBottom: '1px solid rgba(20,32,28,.1)',
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  )
}

export function Kicker({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-plex-mono), monospace',
        fontSize: 10,
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        color: 'rgba(20,32,28,.5)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Bar({ pct, color, track = 'rgba(20,32,28,.08)', h = 7 }: { pct: number; color: string; track?: string; h?: number }) {
  return (
    <div style={{ height: h, borderRadius: 4, background: track }}>
      <div style={{ height: h, borderRadius: 4, background: color, width: `${pct}%` }} />
    </div>
  )
}

export function DashRow({ k, v }: { k: ReactNode; v: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 12,
        padding: '9px 0',
        borderBottom: '1px dashed rgba(20,32,28,.12)',
      }}
    >
      <span style={{ fontSize: 12.5, color: 'rgba(20,32,28,.72)' }}>{k}</span>
      <span
        style={{
          fontFamily: 'var(--font-plex-mono), monospace',
          fontSize: 12.5,
          fontWeight: 500,
          textAlign: 'right',
        }}
      >
        {v}
      </span>
    </div>
  )
}

export function Source({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-plex-mono), monospace',
        fontSize: 10,
        color: 'rgba(20,32,28,.45)',
        marginTop: 10,
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  )
}
