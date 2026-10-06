import { describe, expect, it } from 'vitest';

import { formatDate, formatDuration } from './format';

describe('formatDuration', () => {
  it('formats minutes and seconds', () => {
    expect(formatDuration(24 * 60 * 1_000)).toBe('24:00');
    expect(formatDuration(1_234_000)).toBe('20:34');
  });

  it('includes hours when needed', () => {
    expect(formatDuration(3_661 * 1_000)).toBe('1:01:01');
  });

  it('rounds milliseconds to the nearest second', () => {
    expect(formatDuration(1_500.6)).toBe('00:02');
  });

  it('returns a fallback for missing or invalid durations', () => {
    expect(formatDuration(null)).toBe('—');
    expect(formatDuration(Number.NaN)).toBe('—');
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe('—');
  });
});

describe('formatDate', () => {
  it('formats a valid date using the requested locale', () => {
    expect(formatDate('2024-01-15T12:00:00.000Z', 'en-US')).toBe('Jan 15, 2024');
    expect(formatDate('2024-01-15T12:00:00.000Z', 'es-ES')).toBe('15 ene 2024');
  });

  it('returns a fallback for empty or invalid dates', () => {
    expect(formatDate('')).toBe('—');
    expect(formatDate('not-a-date')).toBe('—');
  });
});
