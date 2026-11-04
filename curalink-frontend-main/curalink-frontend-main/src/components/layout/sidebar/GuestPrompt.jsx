// GuestPrompt — shown in sidebar history area when user is not logged in
// Explains that chat history requires an account
import { useAuthModal } from '../../../context/AuthModalContext';
import styles from './GuestPrompt.module.css';

export default function GuestPrompt() {
  const { openLogin, openSignup } = useAuthModal();

  return (
    <div className={styles.wrapper}>
      <div className={styles.iconWrap} aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <p className={styles.title}>Save your chats</p>
      <p className={styles.desc}>
        Sign in to keep your research history and access it from any device.
      </p>
      <div className={styles.actions}>
        <button className={styles.loginBtn} onClick={openLogin}>Log in</button>
        <button className={styles.signupBtn} onClick={openSignup}>Sign up</button>
      </div>
    </div>
  );
}
