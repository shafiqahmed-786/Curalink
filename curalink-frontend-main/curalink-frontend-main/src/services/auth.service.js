// auth.service.js — login, register, Google OAuth endpoints
import api from './api';

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (name, email, password) =>
  api.post('/auth/signup', { name, email, password });   // backend uses /signup not /register

export const getMe = () =>
  api.get('/auth/me');

export const updateProfile = (data) =>
  api.patch('/auth/me', data);
