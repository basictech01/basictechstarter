import type { ComparisonResult } from '../schemas';

export interface ComparisonTableProps {
  result: ComparisonResult;
  nameA: string;
  nameB: string;
}

export function ComparisonTable({ result, nameA, nameB }: ComparisonTableProps) {
  if (result.rows.length === 0) {
    return (
      <p className="text-text-light/60">
        No indicator has a recorded value for both districts yet.
        {result.omittedCount > 0 && ` (${result.omittedCount} indicator(s) had a value for only one side.)`}
      </p>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th scope="col">Indicator</th>
            <th scope="col">{nameA}</th>
            <th scope="col">{nameB}</th>
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row) => (
            <tr key={row.indicator.key}>
              <td className="font-semibold">{row.indicator.label.en}</td>
              <td>
                {row.areaA.value}
                {row.indicator.unit === 'percent' ? '%' : ` ${row.indicator.unit}`}
              </td>
              <td>
                {row.areaB.value}
                {row.indicator.unit === 'percent' ? '%' : ` ${row.indicator.unit}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {result.omittedCount > 0 && (
        <p className="text-xs text-text-light/50 px-4 py-2 border-t border-border">
          {result.omittedCount} indicator(s) omitted — no value recorded for one of the two districts.
        </p>
      )}
    </div>
  );
}
