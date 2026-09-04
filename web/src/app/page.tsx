'use client';

import React, { useState } from 'react';
import { InteractiveMap } from '@/components/map';
import Link from 'next/link';

export default function HomePage() {
  const [screen, setScreen] = useState<string>('home');
  const [layer, setLayer] = useState<'alerts' | 'roads' | 'tourism' | 'rainfall' | 'migration' | 'population'>('alerts');

  const navItems = [
    { id: 'home', label: 'Home dashboard', badge: '' },
    { id: 'alerts', label: 'Live alerts', badge: '26' },
    { id: 'district', label: 'District dashboard', badge: '' },
    { id: 'compare', label: 'Compare districts', badge: '' },
    { id: 'roads', label: 'Traffic & roads', badge: '38' },
    { id: 'weather', label: 'Weather & rivers', badge: '' },
    { id: 'tourism', label: 'Tourism live', badge: '' },
    { id: 'migration', label: 'Migration tracker', badge: '' },
    { id: 'net', label: 'Speed & connectivity', badge: '' },
    { id: 'intel', label: 'Sector intelligence', badge: '' },
    { id: 'gov', label: 'Governance dashboard', badge: '' },
    { id: 'offline', label: 'Offline mode', badge: '' },
  ];

  const districts = [
    { id: 'uttarkashi', name: 'Uttarkashi', nameHi: 'उत्तरकाशी', population: 330086, alerts: 4 },
    { id: 'chamoli', name: 'Chamoli', nameHi: 'चमोली', population: 391605, alerts: 5 },
    { id: 'rudraprayag', name: 'Rudraprayag', nameHi: 'रुद्रप्रयाग', population: 242285, alerts: 3 },
    { id: 'tehri', name: 'Tehri Garhwal', nameHi: 'टेहरी गढ़वाल', population: 618931, alerts: 2 },
    { id: 'dehradun', name: 'Dehradun', nameHi: 'देहरादून', population: 1696694, alerts: 1 },
    { id: 'pauri', name: 'Pauri Garhwal', nameHi: 'पौड़ी गढ़वाल', population: 687271, alerts: 2 },
    { id: 'haridwar', name: 'Haridwar', nameHi: 'हरिद्वार', population: 1890422, alerts: 2 },
    { id: 'bageshwar', name: 'Bageshwar', nameHi: 'बागेश्वर', population: 259898, alerts: 2 },
    { id: 'almora', name: 'Almora', nameHi: 'अल्मोड़ा', population: 622506, alerts: 1 },
    { id: 'pithoragarh', name: 'Pithoragarh', nameHi: 'पिथौरागढ़', population: 483439, alerts: 3 },
    { id: 'champawat', name: 'Champawat', nameHi: 'चम्पावत', population: 259648, alerts: 1 },
    { id: 'nainital', name: 'Nainital', nameHi: 'नैनीताल', population: 954605, alerts: 1 },
    { id: 'usnagar', name: 'Udham Singh Nagar', nameHi: 'उधम सिंह नगर', population: 1648902, alerts: 1 },
  ];

  return (
    <div className="flex min-h-screen bg-bgLight">
      {/* SIDEBAR */}
      <aside className="sidebar fixed left-0 top-0 w-64 h-screen bg-bgDark text-textLight shadow-md overflow-y-auto z-50">
        {/* Logo */}
        <div className="border-b border-textLight/20 p-6">
          <h1 className="font-display font-bold text-xl text-bgLight mb-1">PAHAD PULSE</h1>
          <p className="font-display text-sm text-yellow-400">पहाड़ पल्स</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 p-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all border-l-4 ${
                screen === item.id
                  ? 'bg-white/10 text-white border-l-accent'
                  : 'text-textLight/80 border-l-transparent hover:bg-white/5'
              }`}
            >
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-accent/20 text-yellow-300 text-xs px-2 py-1 rounded">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-textLight/20 p-4 text-xs text-textLight/60">
          Built for Uttarakhand
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-64 w-full flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-bgLight/90 backdrop-blur-sm border-b border-borderColor px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-textDark">Uttarakhand Home Dashboard</h2>
              <p className="font-display text-sm text-gray-600">उत्तराखंड होम डैशबोर्ड</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-accent/10 border border-accent/40">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                <span className="font-mono text-xs text-accent">LIVE · {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
              </div>
              <div className="font-mono text-xs px-2 py-1 bg-textDark/5 rounded text-textDark/60">
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
                  { icon: '🚌', value: '41,280', label: 'Tourists in State', color: 'border-accent' },
                  { icon: '🚨', value: '26', label: 'Active Alerts', color: 'border-red-500' },
                  { icon: '🚫', value: '38', label: 'Road Closures', color: 'border-orange-600' },
                  { icon: '📡', value: '71%', label: 'Connectivity', color: 'border-bgDark' },
                ].map((counter, i) => (
                  <div key={i} className={`bg-white rounded-lg border-l-4 ${counter.color} p-4 shadow-sm`}>
                    <div className="text-3xl mb-2">{counter.icon}</div>
                    <div className="font-display font-bold text-2xl text-textDark mb-1">{counter.value}</div>
                    <div className="font-mono text-xs text-gray-600">{counter.label}</div>
                  </div>
                ))}
              </div>

              {/* Map Section */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white rounded-lg border border-borderColor shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 p-4 border-b border-borderColor flex-wrap">
                    <div className="font-semibold text-sm flex-1">
                      Interactive state map · <span className="font-display text-gray-600">किलवार नक्शा</span>
                    </div>
                    {['Alerts', 'Roads', 'Tourism', 'Rainfall', 'Migration'].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLayer(l.toLowerCase() as any)}
                        className={`font-mono text-xs px-3 py-1 rounded transition-all ${
                          layer === l.toLowerCase()
                            ? 'bg-accent text-white'
                            : 'bg-gray-100 text-gray-700 hover:border-accent border border-gray-200'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <div className="h-96">
                    <InteractiveMap layer={layer} clickable={true} />
                  </div>
                  <div className="p-3 border-t border-borderColor font-mono text-xs text-gray-600 flex justify-between">
                    <span>Click any district to open its dashboard</span>
                    <span>Layer: {layer.charAt(0).toUpperCase() + layer.slice(1)}</span>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="space-y-4">
                  {/* State Overview */}
                  <div className="bg-white rounded-lg border border-borderColor p-4 shadow-sm">
                    <div className="font-mono text-xs text-gray-600 uppercase mb-3 font-semibold">State overview</div>
                    <div className="space-y-2 text-sm">
                      {[
                        { k: 'Population', v: '1,00,86,292' },
                        { k: 'Area (km²)', v: '53,483' },
                        { k: 'Literacy', v: '78.8%' },
                        { k: 'Districts', v: '13' },
                      ].map((s, i) => (
                        <div key={i} className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-700">{s.k}</span>
                          <span className="font-mono font-semibold text-textDark">{s.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Access */}
                  <div className="bg-white rounded-lg border border-borderColor p-4 shadow-sm">
                    <div className="font-mono text-xs text-gray-600 uppercase mb-3 font-semibold">Quick access</div>
                    <div className="grid grid-cols-2 gap-2">
                      {['Alerts', 'Districts', 'Compare', 'Migration', 'Tourism', 'Weather'].map((q) => (
                        <button
                          key={q}
                          onClick={() => setScreen(q.toLowerCase())}
                          className="text-xs px-2 py-2 rounded border border-gray-200 bg-gray-50 hover:border-accent hover:text-accent transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Districts Grid */}
              <div className="bg-white rounded-lg border border-borderColor shadow-sm overflow-hidden">
                <div className="p-4 border-b border-borderColor font-semibold text-sm">
                  Districts at a glance · <span className="font-display text-gray-600">तेरह जिले</span>
                </div>
                <div className="grid grid-cols-6 divide-x divide-y divide-gray-200">
                  {districts.map((d) => (
                    <Link
                      key={d.id}
                      href={`/districts/${d.id}`}
                      className="p-4 hover:bg-accent/5 transition-colors"
                    >
                      <div className="font-semibold text-sm mb-1">{d.name}</div>
                      <div className="font-display text-xs text-gray-600 mb-2">{d.nameHi}</div>
                      <div className="font-mono text-xs text-gray-500">
                        {d.alerts} · {(d.population / 100000).toFixed(1)}L
                      </div>
                    </Link>
                  ))}
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
