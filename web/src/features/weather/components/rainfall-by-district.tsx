import { Bar } from '@/components/molecules/bar';
import { Card } from '@/components/molecules/card';
import { SourceNote } from '@/components/molecules/source-note';

import type { DistrictRainfall } from '../utils';

export interface RainfallByDistrictProps {
  /** Already aggregated by `aggregateRainfallByDistrict`, highest first. */
  data: DistrictRainfall[];
}

/** Built entirely from the real per-station snapshot (`GET /weather/stations`) — no CWC/river data involved. */
export function RainfallByDistrict({ data }: RainfallByDistrictProps) {
  if (data.length === 0) {
    return (
      <Card className="p-5">
        <h2 className="mb-2 text-sm font-semibold">Rainfall by district</h2>
        <p className="text-sm text-text-dark/60">No station has reported a rainfall reading yet.</p>
      </Card>
    );
  }

  const max = Math.max(...data.map((d) => d.rainfallMm), 1);

  return (
    <Card className="p-5">
      <h2 className="mb-3.5 text-sm font-semibold">Rainfall by district · latest reading</h2>
      <div className="flex flex-col gap-2.5">
        {data.map((d) => (
          <div key={d.slug} className="flex items-center gap-3">
            <div className="w-28 flex-none truncate text-xs" title={d.name}>
              {d.name}
            </div>
            <div className="flex-1">
              <Bar pct={(d.rainfallMm / max) * 100} tone="violet" size="md" />
            </div>
            <div className="w-16 flex-none text-right font-mono text-xs">{d.rainfallMm}mm</div>
          </div>
        ))}
      </div>
      <SourceNote>Source: NWDP automatic weather stations</SourceNote>
    </Card>
  );
}
