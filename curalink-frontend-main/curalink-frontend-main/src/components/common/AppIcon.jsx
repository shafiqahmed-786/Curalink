// AppIcon — the Curalink flame icon inside the dark rounded-square container
// size: pixel size of the outer square (default 40)
// imgSize: pixel size of the flame image inside (default 60% of size)
import styles from './AppIcon.module.css';

export default function AppIcon({ size = 40, className = '' }) {
  const imgSize = Math.round(size * 0.58);
  const radius  = Math.round(size * 0.28); // ~28% border-radius

  return (
    <div
      className={`${styles.wrap} ${className}`}
      style={{ width: size, height: size, borderRadius: radius }}
      aria-hidden="true"
    >
      <img
        src="/fire-flame-curved.png"
        alt=""
        width={imgSize}
        height={imgSize}
        draggable={false}
      />
    </div>
  );
}
