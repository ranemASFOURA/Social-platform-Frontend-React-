// utils/imageLoader.js
export function loadImageFromGateway(minioUrl) {
  if (!minioUrl) return null;

  try {
    let path;

    try {
      const url = new URL(minioUrl);     
      path = url.pathname;               
    } catch {
      path = minioUrl.startsWith('/') ? minioUrl : `/${minioUrl}`; 
    }

    const finalUrl = `/api/image-proxy${path}`; 
    return finalUrl;

  } catch (error) {
    console.error("Failed to build image URL:", error.message);
    return null;
  }
}
