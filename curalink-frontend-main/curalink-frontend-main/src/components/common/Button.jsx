// Button — reusable button component with variants (primary, ghost, danger)
export default function Button({ children, variant = 'primary', onClick, disabled }) {
  return (
    <button className={`btn btn--${variant}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
