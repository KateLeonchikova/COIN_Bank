export function getCachedData(key) {
  const CACHE_LIFETIME = 24 * 60 * 60 * 1000;
  const cachedData = localStorage.getItem(key);
  if (!cachedData) return null;

  const { data, timestamp } = JSON.parse(cachedData);

  if (Date.now() - timestamp > CACHE_LIFETIME) {
    localStorage.removeItem(key);
    return null;
  }

  return data;
}
