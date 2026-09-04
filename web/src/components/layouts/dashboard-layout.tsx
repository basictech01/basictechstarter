import type { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar';

export interface DashboardLayoutProps {
  children: ReactNode;
  /** Defaults to the plain `Sidebar` (no live badge). Pages pass `<AppSidebar />` for the real count. */
  sidebar?: ReactNode;
}

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-bg-light">
      {sidebar ?? <Sidebar />}
      <main className="flex-1 overflow-auto bg-bg-light">{children}</main>
    </div>
  );
}
