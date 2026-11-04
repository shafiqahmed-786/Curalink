// NotFoundPage — 404 with navigation back to chat
import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.message}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button className={styles.btn} onClick={() => navigate('/chat')}>
          Back to Curalink
        </button>
      </div>
    </div>
  );
}
