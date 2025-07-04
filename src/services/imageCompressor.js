import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file using browser-image-compression library.
 * Automatically converts the image to WebP format for better performance.
 *
 * @param {File} imageFile - The original image file selected by the user.
 * @param {Object} customOptions - Optional compression configuration.
 * @returns {Promise<File>} - A Promise that resolves to the compressed WebP image.
 */
export const compressImage = async (imageFile, customOptions = {}) => {
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    fileType: 'image/webp' 
  };

  const options = { ...defaultOptions, ...customOptions };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log("Converted to WebP. Size:", (compressedFile.size / 1024).toFixed(2), "KB");
    return compressedFile;
  } catch (error) {
    console.error('Failed to compress image:', error);
    throw error;
  }
};
