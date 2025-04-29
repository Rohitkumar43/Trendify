import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import CloudinaryImage from '../components/CloudinaryImage';
import '../styles/ImageUploadDemo.css';

const ImageUploadDemo = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUploaded = (imageUrl: string) => {
    setUploadedImages((prev) => [...prev, imageUrl]);
  };

  return (
    <div className="image-upload-demo">
      <h1>Image Upload Demo</h1>
      
      <div className="upload-section">
        <h2>Upload a New Image</h2>
        <ImageUpload 
          onImageUploaded={handleImageUploaded} 
          label="Click to upload an image"
        />
      </div>

      {uploadedImages.length > 0 && (
        <div className="gallery-section">
          <h2>Uploaded Images</h2>
          <div className="image-gallery">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="gallery-item">
                <CloudinaryImage 
                  src={imageUrl} 
                  alt={`Uploaded image ${index + 1}`} 
                  width={300}
                  transformation="c_fill,g_auto"
                />
                <div className="image-url">{imageUrl}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="examples-section">
        <h2>Cloudinary Transformation Examples</h2>
        {uploadedImages.length > 0 && (
          <div className="transformation-examples">
            <div className="example">
              <h3>Original</h3>
              <CloudinaryImage 
                src={uploadedImages[0]} 
                alt="Original image" 
                width={200}
              />
            </div>
            <div className="example">
              <h3>Grayscale</h3>
              <CloudinaryImage 
                src={uploadedImages[0]} 
                alt="Grayscale" 
                width={200}
                transformation="e_grayscale"
              />
            </div>
            <div className="example">
              <h3>Rounded Corners</h3>
              <CloudinaryImage 
                src={uploadedImages[0]} 
                alt="Rounded corners" 
                width={200}
                transformation="r_50"
              />
            </div>
            <div className="example">
              <h3>Sepia Effect</h3>
              <CloudinaryImage 
                src={uploadedImages[0]} 
                alt="Sepia effect" 
                width={200}
                transformation="e_sepia"
              />
            </div>
          </div>
        )}
        {uploadedImages.length === 0 && (
          <p>Upload an image to see transformation examples</p>
        )}
      </div>
    </div>
  );
};

export default ImageUploadDemo;