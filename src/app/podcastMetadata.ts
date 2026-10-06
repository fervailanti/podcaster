import type { Metadata } from 'next';

import { queries } from '@/api/queries';
import { getQueryClient } from '@/api/tanstack/queryClient';
import { getAppMetadata } from '@/i18n/server';

export const getPodcastMetadata = async (
  podcastId: string,
  episodeId?: string
): Promise<Metadata> => {
  const pathname = episodeId
    ? `/podcast/${podcastId}/episode/${episodeId}`
    : `/podcast/${podcastId}`;
  const metadataKey = episodeId ? 'episode' : 'podcast';

  try {
    const podcast = await getQueryClient().fetchQuery(queries.podcastDetail(podcastId));
    const episode = episodeId ? podcast.episodes.find((item) => item.id === episodeId) : undefined;
    const values = episode
      ? { podcastTitle: podcast.title, episodeTitle: episode.title }
      : { podcastTitle: podcast.title };

    return getAppMetadata(metadataKey, pathname, values);
  } catch {
    return getAppMetadata(metadataKey, pathname);
  }
};
