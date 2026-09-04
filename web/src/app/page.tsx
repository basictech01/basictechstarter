'use client';

import React, { useState } from 'react';
import { InteractiveMap } from '@/components/map';

export default function HomePage() {
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  // Sample data - replace with real API calls
  const liveCounters = {
    tourists: 45823,
    alerts: 7,
    roads: 3,
    connectivity: 87,
  };

  const stateOverview = {
    population: 10086292,
    area: 53483,
    literacy: 78.82,
    districts: 13,
    forest: 63,
    villages: 16817,
  };

  const districts = [
    { id: 1, name: 'Uttarkashi', nameHi: 'उत्तरकाशी', population: 365638, alerts: 1 },
    { id: 2, name: 'Chamoli', nameHi: 'चमोली', population: 390235, alerts: 2 },
    { id: 3, name: 'Rudraprayag', nameHi: 'रुद्रप्रयाग', population: 244374, alerts: 0 },
    { id: 4, name: 'Uttarkashi', nameHi: 'उत्तरकाशी', population: 365638, alerts: 1 },
    { id: 5, name: 'Pauri Garhwal', nameHi: 'पौड़ी गढ़वाल', population: 688748, alerts: 0 },
    { id: 6, name: 'Tehri Garhwal', nameHi: 'टेहरी गढ़वाल', population: 647469, alerts: 1 },
    { id: 7, name: 'Dehradun', nameHi: 'देहरादून', population: 1703168, alerts: 0 },
    { id: 8, name: 'Garhwal', nameHi: 'गढ़वाल', population: 568276, alerts: 2 },
    { id: 9, name: 'Almora', nameHi: 'अल्मोड़ा', population: 572606, alerts: 0 },
    { id: 10, name: 'Bageshwar', nameHi: 'बागेश्वर', population: 267537, alerts: 0 },
    { id: 11, name: 'Nainital', nameHi: 'नैनीताल', population: 902158, alerts: 1 },
    { id: 12, name: 'Pithoragarh', nameHi: 'पिथौरागढ़', population: 483439, alerts: 0 },
    { id: 13, name: 'Champawat', nameHi: 'चम्पावत', population: 261648, alerts: 0 },
  ];

  return (
    <div className="home-dashboard">
      {/* Page Header */}
      <div className="page-header">
        <h1>Uttarakhand Home Dashboard</h1>
        <p className="subtitle">Live state-level overview with interactive map and key metrics</p>
      </div>

      {/* Live Counters Section */}
      <div className="counters-grid">
        <div className="counter-card">
          <div className="counter-icon">🚌</div>
          <div className="counter-value">{liveCounters.tourists.toLocaleString()}</div>
          <div className="counter-label">Tourists in State</div>
        </div>
        <div className="counter-card">
          <div className="counter-icon">🚨</div>
          <div className="counter-value">{liveCounters.alerts}</div>
          <div className="counter-label">Active Alerts</div>
        </div>
        <div className="counter-card">
          <div className="counter-icon">🚫</div>
          <div className="counter-value">{liveCounters.roads}</div>
          <div className="counter-label">Road Closures</div>
        </div>
        <div className="counter-card">
          <div className="counter-icon">📡</div>
          <div className="counter-value">{liveCounters.connectivity}%</div>
          <div className="counter-label">Connectivity</div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="map-section bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2">Uttarakhand Interactive Map</h2>
        <p className="text-gray-600 mb-6">Click any district to view details. The map shows alert intensity by region.</p>
        <InteractiveMap layer="alerts" clickable={true} />
      </div>

      {/* State Overview Card */}
      <div className="state-overview">
        <h2>State Overview</h2>
        <div className="overview-grid">
          <div className="overview-item">
            <div className="overview-label">Population</div>
            <div className="overview-value">{(stateOverview.population / 10000000).toFixed(2)}Cr</div>
          </div>
          <div className="overview-item">
            <div className="overview-label">Area (km²)</div>
            <div className="overview-value">{stateOverview.area.toLocaleString()}</div>
          </div>
          <div className="overview-item">
            <div className="overview-label">Literacy Rate</div>
            <div className="overview-value">{stateOverview.literacy}%</div>
          </div>
          <div className="overview-item">
            <div className="overview-label">Districts</div>
            <div className="overview-value">{stateOverview.districts}</div>
          </div>
          <div className="overview-item">
            <div className="overview-label">Forest Cover</div>
            <div className="overview-value">{stateOverview.forest}%</div>
          </div>
          <div className="overview-item">
            <div className="overview-label">Villages</div>
            <div className="overview-value">{stateOverview.villages.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="quick-access">
        <h2>Quick Access</h2>
        <div className="quick-grid">
          <a href="/alerts" className="quick-button">
            <span className="quick-icon">🚨</span>
            <span>Live Alerts</span>
          </a>
          <a href="/districts" className="quick-button">
            <span className="quick-icon">📊</span>
            <span>Districts</span>
          </a>
          <a href="/tourism" className="quick-button">
            <span className="quick-icon">🏛️</span>
            <span>Tourism</span>
          </a>
          <a href="/weather" className="quick-button">
            <span className="quick-icon">🌊</span>
            <span>Weather & Rivers</span>
          </a>
          <a href="/roads" className="quick-button">
            <span className="quick-icon">🚗</span>
            <span>Traffic & Roads</span>
          </a>
          <a href="/connectivity" className="quick-button">
            <span className="quick-icon">📡</span>
            <span>Connectivity</span>
          </a>
          <a href="/migration" className="quick-button">
            <span className="quick-icon">🔄</span>
            <span>Migration</span>
          </a>
          <a href="/intelligence" className="quick-button">
            <span className="quick-icon">🧠</span>
            <span>Intelligence</span>
          </a>
          <a href="/compare" className="quick-button">
            <span className="quick-icon">⚖️</span>
            <span>Compare</span>
          </a>
        </div>
      </div>

      {/* Districts Grid */}
      <div className="districts-section">
        <h2>All 13 Districts</h2>
        <div className="districts-grid">
          {districts.map((district) => (
            <a key={district.id} href={`/districts/${district.id}`} className="district-card">
              <h4>{district.name}</h4>
              <p className="district-hindi">{district.nameHi}</p>
              <div className="district-stats">
                <div className="stat">
                  <span className="stat-label">Population</span>
                  <span className="stat-value">{(district.population / 100000).toFixed(1)}L</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Alerts</span>
                  <span className={`stat-value ${district.alerts > 0 ? 'alert' : ''}`}>
                    {district.alerts}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <p>Data from government sources — see each figure's attribution on district pages</p>
      </div>
    </div>
  );
}
