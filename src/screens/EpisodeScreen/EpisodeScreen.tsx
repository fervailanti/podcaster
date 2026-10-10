'use client';

import { useTranslation } from 'react-i18next';

import { usePodcastDetail } from '@/api/hooks';
import type { Episode } from '@/api/types';
import {
  AudioPlayer,
  BackLink,
  Card,
  DetailLayout,
  EmptyState,
  Footer,
  SectionHeading
} from '@/components';
import { useNavigationComplete } from '@/navigation';
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
        className={styles.heading}
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
        <p className={styles.note}>{t('audioUnavailable')}</p>
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

  const { data, isPending: loading, isError: error } = usePodcastDetail(podcastId);
  const episode = data?.episodes.find((item) => item.id === episodeId);

  useNavigationComplete(loading);

  return (
    <main className="pageShell">
      <BackLink href={`/podcast/${podcastId}`}>{t('backToPodcast')}</BackLink>
      {error && <EmptyState icon={t('loadErrorIcon')} text={t('loadError')} />}
      {data && (
        <DetailLayout
          sidebar={{
            body: data.description,
            eyebrow: t('about'),
            media: { src: data.artwork, alt: data.title },
            mediaHref: `/podcast/${podcastId}`,
            subtitle: (
              <>
                {t('by')} <strong>{data.author}</strong>
              </>
            ),
            subtitleHref: `/podcast/${podcastId}`,
            title: data.title,
            titleHref: `/podcast/${podcastId}`
          }}
        >
          <Card as="article">
            {episode ? (
              <EpisodeContent episode={episode} />
            ) : (
              <EmptyState icon={t('loadErrorIcon')} text={t('episodeNotFound')} />
            )}
          </Card>
        </DetailLayout>
      )}
      <Footer />
    </main>
  );
};
