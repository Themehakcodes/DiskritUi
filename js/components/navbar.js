/**
 * DISKRIT TOPBAR & MOBILE NAVIGATION
 * Solves Flaw 2.3 & 2.4: Unified Safe Mode toggle, responsive live search, and consistent iconography
 */

window.Diskrit = window.Diskrit || {};
Diskrit.components = Diskrit.components || {};

Diskrit.components.navbar = {
  renderTopNav(activeRoute = "home") {
    const isSafe = Diskrit.theme.isSafeMode();
    const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;
    const notifs = Diskrit.storage.get("notifications") || Diskrit.mockData.notifications;
    const unreadCount = notifs.filter(n => n.isUnread).length;

    return `
      <header class="app-topbar">
        <div class="topbar-left">
          <a href="#home" class="brand-logo" aria-label="Diskrit Home">
            <img src="assets/images/logo.png" class="brand-logo-img" alt="Diskrit">
            <span class="brand-logo-text">Diskrit</span>
          </a>
        </div>

        <div class="topbar-search-container">
          <div class="search-input-wrapper">
            <span class="search-input-icon">${Diskrit.icons("search", "", 18)}</span>
            <input 
              type="text" 
              id="global-search-input" 
              class="topbar-search-input" 
              placeholder="Search creators, hashtags, or posts..." 
              autocomplete="off"
              aria-label="Search Diskrit"
            >
          </div>
          <div id="search-autocomplete-dropdown" class="search-autocomplete-dropdown">
            <div class="autocomplete-section-title">Trending Hashtags</div>
            <div id="autocomplete-hashtags-list"></div>
            <div class="autocomplete-section-title">Creators</div>
            <div id="autocomplete-users-list"></div>
          </div>
        </div>

        <div class="topbar-right">
          <!-- Mobile Quick Search Trigger -->
          <a href="#search" class="btn-icon mobile-search-btn" title="Search Diskrit" aria-label="Search">
            ${Diskrit.icons("search", "", 20)}
          </a>

          <!-- Unified Safe Mode Pill (Solves Flaw 2.4) -->
          <button 
            id="safe-mode-toggle-btn" 
            class="safe-mode-pill ${isSafe ? 'active' : 'inactive'}" 
            title="Toggle Safe Mode (Adult Content Filter)"
            aria-label="Safe Mode Filter"
          >
            ${Diskrit.icons(isSafe ? "shield" : "shieldAlert", "", 16)}
            <span class="safe-mode-label">Safe Mode: ${isSafe ? 'ON' : 'OFF'}</span>
          </button>

          <!-- Theme Mode Toggle -->
          <button id="theme-mode-toggle-btn" class="btn-icon" title="Toggle Light/Dark Mode" aria-label="Toggle Theme Mode">
            ${Diskrit.icons(Diskrit.theme.currentTheme === 'dark' ? 'sun' : 'moon', '', 20)}
          </button>

          <!-- Messages Link -->
          <a href="#chatify" class="btn-icon ${activeRoute.startsWith('chat') ? 'active' : ''}" title="Direct Messages & Channels" aria-label="Messages">
            ${Diskrit.icons("message", "", 20)}
          </a>

          <!-- Notifications Bell with Dropdown -->
          <div style="position: relative;">
            <button id="notifications-trigger-btn" class="btn-icon ${activeRoute === 'notifications' ? 'active' : ''}" title="Notifications" aria-label="Notifications">
              ${Diskrit.icons("bell", "", 20)}
              ${unreadCount > 0 ? `
                <span style="position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; border-radius: 50%; background: #ef4444; border: 2px solid var(--bg-surface);"></span>
              ` : ''}
            </button>
            <div id="notifications-dropdown-menu" class="dropdown-menu" style="width: 320px; right: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--border-subtle);">
                <span style="font-weight: 600; font-size: var(--font-sm);">Notifications</span>
                <span class="badge badge-primary">${unreadCount} New</span>
              </div>
              <div style="max-height: 280px; overflow-y: auto;">
                ${notifs.slice(0, 4).map(n => `
                  <a href="${n.targetUrl}" class="dropdown-item" style="gap: 12px; align-items: flex-start; padding: 10px 14px;">
                    <img src="${n.actorAvatar}" class="avatar avatar-sm" alt="${n.actorName}">
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                      <span style="font-size: var(--font-xs); color: var(--text-primary);">
                        <strong>${n.actorName}</strong> ${n.text}
                      </span>
                      <span style="font-size: 11px; color: var(--text-muted);">${n.time}</span>
                    </div>
                  </a>
                `).join('')}
              </div>
              <div class="dropdown-divider"></div>
              <a href="#notifications" class="dropdown-item" style="justify-content: center; font-weight: 600; color: var(--accent);">
                View all notifications
              </a>
            </div>
          </div>

          <!-- User Avatar Menu Dropdown -->
          <div style="position: relative;">
            <button id="user-menu-trigger-btn" style="border: none; background: none; cursor: pointer; padding: 0;" aria-label="User profile menu">
              <img src="${user.avatar}" class="avatar avatar-sm" style="border: 2px solid var(--border-medium);" alt="${user.name}">
            </button>
            <div id="user-profile-dropdown" class="dropdown-menu">
              <a href="#@${user.handle}" class="dropdown-item">
                ${Diskrit.icons("user", "", 18)}
                <span>Your Profile</span>
              </a>
              <a href="#creator/dashboard" class="dropdown-item">
                ${Diskrit.icons("barChart", "", 18)}
                <span>Creator Studio</span>
              </a>
              <a href="#settings" class="dropdown-item">
                ${Diskrit.icons("settings", "", 18)}
                <span>Settings & Account</span>
              </a>
              <a href="#superadmin/dashboard" class="dropdown-item">
                ${Diskrit.icons("activity", "", 18)}
                <span>Superadmin Portal</span>
              </a>
              <div class="dropdown-divider"></div>
              <a href="#legal/about" class="dropdown-item">
                ${Diskrit.icons("globe", "", 18)}
                <span>About & Legal</span>
              </a>
              <a href="#login" class="dropdown-item danger">
                ${Diskrit.icons("logOut", "", 18)}
                <span>Log Out</span>
              </a>
            </div>
          </div>
        </div>
      </header>
    `;
  },

  renderMobileNav(activeRoute = "home") {
    const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;
    return `
      <nav class="app-mobile-nav" aria-label="Mobile Navigation">
        <a href="#home" class="mobile-nav-item ${activeRoute === 'home' ? 'active' : ''}">
          ${Diskrit.icons("home", "", 22)}
          <span>Home</span>
        </a>
        <a href="#shorts" class="mobile-nav-item ${activeRoute === 'shorts' ? 'active' : ''}">
          ${Diskrit.icons("zap", "", 22)}
          <span>Shorts</span>
        </a>
        <a href="#posts/create" class="mobile-nav-create-btn" aria-label="Create Post">
          ${Diskrit.icons("plus", "", 24)}
        </a>
        <a href="#home?feed=video" class="mobile-nav-item ${activeRoute === 'video-feed' ? 'active' : ''}">
          ${Diskrit.icons("video", "", 22)}
          <span>Videos</span>
        </a>
        <a href="#@${user.handle}" class="mobile-nav-item ${activeRoute.startsWith('@') ? 'active' : ''}">
          <img src="${user.avatar}" class="avatar avatar-xs" alt="${user.name}">
          <span>Profile</span>
        </a>
      </nav>
    `;
  },

  attachEvents() {
    // 1. Safe Mode Toggle Event
    const safeBtn = document.getElementById("safe-mode-toggle-btn");
    if (safeBtn) {
      safeBtn.addEventListener("click", () => {
        const isCurrentSafe = Diskrit.theme.isSafeMode();
        if (isCurrentSafe) {
          // Turning Safe Mode OFF -> show 18+ Warning Modal!
          Diskrit.components.modals.showAdultWarningModal(() => {
            Diskrit.theme.setSafeMode(false);
            safeBtn.classList.remove("active");
            safeBtn.classList.add("inactive");
            safeBtn.querySelector("span").textContent = "Safe Mode: OFF";
            safeBtn.innerHTML = `
              ${Diskrit.icons("shieldAlert", "", 16)}
              <span>Safe Mode: OFF</span>
            `;
            Diskrit.components.modals.toast("Safe Mode disabled: Mature content unlocked", "info");
          });
        } else {
          // Turning Safe Mode ON -> Instant activation
          Diskrit.theme.setSafeMode(true);
          safeBtn.classList.remove("inactive");
          safeBtn.classList.add("active");
          safeBtn.innerHTML = `
            ${Diskrit.icons("shield", "", 16)}
            <span>Safe Mode: ON</span>
          `;
          Diskrit.components.modals.toast("Safe Mode activated: Mature content filtered", "success");
        }
      });
    }

    // 2. Theme Mode Toggle
    const modeBtn = document.getElementById("theme-mode-toggle-btn");
    if (modeBtn) {
      modeBtn.addEventListener("click", () => {
        const newMode = Diskrit.theme.toggleTheme();
        modeBtn.innerHTML = Diskrit.icons(newMode === 'dark' ? 'sun' : 'moon', '', 20);
        Diskrit.components.modals.toast(`Switched to ${newMode} mode`, "info");
      });
    }

    // 3. Notifications Bell Dropdown
    const notifBtn = document.getElementById("notifications-trigger-btn");
    const notifDropdown = document.getElementById("notifications-dropdown-menu");
    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle("open");
      });
    }

    // 4. User Profile Dropdown
    const userBtn = document.getElementById("user-menu-trigger-btn");
    const userDropdown = document.getElementById("user-profile-dropdown");
    if (userBtn && userDropdown) {
      userBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("open");
      });
    }

    // Close dropdowns on outside click
    document.addEventListener("click", () => {
      const themePopover = document.getElementById("theme-palette-popover");
      if (themePopover) themePopover.classList.remove("open");
      if (notifDropdown) notifDropdown.classList.remove("open");
      if (userDropdown) userDropdown.classList.remove("open");
      const autoDropdown = document.getElementById("search-autocomplete-dropdown");
      if (autoDropdown) autoDropdown.classList.remove("open");
    });

    // 5. Global Search Autocomplete (Solves Flaw 2.3)
    const searchInput = document.getElementById("global-search-input");
    const autoDropdown = document.getElementById("search-autocomplete-dropdown");
    const hashtagsContainer = document.getElementById("autocomplete-hashtags-list");
    const usersContainer = document.getElementById("autocomplete-users-list");

    if (searchInput && autoDropdown) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 1) {
          autoDropdown.classList.remove("open");
          return;
        }

        const matchedTags = Diskrit.mockData.trendingHashtags.filter(t => t.tag.toLowerCase().includes(query));
        const matchedUsers = Diskrit.mockData.users.concat(Diskrit.mockData.currentUser).filter(u => 
          u.name.toLowerCase().includes(query) || u.handle.toLowerCase().includes(query)
        );

        if (matchedTags.length === 0 && matchedUsers.length === 0) {
          autoDropdown.classList.remove("open");
          return;
        }

        hashtagsContainer.innerHTML = matchedTags.slice(0, 3).map(t => `
          <a href="#tags/${t.tag.replace('#', '')}" class="autocomplete-item">
            <span style="color: var(--accent); font-weight: 600;">${t.tag}</span>
            <span style="font-size: var(--font-xs); color: var(--text-muted); margin-left: auto;">${t.count}</span>
          </a>
        `).join('');

        usersContainer.innerHTML = matchedUsers.slice(0, 3).map(u => `
          <a href="#@${u.handle}" class="autocomplete-item">
            <img src="${u.avatar}" class="avatar avatar-sm" alt="${u.name}">
            <div style="display: flex; flex-direction: column;">
              <span style="font-weight: 600; font-size: var(--font-sm);">${u.name}</span>
              <span style="font-size: var(--font-xs); color: var(--text-muted);">@${u.handle}</span>
            </div>
          </a>
        `).join('');

        autoDropdown.classList.add("open");
      });

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const val = searchInput.value.trim();
          if (val) {
            autoDropdown.classList.remove("open");
            window.location.hash = `#search?q=${encodeURIComponent(val)}`;
          }
        }
      });
    }
  }
};
