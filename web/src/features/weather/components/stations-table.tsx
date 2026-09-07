import Link from 'next/link';

import { Card } from '@/components/molecules/card';
import { cn } from '@/lib/utils';

import type { WeatherStation } from '../schemas';
import { describeObservationAge } from '../utils';

export interface StationsTableProps {
  stations: WeatherStation[];
}

export function StationsTable({ stations }: StationsTableProps) {
  return (
    <Card className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs tracking-wide text-text-dark/55 uppercase">
            <th scope="col" className="px-4 py-3 font-semibold">
              Station
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              District
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Rainfall
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Temp.
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Humidity
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Observed
            </th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => {
            const age = describeObservationAge(station.latest.observedAt);
            return (
              <tr key={station.id} className="border-b border-border/60 last:border-b-0 hover:bg-surface-hover">
                <td className="px-4 py-3 font-semibold">{station.name}</td>
                <td className="px-4 py-3">
                  <Link href={`/districts/${station.district.slug}`} className="hover:text-accent">
                    {station.district.name.en}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono">
                  {station.latest.rainfallMm !== null ? `${station.latest.rainfallMm}mm` : 'No data'}
                </td>
                <td className="px-4 py-3 font-mono">
                  {station.latest.temperatureCelsius !== null ? `${station.latest.temperatureCelsius}°C` : 'No data'}
                </td>
                <td className="px-4 py-3 font-mono">
                  {station.latest.humidityPercent !== null ? `${station.latest.humidityPercent}%` : 'No data'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'font-mono text-xs',
                      age.level === 'expired'
                        ? 'text-alert-critical'
                        : age.level === 'stale'
                          ? 'text-alert-warning'
                          : 'text-text-dark/60',
                    )}
                  >
                    {age.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
