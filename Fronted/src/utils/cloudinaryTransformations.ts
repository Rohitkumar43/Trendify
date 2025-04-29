/**
 * Utility functions for Cloudinary image transformations
 */

/**
 * Transforms a Cloudinary URL to apply various transformations
 * @param url The original Cloudinary URL
 * @param options Transformation options
 * @returns The transformed URL
 */
export const transformCloudinaryUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'crop';
    gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    effect?: string;
    radius?: number | 'max';
    background?: string;
  }
) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  try {
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) {
      return url;
    }

    const transformations: string[] = [];

    // Add width if provided
    if (options.width) {
      transformations.push(`w_${options.width}`);
    }

    // Add height if provided
    if (options.height) {
      transformations.push(`h_${options.height}`);
    }

    // Add crop mode if provided
    if (options.crop) {
      transformations.push(`c_${options.crop}`);
    }

    // Add gravity if provided
    if (options.gravity) {
      transformations.push(`g_${options.gravity}`);
    }

    // Add quality if provided
    if (options.quality) {
      transformations.push(`q_${options.quality}`);
    }

    // Add format if provided
    if (options.format) {
      transformations.push(`f_${options.format}`);
    }

    // Add effect if provided
    if (options.effect) {
      transformations.push(`e_${options.effect}`);
    }

    // Add radius if provided
    if (options.radius) {
      transformations.push(`r_${options.radius}`);
    }

    // Add background if provided
    if (options.background) {
      transformations.push(`b_${options.background}`);
    }

    // If no transformations, return original URL
    if (transformations.length === 0) {
      return url;
    }

    // Combine all transformations
    const transformationString = transformations.join(',');
    return `${urlParts[0]}/upload/${transformationString}/${urlParts[1]}`;
  } catch (error) {
    console.error('Error transforming Cloudinary URL:', error);
    return url;
  }
};

/**
 * Common transformation presets for Cloudinary images
 */
export const cloudinaryPresets = {
  /**
   * Optimizes image for thumbnail display
   */
  thumbnail: (url: string, size = 100) =>
    transformCloudinaryUrl(url, {
      width: size,
      height: size,
      crop: 'fill',
      gravity: 'auto',
      quality: 80,
      format: 'auto',
    }),

  /**
   * Optimizes image for profile picture display
   */
  profilePicture: (url: string, size = 200) =>
    transformCloudinaryUrl(url, {
      width: size,
      height: size,
      crop: 'fill',
      gravity: 'face',
      radius: 'max',
      quality: 90,
      format: 'auto',
    }),

  /**
   * Optimizes image for product display
   */
  productImage: (url: string, width = 600) =>
    transformCloudinaryUrl(url, {
      width,
      crop: 'fill',
      gravity: 'auto',
      quality: 90,
      format: 'auto',
    }),

  /**
   * Applies a grayscale effect to the image
   */
  grayscale: (url: string) =>
    transformCloudinaryUrl(url, {
      effect: 'grayscale',
    }),

  /**
   * Applies a sepia effect to the image
   */
  sepia: (url: string) =>
    transformCloudinaryUrl(url, {
      effect: 'sepia',
    }),

  /**
   * Optimizes image for banner display
   */
  banner: (url: string, width = 1200, height = 400) =>
    transformCloudinaryUrl(url, {
      width,
      height,
      crop: 'fill',
      gravity: 'auto',
      quality: 90,
      format: 'auto',
    }),
};