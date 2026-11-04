// SourcesList — flat list of sources (used inside collapsible Section in MessageBubble)
import { sourceLabel } from '../../utils/formatters';
import styles from './SourcesList.module.css';

const SOURCE_COLORS = {
  pubmed:         { bg: 'rgba(59,130,246,0.1)',  text: '#3b82f6' },
  openalex:       { bg: 'rgba(16,185,129,0.1)',  text: '#10b981' },
  clinicaltrials: { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b' },
  pdf:            { bg: 'rgba(139,92,246,0.1)',  text: '#8b5cf6' },
};

export default function SourcesList({ sources }) {
  if (!sources?.length) return null;

  return (
    <ul className={styles.list}>
      {sources.map((s, i) => {
        const sourceKey = s.source || s.platform || 'unknown';
        const c = SOURCE_COLORS[sourceKey] || { bg: 'var(--color-bg-tertiary)', text: 'var(--color-text-muted)' };
        return (
          <li key={i} className={styles.item}>
            <span className={styles.badge} style={{ backgroundColor: c.bg, color: c.text }}>
              {sourceLabel(sourceKey)}
            </span>
            <div className={styles.itemContent}>
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {s.title}
                </a>
              ) : (
                <span className={styles.titleText}>{s.title}</span>
              )}
              {s.snippet && <p className={styles.snippet}>{s.snippet.slice(0, 160)}{s.snippet.length > 160 ? '…' : ''}</p>}
            </div>
            {s.year && <span className={styles.year}>{s.year}</span>}
          </li>
        );
      })}
    </ul>
  );
}
