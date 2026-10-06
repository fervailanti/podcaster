import { queryOptions } from '@tanstack/react-query';

import { APPLE_API_BASE_URL } from './config';
import { mapPodcastDetail, mapTopPodcasts } from './mappers';
import type { PodcastLookupResponse, TopPodcastsResponse } from './types';
import { assertPodcastId, getJson } from './utils';

export const queries = {
  topPodcasts: () =>
    queryOptions({
      queryKey: ['topPodcasts'],
      queryFn: async () => {
        const url = `${APPLE_API_BASE_URL}/us/rss/toppodcasts/limit=100/genre=1310/json`;

        const data = await getJson<TopPodcastsResponse>(url);

        return mapTopPodcasts(data);
      }
    }),

  podcastDetail: (id: string) =>
    queryOptions({
      queryKey: ['podcast', id],
      queryFn: async ({ client }) => {
        assertPodcastId(id);

        const url = new URL(`${APPLE_API_BASE_URL}/lookup`);
        url.searchParams.set('id', id);
        url.searchParams.set('media', 'podcast');
        url.searchParams.set('entity', 'podcastEpisode');
        url.searchParams.set('limit', '20');

        const [lookup, topPodcasts] = await Promise.all([
          getJson<PodcastLookupResponse>(url.toString()),
          client.query(queries.topPodcasts())
        ]);

        return mapPodcastDetail(
          lookup,
          topPodcasts.find((podcast) => podcast.id === id)
        );
      }
    })
};
