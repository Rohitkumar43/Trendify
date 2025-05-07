import { useState, useEffect } from 'react';
import '../styles/CloudinaryImage.css';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  transformation?: string;
}

const CloudinaryImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  transformation = '',
}: CloudinaryImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setError(true);
      setIsLoading(false);
      return;
    }

    // Check if it's a Cloudinary URL
    if (src.includes('cloudinary.com')) {
      try {
        // Parse the URL to add transformations
        const urlParts = src.split('/upload/');
        if (urlParts.length === 2) {
          // Create an array to hold all transformations
          const transformations = [];
          
          // Add width and height if provided
          if (width) transformations.push(`w_${width}`);
          if (height) transformations.push(`h_${height}`);
          
          // Add custom transformations if provided
          if (transformation) {
            // Split by comma in case multiple transformations are provided
            const customTransforms = transformation.split(',');
            transformations.push(...customTransforms);
          }
          
          // Build the final URL
          let finalUrl;
          if (transformations.length > 0) {
            finalUrl = `${urlParts[0]}/upload/${transformations.join(',')}/${urlParts[1]}`;
          } else {
            finalUrl = src;
          }
          
          console.log('Transformed image URL:', finalUrl);
          setImageUrl(finalUrl);
        } else {
          console.warn('Invalid Cloudinary URL format:', src);
          setImageUrl(src); // Use original if format is unexpected
        }
      } catch (err) {
        console.error('Error formatting Cloudinary URL:', err);
        setImageUrl(src); // Fallback to original URL
      }
    } else {
      // Not a Cloudinary URL, use as is
      console.log('Using non-Cloudinary URL:', src);
      setImageUrl(src);
    }

    // Create a new image object to preload the image
    const img = new Image();
    img.src = imageUrl;
    
    img.onload = () => {
      setIsLoading(false);
      setError(false);
    };
    
    img.onerror = (e) => {
      console.error('Image failed to load:', imageUrl, e);
      setError(true);
      setIsLoading(false);
    };
    
    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, width, height, transformation, imageUrl]);

  if (error) {
    return <div className="cloudinary-image-error">Image failed to load</div>;
  }

  return (
    <div className={`cloudinary-image-container ${className}`}>
      {isLoading && <div className="cloudinary-image-loading">Loading...</div>}
      <img
        src={imageUrl}
        alt={alt}
        className={`cloudinary-image ${isLoading ? 'loading' : 'loaded'}`}
        style={{ width: width ? `${width}px` : 'auto', height: height ? `${height}px` : 'auto' }}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
      />
    </div>
  );
};

export default CloudinaryImage;