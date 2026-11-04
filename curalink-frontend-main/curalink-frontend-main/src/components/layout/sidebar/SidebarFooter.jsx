// SidebarFooter
// Unauthenticated: "Get responses tailored to you" card + Log in button
// Authenticated:   theme toggle + upload PDF + user profile row
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../hooks/useTheme';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthModal } from '../../../context/AuthModalContext';
import { useToast } from '../../../context/ToastContext';
import { useChatContext } from '../../../context/ChatContext';
import { useConversationStore } from '../../../store/conversationStore';
import ProfileModal from '../../profile/ProfileModal';
import UploadModal from '../../upload/UploadModal';
import styles from './SidebarFooter.module.css';

// ── Sun icon ──────────────────────────────
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

// ── Moon icon ─────────────────────────────
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function SidebarFooter({ onUpload, isOpen }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { openLogin } = useAuthModal();
  const { toast } = useToast();
  const { startNewChat } = useChatContext();
  const { reset: resetConversations } = useConversationStore();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [showProfile, setShowProfile] = useState(false);
  const [showUpload,  setShowUpload]  = useState(false);

  const handleLogout = () => {
    logout();
    startNewChat();
    resetConversations();
    toast.success('Logged out successfully');
    navigate('/chat');
  };

  // ── Collapsed icon-rail: always just show theme toggle ──────────────
  if (!isOpen) {
    return (
      <div className={`${styles.footer} ${styles.collapsed}`}>
        <button
          className={styles.iconBtn}
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {user && (
          <>
            <button className={styles.iconBtn} onClick={() => setShowUpload(true)} aria-label="Upload PDF" title="Upload PDF">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </button>
            <div className={styles.avatarSmall} title={user.name}>
              {user.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          </>
        )}
      </div>
    );
  }

  // ── Expanded — unauthenticated ───────────────────────────────────────
  if (!user) {
    return (
      <div className={styles.footer}>
        {/* Theme toggle row */}
        <button className={styles.row} onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          <span className={styles.icon}>{isDark ? <SunIcon /> : <MoonIcon />}</span>
          <span className={styles.label}>{isDark ? 'Light mode' : 'Dark mode'}</span>
        </button>

        {/* Login prompt card */}
        <div className={styles.loginCard}>
          <p className={styles.loginTitle}>Your research, personalised</p>
          <p className={styles.loginDesc}>
            Sign in to save conversations, upload medical PDFs, and get insights tailored to your research history.
          </p>
          <button
            className={styles.loginBtn}
            onClick={openLogin}
          >
            Log in
          </button>
        </div>
      </div>
    );
  }

  // ── Expanded — authenticated ─────────────────────────────────────────
  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U';

  return (
    <div className={styles.footer}>
      {/* Theme toggle */}
      <button className={styles.row} onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        <span className={styles.icon}>{isDark ? <SunIcon /> : <MoonIcon />}</span>
        <span className={styles.label}>{isDark ? 'Light mode' : 'Dark mode'}</span>
      </button>

      {/* Upload PDF */}
      <button className={styles.row} onClick={() => setShowUpload(true)} aria-label="Upload PDF">
        <span className={styles.icon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </span>
        <span className={styles.label}>Upload PDF</span>
      </button>

      {/* User profile row */}
      <div className={styles.profile} onClick={() => setShowProfile(true)} role="button" tabIndex={0} title="Profile settings">
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.info}>
          <span className={styles.name}>{user.name}</span>
          <span className={styles.email}>{user.email}</span>
        </div>
        <button
          className={styles.settingsBtn}
          onClick={(e) => { e.stopPropagation(); handleLogout(); }}
          aria-label="Log out"
          title="Log out"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showUpload  && <UploadModal  onClose={() => setShowUpload(false)} onUploaded={() => setShowUpload(false)} />}
    </div>
  );
}
