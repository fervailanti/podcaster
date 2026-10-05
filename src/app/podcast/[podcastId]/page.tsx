import { PodcastScreen } from '@/screens/PodcastScreen/PodcastScreen';

const PodcastPage = async ({
  params,
}: {
  params: Promise<{ podcastId: string }>;
}) => {
  const { podcastId } = await params;
  return <PodcastScreen key={podcastId} podcastId={podcastId} />;
};

export default PodcastPage;
