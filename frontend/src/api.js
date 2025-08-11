// src/api.js
import axios from 'axios';

// set baseURL if your backend is at a different port
export const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // change if needed
  // withCredentials: true, // if you use cookies/auth
});

export async function uploadImageToBackend(file, endpoint = '/api/upload') {
  const formData = new FormData();
  formData.append('file', file);
  const res = await apiClient.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.imageUrl;
}
