import { getFullUrl, authHeader, handleUnauthorized  } from './api';

const SEARCH_API = getFullUrl('/api/search');

export async function searchUsersByName(name) {
  const res = await fetch(`${SEARCH_API}/firstname?firstname=${name}`, {
    headers: authHeader()
  });
  if (handleUnauthorized(res)) return;
  if (!res.ok) throw new Error("Failed to fetch search results");
  return res.json();
}

export async function getFollowSuggestions() {
  const res = await fetch(`${SEARCH_API}/suggestions`, {
    headers: authHeader()
  });
  if (handleUnauthorized(res)) return;
  if (!res.ok) throw new Error("Failed to fetch follow suggestions");
  return res.json();
}