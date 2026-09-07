import { Card } from '@/components/molecules/card';
import { DashRow } from '@/components/molecules/dash-row';
import { SourceNote } from '@/components/molecules/source-note';

import type { Area, DistrictDetail } from '../schemas';

export interface DistrictProfileCardProps {
  district: Area;
  tehsilCount: number;
  boundary: DistrictDetail['boundary'];
}

export function DistrictProfileCard({ district, tehsilCount, boundary }: DistrictProfileCardProps) {
  return (
    <Card className="p-5">
      <h1 className="font-display text-3xl leading-none font-bold">{district.name.en}</h1>
      <p className="font-display mt-1 mb-3 text-lg font-semibold text-rust">{district.name.hi}</p>

      <div className="flex flex-col">
        <DashRow label="Division" value={district.division ?? 'Unknown'} />
        <DashRow label="Headquarters" value={district.headquarters?.en ?? 'Unknown'} />
        <DashRow label="Tehsils" value={tehsilCount} />
        <DashRow label="Boundary" value={boundary === null ? 'Not available' : boundary.isPlaceholder ? 'Placeholder' : 'Surveyed'} />
        {district.officialIds.lgd && <DashRow label="LGD code" value={district.officialIds.lgd} />}
        {district.officialIds.census2011 && <DashRow label="Census 2011 code" value={district.officialIds.census2011} />}
      </div>

      <SourceNote>Source: Local Government Directory (LGD) · Census of India 2011</SourceNote>
    </Card>
  );
}
