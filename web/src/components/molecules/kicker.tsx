import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface KickerProps {
  children: ReactNode;
  className?: string;
}

/** Small uppercase mono label used above a metric or section ("STATE OVERVIEW", "LIVE ALERTS"). */
export function Kicker({ children, className }: KickerProps) {
  return (
    <div className={cn('font-mono text-xs tracking-widest text-text-dark/50 uppercase', className)}>{children}</div>
  );
}
