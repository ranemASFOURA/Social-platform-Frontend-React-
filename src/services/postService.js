import { getFullUrl, jsonAuthHeader, authHeader } from './api';

const BASE_URL = getFullUrl('/api/posts');
const IMAGE_BASE = getFullUrl('/api/images');


export async function getPostsByUser(userId) {
  const res = await fetch(`${BASE_URL}/${userId}`, {
    headers: jsonAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function generateUploadUrl(filename) {
  const res = await fetch(`${IMAGE_BASE}/generate-upload-url?filename=${filename}`, {
    headers: jsonAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to generate upload URL");
  return res.json();
}

export async function createPost(postData) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: jsonAuthHeader(),
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}
export async function uploadImageToMinIO(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(getFullUrl('/api/posts/upload'), {
    method: 'POST',
    headers: authHeader(),
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed");
  return await res.text(); // assuming backend returns image URL as plain text
}