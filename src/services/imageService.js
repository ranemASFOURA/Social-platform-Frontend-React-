import { getFullUrl } from './api';

export async function uploadImageToMinIO(file) {
  console.log("Upload image to MinIO →", file.name);
  const response = await fetch(getFullUrl(`/api/images/generate-upload-url?filename=${file.name}`));

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Failed to generate upload URL: " + text);
  }

  const { uploadUrl, fileUrl } = await response.json();

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image to MinIO");
  }

  return fileUrl;
}
