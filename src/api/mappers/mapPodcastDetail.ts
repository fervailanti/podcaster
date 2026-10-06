import sanitizeHtml from 'sanitize-html';

import type {
  Episode,
  PodcastDetail,
  PodcastLookupItem,
  PodcastLookupResponse,
  PodcastSummary
} from '../types';

const mapEpisode = (item: PodcastLookupItem): Episode | null => {
  if (item.kind !== 'podcast-episode' || !item.trackId) return null;

  return {
    id: String(item.trackId),
    title: item.trackName ?? 'Untitled episode',
    descriptionHtml: sanitizeHtml(item.description ?? ''),
    publishedAt: item.releaseDate ?? '',
    durationMs: item.trackTimeMillis ?? null,
    audioUrl: item.episodeUrl?.startsWith('https://') ? item.episodeUrl : null
  };
};

export const mapPodcastDetail = (
  lookup: PodcastLookupResponse,
  summary?: PodcastSummary
): PodcastDetail => {
  const items = lookup.results;
  if (!Array.isArray(items)) throw new Error('Invalid Apple podcast lookup');
  const podcast = items.find((item) => item.kind === 'podcast');
  if (!podcast?.collectionId) throw new Error('Podcast not found');

  const episodes = items.flatMap((item) => {
    const episode = mapEpisode(item);
    return episode ? [episode] : [];
  });

  return {
    id: String(podcast.collectionId),
    title: podcast.collectionName ?? summary?.title ?? '',
    author: podcast.artistName ?? summary?.author ?? '',
    artwork: podcast.artworkUrl600 ?? podcast.artworkUrl100 ?? summary?.artwork ?? '',
    description: summary?.description ?? '',
    episodeCount: podcast.trackCount ?? episodes.length,
    episodes
  };
};
