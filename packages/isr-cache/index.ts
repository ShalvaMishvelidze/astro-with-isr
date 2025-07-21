type CacheEntry<T> = { data: T; timestamp: number };
const cache = new Map<string, CacheEntry<any>>();

export async function withISR<T>(
  key: string,
  fetchFn: () => Promise<T>,
  revalidate: number
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && now - cached.timestamp < revalidate * 1000) {
    return cached.data;
  }
  const data = await fetchFn();
  cache.set(key, { data, timestamp: now });
  return data;
}

export function clearISRCache(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}
