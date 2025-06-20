import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file using browser-image-compression library.
 * @param {File} imageFile - The original image file selected by the user.
 * @param {Object} customOptions - Optional compression configuration.
 * @returns {Promise<File>} - A Promise that resolves to the compressed image file.
 */
export const compressImage = async (imageFile, customOptions = {}) => {
  const defaultOptions = {
    maxSizeMB: 1,               // Max size of the output file (in megabytes)
    maxWidthOrHeight: 1024,     // Limit the max width or height of the image
    useWebWorker: true          // Enables background thread to avoid UI blocking
  };

  const options = { ...defaultOptions, ...customOptions };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    //console.log(`Image compressed: ${(compressedFile.size / 1024).toFixed(2)} KB`);
    return compressedFile;
  } catch (error) {
    console.error(' Failed to compress image:', error);
    throw error;
  }
};
