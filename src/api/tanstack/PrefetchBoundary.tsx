import {
  dehydrate,
  HydrationBoundary,
  type QueryExecuteOptions,
  type QueryKey
} from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { getQueryClient } from './queryClient';

type PrefetchBoundaryProps<TData, TQueryKey extends QueryKey> = {
  query: QueryExecuteOptions<TData, Error, TData, TData, TQueryKey>;
  children: ReactNode;
};

export const PrefetchBoundary = async <TData, TQueryKey extends QueryKey>({
  query,
  children
}: PrefetchBoundaryProps<TData, TQueryKey>) => {
  const queryClient = getQueryClient();
  await queryClient.query(query).catch(console.error);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
};
