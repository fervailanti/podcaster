import sanitizeHtml from 'sanitize-html';
import type { Episode, PodcastDetail, PodcastSummary } from './types';

type AppleLabel = { label?: string };
type AppleFeedEntry = {
  id?: { attributes?: { 'im:id'?: string } };
  'im:name'?: AppleLabel;
  'im:artist'?: AppleLabel;
  'im:image'?: AppleLabel[];
  summary?: AppleLabel;
};

type AppleLookupItem = {
  kind?: string;
  collectionId?: number;
  trackId?: number;
  collectionName?: string;
  artistName?: string;
  artworkUrl600?: string;
  artworkUrl100?: string;
  trackCount?: number;
  trackName?: string;
  description?: string;
  releaseDate?: string;
  trackTimeMillis?: number;
  episodeUrl?: string;
};

export type AppleFeed = { feed?: { entry?: AppleFeedEntry[] } };
export type AppleLookup = { results?: AppleLookupItem[] };

export const normalizeTopPodcasts = (feed: AppleFeed): PodcastSummary[] => {
  if (!Array.isArray(feed.feed?.entry))
    throw new Error('Invalid Apple podcast feed');

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
        description: entry.summary?.label ?? '',
      },
    ];
  });
};

const allowedTags = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'ul',
  'ol',
  'li',
  'blockquote',
  'a',
  'h2',
  'h3',
  'h4',
];

const normalizeEpisode = (item: AppleLookupItem): Episode | null => {
  if (item.kind !== 'podcast-episode' || !item.trackId) return null;

  return {
    id: String(item.trackId),
    title: item.trackName ?? 'Untitled episode',
    descriptionHtml: sanitizeHtml(item.description ?? '', {
      allowedTags,
      allowedAttributes: { a: ['href', 'title', 'target'] },
      allowedSchemes: ['http', 'https'],
      transformTags: {
        a: sanitizeHtml.simpleTransform('a', {
          target: '_blank',
          rel: 'noopener noreferrer',
        }),
      },
    }),
    publishedAt: item.releaseDate ?? '',
    durationMs:
      typeof item.trackTimeMillis === 'number' ? item.trackTimeMillis : null,
    audioUrl: item.episodeUrl?.startsWith('https://') ? item.episodeUrl : null,
  };
};

export const normalizePodcastDetail = (
  lookup: AppleLookup,
  summary?: PodcastSummary,
): PodcastDetail => {
  const items = lookup.results;
  if (!Array.isArray(items)) throw new Error('Invalid Apple podcast lookup');
  const podcast = items.find((item) => item.kind === 'podcast');
  if (!podcast?.collectionId) throw new Error('Podcast not found');

  const episodes = items.flatMap((item) => {
    const episode = normalizeEpisode(item);
    return episode ? [episode] : [];
  });

  return {
    id: String(podcast.collectionId),
    title: podcast.collectionName ?? summary?.title ?? '',
    author: podcast.artistName ?? summary?.author ?? '',
    artwork:
      podcast.artworkUrl600 ?? podcast.artworkUrl100 ?? summary?.artwork ?? '',
    description: summary?.description ?? '',
    episodeCount: podcast.trackCount ?? episodes.length,
    episodes,
  };
};
