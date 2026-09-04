import { describe, expect, it } from 'vitest';
import { describeObservationAge } from './utils';

describe('describeObservationAge', () => {
  it('returns "No data" when there is no observation', () => {
    expect(describeObservationAge(null)).toEqual({ label: 'No data', level: 'unknown' });
  });

  it('is "fresh" well inside the NWDP cadence (a few hours old)', () => {
    const now = new Date('2026-09-04T12:00:00.000Z');
    const observedAt = new Date('2026-09-04T09:00:00.000Z').toISOString();
    expect(describeObservationAge(observedAt, now).level).toBe('fresh');
  });

  it('is "stale" once well past the ~2 day NWDP lag', () => {
    const now = new Date('2026-09-04T12:00:00.000Z');
    const observedAt = new Date('2026-09-01T00:00:00.000Z').toISOString(); // ~84h
    expect(describeObservationAge(observedAt, now).level).toBe('stale');
  });

  it('is "expired" once far beyond the expected cadence', () => {
    const now = new Date('2026-09-04T12:00:00.000Z');
    const observedAt = new Date('2026-08-20T00:00:00.000Z').toISOString(); // > 168h
    expect(describeObservationAge(observedAt, now).level).toBe('expired');
  });
});
