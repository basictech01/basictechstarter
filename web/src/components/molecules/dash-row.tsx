import type { ReactNode } from 'react';

export interface DashRowProps {
  label: ReactNode;
  value: ReactNode;
}

/** A label/value row with a dashed divider — used in profile and overview cards. */
export function DashRow({ label, value }: DashRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-border py-2">
      <span className="text-sm text-text-dark/70">{label}</span>
      <span className="font-mono text-sm font-medium">{value}</span>
    </div>
  );
}
