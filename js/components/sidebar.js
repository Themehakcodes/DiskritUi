/**
 * DISKRIT SIDEBARS & DOCKED MESSAGING
 * Solves Flaw 2.1 & 2.2: Streamlined sidebar navigation, discovery widgets, and docked messaging drawer
 */

window.Diskrit = window.Diskrit || {};
Diskrit.components = Diskrit.components || {};

Diskrit.components.sidebar = {
  renderLeftNav(activeRoute = "home") {
    const isCollapsed = Diskrit.storage.get("leftnav_collapsed", false);
    const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;

    return `
      <aside class="app-leftnav ${isCollapsed ? 'collapsed' : ''}" id="app-leftnav" aria-label="Main Navigation">
        <div>
          <!-- Section 1: Social Feeds & Discovery -->
          <div class="nav-section">
            <div class="nav-section-title">Feeds</div>
            <a href="#home" class="nav-link-item ${activeRoute === 'home' ? 'active' : ''}">
              <span class="nav-link-icon">${Diskrit.icons("home", "", 20)}</span>
              <span class="nav-link-label">Newsfeed</span>
            </a>
            <a href="#home?feed=video" class="nav-link-item ${activeRoute === 'video-feed' ? 'active' : ''}">
              <span class="nav-link-icon">${Diskrit.icons("video", "", 20)}</span>
              <span class="nav-link-label">Videos</span>
            </a>
            <a href="#shorts" class="nav-link-item ${activeRoute === 'shorts' ? 'active' : ''}">
              <span class="nav-link-icon">${Diskrit.icons("zap", "", 20)}</span>
              <span class="nav-link-label">Shorts</span>
              <span class="badge badge-primary">Hot</span>
            </a>
          </div>

          <!-- Section 2: Social Graph & Personal -->
          <div class="nav-section">
            <div class="nav-section-title">Community</div>
            <a href="#@${user.handle}" class="nav-link-item ${activeRoute.startsWith('@') ? 'active' : ''}">
              <span class="nav-link-icon">${Diskrit.icons("user", "", 20)}</span>
              <span class="nav-link-label">Profile</span>
            </a>
            <a href="#friends" class="nav-link-item ${activeRoute === 'friends' ? 'active' : ''}">
              <span class="nav-link-icon">${Diskrit.icons("users", "", 20)}</span>
              <span class="nav-link-label">Friends & Graph</span>
            </a>
            <a href="#saved" class="nav-link-item ${activeRoute === 'saved' ? 'active' : ''}">
              <span class="nav-link-icon">${Diskrit.icons("bookmark", "", 20)}</span>
              <span class="nav-link-label">Saved Library</span>
            </a>
            <a href="#settings" class="nav-link-item ${activeRoute.startsWith('settings') || activeRoute.startsWith('account') ? 'active' : ''}">
              <span class="nav-link-icon">${Diskrit.icons("settings", "", 20)}</span>
              <span class="nav-link-label">Settings</span>
            </a>
          </div>

          <!-- Section 3: Studios & Administration -->
          <div class="nav-section">
            <div class="nav-section-title">Portals</div>
            <a href="#creator/dashboard" class="nav-link-item ${activeRoute.startsWith('creator') ? 'active' : ''}">
              <span class="nav-link-icon">${Diskrit.icons("barChart", "", 20)}</span>
              <span class="nav-link-label">Creator Studio</span>
            </a>
            <a href="#superadmin/dashboard" class="nav-link-item ${activeRoute.startsWith('superadmin') ? 'active' : ''}">
              <span class="nav-link-icon">${Diskrit.icons("activity", "", 20)}</span>
              <span class="nav-link-label">Superadmin</span>
            </a>
          </div>
        </div>

        <!-- Bottom Footer Utilities -->
        <div style="padding: 0 var(--space-4);">
          <button id="pwa-install-btn" class="btn btn-secondary btn-sm" style="width: 100%; margin-bottom: 12px; gap: 8px;">
            ${Diskrit.icons("download", "", 16)}
            <span class="nav-link-label">Install PWA App</span>
          </button>
          
          <button id="leftnav-collapse-btn" class="btn btn-ghost btn-sm" style="width: 100%; justify-content: flex-start; gap: 8px;" title="Collapse Navigation">
            ${Diskrit.icons("chevronLeft", "", 16)}
            <span class="nav-link-label">${isCollapsed ? 'Expand Menu' : 'Collapse Menu'}</span>
          </button>
        </div>
      </aside>
    `;
  },

  renderRightSidebar() {
    const friendRequests = Diskrit.mockData.friendRequests;
    const suggestedUsers = Diskrit.mockData.users.filter(u => u.relationship !== "friend");
    const trending = Diskrit.mockData.trendingHashtags;
    const channels = Diskrit.mockData.chats.conversations.filter(c => c.type === "channel");

    return `
      <aside class="app-right-sidebar" aria-label="Discovery Sidebar">
        <!-- Friend Requests Widget -->
        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">Friend Requests</span>
            <a href="#friends" class="widget-link">See all</a>
          </div>
          <div id="sidebar-friend-requests-list" style="display: flex; flex-direction: column; gap: 12px;">
            ${friendRequests.length === 0 ? `
              <div style="font-size: var(--font-xs); color: var(--text-muted); text-align: center; padding: 12px 0;">No pending requests</div>
            ` : friendRequests.map(fr => `
              <div class="widget-user-row" id="fr-row-${fr.id}">
                <a href="#@${fr.handle || 'user'}" class="widget-user-meta" style="text-decoration: none;" title="View profile">
                  <img src="${fr.avatar}" class="avatar avatar-sm" alt="${fr.name}">
                  <div class="widget-user-names">
                    <span class="widget-name">${fr.name}</span>
                    <span class="widget-handle">${fr.mutualCount} mutual connections</span>
                  </div>
                </a>
                <div style="display: flex; gap: 4px;">
                  <button class="btn btn-primary btn-sm accept-fr-btn" data-id="${fr.id}" title="Confirm Request">
                    ${Diskrit.icons("check", "", 14)}
                  </button>
                  <button class="btn btn-secondary btn-sm decline-fr-btn" data-id="${fr.id}" title="Decline Request">
                    ${Diskrit.icons("x", "", 14)}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Suggested Creators Widget -->
        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">Suggested Creators</span>
            <a href="#search" class="widget-link">Explore</a>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${suggestedUsers.slice(0, 3).map(u => `
              <div class="widget-user-row">
                <a href="#@${u.handle}" class="widget-user-meta" style="text-decoration: none;">
                  <img src="${u.avatar}" class="avatar avatar-sm" alt="${u.name}">
                  <div class="widget-user-names">
                    <span class="widget-name">${u.name}</span>
                    <span class="widget-handle">@${u.handle}</span>
                  </div>
                </a>
                <button class="btn btn-secondary btn-sm follow-user-btn" data-handle="${u.handle}">
                  ${u.profileType === 'public' ? 'Follow' : 'Add'}
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Public Channels Widget -->
        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">Open Channels</span>
            <a href="#chatify" class="widget-link">All</a>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${channels.map(c => `
              <a href="#chatify/channel/${c.channelId}" class="widget-user-row" style="text-decoration: none;">
                <div class="widget-user-meta">
                  <div class="channel-avatar-badge" style="width: 32px; height: 32px; font-size: 13px;">${c.avatar}</div>
                  <div class="widget-user-names">
                    <span class="widget-name">${c.title}</span>
                    <span class="widget-handle">${c.memberCount} members</span>
                  </div>
                </div>
                <span style="font-size: var(--font-xs); color: var(--accent); font-weight: 600;">Join</span>
              </a>
            `).join('')}
          </div>
        </div>

        <!-- Trending Topics Widget -->
        <div class="widget-card">
          <div class="widget-header">
            <span class="widget-title">Trending Hashtags</span>
            ${Diskrit.icons("trendingUp", "text-accent", 16)}
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${trending.map(t => `
              <a href="#tags/${t.tag.replace('#', '')}" class="trending-item">
                <span class="trending-tag">${t.tag}</span>
                <span class="trending-count">${t.count}</span>
              </a>
            `).join('')}
          </div>
        </div>

        <!-- Footer Policy Links -->
        <div style="font-size: var(--font-xs); color: var(--text-muted); display: flex; flex-wrap: wrap; gap: 8px; padding: 0 4px;">
          <a href="#legal/about">About</a> &bull;
          <a href="#legal/terms">Terms</a> &bull;
          <a href="#legal/privacy">Privacy</a> &bull;
          <a href="#legal/acceptable-use">Acceptable Use</a>
          <div style="width: 100%; margin-top: 4px;">&copy; 2026 Diskrit Media Inc.</div>
        </div>
      </aside>
    `;
  },

  renderDockedChat() {
    const contacts = Diskrit.mockData.users;
    return `
      <div class="docked-chat-bar collapsed" id="docked-chat-bar">
        <div class="docked-chat-header" id="docked-chat-toggle">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="status-dot status-online"></span>
            <span style="font-weight: 600; font-size: var(--font-sm);">Diskrit Messenger</span>
          </div>
          ${Diskrit.icons("chevronUp", "docked-arrow-icon", 16)}
        </div>
        <div class="docked-chat-body">
          <div style="font-size: var(--font-xs); color: var(--text-muted); text-transform: uppercase; font-weight: 600; padding: 4px 6px;">
            Online Connections
          </div>
          ${contacts.map(u => `
            <a href="#chatify/${u.id}" class="autocomplete-item" style="border-radius: var(--radius-md); padding: 8px;">
              <div style="position: relative;">
                <img src="${u.avatar}" class="avatar avatar-sm" alt="${u.name}">
                <span class="status-dot status-${u.status}" style="position: absolute; bottom: 0; right: 0;"></span>
              </div>
              <div style="display: flex; flex-direction: column; min-width: 0;">
                <span style="font-weight: 600; font-size: var(--font-xs);">${u.name}</span>
                <span style="font-size: 11px; color: var(--text-muted);">@${u.handle}</span>
              </div>
            </a>
          `).join('')}
          <div class="dropdown-divider"></div>
          <a href="#chatify" class="btn btn-secondary btn-sm" style="width: 100%; justify-content: center;">
            Open Full Messenger
          </a>
        </div>
      </div>
    `;
  },

  attachEvents() {
    // Leftnav collapse toggle
    const collapseBtn = document.getElementById("leftnav-collapse-btn");
    const leftnav = document.getElementById("app-leftnav");
    if (collapseBtn && leftnav) {
      collapseBtn.addEventListener("click", () => {
        const isCollapsed = leftnav.classList.toggle("collapsed");
        Diskrit.storage.set("leftnav_collapsed", isCollapsed);
        const label = collapseBtn.querySelector(".nav-link-label");
        if (label) label.textContent = isCollapsed ? "Expand Menu" : "Collapse Menu";
      });
    }

    // PWA Install Prompt
    const pwaBtn = document.getElementById("pwa-install-btn");
    if (pwaBtn) {
      pwaBtn.addEventListener("click", () => {
        if (Diskrit.pwa) {
          Diskrit.pwa.promptInstall();
        } else {
          Diskrit.components.modals.toast("Diskrit is PWA ready! Add to Home Screen from your browser menu.", "info");
        }
      });
    }

    // Friend request confirmation
    document.querySelectorAll(".accept-fr-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.id;
        const row = document.getElementById(`fr-row-${id}`);
        if (row) {
          row.innerHTML = `<span style="font-size: var(--font-xs); color: var(--color-success); font-weight: 600;">✓ Friend request accepted!</span>`;
          setTimeout(() => row.remove(), 2000);
        }
        Diskrit.components.modals.toast("Friend request accepted!", "success");
      });
    });

    // Friend request decline
    document.querySelectorAll(".decline-fr-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.id;
        const row = document.getElementById(`fr-row-${id}`);
        if (row) row.remove();
        Diskrit.components.modals.toast("Request removed", "info");
      });
    });

    // Follow toggle in sidebar
    document.querySelectorAll(".follow-user-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.textContent.trim() === "Follow") {
          btn.textContent = "Following";
          btn.classList.add("btn-primary");
          btn.classList.remove("btn-secondary");
          Diskrit.components.modals.toast(`Now following @${btn.dataset.handle}`, "success");
        } else {
          btn.textContent = "Follow";
          btn.classList.remove("btn-primary");
          btn.classList.add("btn-secondary");
        }
      });
    });

    // Docked chat bar collapse/expand toggle
    const dockedBar = document.getElementById("docked-chat-bar");
    const dockedToggle = document.getElementById("docked-chat-toggle");
    if (dockedBar && dockedToggle) {
      dockedToggle.addEventListener("click", () => {
        const isCollapsed = dockedBar.classList.toggle("collapsed");
        const arrow = dockedToggle.querySelector(".docked-arrow-icon");
        if (arrow) {
          arrow.outerHTML = isCollapsed ? 
            Diskrit.icons("chevronUp", "docked-arrow-icon", 16) : 
            Diskrit.icons("chevronDown", "docked-arrow-icon", 16);
        }
      });
    }
  }
};
