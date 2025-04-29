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
          // Add transformations if provided
          const transformedUrl = transformation
            ? `${urlParts[0]}/upload/${transformation}/${urlParts[1]}`
            : src;
          
          // Add width and height if provided
          let finalUrl = transformedUrl;
          if (width || height) {
            const dimensions = [];
            if (width) dimensions.push(`w_${width}`);
            if (height) dimensions.push(`h_${height}`);
            
            // Check if there are already transformations
            if (transformation) {
              finalUrl = finalUrl.replace('/upload/', `/upload/${dimensions.join(',')},`);
            } else {
              finalUrl = `${urlParts[0]}/upload/${dimensions.join(',')}/${urlParts[1]}`;
            }
          }
          
          setImageUrl(finalUrl);
        }
      } catch (err) {
        console.error('Error formatting Cloudinary URL:', err);
        setImageUrl(src); // Fallback to original URL
      }
    }

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setIsLoading(false);
    };
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
  }, [src, width, height, transformation]);

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