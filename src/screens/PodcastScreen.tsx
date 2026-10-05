'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationLink } from '@/components/layout/NavigationLink';
import { useNavigation } from '@/components/layout/NavigationProvider';
import { EpisodeTable } from '@/components/podcast/EpisodeTable';
import { PodcastSidebar } from '@/components/podcast/PodcastSidebar';
import { usePodcastDetail } from '@/podcasts/client/hooks';
import styles from './DetailScreen.module.css';

export function PodcastScreen({ podcastId }: { podcastId: string }) {
  const { t } = useTranslation();
  const { complete } = useNavigation();
  const { data, loading, error } = usePodcastDetail(podcastId);

  useEffect(() => {
    if (!loading) complete();
  }, [loading, complete]);

  return (
    <main className="pageShell">
      <NavigationLink href="/" className={styles.back}>
        ← {t('backToDiscover')}
      </NavigationLink>
      {loading && (
        <div className={styles.loadingLayout} aria-label={t('loading')}>
          <div />
          <div />
        </div>
      )}
      {error && <p className="message">{t('loadError')}</p>}
      {data && (
        <div className={styles.layout}>
          <PodcastSidebar podcast={data} />
          <section className={styles.content} aria-labelledby="episodes-title">
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
              <p className={styles.note}>
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
}
