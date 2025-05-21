
const BASE_URL = 'http://localhost:8083/api/follow';

export async function followUser(followerId, followingId) {
  const res = await fetch(`${BASE_URL}/${followerId}/follow/${followingId}`, {
    method: 'POST'
  });
  return res.ok;
}

export async function unfollowUser(followerId, followingId) {
  const res = await fetch(`${BASE_URL}/${followerId}/unfollow/${followingId}`, {
    method: 'DELETE'
  });
  return res.ok;
}

export async function getFollowers(userId) {
  const res = await fetch(`${BASE_URL}/followers/${userId}`);
  return res.json();
}

export async function getFollowing(userId) {
  const res = await fetch(`${BASE_URL}/following/${userId}`);
  return res.json();
}

export async function isFollowing(followerId, followingId) {
  const res = await fetch(`http://localhost:8083/api/follow/${followerId}/is-following/${followingId}`);
  return res.ok;
}

