const FEED_API = "http://localhost:8085/api/feed";

export async function getUserFeed(userId, page = 0, size = 10) {
  try {
    const response = await fetch(`${FEED_API}?userId=${userId}&page=${page}&size=${size}`);
    if (!response.ok) throw new Error("Failed to fetch feed");
    return await response.json(); 
  } catch (error) {
    console.error("Error fetching feed:", error);
    return [];
  }
}

