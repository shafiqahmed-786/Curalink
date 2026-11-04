// AuthContext — provides auth state (user, token) across the app
// On mount: if a token exists in localStorage, fetches /auth/me to restore the session
import { createContext, useState, useEffect } from 'react';
import { getMe } from '../services/auth.service';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [token, setToken]         = useState(() => localStorage.getItem('token') || null);
  const [restoring, setRestoring] = useState(true); // true while checking stored token

  // On mount — if we have a stored token, validate it and restore the user
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setRestoring(false);
      return;
    }
    getMe()
      .then((res) => {
        setUser(res.data.data.user);
        setToken(storedToken);
      })
      .catch(() => {
        // Token invalid / expired — clear it
        localStorage.removeItem('token');
        setToken(null);
      })
      .finally(() => setRestoring(false));
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, restoring }}>
      {children}
    </AuthContext.Provider>
  );
}
