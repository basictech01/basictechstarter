'use client'

import { useState } from 'react'
import { Card, Source } from '@/components/pahad/ui'
import { DISTRICTS } from '@/lib/pahad-data'

const CATS = ['Weather', 'Road', 'River', 'Disaster', 'Tourism advisories']

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid rgba(20,32,28,.18)',
  background: 'rgba(255,255,255,.85)',
  fontSize: 13.5,
  color: '#14201C',
} as const

export default function AccountScreen() {
  const [districts, setDistricts] = useState<string[]>(['chamoli', 'rudraprayag'])
  const [cats, setCats] = useState<string[]>(['Weather', 'Road', 'River', 'Disaster'])
  const [lang, setLang] = useState<'hi' | 'en'>('hi')
  const [done, setDone] = useState(false)

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
      <Card style={{ padding: 24 }}>
        <h2 style={{ margin: '0 0 6px', fontFamily: 'var(--font-anek), sans-serif', fontSize: 22, fontWeight: 700 }}>
          Free alert sign-up · अलर्ट पंजीकरण
        </h2>
        <p style={{ margin: '0 0 20px', fontSize: 13.5, color: 'rgba(20,32,28,.7)', lineHeight: 1.55 }}>
          Choose your districts and the alerts that matter to you. Notifications arrive by SMS and app, in the language you
          prefer. No charge, unsubscribe any time.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            setDone(true)
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600 }}>
              Full name
              <input className="pp-focus" style={{ ...inputStyle, marginTop: 6, fontWeight: 400 }} placeholder="Your name" required />
            </label>
            <label style={{ fontSize: 12.5, fontWeight: 600 }}>
              Mobile number
              <input className="pp-focus" style={{ ...inputStyle, marginTop: 6, fontWeight: 400 }} placeholder="+91 XXXXX XXXXX" required />
            </label>
          </div>

          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>Districts to watch</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {DISTRICTS.map((d) => {
                const on = districts.includes(d.id)
                return (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => toggle(districts, setDistricts, d.id)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      padding: '6px 11px',
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: on ? 600 : 500,
                      border: `1px solid ${on ? '#17372E' : 'rgba(20,32,28,.16)'}`,
                      background: on ? '#17372E' : 'rgba(255,255,255,.7)',
                      color: on ? '#FAF8F4' : 'rgba(20,32,28,.75)',
                    }}
                  >
                    {d.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>Alert types</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {CATS.map((c) => {
                const on = cats.includes(c)
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => toggle(cats, setCats, c)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      padding: '6px 11px',
                      borderRadius: 7,
                      fontSize: 12,
                      fontWeight: on ? 600 : 500,
                      border: `1px solid ${on ? '#E4681F' : 'rgba(20,32,28,.16)'}`,
                      background: on ? '#E4681F' : 'rgba(255,255,255,.7)',
                      color: on ? '#FAF8F4' : 'rgba(20,32,28,.75)',
                    }}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>Language</div>
            <div style={{ display: 'flex', gap: 7 }}>
              {(['hi', 'en'] as const).map((l) => {
                const on = lang === l
                return (
                  <button
                    type="button"
                    key={l}
                    onClick={() => setLang(l)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      padding: '7px 16px',
                      borderRadius: 7,
                      fontSize: 12.5,
                      fontWeight: on ? 600 : 500,
                      border: `1px solid ${on ? '#17372E' : 'rgba(20,32,28,.16)'}`,
                      background: on ? '#17372E' : 'rgba(255,255,255,.7)',
                      color: on ? '#FAF8F4' : 'rgba(20,32,28,.75)',
                    }}
                  >
                    {l === 'hi' ? 'हिन्दी' : 'English'}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="submit"
            className="pp-cta-orange"
            style={{
              all: 'unset',
              cursor: 'pointer',
              textAlign: 'center',
              padding: '12px',
              borderRadius: 8,
              background: '#E4681F',
              color: '#FAF8F4',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {done ? 'Preferences saved ✓' : 'Create free alert account'}
          </button>
          {done ? (
            <div style={{ fontSize: 12.5, color: '#2F7A3E', textAlign: 'center' }}>
              You are now subscribed to {cats.length} alert types across {districts.length} districts.
            </div>
          ) : null}
        </form>
        <Source>Demo form — no data is stored. In production this connects to the state SMS gateway.</Source>
      </Card>

      <Card style={{ padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>How alerts reach you</div>
        {[
          ['SMS', 'Works on any phone, no internet needed'],
          ['App push', 'Rich alerts with maps and advisories'],
          ['Offline cache', 'Last advisory stays on screen in dead zones'],
        ].map(([k, v]) => (
          <div key={k} style={{ padding: '11px 0', borderBottom: '1px dashed rgba(20,32,28,.12)' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{k}</div>
            <div style={{ fontSize: 12, color: 'rgba(20,32,28,.6)', lineHeight: 1.45 }}>{v}</div>
          </div>
        ))}
      </Card>
    </div>
  )
}
