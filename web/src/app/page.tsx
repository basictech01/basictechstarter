'use client';

import React, { useState, useEffect } from 'react';
import { InteractiveMap } from '@/components/map';
import Link from 'next/link';
import { fetchDistricts, type District } from '@/services/api';

export default function HomePage() {
  const [screen, setScreen] = useState<string>('home');
  const [layer, setLayer] = useState<'alerts' | 'roads' | 'tourism' | 'rainfall' | 'migration' | 'population'>('alerts');
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    console.log('[HomePage] Component mounted');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      console.log('[HomePage] Not mounted yet, skipping fetch');
      return;
    }

    console.log('[HomePage] Starting to fetch data');
    async function loadData() {
      try {
        console.log('[HomePage] Fetching districts and alerts');
        const [districtData, alertData] = await Promise.all([
          fetchDistricts(),
          fetchAlerts(),
        ]);
        console.log('[HomePage] Received', districtData.length, 'districts,', alertData.length, 'alerts');
        setDistricts(districtData);
        setAlertCount(alertData.length);
      } catch (error) {
        console.error('[HomePage] Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [mounted]);

  const navItems = [
    { id: 'home', label: 'Home dashboard', badge: '' },
    { id: 'alerts', label: 'Live alerts', badge: alertCount > 0 ? String(alertCount) : '' },
    { id: 'district', label: 'District dashboard', badge: '' },
    { id: 'compare', label: 'Compare districts', badge: '' },
    { id: 'roads', label: 'Traffic & roads', badge: '' },
    { id: 'weather', label: 'Weather & rivers', badge: '' },
    { id: 'tourism', label: 'Tourism live', badge: '' },
    { id: 'migration', label: 'Migration tracker', badge: '' },
    { id: 'net', label: 'Speed & connectivity', badge: '' },
    { id: 'intel', label: 'Sector intelligence', badge: '' },
    { id: 'gov', label: 'Governance dashboard', badge: '' },
    { id: 'offline', label: 'Offline mode', badge: '' },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
      {/* SIDEBAR */}
      <aside className="sidebar fixed left-0 top-0 w-64 h-screen shadow-md overflow-y-auto z-50" style={{ backgroundColor: 'var(--dark-rail)', color: 'var(--text-light)' }}>
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: '1px solid rgba(255,255,255,.12)' }}>
          <h1 className="font-display font-bold text-xl mb-1" style={{ color: 'var(--bg-light)' }}>PAHAD PULSE</h1>
          <p className="font-display text-sm" style={{ color: '#F0A268' }}>पहाड़ पल्स</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all border-l-4 ${
                screen === item.id
                  ? 'text-white'
                  : ''
              }`}
              style={{
                backgroundColor: screen === item.id ? 'rgba(255,255,255,.09)' : 'transparent',
                color: screen === item.id ? '#FFFFFF' : 'rgba(234,240,236,.8)',
                borderLeftColor: screen === item.id ? 'var(--primary-accent)' : 'transparent',
              }}
            >
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(228,104,31,.22)', color: '#F0A268' }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,.12)', color: 'rgba(234,240,236,.62)' }}>
          Built for Uttarakhand
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 w-full flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-sm px-8 py-4 shadow-sm" style={{ backgroundColor: 'rgba(250,248,244,.9)', borderBottom: '1px solid rgba(20,32,28,.12)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-dark)' }}>Uttarakhand Home Dashboard</h2>
              <p className="font-display text-sm text-gray-600">उत्तराखंड होम डैशबोर्ड</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ backgroundColor: 'rgba(228,104,31,.08)', border: '1px solid rgba(228,104,31,.4)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary-accent)' }}></span>
                <span className="font-mono text-xs" style={{ color: 'var(--primary-accent)' }}>LIVE · {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
              </div>
              <div className="font-mono text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(20,32,28,.06)', color: 'rgba(20,32,28,.6)' }}>
                DEMO DATA
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8">
          {screen === 'home' && (
            <div className="space-y-8">
              {/* Live Counters */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: '🚨', value: String(alertCount), label: 'Active Alerts (IMD CAP)', borderColor: '#EF4444' },
                  { icon: '🏘️', value: String(districts.length), label: 'Districts Tracked', borderColor: '#E4681F' },
                  { icon: '⚠️', value: '—', label: 'Road Closures (Pending)', borderColor: '#F97316' },
                  { icon: '🌡️', value: '—', label: 'Weather Data (Pending)', borderColor: '#0369A1' },
                ].map((counter, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 shadow-sm" style={{ borderLeft: `4px solid ${counter.borderColor}` }}>
                    <div className="text-3xl mb-2">{counter.icon}</div>
                    <div className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text-dark)' }}>{counter.value}</div>
                    <div className="font-mono text-xs text-gray-600">{counter.label}</div>
                  </div>
                ))}
              </div>

              {/* Map Section */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid #D4CCBE' }}>
                  <div className="flex items-center gap-3 p-4 flex-wrap" style={{ borderBottom: '1px solid #D4CCBE' }}>
                    <div className="font-semibold text-sm flex-1">
                      Interactive state map · <span className="font-display text-gray-600">किलवार नक्शा</span>
                    </div>
                    {['Alerts', 'Roads', 'Tourism', 'Rainfall', 'Migration'].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLayer(l.toLowerCase() as any)}
                        className="font-mono text-xs px-3 py-1 rounded transition-all border"
                        style={{
                          backgroundColor: layer === l.toLowerCase() ? '#E4681F' : '#F3F4F6',
                          color: layer === l.toLowerCase() ? '#FFFFFF' : '#374151',
                          borderColor: layer === l.toLowerCase() ? '#E4681F' : '#E5E7EB',
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <div className="h-96">
                    <InteractiveMap layer={layer} clickable={true} />
                  </div>
                  <div className="p-3 font-mono text-xs text-gray-600 flex justify-between" style={{ borderTop: '1px solid #D4CCBE' }}>
                    <span>Click any district to open its dashboard</span>
                    <span>Layer: {layer.charAt(0).toUpperCase() + layer.slice(1)}</span>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="space-y-4">
                  {/* State Overview */}
                  <div className="bg-white rounded-lg p-4 shadow-sm" style={{ border: '1px solid #D4CCBE' }}>
                    <div className="font-mono text-xs text-gray-600 uppercase mb-3 font-semibold">State overview</div>
                    <div className="space-y-2 text-sm">
                      {[
                        { k: 'Population', v: '1,00,86,292' },
                        { k: 'Area (km²)', v: '53,483' },
                        { k: 'Literacy', v: '78.8%' },
                        { k: 'Districts', v: '13' },
                      ].map((s, i) => (
                        <div key={i} className="flex justify-between pb-2" style={{ borderBottom: '1px solid #E5E7EB' }}>
                          <span className="text-gray-700">{s.k}</span>
                          <span className="font-mono font-semibold" style={{ color: 'var(--text-dark)' }}>{s.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Access */}
                  <div className="bg-white rounded-lg p-4 shadow-sm" style={{ border: '1px solid #D4CCBE' }}>
                    <div className="font-mono text-xs text-gray-600 uppercase mb-3 font-semibold">Quick access</div>
                    <div className="grid grid-cols-2 gap-2">
                      {['Alerts', 'Districts', 'Compare', 'Migration', 'Tourism', 'Weather'].map((q) => (
                        <button
                          key={q}
                          onClick={() => setScreen(q.toLowerCase())}
                          className="text-xs px-2 py-2 rounded transition-all"
                          style={{
                            backgroundColor: '#F3F4F6',
                            border: '1px solid #E5E7EB',
                            color: '#374151',
                          }}
                          onMouseEnter={(e) => {
                            const target = e.target as HTMLButtonElement;
                            target.style.borderColor = '#E4681F';
                            target.style.color = '#E4681F';
                          }}
                          onMouseLeave={(e) => {
                            const target = e.target as HTMLButtonElement;
                            target.style.borderColor = '#E5E7EB';
                            target.style.color = '#374151';
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Districts Grid */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ border: '1px solid #D4CCBE' }}>
                <div className="p-4 font-semibold text-sm" style={{ borderBottom: '1px solid #D4CCBE' }}>
                  Districts at a glance · <span className="font-display text-gray-600">तेरह जिले</span>
                </div>
                <div className="grid grid-cols-6 divide-x divide-y divide-gray-200">
                  {!mounted ? (
                    <div className="col-span-6 p-8 text-center text-gray-500">Loading...</div>
                  ) : districts.length === 0 ? (
                    <div className="col-span-6 p-8 text-center text-gray-500">
                      {loading ? 'Fetching districts...' : 'No districts found'}
                    </div>
                  ) : (
                    districts.map((d) => (
                      <Link
                        key={d.id}
                        href={`/districts/${d.slug}`}
                        className="p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-semibold text-sm mb-1">{d.name.en}</div>
                        <div className="font-display text-xs text-gray-600 mb-2">{d.name.hi}</div>
                        <div className="font-mono text-xs text-gray-500">
                          {d.counts.villages} villages
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {screen !== 'home' && (
            <div className="text-center py-20">
              <p className="text-xl font-semibold text-gray-700">
                {navItems.find(n => n.id === screen)?.label || 'Screen'} - Coming Soon
              </p>
              <p className="text-gray-500 mt-2">This module is under development</p>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
