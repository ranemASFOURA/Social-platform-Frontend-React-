const BASE_URL = 'http://localhost:8088';

export function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export function jsonAuthHeader() {
  return {
    'Content-Type': 'application/json',
    ...authHeader()
  };
}

export function getFullUrl(path) {
  return `${BASE_URL}${path}`;
}

