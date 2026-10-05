'use client';

import type { PodcastDetail, PodcastSummary } from '../types';
import { useCachedResource } from './useCachedResource';

export function useTopPodcasts() {
  return useCachedResource<PodcastSummary[]>('top', '/api/podcasts');
}

export function usePodcastDetail(id: string) {
  return useCachedResource<PodcastDetail>(
    `podcast:${id}`,
    `/api/podcasts/${id}`,
  );
}
