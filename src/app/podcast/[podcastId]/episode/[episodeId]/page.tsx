import type { Metadata } from 'next';

import { queries } from '@/api/queries';
import { PrefetchBoundary } from '@/api/tanstack/PrefetchBoundary';
import { EpisodeScreen } from '@/screens/EpisodeScreen/EpisodeScreen';

import { getPodcastMetadata } from '../../../../podcastMetadata';

type EpisodePageProps = {
  params: Promise<{ podcastId: string; episodeId: string }>;
};

export const generateMetadata = async ({ params }: EpisodePageProps): Promise<Metadata> => {
  const { podcastId, episodeId } = await params;

  return getPodcastMetadata(podcastId, episodeId);
};

const EpisodePage = async ({ params }: EpisodePageProps) => {
  const { podcastId, episodeId } = await params;

  return (
    <PrefetchBoundary query={queries.podcastDetail(podcastId)}>
      <EpisodeScreen
        key={`${podcastId}:${episodeId}`}
        podcastId={podcastId}
        episodeId={episodeId}
      />
    </PrefetchBoundary>
  );
};

export default EpisodePage;
