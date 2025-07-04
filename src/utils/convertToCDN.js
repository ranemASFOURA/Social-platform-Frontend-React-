export function convertToCDN(url) {
  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    console.warn("Invalid image URL for CDN conversion:", url);
    return null;
  }
  try {
    const parsed = new URL(url);
    const pathSegments = parsed.pathname.split('/'); // ['', 'user-images', 'filename.xxx']
    const bucket = pathSegments[1]; // 'user-images' or 'post-images'
    const filename = pathSegments.slice(2).join('/');

    return `http://localhost:8089/cdn/${bucket}/${filename}`;
  } catch (err) {
    console.warn('Invalid image URL for CDN conversion:', url);
    return url;
  }
}
