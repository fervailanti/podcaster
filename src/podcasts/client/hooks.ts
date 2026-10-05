'use client';

import type { PodcastDetail, PodcastSummary } from '../types';
import { useCachedResource } from './useCachedResource';

export const useTopPodcasts = () => {
  return useCachedResource<PodcastSummary[]>('top', '/api/podcasts');
};

export const usePodcastDetail = (id: string) => {
  return useCachedResource<PodcastDetail>(
    `podcast:${id}`,
    `/api/podcasts/${id}`,
  );
};
