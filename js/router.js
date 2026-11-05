/**
 * DISKRIT CLIENT-SIDE ROUTER
 * Resolves all documented routes, dynamic patterns, and renders modular layout shells
 */

window.Diskrit = window.Diskrit || {};

Diskrit.router = {
  currentRoute: "",
  params: {},

  init() {
    window.addEventListener("hashchange", () => this.handleRoute());
    window.addEventListener("load", () => this.handleRoute());
    
    // Also listen to internal custom event
    document.addEventListener("diskrit:navigate", (e) => {
      window.location.hash = e.detail.route;
    });
  },

  navigate(route) {
    window.location.hash = route;
  },

  handleRoute() {
    try {
      let hash = window.location.hash.slice(1); // remove '#'
      if (!hash || hash === "/") {
        hash = "home";
      }

      // Split query string if any
      let [path, queryString] = hash.split("?");
      path = path.replace(/^\//, ''); // strip leading slash

      const queryParams = {};
      if (queryString) {
        new URLSearchParams(queryString).forEach((val, key) => {
          queryParams[key] = val;
        });
      }

      this.currentRoute = path;
      this.params = queryParams;

      this.resolve(path, queryParams);
    } catch (err) {
      console.error("[Diskrit Router Error]:", err);
      const root = document.getElementById("app-root");
      if (root) {
        root.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #000000; color: #fff; padding: 24px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <img src="assets/images/logo.png" style="width: 52px; margin-bottom: 16px;" alt="Diskrit">
            <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Refreshing Diskrit...</h2>
            <p style="color: #94a3b8; font-size: 14px; max-width: 420px; margin-bottom: 20px;">Applying the latest updates. Click below to load the feed immediately.</p>
            <button onclick="localStorage.removeItem('diskrit_posts'); if ('serviceWorker' in navigator) { navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())); } window.location.hash = 'home'; window.location.reload();" style="background: var(--accent, #f0644b); color: #fff; border: none; padding: 10px 24px; border-radius: 9999px; font-weight: 600; cursor: pointer; font-size: 14px;">
              Reload Fresh Feed
            </button>
          </div>
        `;
      }
    }
  },

  resolve(path, query) {
    const root = document.getElementById("app-root");
    if (!root) return;

    // Run active page cleanup callback (e.g. pause background videos, disconnect observers)
    if (Diskrit.cleanup) {
      Diskrit.cleanup();
      Diskrit.cleanup = null;
    }

    // Check for auth routes first (they render full-screen split layout without social shell)
    if (path === "login") {
      document.title = "Diskrit — Log In";
      root.innerHTML = Diskrit.pages.auth.render("login");
      Diskrit.pages.auth.attachEvents("login");
      return;
    }
    if (path === "register") {
      document.title = "Diskrit — Join & Create Account";
      root.innerHTML = Diskrit.pages.auth.render("register");
      Diskrit.pages.auth.attachEvents("register");
      return;
    }
    if (path === "forgot-password") {
      document.title = "Diskrit — Reset Password";
      root.innerHTML = Diskrit.pages.auth.render("forgot-password");
      Diskrit.pages.auth.attachEvents("forgot-password");
      return;
    }
    if (path.startsWith("reset-password")) {
      document.title = "Diskrit — New Password";
      root.innerHTML = Diskrit.pages.auth.render("forgot-password");
      Diskrit.pages.auth.attachEvents("forgot-password");
      return;
    }
    if (path === "two-factor-challenge") {
      document.title = "Diskrit — Two-Factor Verification";
      root.innerHTML = Diskrit.pages.auth.render("two-factor");
      Diskrit.pages.auth.attachEvents("two-factor");
      return;
    }
    if (path === "email/verify") {
      document.title = "Diskrit — Verify Email";
      root.innerHTML = Diskrit.pages.auth.render("email-verify");
      Diskrit.pages.auth.attachEvents("email-verify");
      return;
    }

    // App Shell Layout Configuration
    let pageHtml = "";
    let pageTitle = "Diskrit";
    let activeNav = "home";
    let layoutMode = "feed"; // "feed" | "full" | "wide" | "shorts"
    let showRightSidebar = false;
    let showDockedChat = false;
    let attachCallback = null;

    // 1. Home Feed / Video Feed
    if (path === "home" || path === "") {
      const isVideo = query.feed === "video";
      pageTitle = isVideo ? "Diskrit — Video Feed" : "Diskrit — Social Feed";
      activeNav = isVideo ? "video-feed" : "home";
      layoutMode = "feed";
      showRightSidebar = true;
      showDockedChat = true;
      pageHtml = Diskrit.pages.home.render(query);
      attachCallback = () => Diskrit.pages.home.attachEvents();
    }
    // 2. Shorts
    else if (path === "shorts") {
      pageTitle = "Diskrit — Shorts & Reels";
      activeNav = "shorts";
      layoutMode = "shorts";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.shorts.render();
      attachCallback = () => Diskrit.pages.shorts.attachEvents();
    }
    // 3. Dedicated Create Post
    else if (path === "posts/create") {
      pageTitle = "Diskrit — Create New Post";
      activeNav = "create";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.errors.renderCreatePost();
      attachCallback = () => Diskrit.pages.errors.attachEvents("create");
    }
    // 4. Single Post View & Analytics
    else if (path.startsWith("post/")) {
      const parts = path.split("/");
      if (parts[2] === "analytics") {
        pageTitle = "Diskrit — Post Analytics";
        layoutMode = "wide";
        showRightSidebar = false;
        showDockedChat = false;
        pageHtml = Diskrit.pages.postDetail.render({ id: parts[1], isAnalytics: true });
        attachCallback = () => Diskrit.pages.postDetail.attachEvents();
      } else {
        pageTitle = "Diskrit — Post";
        layoutMode = "feed";
        showRightSidebar = true;
        showDockedChat = true;
        pageHtml = Diskrit.pages.postDetail.render({ slug: parts[1] });
        attachCallback = () => Diskrit.pages.postDetail.attachEvents();
      }
    }
    // 5. User Profile (@handle)
    else if (path.startsWith("@")) {
      const handle = path.slice(1);
      pageTitle = `Diskrit — @${handle}`;
      activeNav = `@${handle}`;
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.profile.render({ handle });
      attachCallback = () => Diskrit.pages.profile.attachEvents();
    }
    // 6. Friends & Graph
    else if (path === "friends") {
      pageTitle = "Diskrit — Friends & Relationships";
      activeNav = "friends";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.friends.render();
      attachCallback = () => Diskrit.pages.friends.attachEvents();
    }
    // 7. Search & Hashtags
    else if (path === "search") {
      pageTitle = `Diskrit — Search "${query.q || ''}"`;
      activeNav = "search";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.search.render(query);
      attachCallback = () => Diskrit.pages.search.attachEvents();
    }
    else if (path.startsWith("tags/")) {
      const tag = path.replace("tags/", "");
      pageTitle = `Diskrit — #${tag}`;
      activeNav = "tags";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.search.render({ tag, feed: query.feed });
      attachCallback = () => Diskrit.pages.search.attachEvents();
    }
    // 8. Notifications
    else if (path === "notifications") {
      pageTitle = "Diskrit — Notifications";
      activeNav = "notifications";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.notifications.render();
      attachCallback = () => Diskrit.pages.notifications.attachEvents();
    }
    // 9. Saved Bookmarks Library
    else if (path === "saved" || path === "account/saved") {
      pageTitle = "Diskrit — Saved Library (21-Day)";
      activeNav = "saved";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.saved.render();
      attachCallback = () => Diskrit.pages.saved.attachEvents();
    }
    // 10. Settings & Account Hub
    else if (path.startsWith("settings") || path.startsWith("account") || path === "user/profile") {
      let sec = "profile";
      if (path.includes("password")) sec = "security";
      else if (path.includes("privacy")) sec = "privacy";
      else if (path === "user/profile") sec = "sessions";
      pageTitle = "Diskrit — Settings & Preferences";
      activeNav = "settings";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.settings.render({ section: sec });
      attachCallback = () => Diskrit.pages.settings.attachEvents();
    }
    // 11. Chatify Messenger & Channels (Full Layout - Solves 4-column squeeze)
    else if (path.startsWith("chatify")) {
      pageTitle = "Diskrit — Messenger & Channels";
      activeNav = "chat";
      layoutMode = "full";
      showRightSidebar = false; // NEVER squeeze chat with discovery sidebar
      showDockedChat = false;   // NEVER render mini docked chat inside full chat page
      const parts = path.split("/");
      if (parts[1] === "channels" && parts[2] === "join") {
        pageHtml = Diskrit.pages.chat.render({ token: parts[3] });
      } else if (parts[1] === "channel") {
        pageHtml = Diskrit.pages.chat.render({ channelId: parts[2] });
      } else if (parts[1]) {
        pageHtml = Diskrit.pages.chat.render({ id: parts[1] });
      } else {
        pageHtml = Diskrit.pages.chat.render();
      }
      attachCallback = () => Diskrit.pages.chat.attachEvents();
    }
    // 12. Superadmin & Ad Network Portal (Wide Layout)
    else if (path.startsWith("superadmin/ad-websites")) {
      pageTitle = "Diskrit — Ad Network Studio";
      activeNav = "superadmin";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      const parts = path.split("/");
      if (parts[2] === "create") {
        pageHtml = Diskrit.pages.admin.render("ad-websites", { isCreate: true });
      } else if (parts[2]) {
        pageHtml = Diskrit.pages.admin.render("ad-websites", { id: parts[2] });
      } else {
        pageHtml = Diskrit.pages.admin.render("ad-websites");
      }
      attachCallback = () => Diskrit.pages.admin.attachEvents("ad-websites");
    }
    else if (path.startsWith("superadmin/")) {
      const sub = path.replace("superadmin/", "");
      pageTitle = `Diskrit Superadmin — ${sub.toUpperCase()}`;
      activeNav = "superadmin";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.admin.render(sub);
      attachCallback = () => Diskrit.pages.admin.attachEvents(sub);
    }
    // 13. Creator Studio & Role Dashboards
    else if (path === "creator/dashboard") {
      pageTitle = "Diskrit — Creator Studio";
      activeNav = "creator";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.creator.render("creator");
      attachCallback = () => Diskrit.pages.creator.attachEvents();
    }
    else if (path === "admin/dashboard") {
      pageTitle = "Diskrit — Admin Dashboard";
      activeNav = "admin";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.creator.render("admin");
      attachCallback = () => Diskrit.pages.creator.attachEvents();
    }
    else if (path === "admin/roles/form") {
      pageTitle = "Diskrit — Assign Roles";
      activeNav = "admin";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.creator.render("roles_form");
      attachCallback = () => Diskrit.pages.creator.attachEvents();
    }
    else if (path === "user/dashboard") {
      pageTitle = "Diskrit — User Portal";
      activeNav = "user";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.creator.render("user");
      attachCallback = () => Diskrit.pages.creator.attachEvents();
    }
    // 14. Public & Legal Documents
    else if (path.startsWith("legal/") || ["about", "terms-of-service", "privacy-policy", "cookie-policy", "acceptable-use", "disclaimer", "accessibility"].includes(path)) {
      const doc = path.startsWith("legal/") ? path.replace("legal/", "") : path.replace("-of-service", "").replace("-policy", "");
      pageTitle = `Diskrit — ${doc.toUpperCase()}`;
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.legal.render(doc);
      attachCallback = () => Diskrit.pages.legal.attachEvents();
    }
    // 15. Offline Fallback & 500
    else if (path === "offline") {
      pageTitle = "Diskrit — Offline Mode";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.errors.renderOffline();
    }
    else if (path === "500") {
      pageTitle = "Diskrit — Server Error";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.errors.renderServerError();
    }
    // 16. 404 Fallback
    else {
      pageTitle = "Diskrit — Page Not Found";
      layoutMode = "wide";
      showRightSidebar = false;
      showDockedChat = false;
      pageHtml = Diskrit.pages.errors.renderNotFound(path);
    }

    document.title = pageTitle;

    // Render Clean Modular Shared Shell with Appropriate Layout Mode
    root.innerHTML = `
      <div class="app-shell">
        ${Diskrit.components.navbar.renderTopNav(activeNav)}
        <div class="app-container layout-${layoutMode}">
          ${Diskrit.components.sidebar.renderLeftNav(activeNav)}
          <main class="app-main-feed" id="app-main-content">
            ${pageHtml}
          </main>
          ${showRightSidebar ? Diskrit.components.sidebar.renderRightSidebar() : ''}
        </div>
        ${showDockedChat ? Diskrit.components.sidebar.renderDockedChat() : ''}
        ${Diskrit.components.navbar.renderMobileNav(activeNav)}
      </div>
    `;

    // Attach listeners for shared shell
    Diskrit.components.navbar.attachEvents();
    Diskrit.components.sidebar.attachEvents();

    // Attach page-specific listeners
    if (attachCallback) attachCallback();

    // Auto-pack any masonry grid views on the newly rendered page
    if (Diskrit.masonry && Diskrit.masonry.updateAll) {
      Diskrit.masonry.updateAll();
    }

    window.scrollTo({ top: 0, behavior: "instant" });
  }
};
