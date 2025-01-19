export function setCachedData(data, key) {
  const timestamp = Date.now();
  const cachedData = {
    data,
    timestamp,
  };
  localStorage.setItem(key, JSON.stringify(cachedData));
}
