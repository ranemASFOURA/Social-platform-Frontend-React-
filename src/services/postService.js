import { getFullUrl, jsonAuthHeader, authHeader, handleUnauthorized  } from './api';

const BASE_URL = getFullUrl('/api/posts');


export async function getPostsByUser(userId) {
  const res = await fetch(`${BASE_URL}/${userId}`, {
    headers: jsonAuthHeader(),
  });
  if (handleUnauthorized(res)) return;
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function createPost(postData) {
  const res = await fetch(getFullUrl('/api/posts'), {
    method: 'POST',
    headers: jsonAuthHeader(),
    body: JSON.stringify(postData),
  });
  if (handleUnauthorized(res)) return;

  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}


export async function uploadImageToMinIO(file) {
  const filename = encodeURIComponent(file.name);

  const response = await fetch(`${BASE_URL}/images/generate-upload-url?filename=${filename}`, {
    headers: authHeader()  
  });

  if (!response.ok) throw new Error("Failed to get upload URL");

  const { uploadUrl, fileUrl } = await response.json();

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type
    },
    body: file
  });

  if (!uploadRes.ok) throw new Error("Failed to upload image");

  return fileUrl;
}


export async function getMyPosts() {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: authHeader(),
  });
  return res.json();
}

export async function deletePost(postId) {
  const res = await fetch(`${BASE_URL}/${postId}`, {
    method: 'DELETE',
    headers: authHeader(),
  });

  if (handleUnauthorized(res)) return;
  if (!res.ok) throw new Error('Failed to delete post');
}
