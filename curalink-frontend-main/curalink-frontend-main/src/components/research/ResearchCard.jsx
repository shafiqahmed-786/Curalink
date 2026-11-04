// ResearchCard — research paper with source badge, snippet preview, expandable abstract
import { useState } from 'react';
import { sourceLabel } from '../../utils/formatters';
import styles from './ResearchCard.module.css';

const SOURCE_COLORS = {
  pubmed:         { bg: 'rgba(59,130,246,0.1)',  text: '#3b82f6' },
  openalex:       { bg: 'rgba(16,185,129,0.1)',  text: '#10b981' },
  clinicaltrials: { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b' },
  pdf:            { bg: 'rgba(139,92,246,0.1)',  text: '#8b5cf6' },
};

function RankBar({ label, value, weight, color }) {
  const pct = Math.round((value || 0) * 100);
  return (
    <div className={styles.rankBarRow}>
      <span className={styles.rankBarLabel}>{label} <span className={styles.rankBarWeight}>({weight})</span></span>
      <div className={styles.rankBarTrack}>
        <div className={styles.rankBarFill} style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className={styles.rankBarValue}>{pct}%</span>
    </div>
  );
}

export default function ResearchCard({ paper, index }) {
  const [expanded, setExpanded] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const sourceKey = paper.source || paper.platform || 'unknown';
  const color     = SOURCE_COLORS[sourceKey] || { bg: 'var(--color-bg-tertiary)', text: 'var(--color-text-muted)' };

  const snippet  = paper.snippet || '';
  const abstract = paper.abstract || '';
  const preview  = snippet || (abstract.length > 180 ? abstract.slice(0, 180) + '…' : abstract);
  const hasMore  = abstract.length > 180 || (snippet && abstract && snippet !== abstract);

  // Ranking breakdown from reranker
  const ranking = paper.rankingBreakdown;
  const score   = paper.rankingScore;

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(paper.url || paper.title || '');
  };

  return (
    <div className={styles.card}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.index}>{index + 1}</span>
          <span className={styles.sourceBadge} style={{ backgroundColor: color.bg, color: color.text }}>
            {sourceLabel(sourceKey)}
          </span>
          {paper.year && <span className={styles.year}>{paper.year}</span>}
        </div>
        {paper.url && (
          <button className={styles.copyBtn} onClick={handleCopy} title="Copy link" aria-label="Copy link">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── Title ── */}
      {paper.url ? (
        <a href={paper.url} target="_blank" rel="noopener noreferrer" className={styles.title}>
          {paper.title}
        </a>
      ) : (
        <p className={styles.title}>{paper.title}</p>
      )}

      {/* ── Authors ── */}
      {paper.authors?.length > 0 && (
        <div className={styles.authors}>
          {(Array.isArray(paper.authors)
            ? paper.authors
            : paper.authors.split(',').map(a => a.trim())
          ).slice(0, 4).map((a, i) => (
            <span key={i} className={styles.authorChip}>{a}</span>
          ))}
          {(Array.isArray(paper.authors) ? paper.authors : paper.authors.split(',')).length > 4 && (
            <span className={styles.authorMore}>
              +{(Array.isArray(paper.authors) ? paper.authors : paper.authors.split(',')).length - 4} more
            </span>
          )}
        </div>
      )}

      {/* ── Snippet / Abstract preview ── */}
      {preview && (
        <p className={styles.snippet}>
          {expanded ? abstract || preview : preview}
        </p>
      )}

      {/* ── Expand toggle ── */}
      {hasMore && (
        <button className={styles.toggleBtn} onClick={() => setExpanded(p => !p)}>
          {expanded ? 'Show less' : 'Read full abstract'}
          <svg className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      )}

      {/* ── Ranking explanation (top 2 only) ── */}
      {index < 2 && score && (
        <>
          <button className={styles.rankingToggle} onClick={() => setShowRanking(p => !p)}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Why ranked #{index + 1}?
            <svg className={`${styles.chevron} ${showRanking ? styles.chevronOpen : ''}`} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {showRanking && ranking && (
            <div className={styles.rankingBox}>
              <p className={styles.rankingTitle}>Ranking Score: <strong>{score}</strong></p>
              <div className={styles.rankingBars}>
                <RankBar label="Relevance" value={ranking.relevance} weight="50%" color="#3b82f6" />
                <RankBar label="Recency"   value={ranking.recency}   weight="30%" color="#10b981" />
                <RankBar label="Credibility" value={ranking.credibility} weight="20%" color="#8b5cf6" />
              </div>
              <p className={styles.rankingNote}>
                {index === 0
                  ? `Ranked #1 — highest combined score across relevance, recency (${paper.year || 'N/A'}), and source credibility (${sourceKey}).`
                  : `Ranked #2 — strong relevance score with ${paper.year || 'N/A'} publication from ${sourceKey}.`}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
