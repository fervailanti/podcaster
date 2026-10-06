import { QueryClient } from '@tanstack/react-query';

import { QUERY_DEFAULT_OPTIONS } from '../config';

const createQueryClient = () => new QueryClient({ defaultOptions: QUERY_DEFAULT_OPTIONS });

const browserQueryClient = typeof window === 'undefined' ? undefined : createQueryClient();

export const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient();
  return browserQueryClient ?? createQueryClient();
};
