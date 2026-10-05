'use client';

import { useTranslation } from 'react-i18next';
import { NavigationLink } from '@/components/layout/NavigationLink';
import type { PodcastDetail } from '@/podcasts/types';
import { PodcastArtwork } from './PodcastArtwork';
import styles from './PodcastSidebar.module.css';

export const PodcastSidebar = ({ podcast }: { podcast: PodcastDetail }) => {
  const { t } = useTranslation();
  const href = `/podcast/${podcast.id}`;

  return (
    <aside className={styles.sidebar}>
      <NavigationLink
        href={href}
        className={styles.coverLink}
        aria-label={podcast.title}
      >
        <PodcastArtwork src={podcast.artwork} alt="" size="sidebar" />
      </NavigationLink>
      <div className={styles.identity}>
        <NavigationLink href={href} className={styles.title}>
          {podcast.title}
        </NavigationLink>
        <span className={styles.byline}>
          {t('by')}{' '}
          <NavigationLink href={href}>{podcast.author}</NavigationLink>
        </span>
      </div>
      {podcast.description && (
        <div className={styles.about}>
          <h2>{t('about')}</h2>
          <p>{podcast.description}</p>
        </div>
      )}
    </aside>
  );
};
