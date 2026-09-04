import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { AppSidebar } from '@/features/dashboard/components';
import { fetchDistrictDetail } from '@/features/dashboard/services';
import { fetchAreaAlerts } from '@/features/alerts/services';
import { AlertCard } from '@/features/alerts/components';
import { fetchAreaIndicators } from '@/features/indicators/services';
import { fetchAreaWeather } from '@/features/weather/services';
import { CurrentConditionsCard } from '@/features/weather/components';
import { ApiError } from '@/lib/api';
import { ERROR_CODES } from '@/types/api';

interface DistrictPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DistrictPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} — Pahad Pulse` };
}

export const dynamic = 'force-dynamic';

export default async function DistrictDetailPage({ params }: DistrictPageProps) {
  const { slug } = await params;

  let detail;
  try {
    detail = await fetchDistrictDetail(slug);
  } catch (err) {
    if (err instanceof ApiError && err.code === ERROR_CODES.AREA_NOT_FOUND) notFound();
    throw err;
  }

  const [indicatorsResult, alertsResult, weatherResult] = await Promise.allSettled([
    fetchAreaIndicators(slug),
    fetchAreaAlerts(slug, undefined, 10),
    fetchAreaWeather(slug),
  ]);

  const indicators = indicatorsResult.status === 'fulfilled' ? indicatorsResult.value : [];
  const alerts = alertsResult.status === 'fulfilled' ? alertsResult.value.data : [];
  const weather = weatherResult.status === 'fulfilled' ? weatherResult.value : null;

  const { district, tehsils, boundary } = detail;

  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <div className="bg-bg-dark text-text-dark py-8 px-6">
        <h1 className="font-display text-4xl font-bold">{district.name.en}</h1>
        <p className="text-text-dark/70 mt-2 font-display">{district.name.hi}</p>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary-accent">
            <div className="text-sm text-gray-600 mb-1">Tehsils</div>
            <div className="text-2xl font-bold text-text-dark">{tehsils.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary-accent">
            <div className="text-sm text-gray-600 mb-1">Boundary</div>
            <div className="text-2xl font-bold text-text-dark">
              {boundary === null ? 'Not available' : boundary.isPlaceholder ? 'Placeholder' : 'Surveyed'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-alert-critical">
            <div className="text-sm text-gray-600 mb-1">Active Alerts</div>
            <div className="text-2xl font-bold text-alert-critical">{alerts.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary-accent">
            <div className="text-sm text-gray-600 mb-1">Headquarters</div>
            <div className="text-lg font-bold text-text-dark">{district.headquarters?.en ?? 'Unknown'}</div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold font-display mb-3">Active Alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-text-light/60">No active alerts for {district.name.en}.</p>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold font-display mb-3">Current Conditions</h2>
          {weather === null ? (
            <p className="text-text-light/60">Weather data is unavailable for {district.name.en} right now.</p>
          ) : (
            <CurrentConditionsCard title={district.name.en} snapshot={weather.latest} />
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold font-display mb-3">Indicators</h2>
          {indicators.length === 0 ? (
            <p className="text-text-light/60">No indicator values recorded for {district.name.en} yet.</p>
          ) : (
            <div className="bg-white rounded-lg shadow-sm divide-y divide-border">
              {indicators.map((item) => (
                <div key={item.indicator.key} className="flex justify-between items-center px-4 py-3">
                  <div>
                    <p className="font-semibold text-sm">{item.indicator.label.en}</p>
                    <p className="text-xs text-text-light/50">
                      Vintage {item.vintage} · Source: {item.provenance?.department.en ?? 'Unknown'}
                    </p>
                  </div>
                  <p className="font-mono font-semibold">
                    {item.value}
                    {item.indicator.unit === 'percent' ? '%' : ` ${item.indicator.unit}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold font-display mb-3">Tehsils</h2>
          {tehsils.length === 0 ? (
            <p className="text-text-light/60">No tehsils recorded.</p>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {tehsils.map((tehsil) => (
                <li key={tehsil.id} className="bg-white rounded px-3 py-2 shadow-sm">
                  {tehsil.name.en}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
