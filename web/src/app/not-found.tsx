import Link from 'next/link';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';

export default function NotFound() {
  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl font-bold mb-2">Page not found</h1>
          <p className="text-text-light/60 mb-6">
            The page or district you&rsquo;re looking for doesn&rsquo;t exist.
          </p>
          <Link href="/" className="text-accent font-semibold hover:underline">
            ← Back to the dashboard
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
