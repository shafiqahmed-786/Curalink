// ProfileModal — update display name, audience level, preferred tone
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { updateProfile } from '../../services/auth.service';
import AppIcon from '../common/AppIcon';
import styles from './ProfileModal.module.css';

const AUDIENCE_OPTIONS = [
  { value: 'patient',    label: 'Patient',     desc: 'Plain language, easy to understand' },
  { value: 'researcher', label: 'Researcher',  desc: 'Technical detail, citations' },
  { value: 'clinician',  label: 'Clinician',   desc: 'Clinical terminology, evidence-based' },
];

const TONE_OPTIONS = [
  { value: 'educational', label: 'Educational', desc: 'Informative and clear' },
  { value: 'clinical',    label: 'Clinical',    desc: 'Precise and formal' },
  { value: 'simplified',  label: 'Simplified',  desc: 'Short and accessible' },
];

export default function ProfileModal({ onClose }) {
  const { user, login, token } = useAuth();
  const { toast } = useToast();
  const overlayRef = useRef(null);

  const [name,          setName]          = useState(user?.name || '');
  const [audienceLevel, setAudienceLevel] = useState(user?.audienceLevel || 'patient');
  const [preferredTone, setPreferredTone] = useState(user?.preferredTone || 'educational');
  const [loading,       setLoading]       = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.warning('Name cannot be empty'); return; }
    setLoading(true);
    try {
      const res = await updateProfile({ name: name.trim(), audienceLevel, preferredTone });
      const updatedUser = res.data.data.user;
      login(updatedUser, token); // refresh user in AuthContext
      toast.success('Profile updated');
      onClose();
    } catch {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Profile settings"
    >
      <div className={styles.modal}>
        {/* Close */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <h2 className={styles.title}>Profile settings</h2>
            <p className={styles.email}>{user?.email}</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSave} noValidate>
          {/* Name */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="profile-name">Display name</label>
            <input
              id="profile-name"
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          {/* Audience level */}
          <div className={styles.field}>
            <label className={styles.label}>I am a</label>
            <div className={styles.optionGrid}>
              {AUDIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.optionCard} ${audienceLevel === opt.value ? styles.optionCardActive : ''}`}
                  onClick={() => setAudienceLevel(opt.value)}
                >
                  <span className={styles.optionLabel}>{opt.label}</span>
                  <span className={styles.optionDesc}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred tone */}
          <div className={styles.field}>
            <label className={styles.label}>Response style</label>
            <div className={styles.optionGrid}>
              {TONE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.optionCard} ${preferredTone === opt.value ? styles.optionCardActive : ''}`}
                  onClick={() => setPreferredTone(opt.value)}
                >
                  <span className={styles.optionLabel}>{opt.label}</span>
                  <span className={styles.optionDesc}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button className={styles.saveBtn} type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
