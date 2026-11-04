// SavedSection — saved/pinned conversations
// Each item has: colored letter avatar · title · context menu (Unsave · Rename · Delete)
import { useEffect, useRef, useState } from 'react';
import styles from './SavedSection.module.css';

const AVATAR_COLORS = [
  { bg: '#dbeafe', text: '#1d4ed8' },
  { bg: '#fce7f3', text: '#be185d' },
  { bg: '#ede9fe', text: '#6d28d9' },
  { bg: '#d1fae5', text: '#065f46' },
  { bg: '#fef3c7', text: '#92400e' },
  { bg: '#fee2e2', text: '#991b1b' },
];

function getAvatarColor(title) {
  return AVATAR_COLORS[(title.charCodeAt(0) || 0) % AVATAR_COLORS.length];
}

// ── Single saved item ─────────────────────────────────────────────────────
function SavedItem({ item, isMenuOpen, onMenuToggle, onSelect, onUnsave, onRename, onDelete }) {
  const menuRef = useRef(null);
  const color   = getAvatarColor(item.title);
  const initial = item.title[0]?.toUpperCase() || '?';

  useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onMenuToggle(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isMenuOpen, onMenuToggle]);

  return (
    <li className={styles.item} ref={menuRef}>
      <button className={styles.itemBtn} onClick={() => onSelect(item.id)}>
        <span
          className={styles.avatar}
          style={{ backgroundColor: color.bg, color: color.text }}
          aria-hidden="true"
        >
          {initial}
        </span>
        <span className={styles.itemTitle}>{item.title}</span>
      </button>

      {/* Three-dot trigger */}
      <button
        className={`${styles.menuTrigger} ${isMenuOpen ? styles.menuTriggerVisible : ''}`}
        onClick={(e) => { e.stopPropagation(); onMenuToggle(isMenuOpen ? null : item.id); }}
        aria-label="More options"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5"  cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>

      {isMenuOpen && (
        <div className={styles.menu} role="menu">

          {/* Unsave */}
          <button
            className={styles.menuItem}
            role="menuitem"
            onClick={(e) => { e.stopPropagation(); onUnsave(item.id); onMenuToggle(null); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill="var(--color-warning)" />
            </svg>
            Unsave
          </button>

          {/* Rename */}
          <button
            className={styles.menuItem}
            role="menuitem"
            onClick={(e) => { e.stopPropagation(); onRename(item.id); onMenuToggle(null); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Rename
          </button>

          <div className={styles.menuDivider} />

          {/* Delete */}
          <button
            className={`${styles.menuItem} ${styles.menuItemDanger}`}
            role="menuitem"
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); onMenuToggle(null); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            Delete
          </button>

        </div>
      )}
    </li>
  );
}

// ── SavedSection ──────────────────────────────────────────────────────────
export default function SavedSection({ conversations, onSelect, onUnsave }) {
  const [activeMenu, setActiveMenu] = useState(null);

  if (!conversations?.length) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            fill="var(--color-warning)" />
        </svg>
        <span>Saved</span>
      </div>

      <ul className={styles.list} role="list">
        {conversations.map((item) => (
          <SavedItem
            key={item.id}
            item={item}
            isMenuOpen={activeMenu === item.id}
            onMenuToggle={setActiveMenu}
            onSelect={onSelect}
            onUnsave={onUnsave}
            onRename={(id) => {/* TODO */}}
            onDelete={(id) => {/* TODO */}}
          />
        ))}
      </ul>

      <div className={styles.divider} />
    </div>
  );
}
