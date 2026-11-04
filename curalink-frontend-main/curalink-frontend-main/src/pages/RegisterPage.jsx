// RegisterPage — redirects to /chat and opens the signup modal
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const { openSignup } = useAuthModal();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/chat', { replace: true });
    } else {
      navigate('/chat', { replace: true });
      const t = setTimeout(() => openSignup(), 50);
      return () => clearTimeout(t);
    }
  }, []);

  return null;
}
