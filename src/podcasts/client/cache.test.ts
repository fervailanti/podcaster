import { beforeEach, describe, expect, it } from 'vitest';
import { CACHE_TTL_MS, readCache, writeCache } from './cache';

describe('podcast client cache', () => {
  beforeEach(() => localStorage.clear());

  it('reuses a stored response until 24 hours have passed', () => {
    writeCache('top', [{ id: '42' }], 1_000);
    expect(readCache('top', 1_000 + CACHE_TTL_MS - 1)).toEqual([{ id: '42' }]);
    expect(readCache('top', 1_000 + CACHE_TTL_MS)).toBeNull();
  });

  it('keeps podcast details under separate keys', () => {
    writeCache('podcast:1', { title: 'One' }, 1_000);
    writeCache('podcast:2', { title: 'Two' }, 1_000);
    expect(readCache('podcast:1', 2_000)).toEqual({ title: 'One' });
    expect(readCache('podcast:2', 2_000)).toEqual({ title: 'Two' });
  });
});
