// ConversationGroup — collapsible date section (Today, Yesterday, etc.)
import { useState } from 'react';
import ConversationItem from './ConversationItem';
import styles from './ConversationGroup.module.css';

export default function ConversationGroup({
  label,
  conversations,
  activeId,
  activeMenu,
  onSelect,
  onMenuToggle,
  onDelete,
  onRename,
  onSave,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.group}>
      <button
        className={styles.labelBtn}
        onClick={() => setCollapsed((p) => !p)}
        aria-expanded={!collapsed}
      >
        <span>{label}</span>
        <svg
          className={`${styles.chevron} ${collapsed ? styles.chevronCollapsed : ''}`}
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {!collapsed && (
        <ul className={styles.list} role="list">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeId}
              isMenuOpen={activeMenu === conv.id}
              onSelect={() => onSelect(conv.id)}
              onMenuToggle={() =>
                onMenuToggle(activeMenu === conv.id ? null : conv.id)
              }
              onDelete={() => onDelete(conv.id)}
              onRename={(id, newTitle) => onRename(id, newTitle)}
              onSave={() => onSave(conv.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
