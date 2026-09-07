import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface SourceNoteProps {
  children: ReactNode;
  className?: string;
}

/** Provenance footer for a card built from real fetched data — names the department/source. */
export function SourceNote({ children, className }: SourceNoteProps) {
  return <p className={cn('mt-2.5 font-mono text-xs leading-relaxed text-text-dark/45', className)}>{children}</p>;
}
