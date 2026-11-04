// AuthModalContext — lets any component open the auth modal
// without prop-drilling
import { createContext, useContext, useState, useCallback } from 'react';
import AuthModal from '../components/auth/AuthModal';

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [state, setState] = useState({ open: false, view: 'login' });

  const openLogin  = useCallback(() => setState({ open: true, view: 'login' }), []);
  const openSignup = useCallback(() => setState({ open: true, view: 'signup' }), []);
  const close      = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  return (
    <AuthModalContext.Provider value={{ openLogin, openSignup, close }}>
      {children}
      {state.open && (
        <AuthModal initialView={state.view} onClose={close} />
      )}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used inside AuthModalProvider');
  return ctx;
}
