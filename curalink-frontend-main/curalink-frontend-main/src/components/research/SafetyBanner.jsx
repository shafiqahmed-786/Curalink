// SafetyBanner — shown when backend returns a safety disclaimer (MEDIUM/LOW severity)
import styles from './SafetyBanner.module.css';

const CONFIG = {
  medium: {
    icon: '🧠',
    label: 'Sensitive topic',
    color: 'medium',
  },
  low: {
    icon: 'ℹ️',
    label: 'Informational note',
    color: 'low',
  },
};

export default function SafetyBanner({ message, severity = 'low' }) {
  const cfg = CONFIG[severity] || CONFIG.low;

  return (
    <div className={`${styles.banner} ${styles[cfg.color]}`} role="note">
      <span className={styles.icon} aria-hidden="true">{cfg.icon}</span>
      <div className={styles.body}>
        <span className={styles.label}>{cfg.label}</span>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}
