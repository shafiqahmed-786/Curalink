import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SidebarHeader from './sidebar/SidebarHeader';
import NewChatButton from './sidebar/NewChatButton';
import SidebarSearch from './sidebar/SidebarSearch';
import SavedSection from './sidebar/SavedSection';
import ConversationGroup from './sidebar/ConversationGroup';
import GuestPrompt from './sidebar/GuestPrompt';
import SidebarFooter from './sidebar/SidebarFooter';
import { useAuth } from '../../hooks/useAuth';
import { useAuthModal } from '../../context/AuthModalContext';
import { useChatContext } from '../../context/ChatContext';
import { useConversationStore } from '../../store/conversationStore';
import { groupConversationsByDate } from '../../utils/groupConversations';
import styles from './Sidebar.module.css';

export default function Sidebar({ isOpen, onToggle, onNavigate, onNewChat }) {
  const { sessionId: urlSessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openLogin } = useAuthModal();
  const { activeTitle: ctxActiveTitle, startNewChat } = useChatContext();

  const {
    conversations,
    savedIds,
    loading,
    fetchConversations,
    deleteConversation,
    saveConversation,
    unsaveConversation,
    renameConversation,
    activeSessionId,
    activeTitle: storeActiveTitle,
  } = useConversationStore();

  const [search, setSearch] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // Fetch conversations when user logs in
  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  const handleSave   = (id) => { if (!user) { openLogin(); return; } saveConversation(id); };
  const handleUnsave = (id) => unsaveConversation(id);

  const handleNewChat = () => { onNewChat?.(); navigate('/chat'); onNavigate?.(); };
  const handleSelect  = (id) => { navigate(`/chat/${id}`); onNavigate?.(); };

  const handleDelete = async (id) => {
    // If deleting the currently active conversation, clear the chat screen too
    if (id === activeSessionId || id === urlSessionId) {
      startNewChat();
      navigate('/chat');
    }
    await deleteConversation(id);
    setActiveMenu(null);
  };

  const handleRename = (id, newTitle) => {
    renameConversation(id, newTitle);
    setActiveMenu(null);
  };

  const toggleSearch = () => {
    setSearchVisible((p) => !p);
    if (searchVisible) setSearch('');
  };

  // ── Build the full conversation list for authenticated users ──────────
  // Include the active session in the list so it gets the full ConversationItem
  // treatment (save, rename, delete menu). Mark it active via activeId.
  const activeTitle = storeActiveTitle || ctxActiveTitle;

  // Merge active session into conversations if it's not already there
  const allConversations = (() => {
    if (!activeSessionId || !activeTitle) return conversations;
    const alreadyIn = conversations.some((c) => c.id === activeSessionId);
    if (alreadyIn) return conversations;
    // Prepend the current session so it appears at the top of "Today"
    return [
      { id: activeSessionId, title: activeTitle, updatedAt: new Date() },
      ...conversations,
    ];
  })();

  const savedConversations   = allConversations.filter((c) => savedIds.has(c.id));
  const unsavedConversations = allConversations.filter((c) => !savedIds.has(c.id));

  const filtered = unsavedConversations.filter((c) =>
    (c.title || '').toLowerCase().includes(search.toLowerCase())
  );
  const groups = groupConversationsByDate(filtered);

  // The active conversation ID — either the URL param or the in-memory session
  const activeId = urlSessionId || activeSessionId;

  // ── Guest: current session entry ─────────────────────────────────────
  const guestCurrentChat = !user && ctxActiveTitle
    ? [{ id: 'guest-current', title: ctxActiveTitle, updatedAt: new Date() }]
    : [];

  return (
    <>
      {isOpen && (
        <div className={styles.backdrop} onClick={onToggle} aria-hidden="true" />
      )}

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
        aria-label="Sidebar"
      >
        <SidebarHeader onToggle={onToggle} onSearchClick={toggleSearch} isOpen={isOpen} />

        {searchVisible && user && (
          <div className={styles.searchWrap}>
            <SidebarSearch value={search} onChange={setSearch} autoFocus />
          </div>
        )}

        <NewChatButton onClick={handleNewChat} isOpen={isOpen} />

        <div className={styles.scrollArea}>

          {/* ── GUEST ── */}
          {!user && (
            <>
              {guestCurrentChat.length > 0 && (
                <div className={styles.guestHistory}>
                  <p className={styles.guestHistoryLabel}>Current chat</p>
                  {guestCurrentChat.map((c) => (
                    <div key={c.id} className={styles.guestChatItem}>
                      <span className={styles.guestChatDot} aria-hidden="true" />
                      <span className={styles.guestChatTitle}>{c.title}</span>
                    </div>
                  ))}
                  <div className={styles.guestDivider} />
                </div>
              )}
              <GuestPrompt />
            </>
          )}

          {/* ── AUTHENTICATED ── */}
          {user && (
            <>
              {/* Saved section */}
              {savedConversations.length > 0 && (
                <SavedSection
                  conversations={savedConversations}
                  onSelect={handleSelect}
                  onUnsave={handleUnsave}
                />
              )}

              {/* History — all conversations including the active one */}
              <nav aria-label="Conversation history">
                {loading && <p className={styles.empty}>Loading…</p>}

                {!loading && groups.length === 0 && (
                  <p className={styles.empty}>Start a new chat to see your history here</p>
                )}

                {!loading && groups.map((group) => (
                  <ConversationGroup
                    key={group.label}
                    label={group.label}
                    conversations={group.items}
                    activeId={activeId}
                    activeMenu={activeMenu}
                    onSelect={handleSelect}
                    onMenuToggle={setActiveMenu}
                    onDelete={handleDelete}
                    onRename={handleRename}
                    onSave={handleSave}
                  />
                ))}
              </nav>
            </>
          )}

        </div>

        <SidebarFooter isOpen={isOpen} />
      </aside>
    </>
  );
}
