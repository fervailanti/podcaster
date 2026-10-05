import {
  normalizePodcastDetail,
  normalizeTopPodcasts,
  type AppleFeed,
  type AppleLookup,
} from '../normalize';
import type { PodcastDetail, PodcastSummary } from '../types';

const TOP_URL =
  'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json';

async function getAppleJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { next: { revalidate: 86_400 } });
  if (!response.ok) throw new Error(`Apple returned HTTP ${response.status}`);
  return (await response.json()) as T;
}

export async function getTopPodcasts(): Promise<PodcastSummary[]> {
  return normalizeTopPodcasts(await getAppleJson<AppleFeed>(TOP_URL));
}

export async function getPodcastDetail(id: string): Promise<PodcastDetail> {
  if (!/^\d+$/.test(id)) throw new Error('Invalid podcast ID');
  const url = new URL('https://itunes.apple.com/lookup');
  url.searchParams.set('id', id);
  url.searchParams.set('media', 'podcast');
  url.searchParams.set('entity', 'podcastEpisode');
  url.searchParams.set('limit', '200');

  const [lookup, topPodcasts] = await Promise.all([
    getAppleJson<AppleLookup>(url.toString()),
    getTopPodcasts(),
  ]);

  return normalizePodcastDetail(
    lookup,
    topPodcasts.find((item) => item.id === id),
  );
}
