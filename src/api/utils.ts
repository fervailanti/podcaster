import { CACHE_TTL_MS } from './config';

export const getJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    next: { revalidate: CACHE_TTL_MS / 1000 } // Next expects seconds
  });

  if (!response.ok) throw new Error(`Request failed with HTTP ${response.status}`);

  return (await response.json()) as T;
};

export const assertPodcastId = (id: string): void => {
  if (!/^\d+$/.test(id)) throw new Error('Invalid podcast ID');
};
