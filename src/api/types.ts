export type PodcastSummary = {
  id: string;
  title: string;
  author: string;
  artwork: string;
  description: string;
};

export type Episode = {
  id: string;
  title: string;
  descriptionHtml: string;
  publishedAt: string;
  durationMs: number | null;
  audioUrl: string | null;
};

export type PodcastDetail = PodcastSummary & {
  episodeCount: number;
  episodes: Episode[];
};

type Label = { label?: string };

export type TopPodcastsResponse = {
  feed?: {
    entry?: {
      id?: { attributes?: { 'im:id'?: string } };
      'im:name'?: Label;
      'im:artist'?: Label;
      'im:image'?: Label[];
      summary?: Label;
    }[];
  };
};

export type PodcastLookupItem = {
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

export type PodcastLookupResponse = { results?: PodcastLookupItem[] };
