/**
 * DISKRIT POST COMPOSER
 * Solves Flaw 3.1, 3.2 & 3.3: Open by default, native media uploader, and instant anonymous avatar morphing
 * Feature: Hashtag/mention autocomplete, live link paste detection & rich link preview generation
 */

window.Diskrit = window.Diskrit || {};
Diskrit.components = Diskrit.components || {};

Diskrit.components.composer = {
  renderComposer(options = {}) {
    const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;
    const firstName = (user.name || "Creator").split(' ')[0];
    const isExpanded = options.isExpanded || false;

    return `
      <section class="composer-card ${isExpanded ? 'is-expanded' : 'is-collapsed'}" id="post-composer-card" aria-label="Create Post">
        <!-- 1. COMPACT COLLAPSED TRIGGER BAR (Default view - saves screen space) -->
        <div class="composer-collapsed-bar" id="composer-collapsed-bar">
          <div class="composer-collapsed-left">
            <img 
              src="${user.avatar}" 
              class="avatar avatar-sm" 
              alt="${user.name}"
              id="composer-collapsed-avatar"
            >
            <div 
              class="composer-collapsed-trigger-box" 
              id="composer-collapsed-trigger" 
              role="button" 
              tabindex="0" 
              title="Click or use arrow to create a new post"
            >
              <span class="composer-collapsed-placeholder">
                What's happening in your creative world, ${firstName}? (Click or expand to post)
              </span>
            </div>
          </div>

          <div class="composer-collapsed-actions">
            <button type="button" class="composer-quick-media-btn" id="composer-quick-photo-btn" title="Add Photo to post">
              ${Diskrit.icons("image", "text-accent", 16)}
              <span class="quick-media-label">Photo</span>
            </button>
            <button type="button" class="composer-quick-media-btn" id="composer-quick-video-btn" title="Add Video to post">
              ${Diskrit.icons("video", "text-accent", 16)}
              <span class="quick-media-label">Video</span>
            </button>
            <button 
              type="button" 
              class="composer-collapse-toggle-btn" 
              id="composer-expand-arrow-btn" 
              aria-label="Expand post creator" 
              title="Expand post creator (Click arrow to slide down)"
            >
              ${Diskrit.icons("chevronDown", "composer-toggle-icon", 18)}
            </button>
          </div>
        </div>

        <!-- 2. EXPANDED FULL COMPOSER DRAWER (Slides down when triggered) -->
        <div class="composer-expanded-drawer" id="composer-expanded-drawer">
          <div class="composer-header">
            <div class="composer-author">
              <div class="composer-avatar-wrapper">
                <img 
                  src="${user.avatar}" 
                  id="composer-user-avatar" 
                  class="avatar avatar-md" 
                  alt="${user.name}"
                >
                <div 
                  id="composer-ghost-avatar" 
                  class="avatar avatar-md" 
                  style="display: none; background: var(--bg-surface-elevated); color: var(--accent); align-items: center; justify-content: center; font-size: 20px; border: 2px solid var(--accent);"
                >
                  ${Diskrit.icons("ghost", "", 24)}
                </div>
              </div>
              <div class="composer-identity">
                <span id="composer-author-name" class="composer-name">${user.name}</span>
                <div class="composer-privacy-badge">
                  <span id="composer-status-label">${Diskrit.icons("globe", "", 12)} Public Timeline</span>
                  <span id="composer-anonymous-badge" class="anonymous-active-badge">
                    ${Diskrit.icons("ghost", "", 12)} Identity Hidden
                  </span>
                </div>
              </div>
            </div>

            <!-- Collapse Arrow Button in Header -->
            <button 
              type="button" 
              class="composer-collapse-toggle-btn" 
              id="composer-collapse-arrow-btn" 
              aria-label="Collapse post creator" 
              title="Collapse post creator (Slide up)"
            >
              ${Diskrit.icons("chevronUp", "composer-toggle-icon", 18)}
            </button>
          </div>

          <div style="position: relative;">
            <textarea 
              id="composer-text-input" 
              class="composer-textarea" 
              placeholder="What's happening in your creative world, ${firstName}? (Type #hashtags or @mentions or paste links)"
              rows="3"
            ></textarea>

            <!-- Autocomplete Suggestions Popover -->
            <div id="composer-autocomplete-popover" class="composer-autocomplete-popover" style="display: none;"></div>
          </div>

          <!-- Detected Link Preview Box -->
          <div id="composer-link-preview-box" class="composer-link-preview-box" style="display: none;"></div>

          <!-- Media preview thumbnails container -->
          <div id="composer-previews-container" class="composer-media-previews" style="display: none;"></div>

          <!-- Hidden native file inputs -->
          <input type="file" id="composer-photo-input" accept="image/*" multiple style="display: none;">
          <input type="file" id="composer-video-input" accept="video/*" style="display: none;">

          <div class="composer-footer">
            <div class="composer-tools">
              <button type="button" class="composer-tool-btn" id="composer-add-photo-btn">
                ${Diskrit.icons("image", "text-accent", 18)}
                <span>Photo</span>
              </button>
              <button type="button" class="composer-tool-btn" id="composer-add-video-btn">
                ${Diskrit.icons("video", "text-accent", 18)}
                <span>Video</span>
              </button>
              
              <div style="height: 20px; width: 1px; background: var(--border-subtle); margin: 0 4px;"></div>

              <!-- Anonymous Posting Switch with instant visual feedback -->
              <label class="composer-anonymous-toggle" title="Hide your identity on this post">
                <span class="switch">
                  <input type="checkbox" id="composer-anonymous-checkbox">
                  <span class="switch-slider"></span>
                </span>
                <span>Post Anonymously</span>
              </label>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <button type="button" class="btn btn-ghost btn-sm" id="composer-cancel-btn" title="Cancel and collapse">
                Cancel
              </button>
              <button type="button" class="btn btn-primary" id="composer-submit-btn">
                ${Diskrit.icons("send", "", 16)}
                <span>Publish</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  attachEvents(onPostPublished) {
    const composer = document.getElementById("post-composer-card");
    if (!composer) return;

    const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;
    const anonCheckbox = document.getElementById("composer-anonymous-checkbox");
    const userAvatar = document.getElementById("composer-user-avatar");
    const ghostAvatar = document.getElementById("composer-ghost-avatar");
    const authorName = document.getElementById("composer-author-name");
    const statusLabel = document.getElementById("composer-status-label");
    const anonBadge = document.getElementById("composer-anonymous-badge");

    const textInput = document.getElementById("composer-text-input");
    const autocompletePopover = document.getElementById("composer-autocomplete-popover");
    const linkPreviewBox = document.getElementById("composer-link-preview-box");
    const previewsContainer = document.getElementById("composer-previews-container");
    const photoInput = document.getElementById("composer-photo-input");
    const videoInput = document.getElementById("composer-video-input");
    const submitBtn = document.getElementById("composer-submit-btn");

    let attachedMedia = null; // { type: 'image' | 'video', url: string }
    let detectedLinkPreview = null; // { url, domain, title, description, image }

    // Collapse & Expand Management (Collapsed by Default - Saves Screen Real Estate)
    function expandComposer(focusInput = true) {
      composer.classList.remove("is-collapsed");
      composer.classList.add("is-expanded");
      if (focusInput && textInput) {
        setTimeout(() => textInput.focus(), 60);
      }
      if (Diskrit.masonry) {
        Diskrit.masonry.updateAll();
      }
    }

    function collapseComposer() {
      composer.classList.add("is-collapsed");
      composer.classList.remove("is-expanded");
      if (autocompletePopover) {
        autocompletePopover.style.display = "none";
      }
      if (Diskrit.masonry) {
        Diskrit.masonry.updateAll();
      }
    }

    // Toggle triggers
    const collapsedBar = document.getElementById("composer-collapsed-bar");
    const collapsedTrigger = document.getElementById("composer-collapsed-trigger");
    const expandArrowBtn = document.getElementById("composer-expand-arrow-btn");
    const collapseArrowBtn = document.getElementById("composer-collapse-arrow-btn");
    const cancelBtn = document.getElementById("composer-cancel-btn");
    const quickPhotoBtn = document.getElementById("composer-quick-photo-btn");
    const quickVideoBtn = document.getElementById("composer-quick-video-btn");

    if (collapsedBar) {
      collapsedBar.addEventListener("click", (e) => {
        if (e.target.closest("#composer-quick-photo-btn, #composer-quick-video-btn, #composer-expand-arrow-btn")) {
          return;
        }
        expandComposer(true);
      });
    }

    if (collapsedTrigger) {
      collapsedTrigger.addEventListener("click", () => expandComposer(true));
      collapsedTrigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          expandComposer(true);
        }
      });
    }

    if (expandArrowBtn) {
      expandArrowBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        expandComposer(true);
      });
    }

    if (collapseArrowBtn) {
      collapseArrowBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        collapseComposer();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        textInput.value = "";
        attachedMedia = null;
        detectedLinkPreview = null;
        previewsContainer.innerHTML = "";
        previewsContainer.style.display = "none";
        photoInput.value = "";
        videoInput.value = "";
        if (linkPreviewBox) {
          linkPreviewBox.innerHTML = "";
          linkPreviewBox.style.display = "none";
        }
        if (autocompletePopover) {
          autocompletePopover.style.display = "none";
        }
        collapseComposer();
      });
    }

    if (quickPhotoBtn) {
      quickPhotoBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        expandComposer(false);
        if (photoInput) photoInput.click();
      });
    }

    if (quickVideoBtn) {
      quickVideoBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        expandComposer(false);
        if (videoInput) videoInput.click();
      });
    }

    // Instant Visual Morphing for Anonymous Switch
    if (anonCheckbox) {
      anonCheckbox.addEventListener("change", () => {
        const isAnon = anonCheckbox.checked;
        if (isAnon) {
          userAvatar.style.display = "none";
          ghostAvatar.style.display = "flex";
          authorName.textContent = "Anonymous User";
          authorName.style.color = "var(--accent)";
          statusLabel.style.display = "none";
          anonBadge.classList.add("visible");
          Diskrit.components.modals.toast("Anonymous mode active: Your name and profile will be completely hidden.", "info");
        } else {
          userAvatar.style.display = "block";
          ghostAvatar.style.display = "none";
          authorName.textContent = user.name;
          authorName.style.color = "var(--text-primary)";
          statusLabel.style.display = "inline-flex";
          anonBadge.classList.remove("visible");
        }
      });
    }

    // Hashtag & Mention Autocomplete List
    const popularTags = [
      { tag: "generative", count: "24.8K posts" },
      { tag: "digitalart", count: "18.2K posts" },
      { tag: "creativecoding", count: "14.5K posts" },
      { tag: "future", count: "12.1K posts" },
      { tag: "tokyo", count: "9.4K posts" },
      { tag: "sounddesign", count: "8.7K posts" },
      { tag: "webgl", count: "7.9K posts" },
      { tag: "privacy", count: "6.3K posts" },
      { tag: "freespeech", count: "5.8K posts" },
      { tag: "cyberpunk", count: "5.1K posts" },
      { tag: "ambient", count: "4.4K posts" },
      { tag: "cinematography", count: "3.9K posts" }
    ];

    const usersList = Diskrit.mockData.users || [];

    if (textInput && autocompletePopover) {
      textInput.addEventListener("input", () => {
        handleAutocomplete();
        handleLinkDetection();
      });

      textInput.addEventListener("keydown", (e) => {
        if (autocompletePopover.style.display !== "none") {
          if (e.key === "Escape") {
            autocompletePopover.style.display = "none";
          }
        }
      });
    }

    function handleAutocomplete() {
      const caret = textInput.selectionStart;
      const textBefore = textInput.value.slice(0, caret);
      const match = textBefore.match(/(#|@)([a-zA-Z0-9_]*)$/);

      if (!match) {
        autocompletePopover.style.display = "none";
        return;
      }

      const trigger = match[1]; // '#' or '@'
      const query = match[2].toLowerCase();

      if (trigger === "#") {
        const matches = popularTags.filter(t => t.tag.toLowerCase().includes(query)).slice(0, 5);
        if (matches.length === 0) {
          autocompletePopover.style.display = "none";
          return;
        }

        autocompletePopover.innerHTML = `
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); padding: 4px 8px; text-transform: uppercase;">
            Matching Hashtags
          </div>
          ${matches.map(m => `
            <button type="button" class="composer-suggestion-item" data-insert="#${m.tag}">
              ${Diskrit.icons("hash", "text-accent", 14)}
              <span class="composer-suggestion-tag">#${m.tag}</span>
              <span class="composer-suggestion-count">${m.count}</span>
            </button>
          `).join('')}
        `;
        autocompletePopover.style.display = "flex";

        autocompletePopover.querySelectorAll(".composer-suggestion-item").forEach(item => {
          item.addEventListener("click", () => {
            insertSuggestion(match[0], item.dataset.insert + " ");
          });
        });
      } else if (trigger === "@") {
        const matches = usersList.filter(u => 
          u.handle.toLowerCase().includes(query) || u.name.toLowerCase().includes(query)
        ).slice(0, 5);

        if (matches.length === 0) {
          autocompletePopover.style.display = "none";
          return;
        }

        autocompletePopover.innerHTML = `
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); padding: 4px 8px; text-transform: uppercase;">
            Mention Creator
          </div>
          ${matches.map(m => `
            <button type="button" class="composer-suggestion-item" data-insert="@${m.handle}">
              <img src="${m.avatar}" class="avatar avatar-xs" alt="${m.name}">
              <span style="font-weight: 600; color: var(--text-primary);">${m.name}</span>
              <span style="font-size: 11px; color: var(--accent);">@${m.handle}</span>
            </button>
          `).join('')}
        `;
        autocompletePopover.style.display = "flex";

        autocompletePopover.querySelectorAll(".composer-suggestion-item").forEach(item => {
          item.addEventListener("click", () => {
            insertSuggestion(match[0], item.dataset.insert + " ");
          });
        });
      }
    }

    function insertSuggestion(triggerWord, replacement) {
      const caret = textInput.selectionStart;
      const text = textInput.value;
      const beforeTrigger = text.slice(0, caret - triggerWord.length);
      const afterTrigger = text.slice(caret);

      textInput.value = beforeTrigger + replacement + afterTrigger;
      textInput.focus();
      const newPos = beforeTrigger.length + replacement.length;
      textInput.setSelectionRange(newPos, newPos);
      autocompletePopover.style.display = "none";
    }

    // Live URL Detection for Link Preview Card
    function handleLinkDetection() {
      if (detectedLinkPreview) return; // Already generated

      const urlMatch = textInput.value.match(/https?:\/\/[^\s]+/i);
      if (!urlMatch) return;

      const rawUrl = urlMatch[0];
      try {
        const parsedUrl = new URL(rawUrl);
        const domain = parsedUrl.hostname.replace(/^www\./, '');
        
        let previewTitle = "External Resource";
        let previewDesc = `Linked content from ${domain}`;
        let previewImg = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80";

        if (domain.includes("github.com")) {
          previewTitle = "GitHub Repository & Open Source";
          previewDesc = "Explore code, repositories, and developer discussions.";
          previewImg = "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=400&q=80";
        } else if (domain.includes("unsplash.com")) {
          previewTitle = "Unsplash High-Res Photography";
          previewDesc = "Visual asset collection shared on the open web.";
          previewImg = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80";
        } else if (domain.includes("youtube.com") || domain.includes("youtu.be")) {
          previewTitle = "Video Broadcast & Stream";
          previewDesc = "Watch high-definition audio/visual stream.";
          previewImg = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80";
        }

        detectedLinkPreview = {
          url: rawUrl,
          domain: domain,
          title: previewTitle,
          description: previewDesc,
          image: previewImg
        };

        renderLinkPreviewBox(detectedLinkPreview);
      } catch (e) {
        // invalid URL
      }
    }

    function renderLinkPreviewBox(preview) {
      if (!linkPreviewBox) return;
      linkPreviewBox.style.display = "flex";
      linkPreviewBox.innerHTML = `
        <img src="${preview.image}" class="link-preview-thumb" alt="Link thumb">
        <div class="link-preview-info">
          <div class="link-preview-domain">${Diskrit.icons("link", "", 12)} <span>${preview.domain}</span></div>
          <div class="link-preview-title">${preview.title}</div>
          <div class="link-preview-desc">${preview.description}</div>
        </div>
        <button type="button" class="link-preview-remove" id="remove-link-preview-btn" title="Remove link preview">
          ${Diskrit.icons("x", "", 14)}
        </button>
      `;

      const removeBtn = document.getElementById("remove-link-preview-btn");
      if (removeBtn) {
        removeBtn.addEventListener("click", () => {
          detectedLinkPreview = null;
          linkPreviewBox.innerHTML = "";
          linkPreviewBox.style.display = "none";
        });
      }
    }

    // Photo Button Trigger
    const addPhotoBtn = document.getElementById("composer-add-photo-btn");
    if (addPhotoBtn && photoInput) {
      addPhotoBtn.addEventListener("click", () => photoInput.click());
      photoInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            attachedMedia = { type: "image", url: event.target.result };
            renderMediaPreview(attachedMedia);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Video Button Trigger
    const addVideoBtn = document.getElementById("composer-add-video-btn");
    if (addVideoBtn && videoInput) {
      addVideoBtn.addEventListener("click", () => videoInput.click());
      videoInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            attachedMedia = { type: "video", url: event.target.result };
            renderMediaPreview(attachedMedia);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    function renderMediaPreview(media) {
      previewsContainer.style.display = "flex";
      previewsContainer.innerHTML = `
        <div class="media-preview-item">
          ${media.type === 'image' 
            ? `<img src="${media.url}" alt="Upload preview">` 
            : `<video src="${media.url}" muted></video>`
          }
          <button type="button" class="media-preview-remove" id="remove-preview-btn" title="Remove attachment">
            ${Diskrit.icons("x", "", 14)}
          </button>
        </div>
      `;

      document.getElementById("remove-preview-btn").addEventListener("click", () => {
        attachedMedia = null;
        previewsContainer.innerHTML = "";
        previewsContainer.style.display = "none";
        photoInput.value = "";
        videoInput.value = "";
      });
    }

    // Submit Post
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const content = textInput.value.trim();
        if (!content && !attachedMedia && !detectedLinkPreview) {
          Diskrit.components.modals.toast("Please enter some text, attach media, or paste a link to publish", "error");
          return;
        }

        const isAnon = anonCheckbox ? anonCheckbox.checked : false;
        const newPost = {
          id: `post-${Date.now()}`,
          slug: content.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || `post-${Date.now()}`,
          authorId: isAnon ? "anon" : user.id,
          authorName: isAnon ? "Anonymous User" : user.name,
          authorHandle: isAnon ? "anonymous" : user.handle,
          authorAvatar: isAnon ? "ghost" : user.avatar,
          location: isAnon ? "Encrypted Network" : (user.city ? `${user.city}, ${user.country}` : "Global"),
          createdAt: "Just now",
          timestamp: new Date().toISOString(),
          content: content,
          mediaType: attachedMedia ? attachedMedia.type : "none",
          mediaUrl: attachedMedia ? attachedMedia.url : null,
          videoUrl: attachedMedia && attachedMedia.type === "video" ? attachedMedia.url : null,
          linkPreview: detectedLinkPreview ? { ...detectedLinkPreview } : null,
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          isLiked: false,
          isBookmarked: false,
          isAnonymous: isAnon,
          isSensitive: false,
          viewsCount: 1,
          comments: []
        };

        // Prepend to posts state
        const posts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
        posts.unshift(newPost);
        Diskrit.storage.set("posts", posts);

        // Reset composer
        textInput.value = "";
        attachedMedia = null;
        detectedLinkPreview = null;
        previewsContainer.innerHTML = "";
        previewsContainer.style.display = "none";
        if (linkPreviewBox) {
          linkPreviewBox.innerHTML = "";
          linkPreviewBox.style.display = "none";
        }
        if (autocompletePopover) {
          autocompletePopover.style.display = "none";
        }
        if (anonCheckbox) {
          anonCheckbox.checked = false;
          anonCheckbox.dispatchEvent(new Event("change"));
        }

        Diskrit.components.modals.toast("Post successfully published!", "success");
        collapseComposer();

        if (onPostPublished) {
          onPostPublished(newPost);
        } else {
          document.dispatchEvent(new CustomEvent("diskrit:post-created", { detail: newPost }));
        }
      });
    }
  }
};
