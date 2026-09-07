import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface CardProps {
  children?: ReactNode;
  /** Tinted background for a card nested inside another card (e.g. a quick-access panel). */
  tinted?: boolean;
  className?: string;
}

/** The base panel used across every dashboard screen — a translucent, bordered surface. */
export function Card({ children, tinted = false, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface/70 backdrop-blur-sm',
        tinted && 'bg-forest/5',
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

/** A `Card`'s header strip — a bordered-bottom title bar, not a heading element by itself. */
export function CardTitle({ children, className }: CardTitleProps) {
  return <div className={cn('border-b border-border px-4 py-3 text-sm font-semibold', className)}>{children}</div>;
}
