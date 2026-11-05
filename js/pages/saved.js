/**
 * DISKRIT SAVED LIBRARY (BOOKMARKS)
 * Solves Flaw 6.2: 21-day auto-expiry countdown, permanent archive toggle, and category filtering
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.saved = {
  currentFilter: "all", // all | post | video

  render() {
    let saved = Diskrit.storage.get("savedBookmarks", Diskrit.mockData.savedBookmarks);
    if (this.currentFilter !== "all") {
      saved = saved.filter(s => s.type === this.currentFilter);
    }

    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-6);">
        <!-- Header & Expiry Context (Solves Flaw 6.2) -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
          <div>
            <h1 style="font-size: var(--font-2xl); font-weight: 700;">Saved Library & Bookmarks</h1>
            <p style="color: var(--text-muted); font-size: var(--font-sm); margin-top: 4px;">
              Your private collection of posts, shorts, and inspirational media.
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.25); padding: 8px 16px; border-radius: var(--radius-lg);">
            <div style="color: #f59e0b;">${Diskrit.icons("clock", "", 18)}</div>
            <span style="font-size: var(--font-xs); color: #f59e0b; font-weight: 600;">
              21-Day Dynamic Expiry Active (Click "Keep Forever" to archive permanently)
            </span>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <button class="pill-tag saved-filter-tab ${this.currentFilter === 'all' ? 'selected' : ''}" data-type="all">
            All Items (${saved.length})
          </button>
          <button class="pill-tag saved-filter-tab ${this.currentFilter === 'post' ? 'selected' : ''}" data-type="post">
            Posts
          </button>
          <button class="pill-tag saved-filter-tab ${this.currentFilter === 'video' ? 'selected' : ''}" data-type="video">
            Videos & Shorts
          </button>
        </div>

        <!-- Saved Bookmarks Stream (Clean Vertical Stack) -->
        <div style="display: flex; flex-direction: column; gap: var(--space-4);" id="saved-items-container">
          ${saved.length === 0 ? `
            <div class="card" style="text-align: center; padding: 48px; grid-column: 1 / -1;">
              <p style="color: var(--text-muted);">No saved bookmarks found in this section.</p>
            </div>
          ` : saved.map(item => `
            <div class="card saved-bookmark-card" id="bookmark-${item.id}" style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 16px; min-width: 0;">
                <img src="${item.thumbnail}" style="width: 76px; height: 76px; border-radius: var(--radius-lg); object-fit: cover;" alt="Saved media">
                <div style="display: flex; flex-direction: column; gap: 4px; min-width: 0;">
                  <a href="#post/${item.postId}" style="font-weight: 600; font-size: var(--font-base); color: var(--text-primary); text-decoration: none;">
                    ${item.title}
                  </a>
                  <div style="font-size: var(--font-xs); color: var(--text-muted);">
                    Saved by @${item.authorHandle} &bull; Date: ${item.savedDate}
                  </div>
                  <div>
                    ${item.isPermanent ? `
                      <span class="badge badge-success">
                        ${Diskrit.icons("check", "", 12)} Kept Forever (Permanent)
                      </span>
                    ` : `
                      <span class="expiry-badge ${item.daysLeft <= 4 ? 'critical' : ''}">
                        ${Diskrit.icons("clock", "", 12)} Expires in ${item.daysLeft} days
                      </span>
                    `}
                  </div>
                </div>
              </div>

              <!-- Action Controls -->
              <div style="display: flex; align-items: center; gap: 8px;">
                ${!item.isPermanent ? `
                  <button class="btn btn-secondary btn-sm keep-forever-btn" data-id="${item.id}" title="Archive permanently and bypass 21-day auto-deletion">
                    ${Diskrit.icons("bookmark", "", 14)}
                    <span>Keep Forever</span>
                  </button>
                ` : ''}
                <a href="#post/${item.postId}" class="btn btn-primary btn-sm">
                  <span>View Post</span>
                </a>
                <button class="btn btn-ghost btn-sm remove-bookmark-btn" data-id="${item.id}" title="Remove Bookmark" style="color: var(--color-danger);">
                  ${Diskrit.icons("trash", "", 16)}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  attachEvents() {
    // Filter tabs
    document.querySelectorAll(".saved-filter-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        this.currentFilter = tab.dataset.type;
        const main = document.getElementById("app-main-content");
        if (main) {
          main.innerHTML = this.render();
          this.attachEvents();
        }
      });
    });

    // Keep forever toggle (Flaw 6.2 solution)
    document.querySelectorAll(".keep-forever-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const saved = Diskrit.storage.get("savedBookmarks", Diskrit.mockData.savedBookmarks);
        const item = saved.find(s => s.id === id);
        if (item) {
          item.isPermanent = true;
          Diskrit.storage.set("savedBookmarks", saved);
          Diskrit.components.modals.toast("Item archived permanently! 21-day auto-expiry removed.", "success");
          const main = document.getElementById("app-main-content");
          if (main) {
            main.innerHTML = this.render();
            this.attachEvents();
          }
        }
      });
    });

    // Remove bookmark
    document.querySelectorAll(".remove-bookmark-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        let saved = Diskrit.storage.get("savedBookmarks", Diskrit.mockData.savedBookmarks);
        saved = saved.filter(s => s.id !== id);
        Diskrit.storage.set("savedBookmarks", saved);
        
        const card = document.getElementById(`bookmark-${id}`);
        if (card) card.remove();
        Diskrit.components.modals.toast("Bookmark removed", "info");
      });
    });
  }
};
