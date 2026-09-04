'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  labelHi?: string;
  href: string;
  badge?: number;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Home Dashboard', labelHi: 'होम डैशबोर्ड', href: '/', icon: '🏠' },
  { label: 'Live Alerts', labelHi: 'लाइव अलर्ट', href: '/alerts', icon: '🚨', badge: 7 },
  { label: 'District Dashboard', labelHi: 'जिला डैशबोर्ड', href: '/districts', icon: '📊' },
  { label: 'Compare Districts', labelHi: 'तुलना करें', href: '/compare', icon: '⚖️' },
  { label: 'Traffic & Roads', labelHi: 'ट्रैफिक', href: '/roads', icon: '🚗', badge: 3 },
  { label: 'Weather & Rivers', labelHi: 'मौसम', href: '/weather', icon: '🌊' },
  { label: 'Tourism Live', labelHi: 'पर्यटन', href: '/tourism', icon: '🏛️' },
  { label: 'Migration Tracker', labelHi: 'प्रवासन', href: '/migration', icon: '🔄' },
  { label: 'Speed & Connectivity', labelHi: 'कनेक्टिविटी', href: '/connectivity', icon: '📡' },
  { label: 'Sector Intelligence', labelHi: 'खुफिया', href: '/intelligence', icon: '🧠' },
  { label: 'Governance Dashboard', labelHi: 'शासन', href: '/governance', icon: '⚙️' },
  { label: 'Offline Mode', labelHi: 'ऑफलाइन', href: '/offline', icon: '📱' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside id="sidebar" className="sidebar">
      {/* Logo / Branding */}
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">🏔️</span>
          <span className="logo-name">Pahad Pulse</span>
        </div>
        <p className="tagline">Uttarakhand Intelligence Platform</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
                          (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="badge">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <p className="footer-text">Real government data, live updates</p>
      </div>
    </aside>
  );
}
