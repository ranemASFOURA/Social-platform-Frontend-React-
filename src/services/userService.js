import { getFullUrl, jsonAuthHeader } from './api';
import { authHeader } from './api';


const BASE_URL = getFullUrl('/api/users');

export async function createUser(data) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Server error: " + text);
  }
  return res.json();
}

export async function updateUser(data) {
  const res = await fetch(`${BASE_URL}/me`, {
    method: 'PUT',
    headers: jsonAuthHeader(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Server error: " + text);
  }
  return res.json();
}


export async function getUserById(userId) {
  const res = await fetch(`${BASE_URL}/${userId}`, {
    headers: jsonAuthHeader()
  });
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: authHeader(),
  });
  return res.json();
}

