import { Card, CardTitle } from '@/components/molecules/card';

import type { ComparisonResult } from '../schemas';

export interface ComparisonTableProps {
  result: ComparisonResult;
  nameA: string;
  nameB: string;
}

export function ComparisonTable({ result, nameA, nameB }: ComparisonTableProps) {
  if (result.rows.length === 0) {
    return (
      <Card className="p-5">
        <p className="text-sm text-text-dark/60">
          No indicator has a recorded value for both districts yet.
          {result.omittedCount > 0 && ` (${result.omittedCount} indicator(s) had a value for only one side.)`}
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardTitle>Head to head</CardTitle>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs tracking-wide text-text-dark/55 uppercase">
              <th scope="col" className="px-4 py-3 font-semibold">
                Indicator
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-forest">
                {nameA}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-accent">
                {nameB}
              </th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr key={row.indicator.key} className="border-b border-dashed border-border last:border-b-0">
                <td className="px-4 py-2.5 font-semibold">{row.indicator.label.en}</td>
                <td className="px-4 py-2.5 font-mono">
                  {row.areaA.value}
                  {row.indicator.unit === 'percent' ? '%' : ` ${row.indicator.unit}`}
                </td>
                <td className="px-4 py-2.5 font-mono">
                  {row.areaB.value}
                  {row.indicator.unit === 'percent' ? '%' : ` ${row.indicator.unit}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result.omittedCount > 0 && (
        <p className="border-t border-border px-4 py-2 text-xs text-text-dark/50">
          {result.omittedCount} indicator(s) omitted — no value recorded for one of the two districts.
        </p>
      )}
    </Card>
  );
}
