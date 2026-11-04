// conversationStore — Zustand store for conversation history
// Handles: fetch all, add current session, delete, save/unsave
import { create } from 'zustand';
import api from '../services/api';

// ── Persist savedIds to localStorage ─────────────────────────────────────
const SAVED_KEY = 'curalink_saved_ids';

const loadSavedIds = () => {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const persistSavedIds = (ids) => {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...ids]));
  } catch { /* storage full or unavailable */ }
};

// ── Helpers ───────────────────────────────────────────────────────────────

// Extract a readable title from conversation messages
// Backend returns { $slice: -1 } = last message only
// We try to find a user message; if the only message is assistant JSON, clean it up
function titleFromConversation(conv) {
  if (!conv.messages?.length) return 'Untitled chat';

  // Try to find a user message first
  const userMsg = conv.messages.find((m) => m.role === 'user');
  const content = userMsg?.content || conv.messages[0]?.content || '';

  if (!content) return 'Untitled chat';

  // Strip markdown code fences and JSON artifacts
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  // If it looks like JSON, try to extract conditionOverview or just skip it
  if (cleaned.startsWith('{')) {
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed.conditionOverview) {
        const t = parsed.conditionOverview;
        return t.length > 60 ? t.slice(0, 60) + '…' : t;
      }
    } catch { /* not valid JSON */ }
    return 'Research chat';
  }

  return cleaned.length > 60 ? cleaned.slice(0, 60) + '…' : cleaned;
}

// ── Store ─────────────────────────────────────────────────────────────────
export const useConversationStore = create((set, get) => ({
  // All persisted conversations from the backend
  conversations: [],
  // IDs of saved/pinned conversations — persisted to localStorage
  savedIds: loadSavedIds(),
  // Loading state for the initial fetch
  loading: false,
  // The current in-progress session (not yet persisted as a full entry)
  activeSessionId: null,
  activeTitle: null,

  // ── Fetch all conversations for the logged-in user ──────────────────
  fetchConversations: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/conversations');
      const raw = res.data.data.conversations || [];
      const { conversations: existing } = get();

      const conversations = raw.map((c) => {
        // If we already have this conversation with a good title (set by upsertConversation),
        // keep that title instead of overwriting with the backend's last-message title
        const alreadyKnown = existing.find((e) => e.id === c.sessionId);
        const title = alreadyKnown?.title || titleFromConversation(c);
        return {
          id: c.sessionId,
          title,
          updatedAt: new Date(c.updatedAt),
          raw: c,
        };
      });
      set({ conversations, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  // ── Set the active session (called from useChat when first message sent) ──
  setActiveSession: (sessionId, title) => {
    set({ activeSessionId: sessionId, activeTitle: title });
  },

  // ── Clear active session (called on New Chat) ──────────────────────
  clearActiveSession: () => {
    set({ activeSessionId: null, activeTitle: null });
  },

  // ── Add/refresh a conversation after a chat completes ─────────────
  // Called when we get a sessionId back from the backend
  upsertConversation: (sessionId, title) => {
    const { conversations } = get();
    const exists = conversations.find((c) => c.id === sessionId);
    if (exists) {
      // Update title and timestamp
      set({
        conversations: conversations.map((c) =>
          c.id === sessionId
            ? { ...c, title: title || c.title, updatedAt: new Date() }
            : c
        ),
      });
    } else {
      // Prepend new conversation
      set({
        conversations: [
          { id: sessionId, title: title || 'New chat', updatedAt: new Date() },
          ...conversations,
        ],
      });
    }
  },

  // ── Delete a conversation ──────────────────────────────────────────
  deleteConversation: async (sessionId) => {
    // Remove from local state immediately (optimistic)
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== sessionId),
      savedIds: (() => {
        const n = new Set(state.savedIds);
        n.delete(sessionId);
        persistSavedIds(n);
        return n;
      })(),
      activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId,
      activeTitle:     state.activeSessionId === sessionId ? null : state.activeTitle,
    }));

    // Best-effort API delete — don't block on failure
    try {
      await api.delete(`/conversations/${sessionId}`);
    } catch {
      // Already removed from UI — backend may not have it (guest session etc.)
    }
  },

  // ── Rename a conversation (local only — no backend endpoint yet) ──────
  renameConversation: (id, newTitle) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title: newTitle } : c
      ),
    })),

  // ── Save / Unsave ──────────────────────────────────────────────────
  saveConversation: (id) => {
    set((state) => {
      const next = new Set([...state.savedIds, id]);
      persistSavedIds(next);
      return { savedIds: next };
    });
  },

  unsaveConversation: (id) => {
    set((state) => {
      const next = new Set(state.savedIds);
      next.delete(id);
      persistSavedIds(next);
      return { savedIds: next };
    });
  },

  // ── Reset everything on logout ─────────────────────────────────────
  reset: () => {
    persistSavedIds(new Set()); // clear localStorage on logout
    set({ conversations: [], savedIds: new Set(), activeSessionId: null, activeTitle: null, loading: false });
  },
}));
