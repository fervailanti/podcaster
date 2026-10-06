import sanitizeHtml from 'sanitize-html';

import type { PodcastSummary, TopPodcastsResponse } from '../types';

export const mapTopPodcasts = (feed: TopPodcastsResponse): PodcastSummary[] => {
  if (!Array.isArray(feed.feed?.entry)) throw new Error('Invalid Apple podcast feed');

  return feed.feed.entry.flatMap((entry) => {
    const id = entry.id?.attributes?.['im:id'];
    const title = entry['im:name']?.label;
    if (!id || !title) return [];

    return [
      {
        id,
        title,
        author: entry['im:artist']?.label ?? '',
        artwork: entry['im:image']?.at(-1)?.label ?? '',
        description: sanitizeHtml(entry.summary?.label ?? '')
      }
    ];
  });
};
