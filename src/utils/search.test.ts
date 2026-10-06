import { describe, expect, it } from 'vitest';

import { matchesSearch } from './search';

describe('matchesSearch', () => {
  it('matches any searchable value', () => {
    expect(matchesSearch(['Música Viva', 'Álvaro'], 'MUSICA')).toBe(true);
    expect(matchesSearch(['Música Viva', 'Álvaro'], 'alvaro')).toBe(true);
  });

  it('ignores surrounding whitespace and letter case', () => {
    expect(matchesSearch(['Daily News'], '  daily  ')).toBe(true);
  });

  it('returns false when no value matches', () => {
    expect(matchesSearch(['Daily News', 'Alex'], 'sports')).toBe(false);
  });

  it('matches an empty query', () => {
    expect(matchesSearch(['Daily News'], '')).toBe(true);
  });

  it('supports an empty collection', () => {
    expect(matchesSearch([], 'query')).toBe(false);
  });
});
