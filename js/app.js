/**
 * DISKRIT BOOTSTRAPPER & APPLICATION ENTRY POINT
 * Initializes modules, registers global events, and launches the router
 */

window.Diskrit = window.Diskrit || {};

Diskrit.app = {
  init() {
    // 1. Initialize persistent storage
    Diskrit.storage.init();

    // 2. Apply theme & accent
    Diskrit.theme.init();

    // 3. Initialize PWA Service Worker & Install Controller
    if (Diskrit.pwa) {
      Diskrit.pwa.init();
    }

    // 4. Listen for global Safe Mode toggles to dynamically update sensitive media on the active page
    document.addEventListener("diskrit:safemode-change", (e) => {
      const isSafe = e.detail.enabled;
      document.querySelectorAll(".post-card").forEach(card => {
        const id = card.dataset.id;
        const posts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
        const post = posts.find(p => p.id === id);
        if (post && post.isSensitive) {
          const mediaContainer = card.querySelector(".post-media-container");
          if (mediaContainer) {
            if (isSafe) {
              mediaContainer.classList.add("sensitive-content-guard");
              if (!mediaContainer.querySelector(".sensitive-overlay")) {
                const overlay = document.createElement("div");
                overlay.className = "sensitive-overlay";
                overlay.innerHTML = `
                  <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(245, 158, 11, 0.2); color: #f59e0b; display: flex; align-items: center; justify-content: center;">
                    ${Diskrit.icons("shieldAlert", "", 24)}
                  </div>
                  <div style="font-weight: 600; font-size: var(--font-sm); color: #ffffff;">Sensitive Content (18+)</div>
                  <div style="font-size: var(--font-xs); color: #cbd5e1; max-width: 320px;">
                    This post contains mature or sensitive visuals filtered by Safe Mode.
                  </div>
                  <button class="btn btn-secondary btn-sm bypass-sensitive-btn" data-id="${post.id}" style="margin-top: 6px;">
                    Show Content Anyway
                  </button>
                `;
                mediaContainer.appendChild(overlay);
                mediaContainer.querySelectorAll("img, video").forEach(el => el.classList.add("sensitive-blur"));
                overlay.querySelector(".bypass-sensitive-btn").addEventListener("click", () => {
                  overlay.remove();
                  mediaContainer.querySelectorAll(".sensitive-blur").forEach(el => el.classList.remove("sensitive-blur"));
                });
              }
            } else {
              mediaContainer.classList.remove("sensitive-content-guard");
              const overlay = mediaContainer.querySelector(".sensitive-overlay");
              if (overlay) overlay.remove();
              mediaContainer.querySelectorAll(".sensitive-blur").forEach(el => el.classList.remove("sensitive-blur"));
            }
          }
        }
      });

      if (Diskrit.masonry) {
        Diskrit.masonry.updateAll();
      }
    });

    // 4. Launch router
    Diskrit.router.init();
    Diskrit.router.handleRoute();
  }
};

// Start application when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => Diskrit.app.init());
} else {
  Diskrit.app.init();
}
