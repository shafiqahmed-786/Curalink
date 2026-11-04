// upload.service.js — POST /api/upload for PDF ingestion
import api from './api';

export const uploadPDF = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
};
