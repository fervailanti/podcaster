'use client';

import { useEffect, useState } from 'react';
import { readCache, writeCache } from './cache';

type ResourceState<T> = {
  data: T | null;
  loading: boolean;
  error: boolean;
};

const requests = new Map<string, Promise<unknown>>();

const fetchOnce = <T>(url: string): Promise<T> => {
  const existing = requests.get(url);
  if (existing) return existing as Promise<T>;

  const request = fetch(url)
    .then(async (response) => {
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      return (await response.json()) as T;
    })
    .finally(() => requests.delete(url));

  requests.set(url, request);
  return request;
};

export const useCachedResource = <T>(
  key: string,
  url: string,
): ResourceState<T> => {
  const [state, setState] = useState<ResourceState<T>>({
    data: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let active = true;
    const cached = readCache<T>(key);
    if (cached !== null) {
      queueMicrotask(() => {
        if (active) setState({ data: cached, loading: false, error: false });
      });
      return () => {
        active = false;
      };
    }

    fetchOnce<T>(url)
      .then((data) => {
        writeCache(key, data);
        if (active) setState({ data, loading: false, error: false });
      })
      .catch((error: unknown) => {
        console.error(error);
        if (active) setState({ data: null, loading: false, error: true });
      });

    return () => {
      active = false;
    };
  }, [key, url]);

  return state;
};
