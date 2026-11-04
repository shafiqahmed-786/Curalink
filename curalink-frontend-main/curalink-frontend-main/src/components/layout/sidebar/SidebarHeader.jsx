// SidebarHeader — "Chat" title (clickable to collapse on desktop) + search icon
// Collapsed: shows a single expand icon button
// Mobile: X close button + title + search icon
import styles from './SidebarHeader.module.css';

export default function SidebarHeader({ onToggle, onSearchClick, isOpen }) {
  return (
    <div className={`${styles.header} ${!isOpen ? styles.headerCollapsed : ''}`}>

      {/* ── COLLAPSED STATE: single expand button ── */}
      {!isOpen && (
        <button
          className={styles.iconBtn}
          onClick={onToggle}
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          {/* Panel / sidebar icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
      )}

      {/* ── EXPANDED STATE ── */}
      {isOpen && (
        <>
          {/* Mobile only: X close */}
          <button
            className={`${styles.iconBtn} ${styles.closeBtn}`}
            onClick={onToggle}
            aria-label="Close sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6"  y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* "Chat" title — click to collapse on desktop */}
          <button
            className={styles.titleBtn}
            onClick={onToggle}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            Chat
          </button>

          {/* Search icon */}
          <button
            className={styles.iconBtn}
            onClick={onSearchClick}
            aria-label="Search conversations"
            title="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </>
      )}

    </div>
  );
}
