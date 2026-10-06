'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { queries } from '@/api/queries';
import type { Episode } from '@/api/types';
import {
  BackLink,
  Card,
  EmptyState,
  Footer,
  SectionHeading,
  Sidebar,
  Table,
  type TableColumn
} from '@/components';
import { NavigationLink, useNavigationComplete } from '@/navigation';
import sharedStyles from '@/styles/DetailLayout.module.css';
import { formatDate, formatDuration } from '@/utils/format';

export const PodcastScreen = ({ podcastId }: { podcastId: string }) => {
  const { i18n, t } = useTranslation();

  const { data, isPending: loading, isError: error } = useQuery(queries.podcastDetail(podcastId));

  useNavigationComplete(loading);

  const columns: readonly TableColumn<Episode>[] = [
    {
      key: 'title',
      header: t('title'),
      render: (episode) => (
        <NavigationLink href={`/podcast/${podcastId}/episode/${episode.id}`} prefetch={false}>
          {episode.title}
        </NavigationLink>
      )
    },
    {
      key: 'date',
      header: t('date'),
      render: (episode) => formatDate(episode.publishedAt, i18n.resolvedLanguage)
    },
    {
      key: 'duration',
      header: t('duration'),
      render: (episode) => formatDuration(episode.durationMs)
    }
  ];

  return (
    <main className="pageShell">
      <BackLink href="/">{t('backToDiscover')}</BackLink>
      {error && <EmptyState icon={t('loadErrorIcon')} text={t('loadError')} />}
      {data && (
        <div className={sharedStyles.layout}>
          <Sidebar
            body={data.description}
            eyebrow={t('about')}
            media={{ src: data.artwork, alt: data.title }}
            subtitle={
              <>
                {t('by')} <strong>{data.author}</strong>
              </>
            }
            title={data.title}
          />
          <Card as="section" className={sharedStyles.content} aria-labelledby="episodes-title">
            <SectionHeading
              caption={t('availableEpisodes', { count: data.episodes.length })}
              className={sharedStyles.tableHeading}
              eyebrow={t('podcastEpisodes')}
              id="episodes-title"
              title={t('episodeCount', { count: data.episodeCount })}
            />
            <Table columns={columns} data={data.episodes} getRowKey={(episode) => episode.id} />
          </Card>
        </div>
      )}
      <Footer />
    </main>
  );
};
