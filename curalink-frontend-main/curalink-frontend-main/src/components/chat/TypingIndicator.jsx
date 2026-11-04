// TypingIndicator — animated dots and live research steps shown while AI is generating a response
import { useState, useEffect } from 'react';
import AppIcon from '../common/AppIcon';
import styles from './TypingIndicator.module.css';

const RESEARCH_STEPS = [
  "Analyzing patient context...",
  "Searching PubMed, OpenAlex & ClinicalTrials...",
  "Retrieving and embedding 150+ medical documents locally...",
  "Reasoning over local Hugging Face embeddings...",
  "Synthesizing final medical response with LLaMA 3...",
];

export default function TypingIndicator() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Switch the text every 6 seconds to show the pipeline progress
    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, RESEARCH_STEPS.length - 1));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.wrapper} aria-label="Curalink is thinking" role="status">
      <AppIcon size={28} className={styles.avatarIcon} />
      <div className={styles.bubble}>
        <div className={styles.dots} aria-hidden="true">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <span className={styles.stepText}>{RESEARCH_STEPS[stepIndex]}</span>
      </div>
    </div>
  );
}
