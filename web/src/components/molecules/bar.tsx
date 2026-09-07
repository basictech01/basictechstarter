import { cn } from '@/lib/utils';

export type BarTone = 'accent' | 'forest' | 'violet' | 'blue' | 'green' | 'rust' | 'critical' | 'warning';

const TONE_BG: Record<BarTone, string> = {
  accent: 'bg-accent',
  forest: 'bg-forest',
  violet: 'bg-violet',
  blue: 'bg-blue',
  green: 'bg-green',
  rust: 'bg-rust',
  critical: 'bg-alert-critical',
  warning: 'bg-alert-warning',
};

export interface BarProps {
  /** Percentage filled. Values outside 0–100 are clamped. */
  pct: number;
  tone: BarTone;
  /** Track height — `sm` for compact rows, `md` for a standalone bar. */
  size?: 'sm' | 'md';
  className?: string;
}

/** A horizontal proportion bar — used for rainfall-by-district, service coverage, comparisons. */
export function Bar({ pct, tone, size = 'sm', className }: BarProps) {
  const clamped = Math.max(0, Math.min(100, pct));

  return (
    <div
      className={cn('rounded bg-border/40', size === 'sm' ? 'h-2' : 'h-3.5', className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={cn('h-full rounded', TONE_BG[tone])} style={{ width: `${clamped}%` }} />
    </div>
  );
}
