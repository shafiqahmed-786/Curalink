// useChat — full chat lifecycle
// messages live in ChatContext so startNewChat() clears them everywhere at once
import { useCallback, useRef, useEffect } from 'react';
import { askQuestion } from '../services/chat.service';
import { setSessionId as storeSession, getSessionId, removeSessionId } from '../utils/storage';
import { parseLLMResponse } from '../utils/parseLLMResponse';
import { useChatContext } from '../context/ChatContext';
import { useToast } from '../context/ToastContext';
import { useConversationStore } from '../store/conversationStore';

export function useChat({ isGuest = false } = {}) {
  const {
    messages, setMessages,
    setSessionId: ctxSetSession,
    setActiveTitle,
    isLoading, setIsLoading,
    startNewChat,
  } = useChatContext();

  const { toast } = useToast();
  const { upsertConversation, setActiveSession } = useConversationStore();

  const sessionIdRef = useRef(isGuest ? null : (getSessionId() || null));
  const isFirstMsg   = useRef(messages.length === 0); // reset if context already empty

  // Sync persisted session to context on mount (auth users)
  useEffect(() => {
    if (!isGuest && sessionIdRef.current) {
      ctxSetSession(sessionIdRef.current);
    }
  }, []);

  // When context messages are cleared externally (startNewChat), reset local refs
  useEffect(() => {
    if (messages.length === 0) {
      isFirstMsg.current = true;
    }
  }, [messages.length]);

  const sendMessage = useCallback(async (payload, _unused = 'All Sources') => {
    // Accept string (suggested queries) or full payload object
    const isString    = typeof payload === 'string';
    const text        = isString ? payload : payload.query;
    const disease     = isString ? undefined : payload.disease;
    const patientName = isString ? undefined : payload.patientName;
    const location    = isString ? undefined : payload.location;
    const source      = isString ? _unused : (payload.source || 'All Sources');
    const normalizedSource = source === 'All Sources' ? null : source;

    if (!text?.trim() || isLoading) return;

    // Set sidebar title from first user message
    if (isFirstMsg.current) {
      const title = text.length > 60 ? text.slice(0, 60) + '…' : text;
      setActiveTitle(title);
      isFirstMsg.current = false;
    }

    // Build display text for user bubble
    // Only include structured fields if they were actually provided
    const displayParts = [text];
    if (disease)     displayParts.push(`Disease: ${disease}`);
    if (patientName) displayParts.push(`Patient: ${patientName}`);
    if (location)    displayParts.push(`Location: ${location}`);
    const displayText = displayParts.join('\n');

    const userMsg = { id: `user-${crypto.randomUUID()}`, role: 'user', text: displayText, source };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      let res;
      let attempt = 0;
      let lastErr = null;
      
      while (attempt < 2) {
        try {
          res = await askQuestion({
            query: text,
            disease,
            patientName,
            location,
            source: normalizedSource,
            displayText: displayText !== text ? displayText : undefined,
          }, sessionIdRef.current);
          break; // Success, exit retry loop
        } catch (err) {
          lastErr = err;
          attempt++;
          const status = err.response?.status;
          const isRetryable = !status || status >= 500;
          if (!isRetryable || attempt >= 2) {
            throw err; // Not retryable or out of attempts
          }
          // Wait 1.5s before retrying to give backend a moment to finish processing
          await new Promise(r => setTimeout(r, 1500));
        }
      }

      let {
        conditionOverview, researchInsights, clinicalTrials,
        experts, sources, freshFetch, sessionId, disclaimers,
        patientTakeaways, suggestedQuestions, trialEligibilitySummary,
        chartInsight, stats,
      } = res.data.data;

      // Parse the LLM response — handles JSON code blocks, truncated JSON, plain text
      const { text: msgText, data: msgData } = parseLLMResponse(conditionOverview, {
        conditionOverview, researchInsights, clinicalTrials,
        experts, sources, freshFetch, disclaimers,
        patientTakeaways, suggestedQuestions, trialEligibilitySummary,
        chartInsight, stats,
      });

      // Merge ranking data from backend sources into parsed sources
      // Backend sources have rankingScore/rankingBreakdown; LLM-generated sources don't
      if (msgData.sources?.length && sources?.length) {
        msgData.sources = msgData.sources.map((s, i) => {
          // Try to match by URL first, then by title prefix, then by position
          const match = sources.find(bs =>
            (s.url && bs.url && s.url === bs.url) ||
            (s.title && bs.title && s.title.toLowerCase().slice(0, 40) === bs.title.toLowerCase().slice(0, 40))
          ) || sources[i];
          return {
            ...s,
            rankingScore:     s.rankingScore     || match?.rankingScore     || null,
            rankingBreakdown: s.rankingBreakdown || match?.rankingBreakdown || null,
            snippet:          s.snippet          || match?.snippet          || '',
          };
        });
      }

      if (sessionId) {
        sessionIdRef.current = sessionId;
        ctxSetSession(sessionId);
        if (!isGuest) {
          storeSession(sessionId);
          const title = text.length > 60 ? text.slice(0, 60) + '…' : text;
          upsertConversation(sessionId, title);
          setActiveSession(sessionId, title);        }
      }

      setMessages((prev) => [
        ...prev,
        { id: `ai-${crypto.randomUUID()}`, role: 'assistant', text: msgText, data: msgData },
      ]);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${crypto.randomUUID()}`,
          role: 'assistant',
          text: `⚠ ${errMsg}`,
          data: null,
          isError: true,
          retryPayload: payload,
          retrySource: source,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isGuest, ctxSetSession, setActiveTitle, setMessages, setIsLoading, toast]);

  const clearChat = useCallback(() => {
    sessionIdRef.current = null;
    isFirstMsg.current = true;
    if (!isGuest) {
      removeSessionId();
      useConversationStore.getState().clearActiveSession();
    }
    startNewChat();
  }, [isGuest, startNewChat]);

  return { messages, isLoading, sendMessage, clearChat, sessionId: sessionIdRef.current };
}
