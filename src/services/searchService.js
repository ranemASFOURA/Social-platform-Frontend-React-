import { getFullUrl, authHeader } from './api';

const SEARCH_API = getFullUrl('/api/search');

export async function searchUsersByName(name) {
  const res = await fetch(`${SEARCH_API}/firstname?firstname=${name}`, {
    headers: authHeader()
  });
  if (!res.ok) throw new Error("Failed to fetch search results");
  return res.json();
}
