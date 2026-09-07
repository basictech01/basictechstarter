import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { AlertCard } from '@/features/alerts/components';
import { fetchAreaAlerts } from '@/features/alerts/services';
import {
  AppSidebar,
  DistrictIndicatorsList,
  DistrictMetricCards,
  DistrictProfileCard,
  DistrictSwitcher,
  DistrictTehsilList,
} from '@/features/dashboard/components';
import { fetchAllDistricts, fetchDistrictDetail } from '@/features/dashboard/services';
import { fetchAreaIndicators } from '@/features/indicators/services';
import { CurrentConditionsCard } from '@/features/weather/components';
import { fetchAreaWeather } from '@/features/weather/services';
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

  const [indicatorsResult, alertsResult, weatherResult, allDistrictsResult] = await Promise.allSettled([
    fetchAreaIndicators(slug),
    fetchAreaAlerts(slug, undefined, 10),
    fetchAreaWeather(slug),
    fetchAllDistricts(),
  ]);

  const indicators = indicatorsResult.status === 'fulfilled' ? indicatorsResult.value : [];
  const alerts = alertsResult.status === 'fulfilled' ? alertsResult.value.data : [];
  const weather = weatherResult.status === 'fulfilled' ? weatherResult.value : null;
  const allDistricts = allDistrictsResult.status === 'fulfilled' ? allDistrictsResult.value : [];

  const { district, tehsils, boundary } = detail;
  const boundaryStatus = boundary === null ? 'Not available' : boundary.isPlaceholder ? 'Placeholder' : 'Surveyed';

  return (
    <DashboardLayout sidebar={<AppSidebar />}>
      <div className="space-y-5 p-6 md:p-8">
        {allDistricts.length > 0 && <DistrictSwitcher districts={allDistricts} currentSlug={slug} />}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr] lg:items-start">
          <DistrictProfileCard district={district} tehsilCount={tehsils.length} boundary={boundary} />

          <div className="flex flex-col gap-4">
            <DistrictMetricCards
              tehsilCount={tehsils.length}
              boundaryStatus={boundaryStatus}
              activeAlertCount={alerts.length}
              headquarters={district.headquarters?.en ?? 'Unknown'}
            />

            <section>
              <h2 className="font-display mb-3 text-xl font-bold">Active Alerts</h2>
              {alerts.length === 0 ? (
                <p className="text-sm text-text-dark/60">No active alerts for {district.name.en}.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {alerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-display mb-3 text-xl font-bold">Current Conditions</h2>
              {weather === null ? (
                <p className="text-sm text-text-dark/60">Weather data is unavailable for {district.name.en} right now.</p>
              ) : (
                <CurrentConditionsCard title={district.name.en} snapshot={weather.latest} />
              )}
            </section>

            <DistrictIndicatorsList districtName={district.name.en} indicators={indicators} />

            <DistrictTehsilList tehsils={tehsils} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
