'use client';

import { useEffect, useState } from 'react';

/**
 * Real client clock, displayed in IST regardless of the visitor's own timezone (matches the
 * product's "display is IST, converted at the edge" rule). This is a genuine live clock, not a
 * fabricated "last synced" timestamp — nothing here claims data was just fetched.
 */
export function LiveClock() {
  // `null` until mounted so the server-rendered markup never disagrees with the client's clock.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return null;

  const time = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <span className="inline-flex flex-none items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1">
      <span className="size-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" />
      <span className="font-mono text-xs whitespace-nowrap text-rust">LIVE · {time} IST</span>
    </span>
  );
}
