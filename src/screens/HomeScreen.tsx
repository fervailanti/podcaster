'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@/components/layout/NavigationProvider';
import { PodcastCard } from '@/components/podcast/PodcastCard';
import { useTopPodcasts } from '@/podcasts/client/hooks';
import { matchesPodcast } from '@/podcasts/format';
import styles from './HomeScreen.module.css';

export function HomeScreen() {
  const { t } = useTranslation();
  const { complete } = useNavigation();
  const { data, loading, error } = useTopPodcasts();
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      data?.filter((podcast) =>
        matchesPodcast(podcast.title, podcast.author, query),
      ) ?? [],
    [data, query],
  );

  useEffect(() => {
    if (!loading) complete();
  }, [loading, complete]);

  return (
    <main className="pageShell">
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>{t('heroEyebrow')}</span>
          <h1>{t('discover')}</h1>
          <p>{t('discoverLead')}</p>
        </div>
        <div className={styles.orbit} aria-hidden="true">
          <span>♫</span>
        </div>
      </section>

      <section className={styles.catalogue} aria-labelledby="top-title">
        <div className={styles.toolbar}>
          <div>
            <span className="sectionLabel">01 / {t('discoverLabel')}</span>
            <h2 id="top-title">
              {t('topPodcasts')}{' '}
              <span className={styles.count}>{data?.length ?? 100}</span>
            </h2>
          </div>
          <label className={styles.search}>
            <span className="srOnly">{t('filterLabel')}</span>
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('filterPlaceholder')}
            />
          </label>
        </div>

        {loading && (
          <div className={styles.grid} aria-label={t('loading')}>
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className={styles.skeleton} />
            ))}
          </div>
        )}
        {error && <p className="message">{t('loadError')}</p>}
        {data && (
          <>
            <p className={styles.resultCount}>
              {t('results', { count: filtered.length })}
            </p>
            {filtered.length ? (
              <div className={styles.grid}>
                {filtered.map((podcast, index) => (
                  <PodcastCard
                    key={podcast.id}
                    podcast={podcast}
                    by={t('by')}
                    eager={index === 0}
                  />
                ))}
              </div>
            ) : (
              <p className="message">{t('noResults')}</p>
            )}
          </>
        )}
      </section>
      <footer className="footer">{t('providedBy')}</footer>
    </main>
  );
}
