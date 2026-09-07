import { Card, CardTitle } from '@/components/molecules/card';

import type { Area } from '../schemas';

export interface DistrictTehsilListProps {
  tehsils: Area[];
}

export function DistrictTehsilList({ tehsils }: DistrictTehsilListProps) {
  if (tehsils.length === 0) {
    return (
      <Card className="p-5">
        <p className="text-sm text-text-dark/60">No tehsils recorded.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardTitle>Tehsils</CardTitle>
      <ul className="grid grid-cols-2 gap-2 p-4 text-sm sm:grid-cols-3 lg:grid-cols-4">
        {tehsils.map((tehsil) => (
          <li key={tehsil.id} className="rounded-md border border-border bg-surface/70 px-3 py-2">
            {tehsil.name.en}
          </li>
        ))}
      </ul>
    </Card>
  );
}
