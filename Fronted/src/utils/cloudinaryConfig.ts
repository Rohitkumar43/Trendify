import { v2 as cloudinary } from 'cloudinary';

const CLOUD_NAME = 'dv62cowbi';
const UPLOAD_PRESET = 'trendify_unsigned';  // Create this preset name in Cloudinary dashboard

cloudinary.config({
  cloud_name: CLOUD_NAME,
});

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'trendify');  // This will store images in a 'trendify' folder

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;
