const FEED_API = "http://localhost:8085/api/feed";

export async function getUserFeed(userId) {
  try {
    const response = await fetch(`${FEED_API}?userId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch feed");
    return await response.json();
  } catch (error) {
    console.error("Error fetching feed:", error);
    return [];
  }
}
