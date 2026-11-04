// NewChatButton
// Expanded: full-width dark pill with  +  New Chat  ✦
// Collapsed: small square icon button showing only  +
import styles from './NewChatButton.module.css';

export default function NewChatButton({ onClick, isOpen }) {
  return (
    <div className={`${styles.wrap} ${!isOpen ? styles.wrapCollapsed : ''}`}>
      <button
        className={`${styles.btn} ${!isOpen ? styles.btnCollapsed : ''}`}
        onClick={onClick}
        aria-label="New chat"
        title="New chat"
      >
        {/* Plus icon — always visible */}
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          aria-hidden="true"
          className={styles.plusIcon}
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5"  y1="12" x2="19" y2="12" />
        </svg>

        {/* Text + sparkle — hidden when collapsed */}
        {isOpen && (
          <>
            <span>New Chat</span>
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="currentColor" aria-hidden="true"
              className={styles.sparkle}
            >
              <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
              <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" opacity="0.7" />
              <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" opacity="0.5" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
