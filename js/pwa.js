/**
 * DISKRIT PWA (PROGRESSIVE WEB APP) CONTROLLER
 * Manages ServiceWorker lifecycle, beforeinstallprompt capture,
 * custom installation modal guide, and network status notifications.
 */

window.Diskrit = window.Diskrit || {};

Diskrit.pwa = {
  deferredPrompt: null,
  isInstalled: false,

  init() {
    this.registerServiceWorker();
    this.listenForInstallPrompt();
    this.listenForAppInstalled();
    this.listenForNetworkStatus();
  },

  // 1. Register Service Worker
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js', { scope: './' })
          .then((reg) => {
            console.log('[Diskrit PWA] Service Worker active with scope:', reg.scope);
            // Check for updates periodically
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    Diskrit.components.modals.toast('New Diskrit version available! Reloading...', 'info');
                    setTimeout(() => window.location.reload(), 1500);
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.warn('[Diskrit PWA] Service Worker registration failed:', err);
          });
      });
    }
  },

  // 2. Capture beforeinstallprompt event
  listenForInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      console.log('[Diskrit PWA] beforeinstallprompt captured and ready.');

      // Update any visible install buttons to active/ready state
      document.querySelectorAll('#pwa-install-btn, .pwa-install-trigger').forEach(btn => {
        btn.classList.add('ready-to-install');
        btn.setAttribute('title', 'Install Diskrit to your homescreen');
      });
    });
  },

  // 3. Listen for successful installation
  listenForAppInstalled() {
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.isInstalled = true;
      console.log('[Diskrit PWA] Diskrit was installed successfully.');
      Diskrit.components.modals.toast('🎉 Diskrit was installed! Launch it anytime from your homescreen or desktop.', 'success');

      document.querySelectorAll('#pwa-install-btn, .pwa-install-trigger').forEach(btn => {
        btn.style.display = 'none';
      });
    });

    // Check if running in standalone mode already
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      this.isInstalled = true;
      document.querySelectorAll('#pwa-install-btn, .pwa-install-trigger').forEach(btn => {
        btn.style.display = 'none';
      });
    }
  },

  // 4. Online / Offline network status notifications
  listenForNetworkStatus() {
    window.addEventListener('online', () => {
      Diskrit.components.modals.toast('🌐 Back online! Connected to Diskrit network.', 'success');
      const banner = document.getElementById('offline-network-banner');
      if (banner) banner.remove();
    });

    window.addEventListener('offline', () => {
      Diskrit.components.modals.toast('⚠️ You are offline. Diskrit is serving cached posts & offline mode.', 'info');
      this.showOfflineBanner();
    });
  },

  showOfflineBanner() {
    if (document.getElementById('offline-network-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'offline-network-banner';
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #f59e0b;
      color: #000000;
      text-align: center;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 700;
      z-index: 10001;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    `;
    banner.textContent = '⚡ Offline Mode Active — Showing cached Diskrit content';
    document.body.prepend(banner);
  },

  // 5. Trigger PWA Installation prompt or Guide Modal
  promptInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          Diskrit.components.modals.toast('Installing Diskrit PWA...', 'success');
        } else {
          Diskrit.components.modals.toast('Installation postponed.', 'info');
        }
        this.deferredPrompt = null;
      });
    } else {
      // Show Device-Specific Installation Guide Modal
      this.showInstallGuideModal();
    }
  },

  // 6. Device-Specific Guide Modal (Safari, Android, Desktop)
  showInstallGuideModal() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let instructionsHtml = '';

    if (isIOS) {
      instructionsHtml = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: gap: 12px; align-items: flex-start; display: flex;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">1</div>
            <div style="font-size: var(--font-sm); line-height: 1.5; color: var(--text-primary);">
              Tap the <strong>Share button</strong> <span style="font-size: 16px;">⎋</span> at the bottom of Safari.
            </div>
          </div>
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">2</div>
            <div style="font-size: var(--font-sm); line-height: 1.5; color: var(--text-primary);">
              Scroll down and tap <strong>"Add to Home Screen"</strong> <span style="font-size: 16px;">➕</span>.
            </div>
          </div>
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">3</div>
            <div style="font-size: var(--font-sm); line-height: 1.5; color: var(--text-primary);">
              Tap <strong>"Add"</strong> in the top right. Diskrit will appear as an app icon!
            </div>
          </div>
        </div>
      `;
    } else if (isAndroid) {
      instructionsHtml = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">1</div>
            <div style="font-size: var(--font-sm); line-height: 1.5; color: var(--text-primary);">
              Tap the <strong>Menu icon</strong> <span style="font-weight: 700;">⋮</span> in the top right of Chrome.
            </div>
          </div>
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">2</div>
            <div style="font-size: var(--font-sm); line-height: 1.5; color: var(--text-primary);">
              Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
            </div>
          </div>
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">3</div>
            <div style="font-size: var(--font-sm); line-height: 1.5; color: var(--text-primary);">
              Confirm the install prompt. Diskrit launches full-screen!
            </div>
          </div>
        </div>
      `;
    } else {
      // Desktop (Chrome, Edge, Brave)
      instructionsHtml = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">1</div>
            <div style="font-size: var(--font-sm); line-height: 1.5; color: var(--text-primary);">
              Look at your browser's address bar and click the <strong>Install icon</strong> ⊕ (right side).
            </div>
          </div>
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">2</div>
            <div style="font-size: var(--font-sm); line-height: 1.5; color: var(--text-primary);">
              Or click your browser's menu <strong>(⋮ or …)</strong> &gt; <strong>"Install Diskrit..."</strong>.
            </div>
          </div>
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">3</div>
            <div style="font-size: var(--font-sm); line-height: 1.5; color: var(--text-primary);">
              Enjoy a dedicated window, faster loads, and offline support!
            </div>
          </div>
        </div>
      `;
    }

    const bodyHtml = `
      <div style="display: flex; flex-direction: column; gap: var(--space-4); text-align: left;">
        <div style="display: flex; align-items: center; gap: 16px; padding: 12px; background: var(--bg-surface-elevated); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <img src="assets/icons/favicon-192.png" style="width: 54px; height: 54px; border-radius: var(--radius-lg); object-fit: contain; background: #000; border: 1px solid var(--border-medium);" alt="Diskrit">
          <div>
            <div style="font-weight: 700; font-size: var(--font-base); color: var(--text-primary);">Diskrit App</div>
            <div style="font-size: var(--font-xs); color: var(--text-muted); margin-top: 2px;">Offline Ready &bull; Standalone Window &bull; Fast Sync</div>
          </div>
        </div>

        <div style="font-weight: 600; font-size: var(--font-sm); color: var(--text-primary);">How to Install:</div>
        ${instructionsHtml}
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary modal-cancel-btn">Close</button>
      <button class="btn btn-primary modal-test-install-btn">Got It!</button>
    `;

    const modal = Diskrit.components.modals.openModal("Install Diskrit PWA", bodyHtml, footerHtml);
    modal.backdrop.querySelector(".modal-cancel-btn").addEventListener("click", () => modal.close());
    modal.backdrop.querySelector(".modal-test-install-btn").addEventListener("click", () => {
      modal.close();
      Diskrit.components.modals.toast("Diskrit is ready on your device!", "success");
    });
  }
};

