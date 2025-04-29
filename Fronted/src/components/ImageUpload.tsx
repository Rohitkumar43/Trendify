import { useState } from 'react';
import { uploadImage } from '../utils/cloudinaryConfig';
import '../styles/ImageUpload.css'; // We'll create this next

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  label?: string;
  className?: string;
}

const ImageUpload = ({ onImageUploaded, label = 'Upload Image', className = '' }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Upload to Cloudinary
      const imageUrl = await uploadImage(file);
      onImageUploaded(imageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`image-upload-container ${className}`}>
      <label className="upload-label">
        {label}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={isUploading}
          className="file-input"
        />
      </label>

      {isUploading && <div className="upload-status">Uploading...</div>}
      
      {uploadError && <div className="upload-error">{uploadError}</div>}
      
      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;