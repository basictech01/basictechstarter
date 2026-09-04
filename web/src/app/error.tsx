'use client';

import { DashboardLayout } from '@/components/layouts/dashboard-layout';

/**
 * Next.js reports the underlying error to its own server-side logging automatically; this
 * boundary only needs to render a recoverable UI, not log again (no frontend logger exists yet).
 */
export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl font-bold mb-2">Something went wrong</h1>
          <p className="text-text-light/60 mb-6">
            This page hit an unexpected error. It has been logged; try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="bg-accent text-white px-6 py-2 rounded font-semibold hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
