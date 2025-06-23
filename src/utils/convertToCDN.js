export function convertToCDN(url) {
  try {
    const parsed = new URL(url);
    const pathSegments = parsed.pathname.split('/'); // ['', 'user-images', 'filename.jpg']
    const bucket = pathSegments[1]; // 'user-images' or 'post-images'
    const filename = pathSegments.slice(2).join('/');

    return `http://localhost:8089/cdn/${bucket}/${filename}`;
  } catch (err) {
    console.warn('Invalid image URL for CDN conversion:', url);
    return url;
  }
}
