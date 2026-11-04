// MessageBubble — renders user and assistant messages with full structured response
import { useState } from 'react';
import ResearchCard from '../research/ResearchCard';
import ClinicalTrialCard from '../research/ClinicalTrialCard';
import ResearchTrendChart from '../research/ResearchTrendChart';
import SourcesList from '../research/SourcesList';
import SafetyBanner from '../research/SafetyBanner';
import AppIcon from '../common/AppIcon';
import styles from './MessageBubble.module.css';

// ── Icons ─────────────────────────────────────────────────────────────────
const LightbulbIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const FlaskIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 3h15" />
    <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
    <path d="M6 14h12" />
  </svg>
);

const UsersIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LinkIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// ── User bubble ───────────────────────────────────────────────────────────
function UserBubble({ text }) {
  const lines = text.split('\n');
  const query = lines[0];
  const contextLines = lines.slice(1);
  return (
    <div className={styles.userRow}>
      <div className={styles.userBubble}>
        <span>{query}</span>
        {contextLines.length > 0 && (
          <div className={styles.userContext}>
            {contextLines.map((line, i) => (
              <span key={i} className={styles.userContextLine}>{line}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Collapsible section ───────────────────────────────────────────────────
function Section({ title, icon, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.section}>
      <button className={styles.sectionHeader} onClick={() => setOpen(p => !p)}>
        <span className={styles.sectionIcon}>{icon}</span>
        <span className={styles.sectionTitle}>{title}</span>
        {count > 0 && <span className={styles.sectionCount}>{count}</span>}
        <svg
          className={`${styles.sectionChevron} ${open ? styles.sectionChevronOpen : ''}`}
          width="13" height="13" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────
function StatsBar({ papers, trials, experts, sources, totalSources }) {
  const items = [
    papers > 0 && { label: 'Papers', value: papers, color: '#3b82f6' },
    trials > 0 && { label: 'Trials', value: trials, color: '#10b981' },
    experts > 0 && { label: 'Experts', value: experts, color: '#8b5cf6' },
    sources > 0 && { label: 'Sources', value: sources, color: '#f59e0b' },
  ].filter(Boolean);

  if (items.length === 0 && !totalSources) return null;

  return (
    <div className={styles.statsBar}>
      {items.map((item, i) => (
        <span key={i} className={styles.statItem}>
          <span className={styles.statDot} style={{ backgroundColor: item.color }} />
          <span className={styles.statValue}>{item.value}</span>
          <span className={styles.statLabel}>{item.label}</span>
        </span>
      ))}
      {totalSources > 0 && (
        <span className={styles.statTotal}>
          from <span className={styles.statHighlight}>{totalSources}</span> scanned sources
        </span>
      )}
    </div>
  );
}

// ── Assistant bubble ──────────────────────────────────────────────────────
function AssistantBubble({ message, onRetry }) {
  const { text, data, isError, retryPayload, retrySource } = message;
  const d = data || {};

  if (isError) {
    return (
      <div className={styles.assistantRow}>
        <AppIcon size={28} className={styles.avatarIcon} />
        <div className={styles.assistantContent}>
          <p className={styles.assistantText}>{text}</p>
          {onRetry && (
            <button className={styles.retryBtn} onClick={() => onRetry(retryPayload, retrySource)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: '6px' }}>
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // Normalise sources
  const normalisedSources = (d.sources || []).map(s => ({
    ...s,
    source: s.source || s.platform || 'unknown',
  }));

  // Normalise clinical trials
  const normalisedTrials = (d.clinicalTrials || []).map((t, i) => ({
    ...t,
    nctId: t.nctId || t.id || `trial-${i}`,
    condition: t.condition || t.eligibility?.slice(0, 60) || '',
    sponsor: t.sponsor || t.contacts?.[0]?.name || '',
  }));

  // Build research papers from sources (non-clinicaltrials)
  const researchPapers = normalisedSources.filter(
    s => s.source !== 'clinicaltrials' && s.title
  );

  // Experts
  const experts = (d.experts || []).filter(e => {
    const name = typeof e === 'string' ? e : e?.name;
    return name && name !== 'N/A';
  });

  return (
    <div className={styles.assistantRow}>
      <AppIcon size={28} className={styles.avatarIcon} />

      <div className={styles.assistantContent}>

        {/* Safety / disclaimer */}
        {d.safetyMessage && (
          <SafetyBanner message={d.safetyMessage} severity={d.safetySeverity || 'low'} />
        )}
        {d.disclaimers?.length > 0 && (
          <SafetyBanner message={d.disclaimers[0].replace(/^[ℹ️⚠️🧠]\s*/u, '')} severity="low" />
        )}

        {/* Condition overview */}
        {text && <p className={styles.assistantText}>{text}</p>}

        {/* Stats bar */}
        <StatsBar
          papers={researchPapers.length}
          trials={normalisedTrials.length}
          experts={experts.length}
          sources={normalisedSources.length}
          totalSources={d.stats?.totalSources || 0}
        />

        {/* Research Insights */}
        {d.researchInsights?.length > 0 && (
          <Section
            title="Research Insights"
            icon={<LightbulbIcon />}
            count={d.researchInsights.length}
          >
            <ul className={styles.insightList}>
              {d.researchInsights.map((item, i) => {
                const finding = typeof item === 'string' ? item : item?.finding || item?.text || '';
                const source = typeof item === 'object' ? item?.source : '';
                return finding ? (
                  <li key={i} className={styles.insightItem}>
                    <span>{finding}</span>
                    {source && <span className={styles.insightSource}>— {source}</span>}
                  </li>
                ) : null;
              })}
            </ul>
          </Section>
        )}

        {/* Research Trend Chart */}
        {d.stats?.sourceTrend && (
          <ResearchTrendChart data={d.stats.sourceTrend} insight={d.chartInsight} />
        )}

        {/* Patient Takeaways */}
        {d.patientTakeaways?.length > 0 && (
          <div className={styles.takeawaysBox}>
            <div className={styles.takeawaysHeader}>
              <LightbulbIcon />
              <span>Key Takeaways for You</span>
            </div>
            <ul className={styles.takeawayList}>
              {d.patientTakeaways.map((t, i) => (
                <li key={i} className={styles.takeawayItem}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Research Papers */}
        {researchPapers.length > 0 && (
          <Section
            title="Research Papers"
            icon={<FileTextIcon />}
            count={researchPapers.length}
            defaultOpen={true}
          >
            <div className={styles.cardList}>
              {researchPapers.map((paper, i) => (
                <ResearchCard key={paper.url || i} paper={paper} index={i} />
              ))}
            </div>
          </Section>
        )}

        {/* Clinical Trials */}
        {normalisedTrials.length > 0 && (
          <Section
            title="Clinical Trials"
            icon={<FlaskIcon />}
            count={normalisedTrials.length}
            defaultOpen={true}
          >
            {d.trialEligibilitySummary && (
              <div className={styles.eligibilitySummary}>
                <strong>Who can participate:</strong> {d.trialEligibilitySummary}
              </div>
            )}
            <div className={styles.cardList}>
              {normalisedTrials.map((trial, i) => (
                <ClinicalTrialCard key={trial.nctId || i} trial={trial} index={i} />
              ))}
            </div>
          </Section>
        )}

        {/* Key Researchers */}
        {experts.length > 0 && (
          <Section title="Key Researchers" icon={<UsersIcon />} count={experts.length} defaultOpen={true}>
            <div className={styles.expertGrid}>
              {experts.map((expert, i) => {
                const name = typeof expert === 'string' ? expert : expert?.name || '';
                const affiliation = expert?.affiliation || expert?.institution || '';
                const contribution = expert?.contribution || '';
                return (
                  <div key={i} className={styles.expertCard}>
                    <div className={styles.expertAvatar}>
                      {name[0]?.toUpperCase() || '?'}
                    </div>
                    <div className={styles.expertInfo}>
                      <span className={styles.expertName}>{name}</span>
                      {affiliation && affiliation !== 'N/A' && (
                        <span className={styles.expertAffiliation}>{affiliation}</span>
                      )}
                      {contribution && (
                        <span className={styles.expertContribution}>{contribution}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* All Sources */}
        {normalisedSources.length > 0 && (
          <Section title="All Sources" icon={<LinkIcon />} count={normalisedSources.length} defaultOpen={false}>
            <SourcesList sources={normalisedSources} />
          </Section>
        )}

        {/* Suggested Questions */}
        {d.suggestedQuestions?.length > 0 && (
          <div className={styles.questionsBox}>
            <div className={styles.questionsHeader}>
              <span>Questions for your doctor</span>
            </div>
            <div className={styles.questionsGrid}>
              {d.suggestedQuestions.map((q, i) => (
                <div key={i} className={styles.questionItem}>
                  <span className={styles.questionBullet}>?</span>
                  <span className={styles.questionText}>{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live fetch indicator */}
        {d.freshFetch && (
          <p className={styles.freshFetch}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Live data fetched from PubMed, OpenAlex &amp; ClinicalTrials
          </p>
        )}

      </div>
    </div>
  );
}

export default function MessageBubble({ message, onRetry }) {
  if (message.role === 'user') return <UserBubble text={message.text} />;
  return <AssistantBubble message={message} onRetry={onRetry} />;
}
