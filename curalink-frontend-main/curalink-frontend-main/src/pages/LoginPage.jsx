// LoginPage — redirects to /chat and opens the login modal
// This route exists for direct links like /login from emails etc.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { openLogin } = useAuthModal();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Already logged in — go straight to chat
      navigate('/chat', { replace: true });
    } else {
      // Go to chat page and open the modal on top of it
      navigate('/chat', { replace: true });
      // Small delay so ChatPage mounts first
      const t = setTimeout(() => openLogin(), 50);
      return () => clearTimeout(t);
    }
  }, []);

  return null;
}
