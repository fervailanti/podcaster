import type { Metadata } from 'next';

import { queries } from '@/api/queries';
import { PrefetchBoundary } from '@/api/tanstack/PrefetchBoundary';
import { PodcastScreen } from '@/screens/PodcastScreen/PodcastScreen';

import { getPodcastMetadata } from '../../podcastMetadata';

type PodcastPageProps = { params: Promise<{ podcastId: string }> };

export const generateMetadata = async ({ params }: PodcastPageProps): Promise<Metadata> => {
  const { podcastId } = await params;

  return getPodcastMetadata(podcastId);
};

const PodcastPage = async ({ params }: PodcastPageProps) => {
  const { podcastId } = await params;

  return (
    <PrefetchBoundary query={queries.podcastDetail(podcastId)}>
      <PodcastScreen key={podcastId} podcastId={podcastId} />
    </PrefetchBoundary>
  );
};

export default PodcastPage;
