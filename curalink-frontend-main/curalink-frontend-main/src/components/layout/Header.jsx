// Header — top bar
// Unauthenticated: Login + Sign up buttons on the right
// Authenticated:   user avatar + name on the right
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuthModal } from '../../context/AuthModalContext';
import { useChatContext } from '../../context/ChatContext';
import ProfileModal from '../profile/ProfileModal';
import styles from './Header.module.css';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const { openLogin, openSignup } = useAuthModal();
  const { startNewChat } = useChatContext();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleNewChat = () => {
    startNewChat();
    navigate('/chat');
  };

  return (
    <>
      <header className={styles.header}>
      {/* ── Left ── */}
      <div className={styles.left}>
        {/* Hamburger — mobile only */}
        <button
          className={styles.menuBtn}
          onClick={onMenuClick}
          aria-label="Open menu"
          title="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="3" y1="6"  x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <span className={styles.logo}>Curalink</span>
        <span className={styles.badge}>LLaMA 3.3 70B</span>
      </div>

      {/* ── Right ── */}
      <div className={styles.right}>
        {user ? (
          /* Authenticated — avatar chip opens profile modal */
          <div
            className={styles.userChip}
            onClick={() => setShowProfile(true)}
            role="button"
            tabIndex={0}
            title="Profile settings"
          >
            <div className={styles.avatar}>
              {user.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <span className={styles.userName}>{user.name}</span>
          </div>
        ) : (
          /* Unauthenticated — New Chat + Login + Sign up */
          <>
            <button
              className={styles.newChatBtn}
              onClick={handleNewChat}
              aria-label="New chat"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5"  y1="12" x2="19" y2="12" />
              </svg>
              New Chat
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
                <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" opacity="0.7" />
              </svg>
            </button>

            <button
              className={styles.loginBtn}
              onClick={openLogin}
            >
              Log in
            </button>

            <button
              className={styles.signupBtn}
              onClick={openSignup}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
    {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}
