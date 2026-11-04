// useLoadConversation — loads a past conversation by sessionId from the backend
// Re-parses assistant messages so structured sections render correctly
import { useEffect, useRef } from 'react';
import { useChatContext } from '../context/ChatContext';
import { useConversationStore } from '../store/conversationStore';
import { parseLLMResponse } from '../utils/parseLLMResponse';
import api from '../services/api';

export function useLoadConversation(sessionId) {
  const { setMessages, setSessionId, setActiveTitle, startNewChat, setIsChatLoading } = useChatContext();
  const { setActiveSession } = useConversationStore();
  const loadedRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;
    if (loadedRef.current === sessionId) return;
    loadedRef.current = sessionId;

    const load = async () => {
      setIsChatLoading(true);
      try {
        const res = await api.get(`/conversations/${sessionId}`);
        const conv = res.data.data;
        if (!conv?.messages?.length) return;

        // Map backend messages → frontend format
        // For assistant messages: re-parse the stored content to restore structured data
        const messages = conv.messages.map((m, i) => {
          if (m.role === 'user') {
            return {
              id:   `loaded-${i}-${Date.now()}`,
              role: 'user',
              text: m.content,
              data: null,
            };
          }

          // Assistant — parse the stored LLM content to restore cards/sections
          const { text, data } = parseLLMResponse(m.content, {
            conditionOverview: m.content,
            researchInsights:  [],
            clinicalTrials:    [],
            experts:           [],
            sources:           [],
            freshFetch:        false,
            disclaimers:       [],
            patientTakeaways:  [],
            suggestedQuestions: [],
            trialEligibilitySummary: '',
            chartInsight:      '',
            stats:             null,
          });

          return {
            id:   `loaded-${i}-${Date.now()}`,
            role: 'assistant',
            text,
            data,
          };
        });

        // Title from first user message
        const firstUser = conv.messages.find((m) => m.role === 'user');
        const title = firstUser?.content
          ? firstUser.content.length > 60
            ? firstUser.content.slice(0, 60) + '…'
            : firstUser.content
          : 'Past conversation';

        setMessages(messages);
        setSessionId(sessionId);
        setActiveTitle(title);
        setActiveSession(sessionId, title);
      } catch {
        startNewChat();
      } finally {
        setIsChatLoading(false);
      }
    };

    load();
  }, [sessionId]);
}
