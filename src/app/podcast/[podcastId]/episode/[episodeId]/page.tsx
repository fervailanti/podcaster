import type { Metadata } from 'next';

import { queries } from '@/api/queries';
import { PrefetchBoundary } from '@/api/tanstack/PrefetchBoundary';
import { getAppMetadata } from '@/i18n/server';
import { EpisodeScreen } from '@/screens/EpisodeScreen/EpisodeScreen';

type EpisodePageProps = {
  params: Promise<{ podcastId: string; episodeId: string }>;
};

export const generateMetadata = async (): Promise<Metadata> => getAppMetadata('episode');

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
