import { getFullUrl, authHeader } from './api';

const BASE_URL = getFullUrl('/api/follow');


export async function followUser(followingId) {
  const res = await fetch(`${BASE_URL}/follow/${followingId}`, {
    method: 'POST',
    headers: authHeader(),
  });
  return res.ok;
}


export async function unfollowUser(followingId) {
  const res = await fetch(`${BASE_URL}/unfollow/${followingId}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  return res.ok;
}


export async function isFollowing(followingId) {
  try {
  const res = await fetch(`${BASE_URL}/is-following/${followingId}`, {
    headers: authHeader(),
  });
  return res.data;
}
catch (err) {
    console.error("Error checking follow status", err);
    return false; 
  }
}

export async function getFollowers(userId) {
  const res = await fetch(`${BASE_URL}/followers/${userId}`, {
    headers: authHeader(),
  });
  return res.json();
}


export async function getFollowing(userId) {
  const res = await fetch(`${BASE_URL}/following/${userId}`, {
    headers: authHeader(),
  });
  return res.json();
}

export async function getMyFollowers() {
  const res = await fetch(`${BASE_URL}/followers`, {
    headers: authHeader(),
  });
  return res.json();
}


export async function getMyFollowing() {
  const res = await fetch(`${BASE_URL}/following`, {
    headers: authHeader(),
  });
  return res.json();
}
