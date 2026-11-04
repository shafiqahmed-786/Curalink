// ChatContext — single source of truth for chat state
// messages, isLoading, sessionId, activeTitle all live here
// so startNewChat() resets everything in one place
import { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages]       = useState([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [sessionId, setSessionId]     = useState(null);
  const [activeTitle, setActiveTitle] = useState(null);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    setIsChatLoading(false);
    setSessionId(null);
    setActiveTitle(null);
  }, []);

  return (
    <ChatContext.Provider value={{
      messages,    setMessages,
      isLoading,   setIsLoading,
      isChatLoading, setIsChatLoading,
      sessionId,   setSessionId,
      activeTitle, setActiveTitle,
      startNewChat,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used inside ChatProvider');
  return ctx;
}
