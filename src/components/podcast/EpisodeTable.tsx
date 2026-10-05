'use client';

import { useTranslation } from 'react-i18next';
import { NavigationLink } from '@/components/layout/NavigationLink';
import { formatDate, formatDuration } from '@/podcasts/format';
import type { Episode } from '@/podcasts/types';
import styles from './EpisodeTable.module.css';

export const EpisodeTable = ({
  podcastId,
  episodes,
}: {
  podcastId: string;
  episodes: Episode[];
}) => {
  const { t, i18n } = useTranslation();

  return (
    <div className={styles.scrollArea}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t('title')}</th>
            <th>{t('date')}</th>
            <th>{t('duration')}</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((episode) => (
            <tr key={episode.id}>
              <td>
                <NavigationLink
                  href={`/podcast/${podcastId}/episode/${episode.id}`}
                  prefetch={false}
                >
                  {episode.title}
                </NavigationLink>
              </td>
              <td>
                {formatDate(episode.publishedAt, i18n.resolvedLanguage ?? 'es')}
              </td>
              <td>{formatDuration(episode.durationMs)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
