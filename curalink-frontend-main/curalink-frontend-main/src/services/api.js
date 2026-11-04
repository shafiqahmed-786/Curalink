// api.js — base axios instance with auth token injection and error handling
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 120000, // 2 minutes — live fetch + embed + store takes time on first query
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if the user had a stored token (expired session)
    // NOT when they're actively trying to log in with wrong credentials
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    const hasToken = !!localStorage.getItem('token');
    
    if (error.response?.status === 401 && !isAuthEndpoint && hasToken) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
