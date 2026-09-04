'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { DistrictSummary } from '@/features/dashboard/schemas';

export interface DistrictPickerProps {
  districts: DistrictSummary[];
  a?: string;
  b?: string;
}

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="block">
        <span className="text-sm font-semibold block mb-1">First district</span>
        <select
          value={a ?? ''}
          onChange={(e) => setParam('a', e.target.value)}
          className="w-full border border-border rounded px-3 py-2 bg-surface"
        >
          <option value="">Select a district</option>
          {districts.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name.en}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-semibold block mb-1">Second district</span>
        <select
          value={b ?? ''}
          onChange={(e) => setParam('b', e.target.value)}
          className="w-full border border-border rounded px-3 py-2 bg-surface"
        >
          <option value="">Select a district</option>
          {districts.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name.en}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
