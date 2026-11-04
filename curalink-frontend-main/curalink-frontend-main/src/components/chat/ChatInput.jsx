import { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';
import VoiceDialog from './VoiceDialog';

const SOURCES = ['All Sources', 'Uploaded PDFs'];

export default function ChatInput({ onSend, isLoading }) {
  const [value,        setValue]        = useState('');
  const [source,       setSource]       = useState('All Sources');
  const [sourceOpen,   setSourceOpen]   = useState(false);
  const [structured,   setStructured]   = useState(false);
  const [disease,      setDisease]      = useState('');
  const [patientName,  setPatientName]  = useState('');
  const [location,     setLocation]     = useState('');
  const [voiceOpen,    setVoiceOpen]    = useState(false);

  const textareaRef = useRef(null);
  const sourceRef   = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, [value]);

  // Close source dropdown on outside click
  useEffect(() => {
    if (!sourceOpen) return;
    const handler = (e) => {
      if (sourceRef.current && !sourceRef.current.contains(e.target)) setSourceOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sourceOpen]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;

    // Only pass structured fields when structured mode is ON
    const payload = {
      query:  trimmed,
      source,
      ...(structured && {
        disease:     disease.trim()     || undefined,
        patientName: patientName.trim() || undefined,
        location:    location.trim()    || undefined,
      }),
    };

    onSend?.(payload);
    setValue('');

    // Clear structured fields after send so next message starts fresh
    if (structured) {
      setDisease('');
      setPatientName('');
      setLocation('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {/* ── Structured fields (shown when structured mode is on) ── */}
        {structured && (
          <div className={styles.structuredFields}>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="ci-disease">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  Disease / Condition
                </label>
                <input
                  id="ci-disease"
                  className={styles.fieldInput}
                  type="text"
                  placeholder="e.g. Parkinson's disease"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="ci-name">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  Patient Name
                </label>
                <input
                  id="ci-name"
                  className={styles.fieldInput}
                  type="text"
                  placeholder="e.g. John Smith"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="ci-location">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  Location
                </label>
                <input
                  id="ci-location"
                  className={styles.fieldInput}
                  type="text"
                  placeholder="e.g. Toronto, Canada"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className={styles.structuredDivider} />
          </div>
        )}

        {/* ── Main query textarea ── */}
        <div className={styles.inputRow}>
          <span className={styles.sparkleIcon} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/>
              <path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/>
              <path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/>
            </svg>
          </span>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            placeholder={structured
              ? 'Additional query or question...'
              : 'What are the latest treatments for...'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Message input"
            disabled={isLoading}
          />
        </div>

        {/* ── Toolbar ── */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            {/* Source selector */}
            <div className={styles.sourceWrap} ref={sourceRef}>
              <button
                className={styles.sourceBtn}
                onClick={() => setSourceOpen((p) => !p)}
                aria-haspopup="listbox"
                aria-expanded={sourceOpen}
              >
                {source}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {sourceOpen && (
                <ul className={styles.dropdown} role="listbox" aria-label="Select source">
                  {SOURCES.map((s) => (
                    <li
                      key={s}
                      className={`${styles.dropdownItem} ${s === source ? styles.dropdownItemActive : ''}`}
                      role="option"
                      aria-selected={s === source}
                      onClick={() => { setSource(s); setSourceOpen(false); }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Structured mode toggle */}
            <button
              className={`${styles.structuredToggle} ${structured ? styles.structuredToggleActive : ''}`}
              onClick={() => setStructured((p) => !p)}
              title={structured ? 'Hide structured fields' : 'Add disease, patient name, location'}
              aria-pressed={structured}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="8"  y1="6"  x2="21" y2="6"/>
                <line x1="8"  y1="12" x2="21" y2="12"/>
                <line x1="8"  y1="18" x2="21" y2="18"/>
                <line x1="3"  y1="6"  x2="3.01" y2="6"/>
                <line x1="3"  y1="12" x2="3.01" y2="12"/>
                <line x1="3"  y1="18" x2="3.01" y2="18"/>
              </svg>
              <span>Structured</span>
            </button>
          </div>

          <div className={styles.toolbarRight} style={{ display: 'flex', gap: '8px' }}>
            {/* Voice Mode */}
            <button
              className={styles.voiceBtn}
              onClick={() => setVoiceOpen(true)}
              aria-label="Voice mode"
              title="Voice Mode"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>

            {/* Send */}
            <button
              className={`${styles.sendBtn} ${canSend ? styles.sendBtnActive : ''}`}
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Send message"
              title="Send"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="19" x2="12" y2="5"/>
                <polyline points="5 12 12 5 19 12"/>
              </svg>
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>

      <p className={styles.disclaimer}>
        Curalink may display inaccurate info — always verify with a medical professional.{' '}
        <a
          href="#privacy"
          className={styles.disclaimerLink}
          onClick={(e) => e.preventDefault()}
        >
          Your Privacy &amp; Curalink
        </a>
      </p>

      <VoiceDialog isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
}
