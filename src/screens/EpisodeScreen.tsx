'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationLink } from '@/components/layout/NavigationLink';
import { useNavigation } from '@/components/layout/NavigationProvider';
import { PodcastSidebar } from '@/components/podcast/PodcastSidebar';
import { usePodcastDetail } from '@/podcasts/client/hooks';
import { formatDate, formatDuration } from '@/podcasts/format';
import styles from './DetailScreen.module.css';

export function EpisodeScreen({
  podcastId,
  episodeId,
}: {
  podcastId: string;
  episodeId: string;
}) {
  const { t, i18n } = useTranslation();
  const { complete } = useNavigation();
  const { data, loading, error } = usePodcastDetail(podcastId);
  const episode = data?.episodes.find((item) => item.id === episodeId);

  useEffect(() => {
    if (!loading) complete();
  }, [loading, complete]);

  return (
    <main className="pageShell">
      <NavigationLink href={`/podcast/${podcastId}`} className={styles.back}>
        ← {t('backToPodcast')}
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
          <article className={styles.content}>
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
                  <p className={styles.note}>{t('audioUnavailable')}</p>
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
}
