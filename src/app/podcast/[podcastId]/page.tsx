import { PodcastScreen } from '@/screens/PodcastScreen';

export default async function PodcastPage({
  params,
}: {
  params: Promise<{ podcastId: string }>;
}) {
  const { podcastId } = await params;
  return <PodcastScreen key={podcastId} podcastId={podcastId} />;
}
