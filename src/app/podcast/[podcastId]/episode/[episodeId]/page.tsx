import { EpisodeScreen } from '@/screens/EpisodeScreen';

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ podcastId: string; episodeId: string }>;
}) {
  const { podcastId, episodeId } = await params;
  return (
    <EpisodeScreen
      key={`${podcastId}:${episodeId}`}
      podcastId={podcastId}
      episodeId={episodeId}
    />
  );
}
