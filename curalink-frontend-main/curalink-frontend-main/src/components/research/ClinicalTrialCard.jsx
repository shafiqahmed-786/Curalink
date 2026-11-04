// ClinicalTrialCard — full trial card with expandable eligibility, locations, contacts
import { useState } from 'react';
import styles from './ClinicalTrialCard.module.css';

const STATUS_CONFIG = {
  'Recruiting':             { color: '#10b981', bg: 'rgba(16,185,129,0.1)', dot: '#10b981' },
  'Active, not recruiting': { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', dot: '#3b82f6' },
  'Completed':              { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', dot: '#6b7280' },
  'Not yet recruiting':     { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  dot: '#f59e0b' },
  'Terminated':             { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   dot: '#ef4444' },
};

export default function ClinicalTrialCard({ trial, index }) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_CONFIG[trial.status] || { color: 'var(--color-text-muted)', bg: 'var(--color-bg-tertiary)', dot: 'var(--color-text-muted)' };

  // Parse locations — may be JSON string or array
  let locations = trial.locations || [];
  if (typeof locations === 'string') {
    try { locations = JSON.parse(locations); } catch { locations = []; }
  }

  let contacts = trial.contacts || [];
  if (typeof contacts === 'string') {
    try { contacts = JSON.parse(contacts); } catch { contacts = []; }
  }

  const eligibility = trial.eligibility || trial.condition || '';
  const hasDetails  = eligibility || locations.length > 0 || contacts.length > 0;

  return (
    <div className={styles.card}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.index}>{index + 1}</span>
          <span className={styles.statusDot} style={{ backgroundColor: statusCfg.dot }} aria-hidden="true" />
          <span className={styles.status} style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
            {trial.status || 'Unknown'}
          </span>
          {trial.phase && trial.phase !== 'N/A' && (
            <span className={styles.phase}>{trial.phase}</span>
          )}
        </div>
        {trial.url && (
          <a href={trial.url} target="_blank" rel="noopener noreferrer" className={styles.extLink} title="View on ClinicalTrials.gov" aria-label="View on ClinicalTrials.gov">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        )}
      </div>

      {/* ── Title ── */}
      {trial.url ? (
        <a href={trial.url} target="_blank" rel="noopener noreferrer" className={styles.title}>
          {trial.title}
        </a>
      ) : (
        <p className={styles.title}>{trial.title}</p>
      )}

      {/* ── Sponsor / NCT ID ── */}
      <div className={styles.meta}>
        {trial.sponsor && (
          <span className={styles.metaItem}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
            {trial.sponsor}
          </span>
        )}
        {trial.nctId && !trial.nctId.startsWith('trial-') && (
          <span className={styles.nctId}>{trial.nctId}</span>
        )}
      </div>

      {/* ── Expandable details ── */}
      {hasDetails && (
        <>
          {expanded && (
            <div className={styles.details}>
              {eligibility && (
                <div className={styles.detailSection}>
                  <p className={styles.detailLabel}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    Eligibility
                  </p>
                  <p className={styles.detailText}>{eligibility}</p>
                </div>
              )}

              {locations.length > 0 && (
                <div className={styles.detailSection}>
                  <p className={styles.detailLabel}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    Locations
                  </p>
                  <div className={styles.locationList}>
                    {locations.slice(0, 4).map((loc, i) => (
                      <span key={i} className={styles.locationChip}>
                        {[loc.facility, loc.city, loc.country].filter(Boolean).join(', ')}
                      </span>
                    ))}
                    {locations.length > 4 && (
                      <span className={styles.locationMore}>+{locations.length - 4} more</span>
                    )}
                  </div>
                </div>
              )}

              {contacts.length > 0 && contacts[0]?.name && contacts[0].name !== 'N/A' && (
                <div className={styles.detailSection}>
                  <p className={styles.detailLabel}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Contact
                  </p>
                  {contacts.slice(0, 2).map((c, i) => (
                    <div key={i} className={styles.contactRow}>
                      {c.name && c.name !== 'N/A' && <span className={styles.contactName}>{c.name}</span>}
                      {c.email && c.email !== 'N/A' && (
                        <a href={`mailto:${c.email}`} className={styles.contactLink}>{c.email}</a>
                      )}
                      {c.phone && c.phone !== 'N/A' && (
                        <span className={styles.contactPhone}>{c.phone}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button className={styles.toggleBtn} onClick={() => setExpanded(p => !p)}>
            {expanded ? 'Show less' : 'View eligibility & locations'}
            <svg
              className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
              width="11" height="11" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
