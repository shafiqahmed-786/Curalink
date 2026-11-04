# Curalink — AI Medical Research Assistant
## Frontend System Documentation

---

## Project Structure

```
ai-health-copilot-frontend/
│
├── index.html                         # Vite HTML entry point
├── vite.config.js                     # Vite build config
├── .env                               # Environment variables (not committed)
├── .env.example                       # Environment variable template
├── package.json                       # Dependencies and scripts
├── public/
│   └── fire-flame-curved.png          # App icon (used in chat, auth modal, welcome screen)
│
└── src/
    │
    ├── main.jsx                       # React entry — mounts providers + App
    ├── App.jsx                        # Route definitions
    ├── index.css                      # Global CSS design tokens (light + dark themes)
    │
    ├── pages/
    │   ├── ChatPage.jsx               # Main chat interface (idle → active phase transition)
    │   ├── ChatPage.module.css
    │   ├── LoginPage.jsx              # Redirects to /chat + opens login modal
    │   ├── RegisterPage.jsx           # Redirects to /chat + opens signup modal
    │   ├── AuthCallbackPage.jsx       # Google OAuth callback handler
    │   ├── AuthCallbackPage.module.css
    │   ├── NotFoundPage.jsx           # 404 page
    │   └── NotFoundPage.module.css
    │
    ├── components/
    │   │
    │   ├── auth/
    │   │   ├── AuthModal.jsx          # Login + signup modal (email/password + Google OAuth)
    │   │   └── AuthModal.module.css
    │   │
    │   ├── chat/
    │   │   ├── ChatInput.jsx          # Textarea + source selector + attach/voice/send toolbar
    │   │   ├── ChatInput.module.css
    │   │   ├── MessageBubble.jsx      # User pill + assistant structured response renderer
    │   │   ├── MessageBubble.module.css
    │   │   ├── TypingIndicator.jsx    # Animated 3-dot indicator while AI responds
    │   │   ├── TypingIndicator.module.css
    │   │   ├── WelcomeScreen.jsx      # Empty state with suggested query chips
    │   │   └── WelcomeScreen.module.css
    │   │
    │   ├── common/
    │   │   ├── AppIcon.jsx            # Flame icon in dark rounded square (reusable)
    │   │   ├── AppIcon.module.css
    │   │   ├── Button.jsx             # Generic button (primary/ghost/danger variants)
    │   │   ├── Modal.jsx              # Generic modal wrapper with backdrop
    │   │   ├── Spinner.jsx            # Animated loading ring (sm/md/lg)
    │   │   ├── Spinner.module.css
    │   │   ├── ThemeToggle.jsx        # Sun/moon toggle button
    │   │   ├── ThemeToggle.module.css
    │   │   ├── Toast.jsx              # Individual toast notification
    │   │   └── Toast.module.css
    │   │
    │   ├── layout/
    │   │   ├── Header.jsx             # Top bar — logo, auth buttons / user chip, profile modal
    │   │   ├── Header.module.css
    │   │   ├── MainLayout.jsx         # Shell — sidebar + header + main content
    │   │   ├── MainLayout.module.css
    │   │   ├── Sidebar.jsx            # Conversation history sidebar (guest + auth states)
    │   │   ├── Sidebar.module.css
    │   │   └── sidebar/
    │   │       ├── ConversationGroup.jsx      # Collapsible date section (Today, Yesterday…)
    │   │       ├── ConversationGroup.module.css
    │   │       ├── ConversationItem.jsx       # Single history row + context menu + inline rename
    │   │       ├── ConversationItem.module.css
    │   │       ├── GuestPrompt.jsx            # Login/signup prompt shown to unauthenticated users
    │   │       ├── GuestPrompt.module.css
    │   │       ├── NewChatButton.jsx          # Dark pill button (expanded) / icon (collapsed)
    │   │       ├── NewChatButton.module.css
    │   │       ├── SavedSection.jsx           # Pinned conversations with colored letter avatars
    │   │       ├── SavedSection.module.css
    │   │       ├── SidebarFooter.jsx          # Theme toggle + upload + profile row / login card
    │   │       ├── SidebarFooter.module.css
    │   │       ├── SidebarHeader.jsx          # "Chat" title (collapse trigger) + search icon
    │   │       ├── SidebarHeader.module.css
    │   │       ├── SidebarSearch.jsx          # Real-time search input with clear button
    │   │       └── SidebarSearch.module.css
    │   │
    │   ├── profile/
    │   │   ├── ProfileModal.jsx       # Update name, audience level, preferred tone
    │   │   └── ProfileModal.module.css
    │   │
    │   ├── research/
    │   │   ├── ClinicalTrialCard.jsx  # Trial card — status badge, phase, condition, sponsor
    │   │   ├── ClinicalTrialCard.module.css
    │   │   ├── ResearchCard.jsx       # Paper card — source badge, title, authors, abstract toggle
    │   │   ├── ResearchCard.module.css
    │   │   ├── SafetyBanner.jsx       # Disclaimer banner (medium/low severity)
    │   │   ├── SafetyBanner.module.css
    │   │   ├── SourcesList.jsx        # Collapsible sources list with badges + links
    │   │   └── SourcesList.module.css
    │   │
    │   └── upload/
    │       ├── UploadModal.jsx        # PDF upload modal (stub — not yet implemented)
    │       └── UploadProgress.jsx     # Upload progress bar (stub — not yet implemented)
    │
    ├── context/
    │   ├── AuthContext.jsx            # User + token state, session restore on mount
    │   ├── AuthModalContext.jsx       # Global auth modal open/close (openLogin, openSignup)
    │   ├── ChatContext.jsx            # messages, isLoading, sessionId, activeTitle, startNewChat
    │   ├── ThemeContext.jsx           # light/dark theme, persists to localStorage
    │   └── ToastContext.jsx           # Toast queue + container (success/error/info/warning)
    │
    ├── hooks/
    │   ├── useAuth.js                 # Consume AuthContext
    │   ├── useChat.js                 # Full chat lifecycle — send, parse, persist session
    │   ├── useConversations.js        # (stub) — replaced by conversationStore
    │   ├── useIsMobile.js             # Returns true when viewport ≤ 768px, reactive
    │   ├── useLoadConversation.js     # Load past conversation by sessionId from backend
    │   ├── useTheme.js                # Consume ThemeContext
    │   └── useUpload.js               # (stub) — PDF upload logic not yet implemented
    │
    ├── services/
    │   ├── api.js                     # Axios base instance — JWT injection + 401 handling
    │   ├── auth.service.js            # login, register (signup), getMe, updateProfile
    │   ├── chat.service.js            # askQuestion, getConversation
    │   ├── research.service.js        # ingestPapers, getPapers, getStats
    │   └── upload.service.js          # uploadPDF (ready, not yet wired to UI)
    │
    ├── store/
    │   └── conversationStore.js       # Zustand store — conversations, savedIds, active session
    │
    └── utils/
        ├── constants.js               # APP_NAME, SUGGESTED_QUERIES, SOURCE_COLORS, SAFETY_SEVERITY
        ├── formatters.js              # formatYear, truncate, sourceLabel
        ├── groupConversations.js      # Group by Today/Yesterday/Previous 7 days/month
        ├── parseLLMResponse.js        # Shared JSON extractor for LLM output (fences + truncation)
        └── storage.js                 # localStorage helpers for token + sessionId
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | React 19 + Vite 8 | UI framework + build tool |
| Routing | React Router v6 | Client-side routing |
| State (global) | Zustand 4 | Conversation history store |
| State (context) | React Context | Auth, theme, chat, toast, modal |
| HTTP | Axios | API calls with interceptors |
| Styling | CSS Modules | Scoped component styles |
| Icons | Inline SVG | No icon library dependency |
| Fonts | System UI stack | No external font loading |

---

## Feature 1 — Theme System

**Files:** `src/context/ThemeContext.jsx`, `src/hooks/useTheme.js`, `src/index.css`

### How it works
- `ThemeProvider` reads `localStorage.getItem('theme')` on mount
- Falls back to OS `prefers-color-scheme` if no stored preference
- Applies `data-theme="light"` or `data-theme="dark"` to `<html>`
- All colors are CSS custom properties scoped to `[data-theme]`
- `body` has `transition` on `background-color` and `color` for smooth switching

### Design tokens (CSS variables)
```css
/* Surfaces */
--color-bg, --color-bg-secondary, --color-bg-tertiary, --color-sidebar-bg

/* Text */
--color-text-primary, --color-text-secondary, --color-text-muted

/* Brand */
--color-accent, --color-accent-hover, --color-accent-subtle

/* Chat bubbles */
--color-user-bubble-bg, --color-user-bubble-text
--color-ai-bubble-bg,   --color-ai-bubble-text

/* Status */
--color-success, --color-warning, --color-error, --color-info

/* Source badges */
--color-pubmed, --color-openalex, --color-clinicaltrials, --color-pdf
```

### Usage anywhere
```jsx
import { useTheme } from '../hooks/useTheme';
const { theme, toggleTheme } = useTheme();
```

---

## Feature 2 — Authentication

**Files:** `src/context/AuthContext.jsx`, `src/context/AuthModalContext.jsx`, `src/components/auth/AuthModal.jsx`

### Session restore on page refresh
On mount, `AuthProvider` calls `GET /api/auth/me` with the stored token:
- Token valid → user restored, app renders normally
- Token invalid/expired → token cleared, user treated as guest
- A `restoring` flag shows a spinner in `App.jsx` during this check

### Auth modal
Single modal handles both login and signup views. Switching between them resets all fields.
- Email/password form with show/hide password toggle
- Google OAuth button redirects to `LLM_BASE_URL/api/auth/google`
- Error messages shown inline in the modal
- Success shows a toast and closes the modal

### Opening the modal from anywhere
```jsx
import { useAuthModal } from '../context/AuthModalContext';
const { openLogin, openSignup } = useAuthModal();
```

### Route-based auth
- `/login` → renders null, navigates to `/chat`, opens login modal after 50ms
- `/register` → same pattern for signup
- `/auth/callback?token=...` → `AuthCallbackPage` extracts token, calls `/auth/me`, logs in

### API interceptor
`src/services/api.js` — on 401 response:
- If the request was to an `/auth/` endpoint → **do not redirect** (wrong credentials, show error in modal)
- Otherwise → clear token + redirect to `/login` (expired session)

---

## Feature 3 — Chat Flow

**Files:** `src/hooks/useChat.js`, `src/context/ChatContext.jsx`, `src/pages/ChatPage.jsx`

### Phase system
`ChatPage` has two phases:
- `idle` — WelcomeScreen centred above the input, no messages
- `active` — messages scroll above, input pinned to bottom with slide-up animation

Phase flips to `active` on first message. Resets to `idle` when `startNewChat()` is called.

### Message lifecycle
```
User types → sendMessage(text, source)
  → Add user message to ChatContext immediately
  → setIsLoading(true) → TypingIndicator appears
  → POST /api/ask { query, sessionId }
  → Parse LLM response (parseLLMResponse utility)
  → Add assistant message with structured data
  → setIsLoading(false) → TypingIndicator disappears
  → Scroll to bottom
```

### LLM response parsing
The backend sometimes returns structured JSON wrapped in markdown code fences inside `conditionOverview`. `parseLLMResponse.js` handles:
1. Strip ` ``` ` or ` ```json ` fences
2. Find first `{` in the string
3. `JSON.parse()` — if it fails, try bracket-repair for truncated JSON
4. Extract `conditionOverview`, `researchInsights`, `clinicalTrials`, `experts`, `sources`
5. Fallback: strip fences and use as plain text

This utility is used in both `useChat` (live responses) and `useLoadConversation` (past conversations).

### Guest vs authenticated
| Behaviour | Guest | Authenticated |
|---|---|---|
| Chat works | ✅ | ✅ |
| sessionId persisted | ❌ memory only | ✅ localStorage |
| Conversation saved to DB | ❌ | ✅ (backend links userId) |
| Sidebar history | GuestPrompt + current chat | Full history from backend |
| Save conversation | Opens login modal | ✅ |
| "This chat won't be saved" banner | ✅ shown | ❌ hidden |

### New Chat
Both the sidebar button and header button call `startNewChat()` from `ChatContext`:
- Clears `messages`, `isLoading`, `sessionId`, `activeTitle`
- `useChat` resets `sessionIdRef` and `isFirstMsg`
- `conversationStore.clearActiveSession()` removes the "Now" entry from sidebar
- `ChatPage` resets phase to `idle` → WelcomeScreen returns

---

## Feature 4 — Conversation History (Zustand Store)

**File:** `src/store/conversationStore.js`

### Store shape
```js
{
  conversations: [],      // [{ id, title, updatedAt }] — fetched from backend
  savedIds: new Set(),    // IDs of pinned/saved conversations
  loading: false,
  activeSessionId: null,  // current in-progress session
  activeTitle: null,      // title derived from first user message
}
```

### Actions
| Action | When called | What it does |
|---|---|---|
| `fetchConversations()` | User logs in | GET /api/conversations → populate store |
| `upsertConversation(id, title)` | After first API response | Add/update conversation in list |
| `setActiveSession(id, title)` | After first API response | Set "Now" entry in sidebar |
| `clearActiveSession()` | New Chat clicked | Remove "Now" entry |
| `deleteConversation(id)` | Delete from sidebar menu | Optimistic remove + DELETE /api/conversations/:id |
| `renameConversation(id, title)` | Inline rename committed | Update title locally |
| `saveConversation(id)` | Save from sidebar menu | Add to savedIds Set |
| `unsaveConversation(id)` | Unsave from saved menu | Remove from savedIds Set |
| `reset()` | User logs out | Clear all state |

### Title extraction
When fetching from backend, `titleFromConversation()` reads the first message (user query) as the title. If the stored content is a JSON blob (LLM output), it extracts `conditionOverview` or falls back to `'Research chat'`.

---

## Feature 5 — Sidebar

**Files:** `src/components/layout/Sidebar.jsx` + `src/components/layout/sidebar/`

### Desktop behaviour
- **Expanded (260px):** Full sidebar with search, conversations, footer
- **Collapsed (56px icon rail):** Only toggle icon + new chat icon + theme/upload/avatar icons
- Click "Chat" title to collapse, click panel icon to expand

### Mobile behaviour
- Sidebar is **off-screen** by default (hidden, not icon rail)
- Hamburger ☰ in Header opens it as a full overlay drawer (max 85vw)
- Dark backdrop covers the rest — tap to close
- Selecting a conversation auto-closes the drawer

### Conversation grouping
`groupConversationsByDate()` buckets conversations into:
- Today / Yesterday / Previous 7 days / Previous 30 days / Month Year (older)

### Context menu (per conversation item)
- **Save** → moves to Saved section (opens login modal for guests)
- **Rename** → inline text input, Enter to commit, Escape to cancel
- **Delete** → optimistic remove from UI + DELETE API call

### Saved section
- Shown only when `savedIds.size > 0`
- Colored letter avatars (deterministic color from title initial)
- Context menu: **Unsave** / Rename / Delete

---

## Feature 6 — Message Rendering

**File:** `src/components/chat/MessageBubble.jsx`

### User message
Right-aligned pill with `--color-user-bubble-bg` background.

### Assistant message
Left-aligned with `AppIcon` avatar. Renders structured sections in order:

```
1. SafetyBanner       — if safetyMessage or disclaimers present
2. conditionOverview  — plain text paragraph
3. Research Insights  — bullet list (extracts .finding from [{finding, source}])
4. Clinical Trials    — ClinicalTrialCard per trial
5. Key Researchers    — name + institution list
6. Sources            — SourcesList collapsible
7. Fresh fetch badge  — if freshFetch === true
```

### Field normalisation
Backend uses `platform` key for source type; components expect `source`. `MessageBubble` normalises before passing to cards:
```js
sources.map(s => ({ ...s, source: s.source || s.platform || 'unknown' }))
```

---

## Feature 7 — Loading Past Conversations

**File:** `src/hooks/useLoadConversation.js`

When `ChatPage` mounts with a `sessionId` URL param (`/chat/:sessionId`):
1. Calls `GET /api/conversations/:sessionId`
2. Maps backend messages to frontend format
3. For assistant messages: runs `parseLLMResponse()` to restore structured data
4. Sets messages in `ChatContext` → chat screen renders the full conversation
5. Sets `activeTitle` and `activeSession` in store → sidebar highlights the item

---

## Feature 8 — Profile Settings

**File:** `src/components/profile/ProfileModal.jsx`

Opens from:
- Clicking the user avatar chip in the Header
- Clicking the profile row in the Sidebar footer

Fields:
- **Display name** — text input
- **I am a** — Patient / Researcher / Clinician (card selector)
- **Response style** — Educational / Clinical / Simplified (card selector)

Calls `PATCH /api/auth/me`, updates `AuthContext` with the returned user, shows success toast.

---

## Routing

| Route | Component | Notes |
|---|---|---|
| `/` | Redirect → `/chat` | |
| `/chat` | `ChatPage` | Idle state — WelcomeScreen |
| `/chat/:sessionId` | `ChatPage` | Loads past conversation |
| `/login` | `LoginPage` | Redirects to `/chat` + opens login modal |
| `/register` | `RegisterPage` | Redirects to `/chat` + opens signup modal |
| `/auth/callback` | `AuthCallbackPage` | Google OAuth token handler |
| `*` | `NotFoundPage` | 404 |

---

## Provider Tree

```
BrowserRouter
  ThemeProvider          — data-theme on <html>, toggleTheme
    AuthProvider         — user, token, login, logout, restoring
      ToastProvider      — toast.success/error/info/warning, auto-dismiss 4s
        AuthModalProvider — openLogin, openSignup, renders AuthModal
          ChatProvider   — messages, isLoading, sessionId, activeTitle, startNewChat
            App          — routes
```

**Order matters:** `ToastProvider` must wrap `AuthModalProvider` so `AuthModal` can call `useToast()`.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |

---

## End-to-End Application Flows

### Flow 1 — Guest Chat

```
1. User opens app → WelcomeScreen shown, sidebar shows GuestPrompt
2. User clicks suggested query chip → sendMessage(query)
3. POST /api/ask (no auth header) → response parsed → cards rendered
4. Sidebar shows "Current chat" with pulsing dot + truncated title
5. "This chat won't be saved" banner shown above input
6. User clicks New Chat → messages cleared → WelcomeScreen returns
7. User tries to Save → login modal opens
```

### Flow 2 — Email/Password Login

```
1. User clicks "Log in" in Header or Sidebar footer
2. AuthModal opens (login view)
3. User fills email + password → POST /api/auth/login
4. Token stored in localStorage, user set in AuthContext
5. Modal closes, toast: "Welcome back, [name]!"
6. Header shows user chip, sidebar shows history
7. fetchConversations() fires → past chats appear in sidebar
```

### Flow 3 — Google OAuth

```
1. User clicks "Continue with Google" in AuthModal
2. Browser navigates to GET /api/auth/google
3. Google consent screen → user approves
4. Backend redirects to /auth/callback?token=<jwt>
5. AuthCallbackPage: extracts token → GET /api/auth/me → login(user, token)
6. Navigate to /chat → fully logged in
```

### Flow 4 — Authenticated Chat + History

```
1. User sends message → POST /api/ask (Authorization: Bearer <token>)
2. Backend saves conversation with userId
3. Frontend: upsertConversation(sessionId, title) → appears in sidebar "Today"
4. User clicks New Chat → clearActiveSession() → conversation stays in "Today"
5. User clicks past conversation → navigate to /chat/:sessionId
6. useLoadConversation fires → GET /api/conversations/:sessionId
7. Messages loaded + re-parsed → full structured response rendered
```

### Flow 5 — Rename + Delete

```
Rename:
1. Hover conversation → click ··· → Rename
2. Inline input appears, pre-filled with current title
3. User edits → Enter → renameConversation(id, newTitle) → title updates in store

Delete:
1. Hover conversation → click ··· → Delete
2. Optimistic: removed from store immediately (UI updates instantly)
3. DELETE /api/conversations/:sessionId fires in background
4. If deleted conversation was active → startNewChat() + navigate('/chat')
```

### Flow 6 — Profile Update

```
1. User clicks avatar chip in Header (or profile row in Sidebar footer)
2. ProfileModal opens with current values pre-filled
3. User changes name / audience level / tone → Save changes
4. PATCH /api/auth/me → updated user returned
5. AuthContext updated → name reflects everywhere immediately
6. Toast: "Profile updated"
```

### Flow 7 — Theme Toggle

```
1. User clicks sun/moon icon in Sidebar footer
2. toggleTheme() → theme flips light ↔ dark
3. data-theme attribute updated on <html>
4. All CSS variables switch instantly via CSS cascade
5. New theme persisted to localStorage
6. On next page load: ThemeProvider reads localStorage → correct theme applied before first paint
```

---

## Key Design Decisions

**CSS Modules over Tailwind** — scoped styles, no class name collisions, easier to read component-specific styles.

**Zustand for conversations, Context for everything else** — conversations need to be accessed from both `Sidebar` and `ChatPage` without prop drilling, and need actions like `upsertConversation` that don't fit naturally into React Context. Auth, theme, chat state, and toasts are simpler and fit Context well.

**Optimistic UI for delete** — conversation removed from sidebar immediately, API call fires in background. If the API fails (e.g. guest session not in DB), the item is already gone from the UI which is the correct behaviour.

**Single `parseLLMResponse` utility** — the LLM inconsistently returns structured JSON vs plain text vs truncated JSON. Centralising the parsing logic ensures both live responses and loaded past conversations render identically.

**Phase-based chat layout** — `idle` and `active` phases drive the CSS layout. In `idle`, the input is vertically centred with WelcomeScreen above it. On first send, `useLayoutEffect` animates the input to the bottom before React re-renders the messages. This avoids layout shift.

**`isFirstMsg` ref in useChat** — tracks whether the current message is the first in the session to set the sidebar title. Resets when `messages.length === 0` (after `startNewChat()`).
