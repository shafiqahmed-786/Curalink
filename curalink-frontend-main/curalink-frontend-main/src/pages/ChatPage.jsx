import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ChatInput from '../components/chat/ChatInput';
import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import WelcomeScreen from '../components/chat/WelcomeScreen';
import ErrorBoundary from '../components/common/ErrorBoundary';
import Spinner from '../components/common/Spinner';
import { useChat } from '../hooks/useChat';
import { useLoadConversation } from '../hooks/useLoadConversation';
import { useAuth } from '../hooks/useAuth';
import { useAuthModal } from '../context/AuthModalContext';
import { useChatContext } from '../context/ChatContext';
import styles from './ChatPage.module.css';

export default function ChatPage() {
  const { sessionId: urlSessionId } = useParams();
  const { user } = useAuth();
  const { openLogin } = useAuthModal();
  const { isChatLoading } = useChatContext();
  const isGuest = !user;

  const { messages, isLoading, sendMessage, clearChat, sessionId } = useChat({ isGuest });

  // Load past conversation if URL has a sessionId or if there's a persisted session
  useLoadConversation(isGuest ? null : (urlSessionId || sessionId));
  const messagesEndRef = useRef(null);
  const inputWrapRef = useRef(null);
  const [phase, setPhase] = useState('idle');

  // Flip to active on first message
  useEffect(() => {
    if (messages.length > 0 && phase === 'idle') setPhase('active');
  }, [messages.length]);

  // Reset to idle when chat is cleared (new chat)
  useEffect(() => {
    if (messages.length === 0) setPhase('idle');
  }, [messages.length]);

  // Scroll to bottom
  useEffect(() => {
    if (phase === 'active') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, phase]);

  // Animate input to bottom on first send
  useLayoutEffect(() => {
    if (phase !== 'active') return;
    const el = inputWrapRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.transform = 'translateY(-32px)';
    el.style.opacity = '0';
    void el.offsetHeight;
    el.style.transition = 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease';
    el.style.transform = 'translateY(0)';
    el.style.opacity = '1';
  }, [phase]);

  const handleSend = (payload) => sendMessage(payload);
  const handleSuggest = (query) => sendMessage({ query });

  return (
    <MainLayout onNewChat={clearChat}>
      {isChatLoading ? (
        <div className={styles.loadingWrapper}>
          <Spinner size="lg" />
        </div>
      ) : (
        <div className={`${styles.page} ${styles[phase]}`}>

          {/* ── Message list ── */}
          <div className={styles.messages}>
            {messages.map((msg) => (
              <ErrorBoundary
                key={msg.id}
                fallback={
                  <div style={{
                    padding: '10px 16px',
                    fontSize: '13px',
                    color: 'var(--color-error)',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-error)',
                  }}>
                    ⚠ This message could not be displayed.
                  </div>
                }
              >
                <MessageBubble message={msg} onRetry={sendMessage} />
              </ErrorBoundary>
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input area ── */}
          <div className={styles.inputWrap} ref={inputWrapRef}>
            {phase === 'idle' && <WelcomeScreen onSuggest={handleSuggest} />}

            {/* Guest nudge — shown after first message */}
            {isGuest && phase === 'active' && (
              <div className={styles.guestBanner}>
                <span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  This chat won't be saved.
                </span>
                <button className={styles.guestLoginBtn} onClick={openLogin}>
                  Log in to save
                </button>
              </div>
            )}

            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>

        </div>
      )}
    </MainLayout>
  );
}
