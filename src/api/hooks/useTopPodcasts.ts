import { useQuery } from '@tanstack/react-query';

import { queries } from '../queries';

export const useTopPodcasts = () => useQuery(queries.topPodcasts());
