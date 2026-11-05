# DISKRIT — Modern Social Media Frontend

**DISKRIT** is a complete, modern, responsive social media Progressive Web Application (PWA) interface built exclusively using **Vanilla HTML5, CSS3, and JavaScript (ES6+)**.

Built with **zero external dependencies, zero frameworks, zero build steps, and zero bundlers**. Diskrit runs directly in any modern browser via static files or any standard HTTP web server (Python, Nginx, Apache, Caddy, Node `http-server`, etc.).

---

## 🌟 Highlights of the Redesign & Flaws Solved

This implementation addresses every architectural deficiency cataloged in `UI_UX_Flaws_And_Redesign_Recommendations.md` and fulfills the complete page inventory in `UI_UX_Designer_Handoff.md`:

1. **Design System Unification (Flaw 1.1 & 1.3):**
   - Replaced fragmented CSS frameworks (Tailwind CDN, Bootstrap 5, Chatify CSS) with a single, comprehensive CSS Custom Properties token system (`css/tokens.css`).
   - Fully accessible WCAG 2.1 AA compliant typography and contrast ratios across both Dark Mode (default brand) and Daylight Light Mode.
   - Built-in live theme picker with **12 curated accent palettes** (Indigo, Crimson, Amber, Emerald, Cyan, Violet, Rose, Blue, Lime, Coral, Gold, Fuchsia).

2. **Unified SVG Iconography (Flaw 1.2):**
   - Eliminated mismatched icon libraries (Feather, FontAwesome, Themify) in favor of a cohesive, vector SVG icon helper (`js/icons.js`) with consistent 1.75px stroke widths and 24x24 bounding boxes.

3. **3-Column Desktop Layout (Flaw 2.1):**
   - Replaced the congested 4-column squeeze with a balanced 3-column architecture:
     - Collapsible Left Navigation (260px &rarr; 76px icon rail).
     - Wide, comfortable central timeline feed (680px).
     - Contextual discovery sidebar with widgets.
     - Secondary messaging transformed into a collapsible **Docked Chat Bar** at the bottom-right.

4. **Streamlined Sidebar & Navigation (Flaw 2.2 & 2.3):**
   - Removed duplicate profile links and redundant items.
   - Header search with instant autocomplete dropdown for hashtags and creators, plus a dedicated `/search` tab with recent queries.

5. **Unified Safe Mode Content Guard (Flaw 2.4):**
   - Unified Safe Mode into a single synchronized toggle in the top navigation.
   - Disabling Safe Mode triggers an **18+ Adult Content Warning Modal** with age verification confirmation.
   - Sensitive posts feature a blurred overlay with a one-click session reveal button.

6. **Post Creation UX Overhaul (Flaw 3.1, 3.2 & 3.3):**
   - The composer is open, inviting, and ready for input by default (no hidden accordion).
   - Replaced archaic Laravel File Manager popups with native file inputs supporting drag-and-drop, instant thumbnail previews, and video players.
   - **Visual Reassurance for Anonymous Posting:** Toggling "Post Anonymously" dynamically morphs the author avatar to a ghost icon, updates the name to *"Anonymous User"*, and adds an *"Identity Hidden"* badge in real time.

7. **Immersive Shorts / Reels Viewport (Flaw 4.1, 4.2 & 4.3):**
   - Fullscreen edge-to-edge dark viewport with ambient color glow.
   - Up/Down navigation via buttons, swipe, and arrow/J/K keys.
   - Tap to pause/play, double-tap heart burst animation, and audio mute/unmute toggle.
   - Native-feeling slide-over comments drawer with live comment posting.

8. **Social Graph & Relationship Hub (Flaw 5.1 & 5.2):**
   - Segmented tabs: **"Mutual Friends"** (private connections) and **"Followed Creators"** (public accounts).
   - Profile header layout optimized for mobile screens without button wrapping or handle overlap.
   - Public Creator vs. Private Profile badges.
   - **Demographic Pill Tag Selector Modal (Flaw 5.3):** Searchable modal with chips for 21 sexual orientations and 43+ identity roles.

9. **Unified Settings Hub (Flaw 6.1 & 6.2):**
   - Consolidated `/account` and Jetstream's `/user/profile` into a unified settings center: Profile Info, Password & 2FA TOTP setup, Privacy rules, and Active Browser Sessions.
   - **21-Day Bookmark Expiry Countdown:** Displays clear *"Expires in X days"* badges with a 1-click *"Keep Forever"* archive toggle.

10. **Chatify Messenger & Channels (Flaw 7.1 & 7.2):**
    - Seamlessly integrated within the Diskrit shell with 1-on-1 direct chats, group channels, announcement modes, channel creation modal, and invite landing page (`/chatify/channels/join/{token}`).
    - Distinct visual avatars: circular avatars for users, rounded-hex badges with initials for channels.

11. **Superadmin Portal & Interactive Ad Studio (Flaw 8.1 & 8.2):**
    - Dark mode dashboard with KPI stat cards, real SVG growth and activity charts.
    - User governance (ban/unban), All Posts management (hide post with formal reason modal), Reports queue, and AI Moderation queue.
    - **Interactive Live Ad Preview Studio:** Live viewport switcher (Desktop 100%, Tablet 540px, Mobile 340px), Ad variety tester (Card, Banner, Floating, Story), theme toggle, and embed snippet generator.
    - Dedicated **Creator Studio** with audience telemetry and tips analytics.

---

## 📂 Project Architecture

```text
DiskritUi/
├── index.html                   # Universal application entry point & layout shell
├── pages/                       # Direct page entry points (URL redirects)
│   ├── home.html
│   ├── shorts.html
│   ├── profile.html
│   ├── friends.html
│   ├── search.html
│   ├── notifications.html
│   ├── saved.html
│   ├── chat.html
│   ├── settings.html
│   ├── post.html
│   ├── auth/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── forgot-password.html
│   │   └── two-factor.html
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── users.html
│   │   ├── posts.html
│   │   ├── moderation.html
│   │   └── ad-studio.html
│   └── legal/
│       ├── about.html
│       ├── terms.html
│       ├── privacy.html
│       └── acceptable-use.html
├── css/
│   ├── tokens.css               # Design tokens, variables & accessible color palettes
│   ├── reset.css                # Modern box-sizing reset & custom scrollbars
│   ├── global.css               # Buttons, form controls, pills, badges, cards, animations
│   ├── layout.css               # 3-column desktop layout, topbar, mobile bottom nav, docked chat
│   ├── components.css           # Post card, composer, modals, dropdowns, toast system
│   ├── themes.css               # 12 curated accent themes
│   ├── responsive.css           # Breakpoints & mobile PWA safe area adaptations
│   └── pages/                   # Page-specific stylesheets (feed, shorts, profile, chat, etc.)
├── js/
│   ├── app.js                   # Main application bootstrapper
│   ├── router.js                # Central client-side router & dynamic path resolver
│   ├── theme.js                 # Theme switcher & safe mode manager
│   ├── storage.js               # Centralized localStorage persistence service
│   ├── mock-data.js             # Rich mock dataset (posts, shorts, chats, admin, demographics)
│   ├── icons.js                 # Unified SVG icon library (1.75px uniform stroke)
│   ├── components/
│   │   ├── navbar.js            # Topbar, live search autocomplete, mobile nav
│   │   ├── sidebar.js           # Collapsible leftnav, discovery widgets, docked chat
│   │   ├── post-card.js         # Interactive post card renderer with heartPop & comments
│   │   ├── composer.js          # Post composer with anonymous avatar swap
│   │   └── modals.js            # Adult warning, pill selector modal, hide modal, toasts
│   └── pages/                   # Page controllers (home, shorts, profile, admin, chat, etc.)
└── README.md
```

---

## 🚀 Running Locally

No installation or build step is required. You can run the application directly using any local web server:

### Option 1: Python 3 (Recommended)
```bash
python3 -m http.server 8080
```
Then open your browser to: `http://localhost:8080`

### Option 2: Node.js (npx serve / http-server)
```bash
npx -y serve -p 8080 .
```

### Option 3: PHP Built-in Server
```bash
php -S localhost:8080
```

---

## 🧭 Page Routes & Navigation Index

All routes can be accessed via hash navigation (`index.html#route`) or through direct page links:

| Route Path | Description |
|---|---|
| `#home` | Central social feed with stories, composer, and post stream |
| `#home?feed=video` | Filtered timeline displaying only video posts |
| `#shorts` | Full-screen vertical shorts player with keyboard and gestures |
| `#posts/create` | Dedicated full-page post creator |
| `#post/{slug}` | Deep-linkable single post view with full comment thread |
| `#post/{id}/analytics` | Author-only performance analytics insight dashboard |
| `#search?q={query}` | Global search across creators and posts |
| `#tags/{tag}` | Topical hashtag feed with stream of tagged content |
| `#@{handle}` | Public/private user profile with demographic chips and tabs |
| `#friends` | Friends & relationship manager (Friends vs Following) |
| `#notifications` | Chronological activity alerts with unread filtering |
| `#settings` (or `#account`) | Unified settings hub (Profile, Password, 2FA, Sessions) |
| `#saved` (or `#account/saved`) | 21-day auto-expiring bookmarks library |
| `#chatify` | Messenger console with direct chats and channels |
| `#chatify/{id}` | Direct 1-on-1 conversation thread |
| `#chatify/channel/{id}` | Group channel discussion |
| `#chatify/channels/join/{token}` | Channel invite public landing page |
| `#login` | Split-screen login gateway with social authentication |
| `#register` | Split-screen registration and onboarding |
| `#forgot-password` | Password reset link request |
| `#two-factor-challenge` | 6-digit TOTP authenticator verification |
| `#email/verify` | Email verification status checkpoint |
| `#superadmin/dashboard` | Superadmin command center with KPI charts |
| `#superadmin/users` | User governance & ban/unban moderation table |
| `#superadmin/all-posts` | Content governance catalog with hide post modal |
| `#superadmin/reports` | Community user reports triage queue |
| `#superadmin/rejected-posts` | AI automated safety filter review queue |
| `#superadmin/ad-websites` | External publisher syndicate ad distribution network |
| `#superadmin/ad-websites/{id}` | Interactive Live Ad Preview Studio & Embed Generator |
| `#creator/dashboard` | Creator Studio with monetization & retention telemetry |
| `#admin/roles/form` | User access delegation & role assignment |
| `#legal/about` | Brand showcase, mission statement, and principles |
| `#legal/terms` | Terms of service and user agreements |
| `#legal/privacy` | Privacy transparency statement |
| `#legal/cookies` | Cookie and local storage disclosure |
| `#legal/acceptable-use` | Rules of behavior and prohibited activities |
| `#offline` | PWA offline connectivity fallback |
| `#500` | 500 internal server error page |

---

## 🔒 Verification & Compliance
- **No Build Tools:** 100% vanilla HTML5, CSS3, ES6+ JS.
- **Reference Integrity:** `UI_UX_Designer_Handoff.md` and `UI_UX_Flaws_And_Redesign_Recommendations.md` remain completely untouched.
- **Responsive:** Verified across mobile (<768px), tablet (768px-1279px), and desktop (1280px+).
