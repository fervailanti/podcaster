export const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

type CacheEntry<T> = {
  savedAt: number;
  value: T;
};

export const readCache = <T>(key: string, now = Date.now()): T | null => {
  try {
    const raw = localStorage.getItem(`podcaster:v1:${key}`);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (
      !entry ||
      typeof entry.savedAt !== 'number' ||
      now - entry.savedAt >= CACHE_TTL_MS ||
      now < entry.savedAt
    ) {
      localStorage.removeItem(`podcaster:v1:${key}`);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
};

export const writeCache = <T>(
  key: string,
  value: T,
  now = Date.now(),
): void => {
  try {
    localStorage.setItem(
      `podcaster:v1:${key}`,
      JSON.stringify({ savedAt: now, value } satisfies CacheEntry<T>),
    );
  } catch {
    // Browsers can disable storage; data still works for this visit.
  }
};
