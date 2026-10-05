'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationLink } from '@/components/layout/NavigationLink/NavigationLink';
import { useNavigation } from '@/components/layout/NavigationProvider/NavigationProvider';
import { PodcastSidebar } from '@/components/podcast/PodcastSidebar/PodcastSidebar';
import { usePodcastDetail } from '@/podcasts/client/hooks';
import { formatDate, formatDuration } from '@/podcasts/format';
import sharedStyles from '../shared/DetailLayout.module.css';
import styles from './EpisodeScreen.module.css';

export const EpisodeScreen = ({
  podcastId,
  episodeId,
}: {
  podcastId: string;
  episodeId: string;
}) => {
  const { t, i18n } = useTranslation();
  const { complete } = useNavigation();
  const { data, loading, error } = usePodcastDetail(podcastId);
  const episode = data?.episodes.find((item) => item.id === episodeId);

  useEffect(() => {
    if (!loading) complete();
  }, [loading, complete]);

  return (
    <main className="pageShell">
      <NavigationLink
        href={`/podcast/${podcastId}`}
        className={sharedStyles.back}
      >
        ← {t('backToPodcast')}
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
          <article className={sharedStyles.content}>
            {episode ? (
              <>
                <span className="sectionLabel">
                  03 / {t('listenNow').toUpperCase()}
                </span>
                <h1 className={styles.episodeTitle}>{episode.title}</h1>
                <p className={styles.meta}>
                  {formatDate(
                    episode.publishedAt,
                    i18n.resolvedLanguage ?? 'es',
                  )}{' '}
                  <span>·</span> {formatDuration(episode.durationMs)}
                </p>
                {episode.descriptionHtml && (
                  <div
                    className={styles.description}
                    dangerouslySetInnerHTML={{
                      __html: episode.descriptionHtml,
                    }}
                  />
                )}
                {episode.audioUrl ? (
                  <div className={styles.player}>
                    <span>♫ &nbsp; {t('listenNow')}</span>
                    <audio
                      controls
                      preload="none"
                      src={episode.audioUrl}
                      aria-label={episode.title}
                    />
                  </div>
                ) : (
                  <p className={sharedStyles.note}>{t('audioUnavailable')}</p>
                )}
              </>
            ) : (
              <p className="message">{t('episodeNotFound')}</p>
            )}
          </article>
        </div>
      )}
      <footer className="footer">{t('providedBy')}</footer>
    </main>
  );
};
