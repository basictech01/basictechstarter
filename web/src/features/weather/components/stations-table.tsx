import Link from 'next/link';
import type { WeatherStation } from '../schemas';
import { describeObservationAge } from '../utils';

export interface StationsTableProps {
  stations: WeatherStation[];
}

export function StationsTable({ stations }: StationsTableProps) {
  return (
    <div className="overflow-x-auto bg-surface border border-border rounded-lg">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th scope="col">Station</th>
            <th scope="col">District</th>
            <th scope="col">Rainfall</th>
            <th scope="col">Temp.</th>
            <th scope="col">Humidity</th>
            <th scope="col">Observed</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => {
            const age = describeObservationAge(station.latest.observedAt);
            return (
              <tr key={station.id}>
                <td className="font-semibold">{station.name}</td>
                <td>
                  <Link href={`/districts/${station.district.slug}`} className="hover:text-accent">
                    {station.district.name.en}
                  </Link>
                </td>
                <td>{station.latest.rainfallMm !== null ? `${station.latest.rainfallMm}mm` : 'No data'}</td>
                <td>{station.latest.temperatureCelsius !== null ? `${station.latest.temperatureCelsius}°C` : 'No data'}</td>
                <td>{station.latest.humidityPercent !== null ? `${station.latest.humidityPercent}%` : 'No data'}</td>
                <td>
                  <span
                    className={
                      age.level === 'expired'
                        ? 'text-red-700'
                        : age.level === 'stale'
                          ? 'text-yellow-700'
                          : 'text-text-dark'
                    }
                  >
                    {age.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
