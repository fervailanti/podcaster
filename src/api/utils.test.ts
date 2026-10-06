import { afterEach, expect, it, vi } from 'vitest';

import { CACHE_TTL_MS } from './config';
import { assertPodcastId, getJson } from './utils';

afterEach(() => vi.unstubAllGlobals());

it('returns JSON and applies the configured revalidation time', async () => {
  const data = { results: [{ id: 123 }] };
  const request = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => data
  });
  vi.stubGlobal('fetch', request);

  await expect(getJson<typeof data>('https://example.com')).resolves.toEqual(data);
  expect(request).toHaveBeenCalledWith('https://example.com', {
    next: { revalidate: CACHE_TTL_MS / 1000 }
  });
});

it('throws the HTTP status without parsing an unsuccessful response', async () => {
  const json = vi.fn();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503, json }));

  await expect(getJson('https://example.com')).rejects.toThrow('Request failed with HTTP 503');
  expect(json).not.toHaveBeenCalled();
});

it.each(['123', '00123'])('accepts a numeric podcast ID: %s', (id) => {
  expect(() => assertPodcastId(id)).not.toThrow();
});

it.each(['', 'abc', '12a', '-12', ' 12'])('rejects an invalid podcast ID: %s', (id) => {
  expect(() => assertPodcastId(id)).toThrow('Invalid podcast ID');
});
