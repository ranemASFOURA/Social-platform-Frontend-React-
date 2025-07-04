import { getFullUrl } from './api';

const AUTH_BASE = getFullUrl('/api/auth');

export async function login(email, password) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const errorText = await res.text(); 
    throw new Error(errorText || "Login failed");
  }

  return res.json();
}


