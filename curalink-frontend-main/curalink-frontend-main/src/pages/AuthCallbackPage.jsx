// AuthCallbackPage — handles Google OAuth redirect
// Backend redirects to: /auth/callback?token=<jwt>
// We extract the token, fetch the user, store it, then go to /chat
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMe } from '../services/auth.service';
import styles from './AuthCallbackPage.module.css';

export default function AuthCallbackPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setError('No token received. Please try logging in again.');
      return;
    }

    // Store token temporarily so the API interceptor can use it
    localStorage.setItem('token', token);

    getMe()
      .then((res) => {
        const user = res.data.data.user;
        login(user, token);
        navigate('/chat', { replace: true });
      })
      .catch(() => {
        localStorage.removeItem('token');
        setError('Authentication failed. Please try again.');
      });
  }, []);

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.errorIcon} aria-hidden="true">⚠</div>
          <h2 className={styles.title}>Sign-in failed</h2>
          <p className={styles.message}>{error}</p>
          <button className={styles.btn} onClick={() => navigate('/chat')}>
            Back to Curalink
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Spinner */}
        <div className={styles.spinner} aria-label="Signing you in…" />
        <p className={styles.message}>Signing you in…</p>
      </div>
    </div>
  );
}
