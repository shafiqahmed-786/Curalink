// storage.js — localStorage helpers for token and session persistence

export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

export const getSessionId = () => localStorage.getItem('sessionId');
export const setSessionId = (id) => localStorage.setItem('sessionId', id);
export const removeSessionId = () => localStorage.removeItem('sessionId');
