// src/api.js
import axios from 'axios';

// set baseURL if your backend is at a different port
export const apiClient = axios.create({
  baseURL: 'https://formbuilder-xbl5.onrender.com/', // change if needed
  // withCredentials: true, // if you use cookies/auth
});
/*
export async function uploadImageToBackend(file, endpoint = '/api/upload') {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.imageUrl;
}
*/
export async function uploadImageToBackend(file, endpoint) {
  const formData = new FormData();
  // Ensure the key matches what your backend expects. It's 'image' in the backend, not 'file'.
  formData.append('image', file);

  try {
    const res = await apiClient.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    // Assuming your backend response for successful upload is { imageUrl: '...' }
    return res.data.imageUrl;
  } catch (error) {
    console.error(`Error uploading image to ${endpoint}:`, error);
    // Rethrow to be handled by the component
    throw error;
  }
}