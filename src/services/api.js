import axios from 'axios';
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

export function handleUnauthorized(res) {
  if (res.status === 401) {
    setTimeout(() => {
      window.location.href = "/login";
    }, 3000); // 3 seconds
    return true;
  }
  return false;
}

const api = axios.create({
  baseURL: BASE_URL, 
  withCredentials: true,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data?.error || "Unauthorized access.";
      alert(errorMessage); 

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;

