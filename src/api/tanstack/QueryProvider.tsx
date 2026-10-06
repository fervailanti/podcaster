'use client';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { type ReactNode, useState } from 'react';

import { CACHE_TTL_MS } from '../config';
import { getQueryClient } from './queryClient';

const getStorage = (): Storage | undefined => {
  if (typeof window === 'undefined') return undefined;
  try {
    return window.localStorage;
  } catch (error) {
    console.warn(error);
    return undefined;
  }
};

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();
  const [persister] = useState(() =>
    createAsyncStoragePersister({ storage: getStorage(), key: 'podcaster' })
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: CACHE_TTL_MS }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
