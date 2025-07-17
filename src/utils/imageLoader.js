// utils/imageLoader.js
export function loadImageFromGateway(minioUrl) {
  if (!minioUrl) return null;

  try {
    let path;
    // strip domain manually
    try {
      const url = new URL(minioUrl);     
      path = url.pathname;               
    } catch {
      path = minioUrl.startsWith('/') ? minioUrl : `/${minioUrl}`; 
    }

    const finalUrl = `${process.env.REACT_APP_API_URL}/api/image-proxy${path}`;
    console.log("Image loading from:", finalUrl);
    return finalUrl;

  } catch (error) {
    console.error("Failed to build image URL:", error.message);
    return null;
  }
}

