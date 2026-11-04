// Spinner — animated ring for loading states
// sizes: sm (16px) | md (24px) | lg (40px)
import styles from './Spinner.module.css';

const SIZES = { sm: 16, md: 24, lg: 40 };

export default function Spinner({ size = 'md', className = '' }) {
  const px = SIZES[size] ?? SIZES.md;
  return (
    <div
      className={`${styles.spinner} ${className}`}
      style={{ width: px, height: px }}
      role="status"
      aria-label="Loading"
    />
  );
}
