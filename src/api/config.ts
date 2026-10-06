export const APPLE_API_BASE_URL = 'https://itunes.apple.com';

export const CACHE_TTL_MS = 86400000; // 24 hours

export const QUERY_DEFAULT_OPTIONS = {
  queries: {
    staleTime: CACHE_TTL_MS,
    gcTime: CACHE_TTL_MS,
    retry: false
  }
};
