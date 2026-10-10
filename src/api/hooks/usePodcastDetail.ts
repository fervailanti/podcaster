import { useQuery } from '@tanstack/react-query';

import { queries } from '../queries';

export const usePodcastDetail = (podcastId: string) => useQuery(queries.podcastDetail(podcastId));
