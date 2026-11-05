/**
 * DISKRIT NOTIFICATIONS CENTER
 * Historical alert log with unread filtering and clear all action
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.notifications = {
  filter: "all", // all | unread

  render() {
    let notifs = Diskrit.storage.get("notifications", Diskrit.mockData.notifications);
    if (this.filter === "unread") {
      notifs = notifs.filter(n => n.isUnread);
    }

    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-6);">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h1 style="font-size: var(--font-2xl); font-weight: 700;">Notifications</h1>
            <p style="color: var(--text-muted); font-size: var(--font-sm);">
              Stay updated on likes, comments, mentions, and community activities.
            </p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" id="mark-all-read-btn">Mark All as Read</button>
            <button class="btn btn-ghost btn-sm" id="clear-all-notifs-btn" style="color: var(--color-danger);">Clear All</button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <button class="pill-tag notif-filter-tab ${this.filter === 'all' ? 'selected' : ''}" data-filter="all">
            All Notifications
          </button>
          <button class="pill-tag notif-filter-tab ${this.filter === 'unread' ? 'selected' : ''}" data-filter="unread">
            Unread Only
          </button>
        </div>

        <!-- Notifications List -->
        <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;" id="notifs-container">
          ${notifs.length === 0 ? `
            <div style="text-align: center; padding: 48px; color: var(--text-muted);">
              ${Diskrit.icons("bell", "", 32)}
              <div style="margin-top: 8px;">No notifications in this filter view.</div>
            </div>
          ` : notifs.map(n => `
            <a href="${n.targetUrl}" class="autocomplete-item notif-row-item" style="padding: 16px; border-bottom: 1px solid var(--border-subtle); background: ${n.isUnread ? 'var(--accent-light)' : 'transparent'};">
              <img src="${n.actorAvatar}" class="avatar avatar-md" alt="${n.actorName}">
              <div style="display: flex; flex-direction: column; gap: 4px; flex: 1;">
                <div style="font-size: var(--font-sm); color: var(--text-primary);">
                  <strong>${n.actorName}</strong> ${n.text}
                </div>
                <div style="font-size: var(--font-xs); color: var(--text-muted);">${n.time}</div>
              </div>
              ${n.isUnread ? `
                <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent);"></span>
              ` : ''}
            </a>
          `).join('')}
        </div>
      </div>
    `;
  },

  attachEvents() {
    // Filter tabs
    document.querySelectorAll(".notif-filter-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        this.filter = tab.dataset.filter;
        const main = document.getElementById("app-main-content");
        if (main) {
          main.innerHTML = this.render();
          this.attachEvents();
        }
      });
    });

    // Mark all as read
    const markReadBtn = document.getElementById("mark-all-read-btn");
    if (markReadBtn) {
      markReadBtn.addEventListener("click", () => {
        const notifs = Diskrit.storage.get("notifications", Diskrit.mockData.notifications);
        notifs.forEach(n => n.isUnread = false);
        Diskrit.storage.set("notifications", notifs);
        Diskrit.components.modals.toast("All notifications marked as read", "success");
        const main = document.getElementById("app-main-content");
        if (main) {
          main.innerHTML = this.render();
          this.attachEvents();
        }
      });
    }

    // Clear all
    const clearBtn = document.getElementById("clear-all-notifs-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        Diskrit.storage.set("notifications", []);
        Diskrit.components.modals.toast("Notifications history cleared", "info");
        const main = document.getElementById("app-main-content");
        if (main) {
          main.innerHTML = this.render();
          this.attachEvents();
        }
      });
    }
  }
};
