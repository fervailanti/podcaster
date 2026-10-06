'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { queries } from '@/api/queries';
import type { Episode } from '@/api/types';
import {
  AudioPlayer,
  BackLink,
  Card,
  EmptyState,
  Footer,
  SectionHeading,
  Sidebar
} from '@/components';
import { useNavigationComplete } from '@/navigation';
import sharedStyles from '@/styles/DetailLayout.module.css';
import { formatDate, formatDuration } from '@/utils/format';

import styles from './EpisodeScreen.module.css';

const EpisodeContent = ({ episode }: { episode: Episode }) => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <SectionHeading
        caption={
          <span className={styles.meta}>
            {formatDate(episode.publishedAt, i18n.resolvedLanguage)} <span>·</span>{' '}
            {formatDuration(episode.durationMs)}
          </span>
        }
        className={sharedStyles.tableHeading}
        eyebrow={
          <span className={styles.listenLabel}>
            <span aria-hidden="true">♫</span>
            <span>{t('listenNow')}</span>
          </span>
        }
        title={episode.title}
      />
      {episode.descriptionHtml && (
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{
            __html: episode.descriptionHtml
          }}
        />
      )}
      {episode.audioUrl ? (
        <AudioPlayer label={episode.title} src={episode.audioUrl} />
      ) : (
        <p className={sharedStyles.note}>{t('audioUnavailable')}</p>
      )}
    </>
  );
};

export const EpisodeScreen = ({
  podcastId,
  episodeId
}: {
  podcastId: string;
  episodeId: string;
}) => {
  const { t } = useTranslation();

  const { data, isPending: loading, isError: error } = useQuery(queries.podcastDetail(podcastId));
  const episode = data?.episodes.find((item) => item.id === episodeId);

  useNavigationComplete(
    loading,
    episode
      ? t('metadata.episode.dynamicTitle', {
          appName: t('appName'),
          episodeTitle: episode.title
        })
      : t('metadata.episode.title', { appName: t('appName') })
  );

  return (
    <main className="pageShell">
      <BackLink href={`/podcast/${podcastId}`}>{t('backToPodcast')}</BackLink>
      {error && <EmptyState icon={t('loadErrorIcon')} text={t('loadError')} />}
      {data && (
        <div className={sharedStyles.layout}>
          <Sidebar
            body={data.description}
            eyebrow={t('about')}
            media={{ src: data.artwork, alt: data.title }}
            mediaHref={`/podcast/${podcastId}`}
            subtitle={
              <>
                {t('by')} <strong>{data.author}</strong>
              </>
            }
            title={data.title}
            titleHref={`/podcast/${podcastId}`}
            subtitleHref={`/podcast/${podcastId}`}
          />
          <Card as="article" className={sharedStyles.content}>
            {episode ? (
              <EpisodeContent episode={episode} />
            ) : (
              <EmptyState icon={t('loadErrorIcon')} text={t('episodeNotFound')} />
            )}
          </Card>
        </div>
      )}
      <Footer />
    </main>
  );
};
