// ConversationItem — single history row with context menu + inline rename
import { useEffect, useRef, useState } from 'react';
import styles from './ConversationItem.module.css';

export default function ConversationItem({
  conversation,
  isActive,
  isMenuOpen,
  onSelect,
  onMenuToggle,
  onDelete,
  onRename,
  onSave,
}) {
  const menuRef   = useRef(null);
  const inputRef  = useRef(null);
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(conversation.title);

  // Close menu on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onMenuToggle();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isMenuOpen, onMenuToggle]);

  // Focus input when rename mode opens
  useEffect(() => {
    if (renaming) {
      setRenameVal(conversation.title);
      setTimeout(() => inputRef.current?.select(), 30);
    }
  }, [renaming]);

  const startRename = () => {
    onMenuToggle(); // close menu
    setRenaming(true);
  };

  const commitRename = () => {
    const trimmed = renameVal.trim();
    if (trimmed && trimmed !== conversation.title) {
      onRename(conversation.id, trimmed);
    }
    setRenaming(false);
  };

  const handleRenameKey = (e) => {
    if (e.key === 'Enter')  { e.preventDefault(); commitRename(); }
    if (e.key === 'Escape') { setRenaming(false); }
  };

  return (
    <li className={`${styles.item} ${isActive ? styles.active : ''}`} ref={menuRef}>

      {/* ── Rename mode ── */}
      {renaming ? (
        <div className={styles.renameWrap}>
          <input
            ref={inputRef}
            className={styles.renameInput}
            value={renameVal}
            onChange={(e) => setRenameVal(e.target.value)}
            onBlur={commitRename}
            onKeyDown={handleRenameKey}
            aria-label="Rename conversation"
          />
        </div>
      ) : (
        <>
          <button className={styles.titleBtn} onClick={onSelect} title={conversation.title}>
            <span className={styles.title}>{conversation.title}</span>
          </button>

          <button
            className={`${styles.menuTrigger} ${isMenuOpen ? styles.menuTriggerVisible : ''}`}
            onClick={(e) => { e.stopPropagation(); onMenuToggle(); }}
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
              {/* Save */}
              <button className={styles.menuItem} role="menuitem"
                onClick={(e) => { e.stopPropagation(); onSave(); onMenuToggle(); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Save
              </button>

              {/* Rename */}
              <button className={styles.menuItem} role="menuitem"
                onClick={(e) => { e.stopPropagation(); startRename(); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Rename
              </button>

              <div className={styles.menuDivider} />

              {/* Delete */}
              <button className={`${styles.menuItem} ${styles.menuItemDanger}`} role="menuitem"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}>
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
        </>
      )}
    </li>
  );
}
