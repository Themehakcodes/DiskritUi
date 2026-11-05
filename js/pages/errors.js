/**
 * DISKRIT UTILITY & ERROR SCREENS
 * Handles /posts/create dedicated page, 404 Not Found, 500 Error, and PWA Offline fallback
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.errors = {
  renderCreatePost() {
    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-5); max-width: 680px; margin: 0 auto; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="font-size: var(--font-2xl); font-weight: 800;">Create New Post</h1>
            <p style="font-size: var(--font-sm); color: var(--text-muted);">Share photos, loops, thoughts, or launch an anonymous discussion.</p>
          </div>
          <a href="#home" class="btn btn-secondary btn-sm">Cancel</a>
        </div>

        ${Diskrit.components.composer.renderComposer({ isExpanded: true })}
      </div>
    `;
  },

  renderNotFound(path = "") {
    return `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 60vh;">
        <div class="card" style="max-width: 440px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 48px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800;">
            404
          </div>
          <h1 style="font-size: var(--font-xl); font-weight: 800;">Page Not Found</h1>
          <p style="color: var(--text-muted); font-size: var(--font-sm);">
            The route <code>${path || 'requested'}</code> does not exist or may have been moved.
          </p>
          <a href="#home" class="btn btn-primary btn-lg" style="margin-top: 8px;">
            Return to Newsfeed
          </a>
        </div>
      </div>
    `;
  },

  renderServerError() {
    return `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 60vh;">
        <div class="card" style="max-width: 440px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 48px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); color: #ef4444; display: flex; align-items: center; justify-content: center;">
            ${Diskrit.icons("shieldAlert", "", 32)}
          </div>
          <h1 style="font-size: var(--font-xl); font-weight: 800;">500 Internal Error</h1>
          <p style="color: var(--text-muted); font-size: var(--font-sm);">
            An unexpected error occurred. Don't worry, Diskrit's telemetry has logged this incident.
          </p>
          <a href="#home" class="btn btn-primary" style="margin-top: 8px;">
            Return to Safety
          </a>
        </div>
      </div>
    `;
  },

  renderOffline() {
    return `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 60vh;">
        <div class="card" style="max-width: 440px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 48px;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--bg-surface-elevated); color: var(--text-muted); display: flex; align-items: center; justify-content: center;">
            ${Diskrit.icons("zap", "", 32)}
          </div>
          <h1 style="font-size: var(--font-xl); font-weight: 800;">You are currently offline</h1>
          <p style="color: var(--text-muted); font-size: var(--font-sm);">
            No internet connection detected. Saved items remain accessible in your offline PWA cache.
          </p>
          <button class="btn btn-primary" onclick="window.location.reload();">
            Retry Connection
          </button>
        </div>
      </div>
    `;
  },

  attachEvents(type = "create") {
    if (type === "create") {
      Diskrit.components.composer.attachEvents(() => {
        window.location.hash = "#home";
      });
    }
  }
};
