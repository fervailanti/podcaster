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
