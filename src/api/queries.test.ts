import { QueryClient } from '@tanstack/react-query';
import { afterEach, expect, it, vi } from 'vitest';

import { CACHE_TTL_MS } from './config';
import { queries } from './queries';

afterEach(() => vi.unstubAllGlobals());

it('reuses the top list when a podcast detail is opened directly', async () => {
  const request = vi.fn(async (url: string) => ({
    ok: true,
    json: async () =>
      url.includes('/lookup')
        ? {
            results: [{ kind: 'podcast', collectionId: 123, collectionName: 'Music' }]
          }
        : {
            feed: {
              entry: [
                {
                  id: { attributes: { 'im:id': '123' } },
                  'im:name': { label: 'Music' },
                  summary: { label: 'Podcast description' }
                }
              ]
            }
          }
  }));
  vi.stubGlobal('fetch', request);

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: CACHE_TTL_MS, retry: false } }
  });
  const detail = await queryClient.query(queries.podcastDetail('123'));
  expect(detail.description).toBe('Podcast description');
  expect(queryClient.getQueryData(queries.topPodcasts().queryKey)).toHaveLength(1);
  expect(request).toHaveBeenCalledTimes(2);
});
