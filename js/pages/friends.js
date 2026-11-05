/**
 * DISKRIT FRIENDS & RELATIONSHIP HUB
 * Solves Flaw 5.1: Segmented "Friends" vs "Following" tabs, request confirmations, and connection search
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.friends = {
  currentTab: "friends", // friends | following | requests

  render() {
    const friendRequests = Diskrit.mockData.friendRequests;
    const users = Diskrit.mockData.users;
    const friends = users.filter(u => u.relationship === "friend");
    const following = users.filter(u => u.relationship === "following");

    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-6);">
        <!-- Hub Header & Search -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h1 style="font-size: var(--font-2xl); font-weight: 700;">Relationships & Connections</h1>
            <p style="color: var(--text-muted); font-size: var(--font-sm);">
              Manage mutual friendships, followed public creators, and incoming connection requests.
            </p>
          </div>
          
          <div class="search-input-wrapper" style="min-width: 260px;">
            <span class="search-input-icon">${Diskrit.icons("search", "", 16)}</span>
            <input 
              type="text" 
              id="friends-search-input" 
              class="topbar-search-input" 
              placeholder="Filter connections by name..."
            >
          </div>
        </div>

        <!-- Segmented Tab Switcher (Solves Flaw 5.1) -->
        <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <button class="pill-tag friends-nav-tab ${this.currentTab === 'friends' ? 'selected' : ''}" data-tab="friends">
            ${Diskrit.icons("users", "", 16)}
            <span>Mutual Friends (${friends.length})</span>
          </button>
          <button class="pill-tag friends-nav-tab ${this.currentTab === 'following' ? 'selected' : ''}" data-tab="following">
            ${Diskrit.icons("sparkles", "", 16)}
            <span>Followed Creators (${following.length})</span>
          </button>
          <button class="pill-tag friends-nav-tab ${this.currentTab === 'requests' ? 'selected' : ''}" data-tab="requests">
            ${Diskrit.icons("bell", "", 16)}
            <span>Pending Requests (${friendRequests.length})</span>
          </button>
        </div>

        <!-- Section: Friend Requests (Always prominent or when selected) -->
        ${friendRequests.length > 0 && this.currentTab === 'requests' ? `
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div style="font-size: var(--font-md); font-weight: 700;">Incoming Requests</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4);">
              ${friendRequests.map(fr => `
                <div class="card" id="req-card-${fr.id}" style="display: flex; flex-direction: column; gap: var(--space-3);">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${fr.avatar}" class="avatar avatar-md" alt="${fr.name}">
                    <div>
                      <div style="font-weight: 600; font-size: var(--font-sm);">${fr.name}</div>
                      <div style="font-size: var(--font-xs); color: var(--text-muted);">@${fr.handle} &bull; ${fr.location}</div>
                    </div>
                  </div>
                  <div style="font-size: var(--font-xs); color: var(--accent);">${fr.mutualCount} mutual connections</div>
                  <div style="display: flex; gap: 8px; margin-top: 4px;">
                    <button class="btn btn-primary btn-sm accept-req-action" data-id="${fr.id}" style="flex: 1;">Confirm</button>
                    <button class="btn btn-secondary btn-sm decline-req-action" data-id="${fr.id}" style="flex: 1;">Decline</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Section: Main Tab List (Friends or Following) -->
        <div id="connections-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4);">
          ${this.renderConnectionCards(this.currentTab === 'following' ? following : friends)}
        </div>
      </div>
    `;
  },

  renderConnectionCards(list) {
    if (!list || list.length === 0) {
      return `
        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
          <p style="color: var(--text-muted);">No connections found in this view.</p>
        </div>
      `;
    }

    return list.map(u => `
      <div class="card connection-item-card" data-name="${u.name.toLowerCase()}" style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <a href="#@${u.handle}" style="display: flex; align-items: center; gap: 12px; text-decoration: none;">
            <img src="${u.avatar}" class="avatar avatar-md" alt="${u.name}">
            <div>
              <div style="font-weight: 600; font-size: var(--font-sm); color: var(--text-primary);">${u.name}</div>
              <div style="font-size: var(--font-xs); color: var(--text-muted);">@${u.handle}</div>
            </div>
          </a>
          <span class="badge ${u.profileType === 'public' ? 'profile-badge-creator' : 'profile-badge-private'}">
            ${u.profileType === 'public' ? 'Creator' : 'Private'}
          </span>
        </div>
        <p style="font-size: var(--font-xs); color: var(--text-secondary); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${u.bio}
        </p>
        <div style="display: flex; gap: 8px; margin-top: auto; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
          <a href="#chatify/${u.id}" class="btn btn-secondary btn-sm" style="flex: 1; gap: 6px;">
            ${Diskrit.icons("message", "", 14)}
            <span>Chat</span>
          </a>
          <button class="btn btn-ghost btn-sm disconnect-btn" data-id="${u.id}" style="color: var(--color-danger);" title="Remove Connection">
            ${Diskrit.icons("trash", "", 14)}
          </button>
        </div>
      </div>
    `).join('');
  },

  attachEvents() {
    // Tabs
    document.querySelectorAll(".friends-nav-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        this.currentTab = tab.dataset.tab;
        const main = document.getElementById("app-main-content");
        if (main) {
          main.innerHTML = this.render();
          this.attachEvents();
        }
      });
    });

    // Accept / Decline Requests
    document.querySelectorAll(".accept-req-action").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const card = document.getElementById(`req-card-${id}`);
        if (card) {
          card.innerHTML = `<div style="color: var(--color-success); font-weight: 600; padding: 20px; text-align: center;">✓ Friend Request Accepted!</div>`;
          setTimeout(() => card.remove(), 1500);
        }
        Diskrit.components.modals.toast("Connected as mutual friends!", "success");
      });
    });

    document.querySelectorAll(".decline-req-action").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const card = document.getElementById(`req-card-${id}`);
        if (card) card.remove();
        Diskrit.components.modals.toast("Request declined", "info");
      });
    });

    // Filter connections input
    const searchInput = document.getElementById("friends-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase().trim();
        document.querySelectorAll(".connection-item-card").forEach(card => {
          const name = card.dataset.name || "";
          card.style.display = name.includes(q) ? "flex" : "none";
        });
      });
    }

    // Disconnect button
    document.querySelectorAll(".disconnect-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".connection-item-card");
        if (card) card.remove();
        Diskrit.components.modals.toast("Connection removed", "info");
      });
    });
  }
};
