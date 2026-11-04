// WelcomeScreen — shown before the first message is sent
// Displays app branding + suggested query chips
import { SUGGESTED_QUERIES } from '../../utils/constants';
import AppIcon from '../common/AppIcon';
import styles from './WelcomeScreen.module.css';

export default function WelcomeScreen({ onSuggest }) {
  return (
    <div className={styles.wrapper}>
      {/* Logo mark */}
      <AppIcon size={64} className={styles.logo} />

      <h1 className={styles.heading}>What can I help you research?</h1>
      <p className={styles.sub}>
        Ask about treatments, clinical trials, researchers, or upload a medical PDF.
      </p>

      {/* Suggested query chips */}
      <div className={styles.chips} role="list" aria-label="Suggested queries">
        {SUGGESTED_QUERIES.map((q) => (
          <button
            key={q}
            className={styles.chip}
            onClick={() => onSuggest?.(q)}
            role="listitem"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
