'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationLink } from '@/components/layout/NavigationLink/NavigationLink';
import { useNavigation } from '@/components/layout/NavigationProvider/NavigationProvider';
import { EpisodeTable } from '@/components/podcast/EpisodeTable/EpisodeTable';
import { PodcastSidebar } from '@/components/podcast/PodcastSidebar/PodcastSidebar';
import { usePodcastDetail } from '@/podcasts/client/hooks';
import sharedStyles from '../shared/DetailLayout.module.css';
import styles from './PodcastScreen.module.css';

export const PodcastScreen = ({ podcastId }: { podcastId: string }) => {
  const { t } = useTranslation();
  const { complete } = useNavigation();
  const { data, loading, error } = usePodcastDetail(podcastId);

  useEffect(() => {
    if (!loading) complete();
  }, [loading, complete]);

  return (
    <main className="pageShell">
      <NavigationLink href="/" className={sharedStyles.back}>
        ← {t('backToDiscover')}
      </NavigationLink>
      {loading && (
        <div className={sharedStyles.loadingLayout} aria-label={t('loading')}>
          <div />
          <div />
        </div>
      )}
      {error && <p className="message">{t('loadError')}</p>}
      {data && (
        <div className={sharedStyles.layout}>
          <PodcastSidebar podcast={data} />
          <section
            className={sharedStyles.content}
            aria-labelledby="episodes-title"
          >
            <span className="sectionLabel">
              02 / {t('episodes').toUpperCase()}
            </span>
            <div className={styles.headingRow}>
              <h1 id="episodes-title">{t('episodes')}</h1>
              <span className={styles.pill}>
                {t('episodeCount', { count: data.episodeCount })}
              </span>
            </div>
            <p className={styles.subheading}>{data.title}</p>
            {data.episodeCount > data.episodes.length && (
              <p className={sharedStyles.note}>
                {t('availableEpisodes', { count: data.episodes.length })}
              </p>
            )}
            <EpisodeTable podcastId={podcastId} episodes={data.episodes} />
          </section>
        </div>
      )}
      <footer className="footer">{t('providedBy')}</footer>
    </main>
  );
};
