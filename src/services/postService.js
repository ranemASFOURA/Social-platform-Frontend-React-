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
  const res = await fetch(getFullUrl('/api/posts'), {
    method: 'POST',
    headers: jsonAuthHeader(),
    body: JSON.stringify(postData),
  });

  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}


export async function uploadImageToMinIO(file) {
  const filename = encodeURIComponent(file.name);

  const response = await fetch(getFullUrl(`/api/images/generate-upload-url?filename=${filename}`), {
    headers: authHeader()  
  });

  if (!response.ok) throw new Error("❌ Failed to get upload URL");

  const { uploadUrl, fileUrl } = await response.json();

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type
    },
    body: file
  });

  if (!uploadRes.ok) throw new Error("❌ Failed to upload image");

  return fileUrl;
}


export async function getMyPosts() {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: authHeader(),
  });
  return res.json();
}