import { NavigationLink } from '@/components/layout/NavigationLink';
import type { PodcastSummary } from '@/podcasts/types';
import { PodcastArtwork } from './PodcastArtwork';
import styles from './PodcastCard.module.css';

export const PodcastCard = ({
  podcast,
  by,
  eager = false,
}: {
  podcast: PodcastSummary;
  by: string;
  eager?: boolean;
}) => {
  return (
    <NavigationLink href={`/podcast/${podcast.id}`} className={styles.card}>
      <PodcastArtwork src={podcast.artwork} alt="" eager={eager} />
      <span className={styles.title}>{podcast.title}</span>
      <span className={styles.author}>
        {by} {podcast.author}
      </span>
    </NavigationLink>
  );
};
