
import { useBaseApi } from './useBaseApi';
const API_BASE_URL = (import.meta.env?.VITE_API_URL) || '/api';

export const useRevenueApi = () => {
  const { post, ...rest } = useBaseApi();

  const uploadRevenueData = async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'revenue_prediction');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            resolve({ success: true, message: 'File uploaded successfully' });
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.error || 'Upload failed'));
          } catch (e) {
            reject(new Error('Upload failed'));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error'));
      };

      xhr.open('POST', `${API_BASE_URL}/upload-revenue-data/`);
      xhr.send(formData);
    });
  };

  const getRevenuePredictionData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-revenue-prediction-data/`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch revenue prediction data');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching revenue prediction data:', error);
      throw error;
    }
  };

  return {
    ...rest,
    uploadRevenueData,
    getRevenuePredictionData,
  };
};
