// ToastContext — global toast notification system
// Usage anywhere: const { toast } = useToast();
//   toast.success('Saved!') | toast.error('Failed') | toast.info('...') | toast.warning('...')
import { createContext, useCallback, useContext, useState } from 'react';
import Toast from '../components/common/Toast';
import styles from './ToastContext.module.css';

const ToastContext = createContext(null);

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    // Auto-dismiss
    setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => add(msg, 'success'),
    error:   (msg) => add(msg, 'error'),
    info:    (msg) => add(msg, 'info'),
    warning: (msg) => add(msg, 'warning'),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container — bottom-right */}
      {toasts.length > 0 && (
        <div className={styles.container} aria-live="polite" aria-atomic="false">
          {toasts.map((t) => (
            <Toast
              key={t.id}
              id={t.id}
              message={t.message}
              type={t.type}
              onDismiss={dismiss}
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
