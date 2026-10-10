'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTopPodcasts } from '@/api/hooks';
import { EmptyState, Footer, SearchBar, SectionHeading, SummaryCard } from '@/components';
import { useNavigationComplete } from '@/navigation';
import { matchesSearch } from '@/utils/search';

import styles from './HomeScreen.module.css';

export const HomeScreen = () => {
  const { t } = useTranslation();

  const { data, isPending: loading, isError: error } = useTopPodcasts();

  useNavigationComplete(loading);

  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => data?.filter((podcast) => matchesSearch([podcast.title, podcast.author], query)) ?? [],
    [data, query]
  );

  return (
    <main className="pageShell">
      <section aria-labelledby="top-title">
        <div className={styles.toolbar}>
          <SectionHeading
            caption={data ? t('results', { count: filtered.length }) : '\u00a0'}
            eyebrow={t('discoverLabel')}
            id="top-title"
            title={t('topPodcasts')}
          />
          <SearchBar
            label={t('filterLabel')}
            value={query}
            onChange={setQuery}
            placeholder={t('filterPlaceholder')}
          />
        </div>
        {error && <EmptyState icon={t('loadErrorIcon')} text={t('loadError')} />}
        {data && (
          <>
            {filtered.length ? (
              <div className={styles.grid}>
                {filtered.map((podcast) => (
                  <SummaryCard
                    key={podcast.id}
                    href={`/podcast/${podcast.id}`}
                    media={{ src: podcast.artwork, alt: podcast.title }}
                    title={podcast.title}
                    caption={`${t('by')} ${podcast.author}`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState icon={t('noResultsIcon')} text={t('noResults')} />
            )}
          </>
        )}
      </section>
      <Footer />
    </main>
  );
};
