'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Card } from '@/components/molecules/card';
import type { DistrictSummary } from '@/features/dashboard/schemas';
import { cn } from '@/lib/utils';

export interface DistrictPickerProps {
  districts: DistrictSummary[];
  a?: string;
  b?: string;
}

const SELECT_CLASS =
  'w-full rounded-md border-2 bg-surface/80 px-3 py-2 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none';

/** Two district selects, backed entirely by URL state (`?a=slug&b=slug`). */
export function DistrictPicker({ districts, a, b }: DistrictPickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: 'a' | 'b', value: string) => {
      const next = new URLSearchParams(searchParams);
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`${pathname}?${next.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <Card className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold">First district</span>
        <select value={a ?? ''} onChange={(e) => setParam('a', e.target.value)} className={cn(SELECT_CLASS, 'border-forest text-forest')}>
          <option value="">Select a district</option>
          {districts.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name.en}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Second district</span>
        <select value={b ?? ''} onChange={(e) => setParam('b', e.target.value)} className={cn(SELECT_CLASS, 'border-accent text-accent')}>
          <option value="">Select a district</option>
          {districts.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name.en}
            </option>
          ))}
        </select>
      </label>
    </Card>
  );
}
