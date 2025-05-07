// Note: We don't import cloudinary directly in frontend code
// as it's meant for Node.js environments

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dv62cowbi';
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '977992946798739';
const UPLOAD_PRESET = 'trendify_unsigned';  // Create this preset name in Cloudinary dashboard

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'trendify');  // This will store images in a 'trendify' folder
  formData.append('api_key', API_KEY);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to upload image');
    }
    
    const data = await response.json();
    console.log('Upload successful:', data);
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// We don't export cloudinary instance as it's not needed in browser environment
