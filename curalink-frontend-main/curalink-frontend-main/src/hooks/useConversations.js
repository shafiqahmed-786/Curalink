// useConversations — fetches and manages the sidebar conversation history list
import { useState, useEffect } from 'react';

export function useConversations() {
  const [conversations, setConversations] = useState([]);

  // TODO: fetch conversation list from backend
  return { conversations, setConversations };
}
