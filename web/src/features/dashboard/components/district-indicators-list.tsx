import { Card, CardTitle } from '@/components/molecules/card';

import type { AreaIndicatorValue } from '@/features/indicators/schemas';

export interface DistrictIndicatorsListProps {
  districtName: string;
  indicators: AreaIndicatorValue[];
}

export function DistrictIndicatorsList({ districtName, indicators }: DistrictIndicatorsListProps) {
  if (indicators.length === 0) {
    return (
      <Card className="p-5">
        <p className="text-sm text-text-dark/60">No indicator values recorded for {districtName} yet.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardTitle>Indicators</CardTitle>
      <div className="divide-y divide-border">
        {indicators.map((item) => (
          <div key={item.indicator.key} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-semibold">{item.indicator.label.en}</p>
              <p className="text-xs text-text-dark/50">
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
    </Card>
  );
}
