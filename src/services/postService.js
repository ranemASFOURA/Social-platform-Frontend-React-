export async function getPostsByUser(userId) {
  const response = await fetch(`http://localhost:8084/api/posts/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
}
