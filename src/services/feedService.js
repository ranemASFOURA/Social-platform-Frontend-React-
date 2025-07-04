import { getFullUrl, authHeader, handleUnauthorized  } from './api';

const FEED_API = getFullUrl('/api/feed');

export async function getUserFeed(page = 0, size = 10) {
  const res = await fetch(`${FEED_API}?page=${page}&size=${size}`, {
    headers: authHeader(),
  });
  if (handleUnauthorized(res)) return;
  if (!res.ok) throw new Error("Failed to fetch feed");
  return await res.json();
}
