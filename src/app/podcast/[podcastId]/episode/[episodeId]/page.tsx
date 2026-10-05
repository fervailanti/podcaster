import { EpisodeScreen } from '@/screens/EpisodeScreen/EpisodeScreen';

const EpisodePage = async ({
  params,
}: {
  params: Promise<{ podcastId: string; episodeId: string }>;
}) => {
  const { podcastId, episodeId } = await params;
  return (
    <EpisodeScreen
      key={`${podcastId}:${episodeId}`}
      podcastId={podcastId}
      episodeId={episodeId}
    />
  );
};

export default EpisodePage;
