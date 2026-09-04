export interface ComingSoonProps {
  title: string;
  /** What this page will eventually show, once a real source exists. */
  description: string;
  /** Named data points this page is waiting on — shown as a plain list, no fake numbers. */
  plannedMetrics?: string[];
}

/**
 * The one honest empty state for every module with no connected government data source yet.
 * Never a fabricated number, never a silent blank page.
 */
export function ComingSoon({ title, description, plannedMetrics }: ComingSoonProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h2 className="font-bold text-amber-900 mb-2">{title}</h2>
        <p className="text-amber-800 text-sm">{description}</p>
      </div>

      {plannedMetrics && plannedMetrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plannedMetrics.map((metric) => (
            <div key={metric} className="bg-surface border border-border rounded-lg p-4">
              <p className="text-sm text-text-light/70">{metric}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-center py-8 text-text-light/60">
        Coming soon — no verified government data source connected yet.
      </p>
    </div>
  );
}
