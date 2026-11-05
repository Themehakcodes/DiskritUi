/**
 * DISKRIT MODAL & TOAST DIALOG SYSTEM
 * Reusable modal windows, demographic pill selectors, and toast notifications
 */

window.Diskrit = window.Diskrit || {};
Diskrit.components = Diskrit.components || {};

Diskrit.components.modals = {
  // Toast notifications
  toast(message, type = "info") {
    let container = document.getElementById("diskrit-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "diskrit-toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let iconName = "sparkles";
    if (type === "success") iconName = "check";
    if (type === "error") iconName = "shieldAlert";

    toast.innerHTML = `
      ${Diskrit.icons(iconName, `text-${type}`, 18)}
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  },

  // Generic modal launcher
  openModal(title, bodyHtml, footerHtml) {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop open";
    backdrop.innerHTML = `
      <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-header">
          <h2 id="modal-title" class="modal-title">${title}</h2>
          <button class="btn-icon modal-close-btn" aria-label="Close dialog">
            ${Diskrit.icons("x", "", 20)}
          </button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ""}
      </div>
    `;

    document.body.appendChild(backdrop);

    const close = () => {
      backdrop.classList.remove("open");
      setTimeout(() => backdrop.remove(), 200);
    };

    backdrop.querySelector(".modal-close-btn").addEventListener("click", close);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) close();
    });

    return { backdrop, close };
  },

  // Flaw 2.4: Safe Mode 18+ Adult Warning Confirmation Modal
  showAdultWarningModal(onConfirm) {
    const bodyHtml = `
      <div style="display: flex; gap: 16px; align-items: flex-start;">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); color: #ef4444; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          ${Diskrit.icons("shieldAlert", "", 24)}
        </div>
        <div>
          <p style="font-weight: 600; color: var(--text-primary); margin-bottom: 8px;">Age Verification & Mature Content Warning</p>
          <p style="color: var(--text-secondary); font-size: var(--font-sm); line-height: 1.5;">
            You are turning <strong>Safe Mode OFF</strong>. The platform will now reveal sensitive, 18+ adult, and uncensored content.
          </p>
          <p style="color: var(--text-muted); font-size: var(--font-xs); margin-top: 8px;">
            By confirming, you certify that you are at least 18 years of age or the age of legal majority in your jurisdiction.
          </p>
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary modal-cancel-btn">Keep Safe Mode ON</button>
      <button class="btn btn-danger modal-confirm-btn">I am 18+ (Disable Safe Mode)</button>
    `;

    const modal = this.openModal("Disable Safe Mode Filter?", bodyHtml, footerHtml);

    modal.backdrop.querySelector(".modal-cancel-btn").addEventListener("click", () => {
      modal.close();
    });

    modal.backdrop.querySelector(".modal-confirm-btn").addEventListener("click", () => {
      modal.close();
      if (onConfirm) onConfirm();
    });
  },

  // Flaw 5.3: Demographic Searchable Pill Selector Modal
  showPillTagModal(title, categoryKey, onSelected) {
    const list = Diskrit.mockData.demographics[categoryKey] || [];
    const currentVal = Diskrit.storage.get("currentUser")[categoryKey === "orientations" ? "orientation" : "identityRole"];

    const bodyHtml = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="font-size: var(--font-sm); color: var(--text-muted);">
          Search and select from community identity attributes. Your selection helps connect you with like-minded creators.
        </p>
        <div class="search-input-wrapper">
          <span class="search-input-icon">${Diskrit.icons("search", "", 16)}</span>
          <input type="text" id="pill-search-input" class="form-input" placeholder="Search options..." style="padding-left: 2.4rem;">
        </div>
        <div class="pill-grid" id="pill-selection-container">
          ${list.map(item => `
            <div class="pill-tag ${item.toLowerCase() === (currentVal || '').toLowerCase() ? 'selected' : ''}" data-value="${item}">
              ${item}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary modal-cancel-btn">Cancel</button>
      <button class="btn btn-primary modal-save-btn">Apply Selection</button>
    `;

    const modal = this.openModal(title, bodyHtml, footerHtml);
    let selectedValue = currentVal;

    const container = modal.backdrop.querySelector("#pill-selection-container");
    container.addEventListener("click", (e) => {
      const pill = e.target.closest(".pill-tag");
      if (!pill) return;
      container.querySelectorAll(".pill-tag").forEach(p => p.classList.remove("selected"));
      pill.classList.add("selected");
      selectedValue = pill.dataset.value;
    });

    const searchInput = modal.backdrop.querySelector("#pill-search-input");
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      container.querySelectorAll(".pill-tag").forEach(pill => {
        const matches = pill.dataset.value.toLowerCase().includes(q);
        pill.style.display = matches ? "inline-flex" : "none";
      });
    });

    modal.backdrop.querySelector(".modal-cancel-btn").addEventListener("click", () => modal.close());
    modal.backdrop.querySelector(".modal-save-btn").addEventListener("click", () => {
      modal.close();
      if (onSelected && selectedValue) onSelected(selectedValue);
    });
  },

  // Flaw 3.4 & Admin: Hide Post with Formal Reason Modal
  showHidePostModal(postId, onConfirm) {
    const bodyHtml = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <p style="font-size: var(--font-sm); color: var(--text-secondary);">
          Specify the administrative reason for hiding post <strong>#${postId}</strong> from public discovery:
        </p>
        <div class="form-group">
          <label class="form-label">Violation Category</label>
          <select id="hide-reason-select" class="form-select">
            <option value="Spam / Automated Bots">Spam / Automated Bots</option>
            <option value="Hate Speech or Harassment">Hate Speech or Harassment</option>
            <option value="Unmarked Adult / Explicit Media">Unmarked Adult / Explicit Media</option>
            <option value="Copyright / DMCA Violation">Copyright / DMCA Violation</option>
            <option value="Misinformation / Malicious Links">Misinformation / Malicious Links</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Internal Audit Notes</label>
          <textarea id="hide-reason-notes" class="form-textarea" placeholder="Provide context for moderation logs..."></textarea>
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary modal-cancel-btn">Cancel</button>
      <button class="btn btn-danger modal-hide-submit-btn">Confirm & Hide Post</button>
    `;

    const modal = this.openModal("Moderate Content: Hide Post", bodyHtml, footerHtml);

    modal.backdrop.querySelector(".modal-cancel-btn").addEventListener("click", () => modal.close());
    modal.backdrop.querySelector(".modal-hide-submit-btn").addEventListener("click", () => {
      const reason = modal.backdrop.querySelector("#hide-reason-select").value;
      const notes = modal.backdrop.querySelector("#hide-reason-notes").value;
      modal.close();
      if (onConfirm) onConfirm(reason, notes);
    });
  },

  // Channel Creation Modal
  showCreateChannelModal(onCreated) {
    const bodyHtml = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="form-group">
          <label class="form-label">Channel Name</label>
          <input type="text" id="new-channel-name" class="form-input" placeholder="e.g. generative-audio-lab">
        </div>
        <div class="form-group">
          <label class="form-label">Description / Topic</label>
          <textarea id="new-channel-desc" class="form-textarea" placeholder="What is this channel about?"></textarea>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-top: 1px solid var(--border-subtle);">
          <div>
            <div style="font-weight: 600; font-size: var(--font-sm);">Private Channel</div>
            <div style="font-size: var(--font-xs); color: var(--text-muted);">Only users with invite link can view and join</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="new-channel-private">
            <span class="switch-slider"></span>
          </label>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-top: 1px solid var(--border-subtle);">
          <div>
            <div style="font-weight: 600; font-size: var(--font-sm);">Announcement Only</div>
            <div style="font-size: var(--font-xs); color: var(--text-muted);">Only channel owners can post messages</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="new-channel-announcement">
            <span class="switch-slider"></span>
          </label>
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary modal-cancel-btn">Cancel</button>
      <button class="btn btn-primary modal-create-channel-btn">Create Channel</button>
    `;

    const modal = this.openModal("Create New Chat Channel", bodyHtml, footerHtml);

    modal.backdrop.querySelector(".modal-cancel-btn").addEventListener("click", () => modal.close());
    modal.backdrop.querySelector(".modal-create-channel-btn").addEventListener("click", () => {
      const name = modal.backdrop.querySelector("#new-channel-name").value.trim();
      const desc = modal.backdrop.querySelector("#new-channel-desc").value.trim();
      const isPrivate = modal.backdrop.querySelector("#new-channel-private").checked;
      const isAnnouncement = modal.backdrop.querySelector("#new-channel-announcement").checked;

      if (!name) {
        Diskrit.components.modals.toast("Please enter a channel name", "error");
        return;
      }

      modal.close();
      if (onCreated) onCreated({ name, desc, isPrivate, isAnnouncement });
    });
  },

  // Interactive Fullscreen Stories Viewer Modal
  openStoryViewer(initialStoryId) {
    const stories = Diskrit.mockData.stories;
    if (!stories || stories.length === 0) {
      this.toast("No stories available right now", "info");
      return;
    }

    let currentIndex = stories.findIndex(s => s.id === initialStoryId);
    if (currentIndex < 0) currentIndex = 0;

    let isPaused = false;
    let progress = 0; // 0 to 100
    const storyDuration = 5000; // 5 seconds per story
    let animFrameId = null;
    let lastTime = null;
    let isHolding = false;
    let isDestroyed = false;

    // Build the modal markup
    const viewerModal = document.createElement("div");
    viewerModal.id = "diskrit-story-viewer-modal";
    viewerModal.className = "story-viewer-modal";
    viewerModal.setAttribute("role", "dialog");
    viewerModal.setAttribute("aria-modal", "true");
    viewerModal.setAttribute("aria-label", "Story Carousel Viewer");

    viewerModal.innerHTML = `
      <div class="story-viewer-backdrop-ambient"></div>
      <div class="story-viewer-backdrop-scrim"></div>

      <!-- Desktop Nav Arrows outside card -->
      <button class="story-desktop-nav-btn prev" id="story-desktop-prev" aria-label="Previous story" title="Previous Story (Left Arrow)">
        ${Diskrit.icons("chevronLeft", "", 24)}
      </button>
      <button class="story-desktop-nav-btn next" id="story-desktop-next" aria-label="Next story" title="Next Story (Right Arrow)">
        ${Diskrit.icons("chevronRight", "", 24)}
      </button>

      <!-- Main Story Container -->
      <div class="story-viewer-container" id="story-viewer-container">
        <!-- Progress Bar Segments -->
        <div class="story-progress-bar-row" id="story-progress-row">
          ${stories.map((s, idx) => `
            <div class="story-progress-segment" data-idx="${idx}">
              <div class="story-progress-fill" style="width: ${idx < currentIndex ? '100%' : '0%'}"></div>
            </div>
          `).join('')}
        </div>

        <!-- Top Header Overlay -->
        <div class="story-header-overlay">
          <div class="story-user-info" id="story-user-info" title="View profile">
            <img src="${stories[currentIndex].userAvatar}" class="story-header-avatar" id="story-header-avatar" alt="${stories[currentIndex].userName}">
            <div class="story-header-meta">
              <div class="story-header-author-row">
                <span class="story-header-author" id="story-header-author">${stories[currentIndex].userName}</span>
                <span class="story-own-badge" id="story-own-badge" style="${stories[currentIndex].isOwn ? 'display: inline-block;' : 'display: none;'}">You</span>
              </div>
              <span class="story-header-time" id="story-header-time">${stories[currentIndex].time || 'Recent'}</span>
            </div>
          </div>
          <div class="story-header-actions">
            <button class="story-action-btn" id="story-pause-btn" aria-label="Pause or play story" title="Pause / Play (Space)">
              <span id="story-pause-icon">${Diskrit.icons("pause", "", 16)}</span>
            </button>
            <button class="story-action-btn" id="story-close-btn" aria-label="Close story viewer" title="Close (Esc)">
              ${Diskrit.icons("x", "", 18)}
            </button>
          </div>
        </div>

        <!-- Media & Caption View -->
        <div class="story-media-view" id="story-media-view">
          <img src="${stories[currentIndex].mediaUrl}" class="story-media-img" id="story-media-img" alt="Story Media">
          <div class="story-media-gradient-overlay"></div>
          <div class="story-caption-overlay" id="story-caption-overlay" style="${stories[currentIndex].caption ? 'display: block;' : 'display: none;'}">
            <p class="story-caption-text" id="story-caption-text">${stories[currentIndex].caption || ''}</p>
          </div>
        </div>

        <!-- Tap Navigation Zones -->
        <div class="story-nav-tap-left" id="story-tap-left" aria-label="Previous slide"></div>
        <div class="story-nav-tap-right" id="story-tap-right" aria-label="Next slide"></div>

        <!-- Floating Reactions Canvas -->
        <div class="story-reactions-canvas" id="story-reactions-canvas"></div>

        <!-- Bottom Actions & Reply Bar -->
        <div class="story-footer-bar">
          <div class="story-quick-emojis">
            <button class="story-emoji-btn" data-emoji="❤️" title="Love">❤️</button>
            <button class="story-emoji-btn" data-emoji="🔥" title="Fire">🔥</button>
            <button class="story-emoji-btn" data-emoji="👏" title="Applause">👏</button>
            <button class="story-emoji-btn" data-emoji="😮" title="Wow">😮</button>
            <button class="story-emoji-btn" data-emoji="😂" title="Laugh">😂</button>
            <button class="story-emoji-btn" data-emoji="🚀" title="Rocket">🚀</button>
          </div>
          <form class="story-reply-row" id="story-reply-form">
            <input 
              type="text" 
              class="story-reply-input" 
              id="story-reply-input" 
              placeholder="Reply to ${stories[currentIndex].userName}..." 
              autocomplete="off"
            >
            <button type="submit" class="story-send-reply-btn" aria-label="Send reply">
              ${Diskrit.icons("send", "", 16)}
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(viewerModal);
    requestAnimationFrame(() => viewerModal.classList.add("open"));

    // DOM Elements
    const backdropAmbient = viewerModal.querySelector(".story-viewer-backdrop-ambient");
    const container = viewerModal.querySelector("#story-viewer-container");
    const avatarImg = viewerModal.querySelector("#story-header-avatar");
    const authorName = viewerModal.querySelector("#story-header-author");
    const ownBadge = viewerModal.querySelector("#story-own-badge");
    const timeText = viewerModal.querySelector("#story-header-time");
    const mediaImg = viewerModal.querySelector("#story-media-img");
    const captionOverlay = viewerModal.querySelector("#story-caption-overlay");
    const captionText = viewerModal.querySelector("#story-caption-text");
    const pauseBtn = viewerModal.querySelector("#story-pause-btn");
    const pauseIcon = viewerModal.querySelector("#story-pause-icon");
    const closeBtn = viewerModal.querySelector("#story-close-btn");
    const prevBtn = viewerModal.querySelector("#story-desktop-prev");
    const nextBtn = viewerModal.querySelector("#story-desktop-next");
    const tapLeft = viewerModal.querySelector("#story-tap-left");
    const tapRight = viewerModal.querySelector("#story-tap-right");
    const replyForm = viewerModal.querySelector("#story-reply-form");
    const replyInput = viewerModal.querySelector("#story-reply-input");
    const reactionsCanvas = viewerModal.querySelector("#story-reactions-canvas");
    const segments = viewerModal.querySelectorAll(".story-progress-segment");

    function updateStoryView() {
      const story = stories[currentIndex];
      backdropAmbient.style.backgroundImage = `url("${story.mediaUrl}")`;
      mediaImg.style.opacity = "0.7";
      setTimeout(() => {
        mediaImg.src = story.mediaUrl;
        mediaImg.style.opacity = "1";
      }, 100);

      avatarImg.src = story.userAvatar;
      authorName.textContent = story.userName;
      ownBadge.style.display = story.isOwn ? "inline-block" : "none";
      timeText.textContent = story.time || "Recent";
      
      if (story.caption) {
        captionText.textContent = story.caption;
        captionOverlay.style.display = "block";
      } else {
        captionOverlay.style.display = "none";
      }

      replyInput.placeholder = `Reply to ${story.userName}...`;
      replyInput.value = "";

      // Sync progress bars
      segments.forEach((seg, idx) => {
        const fill = seg.querySelector(".story-progress-fill");
        if (idx < currentIndex) {
          fill.style.width = "100%";
        } else if (idx > currentIndex) {
          fill.style.width = "0%";
        } else {
          fill.style.width = `${progress}%`;
        }
      });
    }

    function goToStory(newIdx) {
      if (newIdx < 0) {
        progress = 0;
        updateStoryView();
        return;
      }
      if (newIdx >= stories.length) {
        closeViewer();
        return;
      }
      currentIndex = newIdx;
      progress = 0;
      lastTime = performance.now();
      updateStoryView();
    }

    function spawnReaction(emoji) {
      if (!reactionsCanvas) return;
      for (let i = 0; i < 5; i++) {
        const p = document.createElement("div");
        p.className = "story-floating-particle";
        p.textContent = emoji;
        const leftPercent = 15 + Math.random() * 70;
        const drift = (Math.random() - 0.5) * 80;
        const scale = 0.85 + Math.random() * 0.45;
        const delay = i * 65;

        p.style.left = `${leftPercent}%`;
        p.style.setProperty("--drift", `${drift}px`);
        p.style.setProperty("--scale", scale);
        p.style.animationDelay = `${delay}ms`;

        reactionsCanvas.appendChild(p);
        setTimeout(() => p.remove(), 1400);
      }
    }

    function togglePause(forced) {
      if (forced !== undefined) {
        isPaused = forced;
      } else {
        isPaused = !isPaused;
      }
      pauseIcon.innerHTML = isPaused 
        ? Diskrit.icons("play", "", 16) 
        : Diskrit.icons("pause", "", 16);
      if (!isPaused) {
        lastTime = performance.now();
      }
    }

    function loop(time) {
      if (isDestroyed) return;
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      if (!isPaused && !isHolding) {
        progress += (delta / storyDuration) * 100;
        const activeFill = segments[currentIndex]?.querySelector(".story-progress-fill");
        if (activeFill) {
          activeFill.style.width = `${Math.min(progress, 100)}%`;
        }

        if (progress >= 100) {
          goToStory(currentIndex + 1);
        }
      }

      animFrameId = requestAnimationFrame(loop);
    }

    // Start animation loop
    updateStoryView();
    animFrameId = requestAnimationFrame(loop);

    function closeViewer() {
      if (isDestroyed) return;
      isDestroyed = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      document.removeEventListener("keydown", onKeyDown);
      viewerModal.classList.remove("open");
      setTimeout(() => viewerModal.remove(), 250);
    }

    // Keydown listener
    function onKeyDown(e) {
      if (e.key === "Escape") {
        closeViewer();
      } else if (e.key === "ArrowLeft") {
        goToStory(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        goToStory(currentIndex + 1);
      } else if (e.key === " " && document.activeElement !== replyInput) {
        e.preventDefault();
        togglePause();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    // Click events
    closeBtn.addEventListener("click", closeViewer);
    pauseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePause();
    });
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      goToStory(currentIndex - 1);
    });
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      goToStory(currentIndex + 1);
    });
    tapLeft.addEventListener("click", () => goToStory(currentIndex - 1));
    tapRight.addEventListener("click", () => goToStory(currentIndex + 1));

    // Hold down to pause on desktop & mobile
    const mediaView = viewerModal.querySelector("#story-media-view");
    mediaView.addEventListener("mousedown", () => { isHolding = true; });
    window.addEventListener("mouseup", () => {
      if (isHolding) {
        isHolding = false;
        lastTime = performance.now();
      }
    });

    // Touch swipe gestures
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    container.addEventListener("touchstart", (e) => {
      if (e.target.closest(".story-footer-bar") || e.target.closest(".story-header-actions")) return;
      isHolding = true;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    container.addEventListener("touchend", (e) => {
      isHolding = false;
      lastTime = performance.now();
      if (e.changedTouches.length === 0) return;
      const touch = e.changedTouches[0];
      const diffX = touch.clientX - touchStartX;
      const diffY = touch.clientY - touchStartY;
      const elapsed = Date.now() - touchStartTime;

      // Swipe down to dismiss
      if (diffY > 80 && Math.abs(diffY) > Math.abs(diffX) && elapsed < 400) {
        closeViewer();
        return;
      }
      // Swipe horizontal
      if (Math.abs(diffX) > 45 && elapsed < 400) {
        if (diffX < 0) {
          goToStory(currentIndex + 1);
        } else {
          goToStory(currentIndex - 1);
        }
      }
    }, { passive: true });

    // Emoji reaction buttons
    viewerModal.querySelectorAll(".story-emoji-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const emoji = btn.dataset.emoji;
        spawnReaction(emoji);
        Diskrit.components.modals.toast(`Reacted ${emoji} to ${stories[currentIndex].userName}!`, "success");
      });
    });

    // Reply form
    replyInput.addEventListener("focus", () => togglePause(true));
    replyInput.addEventListener("blur", () => {
      if (isPaused) togglePause(false);
    });
    replyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = replyInput.value.trim();
      if (!text) return;
      spawnReaction("💬");
      Diskrit.components.modals.toast(`Reply sent to ${stories[currentIndex].userName}: "${text}"`, "success");
      replyInput.value = "";
      replyInput.blur();
      togglePause(false);
    });

    // Backdrop click dismisses
    viewerModal.addEventListener("click", (e) => {
      if (e.target === viewerModal || e.target.classList.contains("story-viewer-backdrop-scrim")) {
        closeViewer();
      }
    });
  },

  // Interactive Story Creator Modal
  openCreateStoryModal(onCreated) {
    const presets = [
      { name: "Cyber City", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85" },
      { name: "Neon Studio", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85" },
      { name: "Sunset Horizon", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85" },
      { name: "Acoustic Minimal", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85" }
    ];

    const bodyHtml = `
      <div style="display: flex; flex-direction: column; gap: var(--space-4);">
        <div>
          <label style="display: block; font-size: var(--font-sm); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Select Story Media</label>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;" id="story-preset-grid">
            ${presets.map((p, idx) => `
              <div class="story-preset-item ${idx === 0 ? 'selected' : ''}" data-url="${p.url}" style="position: relative; height: 84px; border-radius: 8px; overflow: hidden; cursor: pointer; border: 2px solid ${idx === 0 ? 'var(--accent)' : 'transparent'};">
                <img src="${p.url}" style="width: 100%; height: 100%; object-fit: cover;" alt="${p.name}">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 2px 4px; background: rgba(0,0,0,0.6); font-size: 10px; color: #fff; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <label for="custom-story-media-url" style="display: block; font-size: var(--font-sm); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Or Paste Image URL</label>
          <input 
            type="url" 
            id="custom-story-media-url" 
            class="input" 
            style="width: 100%;" 
            placeholder="https://images.unsplash.com/..." 
            value="${presets[0].url}"
          >
        </div>

        <div>
          <label for="custom-story-caption" style="display: block; font-size: var(--font-sm); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Story Caption</label>
          <input 
            type="text" 
            id="custom-story-caption" 
            class="input" 
            style="width: 100%;" 
            placeholder="Add a vibe or thought to your story..."
            value="Late night coding sessions & creative flow ✨"
          >
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary modal-cancel-btn">Cancel</button>
      <button class="btn btn-primary modal-publish-story-btn">Share Story</button>
    `;

    const modal = this.openModal("Create Your Story", bodyHtml, footerHtml);

    const presetItems = modal.backdrop.querySelectorAll(".story-preset-item");
    const mediaInput = modal.backdrop.querySelector("#custom-story-media-url");

    presetItems.forEach(item => {
      item.addEventListener("click", () => {
        presetItems.forEach(p => p.style.borderColor = "transparent");
        item.style.borderColor = "var(--accent)";
        mediaInput.value = item.dataset.url;
      });
    });

    modal.backdrop.querySelector(".modal-cancel-btn").addEventListener("click", () => modal.close());
    modal.backdrop.querySelector(".modal-publish-story-btn").addEventListener("click", () => {
      const url = mediaInput.value.trim() || presets[0].url;
      const caption = modal.backdrop.querySelector("#custom-story-caption").value.trim();

      const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;
      const newStory = {
        id: "story-" + Date.now(),
        userName: "Your Story",
        userAvatar: user.avatar,
        mediaUrl: url,
        isOwn: true,
        time: "Just now",
        caption: caption
      };

      // Add to beginning of stories
      Diskrit.mockData.stories.unshift(newStory);
      modal.close();
      Diskrit.components.modals.toast("Your story was published!", "success");
      if (onCreated) onCreated(newStory);
    });
  },

  // Fullscreen High-Res Media Lightbox Modal with Feed Navigation & Zoom
  openMediaLightbox(targetPost) {
    const allPosts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
    const mediaPosts = allPosts.filter(p => p.mediaUrl || p.videoUrl);
    let currentIndex = mediaPosts.findIndex(p => p.id === targetPost.id);
    if (currentIndex === -1) {
      mediaPosts.unshift(targetPost);
      currentIndex = 0;
    }

    const modal = document.createElement("div");
    modal.className = "media-lightbox-modal open";
    modal.id = "media-lightbox-overlay";
    document.body.appendChild(modal);

    let isZoomed = false;

    function renderStage() {
      const p = mediaPosts[currentIndex];
      const mediaUrl = p.mediaUrl || p.videoUrl;
      const isVideo = p.mediaType === 'video' || !!p.videoUrl || (mediaUrl && (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm')));
      const formattedContent = (p.content || '').replace(/#(\w+)/g, '<a href="#tags/$1" class="post-hashtag" style="color: var(--accent); text-decoration: none;">#$1</a>');

      modal.innerHTML = `
        <div class="media-lightbox-scrim"></div>
        <div class="media-lightbox-container">
          <!-- Top Floating Header -->
          <div class="media-lightbox-header">
            <div class="media-lightbox-author">
              <a href="#@${p.authorHandle}" style="text-decoration: none;" title="View profile">
                <img src="${p.authorAvatar}" class="avatar avatar-sm" alt="${p.authorName}">
              </a>
              <div class="media-lightbox-meta">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <a href="#@${p.authorHandle}" class="media-lightbox-author-name">${p.authorName}</a>
                  <a href="#@${p.authorHandle}" class="media-lightbox-author-handle">@${p.authorHandle}</a>
                </div>
                <div style="font-size: 11px; color: rgba(255, 255, 255, 0.6);">${p.createdAt} &bull; ${p.location || 'Global'}</div>
              </div>
            </div>

            <div class="media-lightbox-actions">
              <button class="btn btn-secondary btn-sm media-lightbox-share-btn" title="Share photo or video to socials">
                ${Diskrit.icons("share", "", 14)}
                <span>Share</span>
              </button>
              <a href="#post/${p.slug || p.id}" class="btn btn-secondary btn-sm media-lightbox-thread-btn" title="Open dedicated single post page">
                ${Diskrit.icons("message", "", 14)}
                <span>View Thread</span>
              </a>
              <button class="btn-icon media-lightbox-close-btn" aria-label="Close Lightbox" title="Close (Esc)">
                ${Diskrit.icons("x", "", 20)}
              </button>
            </div>
          </div>

          <!-- Center Stage with Chevrons -->
          <div class="media-lightbox-stage">
            ${mediaPosts.length > 1 ? `
              <button class="media-lightbox-nav-btn prev" id="lightbox-prev-btn" aria-label="Previous Media" title="Previous (←)">
                ${Diskrit.icons("chevronLeft", "", 24)}
              </button>
            ` : ''}

            <div class="media-lightbox-media-wrap" id="lightbox-media-wrap">
              ${isVideo ? `
                <video src="${mediaUrl}" class="media-lightbox-video" controls autoplay playsinline ${p.posterUrl ? `poster="${p.posterUrl}"` : ''}></video>
              ` : `
                <img src="${mediaUrl}" class="media-lightbox-img ${isZoomed ? 'zoomed' : ''}" id="lightbox-zoom-img" alt="${p.content || 'Photo'}" title="Click to toggle zoom">
              `}
            </div>

            ${mediaPosts.length > 1 ? `
              <button class="media-lightbox-nav-btn next" id="lightbox-next-btn" aria-label="Next Media" title="Next (→)">
                ${Diskrit.icons("chevronRight", "", 24)}
              </button>
            ` : ''}
          </div>

          <!-- Bottom Floating Caption & Stats -->
          <div class="media-lightbox-footer">
            <div class="media-lightbox-caption">${formattedContent}</div>
            <div class="media-lightbox-counter-bar">
              <div style="display: flex; align-items: center; gap: 16px; color: rgba(255,255,255,0.8); font-size: 13px;">
                <span>${Diskrit.icons("heart", "text-accent", 16)} ${p.likesCount || 0}</span>
                <span>${Diskrit.icons("message", "", 16)} ${p.comments ? p.comments.length : 0}</span>
              </div>
              <div class="media-lightbox-pagination">
                ${currentIndex + 1} of ${mediaPosts.length}
              </div>
            </div>
          </div>
        </div>
      `;

      // Attach navigation events inside stage
      const closeBtn = modal.querySelector(".media-lightbox-close-btn");
      const shareBtn = modal.querySelector(".media-lightbox-share-btn");
      const prevBtn = modal.querySelector("#lightbox-prev-btn");
      const nextBtn = modal.querySelector("#lightbox-next-btn");
      const zoomImg = modal.querySelector("#lightbox-zoom-img");
      const scrim = modal.querySelector(".media-lightbox-scrim");
      const threadBtn = modal.querySelector(".media-lightbox-thread-btn");

      if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
      if (scrim) scrim.addEventListener("click", closeLightbox);
      if (threadBtn) threadBtn.addEventListener("click", closeLightbox);
      if (shareBtn) {
        shareBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (Diskrit.components && Diskrit.components.shareModal) {
            Diskrit.components.shareModal.open(p);
          }
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          currentIndex = (currentIndex - 1 + mediaPosts.length) % mediaPosts.length;
          isZoomed = false;
          renderStage();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          currentIndex = (currentIndex + 1) % mediaPosts.length;
          isZoomed = false;
          renderStage();
        });
      }

      if (zoomImg) {
        zoomImg.addEventListener("click", () => {
          isZoomed = !isZoomed;
          zoomImg.classList.toggle("zoomed", isZoomed);
        });
      }
    }

    function onKeyDown(e) {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft" && mediaPosts.length > 1) {
        currentIndex = (currentIndex - 1 + mediaPosts.length) % mediaPosts.length;
        isZoomed = false;
        renderStage();
      } else if (e.key === "ArrowRight" && mediaPosts.length > 1) {
        currentIndex = (currentIndex + 1) % mediaPosts.length;
        isZoomed = false;
        renderStage();
      }
    }

    function closeLightbox() {
      document.removeEventListener("keydown", onKeyDown);
      modal.classList.remove("open");
      setTimeout(() => modal.remove(), 200);
    }

    document.addEventListener("keydown", onKeyDown);
    renderStage();
  }
};
