'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/pahad/sidebar'
import TopHeader from '@/components/pahad/top-header'
import HomeScreen from '@/components/pahad/screens/home'
import DistrictScreen from '@/components/pahad/screens/district'
import AlertsScreen from '@/components/pahad/screens/alerts'
import CompareScreen from '@/components/pahad/screens/compare'
import MigrationScreen from '@/components/pahad/screens/migration'
import TourismScreen from '@/components/pahad/screens/tourism'
import WeatherScreen from '@/components/pahad/screens/weather'
import RoadsScreen from '@/components/pahad/screens/roads'
import NetScreen from '@/components/pahad/screens/net'
import OfflineScreen from '@/components/pahad/screens/offline'
import IntelScreen from '@/components/pahad/screens/intel'
import GovScreen from '@/components/pahad/screens/gov'
import AccountScreen from '@/components/pahad/screens/account'
import { SCREENS, type MapLayer, type ScreenId } from '@/lib/pahad-data'

function nowIST() {
  const d = new Date(Date.now() + (5.5 * 60 + new Date().getTimezoneOffset()) * 60000)
  return d.toTimeString().slice(0, 8)
}

export default function PahadPulse() {
  const [screen, setScreen] = useState<ScreenId>('home')
  const [layer, setLayer] = useState<MapLayer>('alerts')
  const [districtId, setDistrictId] = useState('chamoli')
  const [offline, setOffline] = useState(false)
  const [clock, setClock] = useState('00:00:00')
  const [syncedAt, setSyncedAt] = useState('00:00')

  useEffect(() => {
    setClock(nowIST())
    setSyncedAt(nowIST().slice(0, 5))
    const t = setInterval(() => {
      if (!offline) setClock(nowIST())
    }, 1000)
    return () => clearInterval(t)
  }, [offline])

  const go = (id: ScreenId) => {
    setScreen(id)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }

  const openDistrict = (id: string) => {
    setDistrictId(id)
    go('district')
  }

  const toggleOffline = () => {
    setOffline((v) => {
      const next = !v
      if (next) setSyncedAt(nowIST().slice(0, 5))
      return next
    })
  }

  const [title, titleHi] = SCREENS[screen]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '256px 1fr',
        minHeight: '100vh',
        background: '#faf8f4',
      }}
    >
      <Sidebar
        screen={screen}
        offline={offline}
        syncedAt={syncedAt}
        onNavigate={go}
        onToggleOffline={toggleOffline}
      />

      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopHeader title={title} titleHi={titleHi} clock={offline ? syncedAt + ':00' : clock} onAccount={() => go('account')} />

        {offline ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 32px',
              background: 'rgba(228,104,31,.1)',
              borderBottom: '1px solid rgba(228,104,31,.25)',
              fontFamily: 'var(--font-plex-mono), monospace',
              fontSize: 11,
              color: '#A8480F',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E4681F' }} />
            OFFLINE MODE — showing cached data from {syncedAt} IST
          </div>
        ) : null}

        <main
          style={{
            flex: 1,
            padding: '24px 32px 56px',
            position: 'relative',
            backgroundImage: 'url(/pattern-bg.png)',
            backgroundSize: '620px',
            backgroundRepeat: 'repeat',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(250,248,244,.86)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            {screen === 'home' && (
              <HomeScreen
                layer={layer}
                districtId={districtId}
                onLayer={setLayer}
                onSelectDistrict={openDistrict}
                onNavigate={go}
              />
            )}
            {screen === 'district' && <DistrictScreen districtId={districtId} onSelectDistrict={setDistrictId} />}
            {screen === 'alerts' && <AlertsScreen />}
            {screen === 'compare' && <CompareScreen />}
            {screen === 'migration' && <MigrationScreen />}
            {screen === 'tourism' && <TourismScreen />}
            {screen === 'weather' && <WeatherScreen />}
            {screen === 'roads' && <RoadsScreen />}
            {screen === 'net' && <NetScreen />}
            {screen === 'offline' && <OfflineScreen offline={offline} syncedAt={syncedAt} onToggleOffline={toggleOffline} />}
            {screen === 'intel' && <IntelScreen />}
            {screen === 'gov' && <GovScreen />}
            {screen === 'account' && <AccountScreen />}
          </div>
        </main>
      </div>
    </div>
  )
}
