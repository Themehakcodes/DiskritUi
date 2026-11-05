/**
 * DISKRIT UNIVERSAL SHARE MODAL COMPONENT
 * Complete multi-platform social sharing dialog with 1-click link copying,
 * QR code generator, and native device sharing.
 */

window.Diskrit = window.Diskrit || {};
Diskrit.components = Diskrit.components || {};

Diskrit.components.shareModal = {
  open(postOrOptions) {
    let post = postOrOptions;

    // If a string (slug or id) was passed, resolve from storage
    if (typeof postOrOptions === "string") {
      const posts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
      post = posts.find(p => p.slug === postOrOptions || p.id === postOrOptions) || {
        slug: postOrOptions,
        id: postOrOptions,
        content: "Check out this post on Diskrit",
        authorName: "Diskrit Creator",
        authorHandle: "creator",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=280&q=80"
      };
    }

    if (!post) return;

    // Resolve details
    const slug = post.slug || post.id || "post";
    const shareUrl = `${window.location.origin}${window.location.pathname}#post/${slug}`;
    const authorName = post.authorName || "Alex Mercer";
    const authorHandle = post.authorHandle || "alexmercer";
    const authorAvatar = post.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=280&q=80";
    const rawContent = post.content || "Explore creative expressions on Diskrit.";
    const summaryText = rawContent.replace(/<[^>]*>/g, '').slice(0, 110) + (rawContent.length > 110 ? "..." : "");
    const mediaThumb = post.mediaUrl || post.videoUrl || null;

    // Social Sharing Intent URLs
    const sharePayload = `${summaryText} by @${authorHandle} on #Diskrit`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(sharePayload)}&url=${encodeURIComponent(shareUrl)}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(sharePayload + "\n" + shareUrl)}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(sharePayload)}`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(summaryText)}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(authorName + " on Diskrit: " + summaryText.slice(0, 40))}&body=${encodeURIComponent(summaryText + "\n\n" + shareUrl)}`;

    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop open";
    backdrop.id = "share-modal-backdrop";
    backdrop.innerHTML = `
      <div class="share-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
        <div class="share-modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="share-modal-icon">${Diskrit.icons("share", "", 18)}</div>
            <h3 id="share-modal-title" class="share-modal-title">Share Post</h3>
          </div>
          <button class="btn-icon share-modal-close-btn" aria-label="Close share dialog" title="Close (Esc)">
            ${Diskrit.icons("x", "", 20)}
          </button>
        </div>

        <div class="share-modal-body">
          <!-- 1. Post Preview Snippet -->
          <div class="share-post-preview">
            ${mediaThumb ? `<img src="${mediaThumb}" class="share-preview-thumb" alt="Post thumbnail">` : ''}
            <div class="share-preview-info">
              <div class="share-preview-author">
                <img src="${authorAvatar}" class="avatar avatar-xs" alt="${authorName}">
                <span class="share-preview-author-name">${authorName}</span>
                <span class="share-preview-author-handle">@${authorHandle}</span>
              </div>
              <div class="share-preview-text">${summaryText}</div>
            </div>
          </div>

          <!-- 2. One-Click Copy Link Box -->
          <div class="share-link-copy-section">
            <label class="share-section-label" for="share-permalink-input">Direct Post Link</label>
            <div class="share-copy-input-row">
              <input type="text" class="share-url-input" id="share-permalink-input" value="${shareUrl}" readonly>
              <button type="button" class="btn btn-primary share-copy-btn" id="share-copy-link-btn" title="Copy link to clipboard">
                ${Diskrit.icons("copy", "", 16)}
                <span id="share-copy-btn-text">Copy Link</span>
              </button>
            </div>
          </div>

          <!-- 3. Social Media Sharing Grid -->
          <div class="share-social-section">
            <label class="share-section-label">Share to Social Channels</label>
            <div class="share-social-grid">
              <!-- X (Twitter) -->
              <a href="${twitterUrl}" target="_blank" rel="noopener noreferrer" class="share-social-btn share-btn-x" title="Share on X">
                ${Diskrit.icons("xTwitter", "", 18)}
                <span>X (Twitter)</span>
              </a>

              <!-- WhatsApp -->
              <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="share-social-btn share-btn-whatsapp" title="Share on WhatsApp">
                ${Diskrit.icons("whatsapp", "", 18)}
                <span>WhatsApp</span>
              </a>

              <!-- Telegram -->
              <a href="${telegramUrl}" target="_blank" rel="noopener noreferrer" class="share-social-btn share-btn-telegram" title="Share on Telegram">
                ${Diskrit.icons("telegram", "", 18)}
                <span>Telegram</span>
              </a>

              <!-- LinkedIn -->
              <a href="${linkedinUrl}" target="_blank" rel="noopener noreferrer" class="share-social-btn share-btn-linkedin" title="Share on LinkedIn">
                ${Diskrit.icons("linkedin", "", 18)}
                <span>LinkedIn</span>
              </a>

              <!-- Facebook -->
              <a href="${facebookUrl}" target="_blank" rel="noopener noreferrer" class="share-social-btn share-btn-facebook" title="Share on Facebook">
                ${Diskrit.icons("facebook", "", 18)}
                <span>Facebook</span>
              </a>

              <!-- Reddit -->
              <a href="${redditUrl}" target="_blank" rel="noopener noreferrer" class="share-social-btn share-btn-reddit" title="Share on Reddit">
                ${Diskrit.icons("reddit", "", 18)}
                <span>Reddit</span>
              </a>

              <!-- Email -->
              <a href="${emailUrl}" class="share-social-btn share-btn-email" title="Share via Email">
                ${Diskrit.icons("mail", "", 18)}
                <span>Email</span>
              </a>

              <!-- More / System Share -->
              <button type="button" class="share-social-btn share-btn-system" id="share-native-system-btn" title="System Share Sheet">
                ${Diskrit.icons("share", "", 18)}
                <span>More...</span>
              </button>
            </div>
          </div>

          <!-- 4. Quick QR Code Drawer -->
          <div class="share-qr-drawer-section">
            <button type="button" class="share-qr-toggle-btn" id="share-qr-toggle-btn">
              <span style="display: flex; align-items: center; gap: 6px;">
                ${Diskrit.icons("qrCode", "", 16)}
                <span>Show Mobile QR Code</span>
              </span>
              <span class="share-qr-toggle-icon">${Diskrit.icons("chevronDown", "", 14)}</span>
            </button>
            <div class="share-qr-container" id="share-qr-container" style="display: none;">
              <div class="share-qr-box">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}&bgcolor=0f0f0f&color=f0644b" alt="QR Code" class="share-qr-img" loading="lazy">
              </div>
              <span class="share-qr-hint">Scan with camera to open post on any phone</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const closeDialog = () => {
      document.removeEventListener("keydown", onKeyDown);
      backdrop.classList.remove("open");
      setTimeout(() => backdrop.remove(), 200);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeDialog();
    };
    document.addEventListener("keydown", onKeyDown);

    // Close button & backdrop click
    const closeBtn = backdrop.querySelector(".share-modal-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", closeDialog);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeDialog();
    });

    // Copy Link Button with instant feedback
    const copyBtn = backdrop.querySelector("#share-copy-link-btn");
    const copyInput = backdrop.querySelector("#share-permalink-input");
    const copyText = backdrop.querySelector("#share-copy-btn-text");

    if (copyBtn && copyInput) {
      copyBtn.addEventListener("click", () => {
        copyInput.select();
        copyInput.setSelectionRange(0, 99999);
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareUrl).then(() => {
            handleCopiedState();
          });
        } else {
          document.execCommand("copy");
          handleCopiedState();
        }
      });
    }

    function handleCopiedState() {
      if (!copyBtn || !copyText) return;
      copyBtn.classList.add("copied");
      copyText.textContent = "Copied! ✓";
      Diskrit.components.modals.toast("Post link copied to clipboard!", "success");
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyText.textContent = "Copy Link";
      }, 2400);
    }

    // System Native Share API
    const systemBtn = backdrop.querySelector("#share-native-system-btn");
    if (systemBtn) {
      systemBtn.addEventListener("click", () => {
        if (navigator.share) {
          navigator.share({
            title: `${authorName} on Diskrit`,
            text: summaryText,
            url: shareUrl
          }).catch(() => {});
        } else {
          handleCopiedState();
        }
      });
    }

    // QR Code Drawer Toggle
    const qrToggleBtn = backdrop.querySelector("#share-qr-toggle-btn");
    const qrContainer = backdrop.querySelector("#share-qr-container");
    if (qrToggleBtn && qrContainer) {
      qrToggleBtn.addEventListener("click", () => {
        const isHidden = qrContainer.style.display === "none";
        qrContainer.style.display = isHidden ? "flex" : "none";
        const icon = qrToggleBtn.querySelector(".share-qr-toggle-icon");
        if (icon) {
          icon.innerHTML = Diskrit.icons(isHidden ? "chevronUp" : "chevronDown", "", 14);
        }
      });
    }
  }
};

// Convenience alias on Diskrit.components.modals
if (Diskrit.components && Diskrit.components.modals) {
  Diskrit.components.modals.openShareModal = (post) => Diskrit.components.shareModal.open(post);
}

