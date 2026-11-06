/**
 * DISKRIT POST CARD COMPONENT
 * Solves Flaw 3.4: Clean 2-line header, 44px touch targets, heartPop micro-animation & Safe Mode blurring
 * Feature: Sleek HTML5 video player, photo lightbox viewer, post-level author follow, and link preview cards
 */

window.Diskrit = window.Diskrit || {};
Diskrit.components = Diskrit.components || {};

Diskrit.components.postCard = {
  renderPostCard(post) {
    const isSafe = Diskrit.theme.isSafeMode();
    const isBlurred = post.isSensitive && isSafe;
    const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;
    const isAuthor = post.authorId === user.id || post.authorHandle === user.handle;

    // Follow state
    const followingList = Diskrit.storage.get("following_handles", ["marcus_chen", "sarahj"]);
    const isFollowing = followingList.includes(post.authorHandle);

    // Media detection
    const mediaUrl = post.mediaUrl || post.videoUrl;
    const isVideo = post.mediaType === 'video' || !!post.videoUrl || (mediaUrl && (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm')));

    // Parse hashtags into clickable links
    const formattedContent = (post.content || '').replace(/#(\w+)/g, '<a href="#tags/$1" class="post-hashtag">#$1</a>');

    return `
      <article class="post-card" id="card-${post.id}" data-id="${post.id}" data-slug="${post.slug}" data-post-url="#post/${post.slug || post.id}">
        <!-- Post Header: Clean 2-Line Meta Layout -->
        <div class="post-header">
          <div class="post-author-info">
            ${post.isAnonymous ? `
              <div class="avatar avatar-md" style="background: var(--bg-surface-elevated); color: var(--accent); display: flex; align-items: center; justify-content: center; border: 2px solid var(--accent);">
                ${Diskrit.icons("ghost", "", 22)}
              </div>
            ` : `
              <a href="#@${post.authorHandle}" title="View @${post.authorHandle}'s profile">
                <img src="${post.authorAvatar}" class="avatar avatar-md" alt="${post.authorName}">
              </a>
            `}
            <div class="post-meta-text">
              <div class="post-author-name-row">
                ${post.isAnonymous ? `
                  <span class="post-author-name" style="color: var(--accent);">Anonymous User</span>
                  <span class="badge" style="background: var(--accent-light); color: var(--accent);">Encrypted</span>
                ` : `
                  <a href="#@${post.authorHandle}" class="post-author-name" title="View @${post.authorHandle}">${post.authorName}</a>
                  <a href="#@${post.authorHandle}" class="post-author-handle">@${post.authorHandle}</a>
                  ${(!isAuthor) ? `
                    <button class="post-author-follow-btn ${isFollowing ? 'following' : ''}" data-handle="${post.authorHandle}" title="${isFollowing ? 'Unfollow' : 'Follow'} ${post.authorName}">
                      ${isFollowing ? 'Following' : '+ Follow'}
                    </button>
                  ` : ''}
                `}
              </div>
              <div class="post-sub-meta">
                <a href="#post/${post.slug || post.id}" style="color: var(--text-muted); text-decoration: none;" title="Open single post view">
                  <span class="post-timestamp">${post.createdAt}</span>
                </a>
                <span>&bull;</span>
                <span class="post-location-tag">
                  ${Diskrit.icons("mapPin", "", 12)}
                  <span>${post.location || 'Global'}</span>
                </span>
                ${post.isSensitive ? `
                  <span>&bull;</span>
                  <span class="badge badge-warning" style="font-size: 10px;">18+ Sensitive</span>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Options Dropdown Menu -->
          <div style="position: relative;">
            <button class="btn-icon post-menu-trigger" data-id="${post.id}" aria-label="Post Options">
              ${Diskrit.icons("more", "", 18)}
            </button>
            <div class="dropdown-menu" id="menu-${post.id}">
              <button class="dropdown-item post-action-copy-link" data-slug="${post.slug || post.id}">
                ${Diskrit.icons("copy", "", 16)}
                <span>Copy Post Link</span>
              </button>
              <a href="#post/${post.slug || post.id}" class="dropdown-item">
                ${Diskrit.icons("eye", "", 16)}
                <span>View Full Thread</span>
              </a>
              ${isAuthor ? `
                <a href="#post/${post.id}/analytics" class="dropdown-item">
                  ${Diskrit.icons("barChart", "", 16)}
                  <span>Post Analytics</span>
                </a>
              ` : ''}
              <button class="dropdown-item danger post-action-hide" data-id="${post.id}">
                ${Diskrit.icons("eyeOff", "", 16)}
                <span>Hide Post (Admin)</span>
              </button>
              <button class="dropdown-item danger post-action-report" data-id="${post.id}">
                ${Diskrit.icons("shieldAlert", "", 16)}
                <span>Report Content</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Post Content Body -->
        <div class="post-body">
          <p>${formattedContent}</p>
        </div>

        <!-- Link Preview Card if attached -->
        ${post.linkPreview ? `
          <a href="${post.linkPreview.url}" target="_blank" rel="noopener noreferrer" class="post-link-preview-card" title="${post.linkPreview.title}">
            ${post.linkPreview.image ? `<img src="${post.linkPreview.image}" class="link-preview-thumb" alt="Link preview">` : ''}
            <div class="link-preview-info">
              <div class="link-preview-domain">${Diskrit.icons("link", "", 12)} <span>${post.linkPreview.domain || 'External Link'}</span></div>
              <div class="link-preview-title">${post.linkPreview.title || post.linkPreview.url}</div>
              ${post.linkPreview.description ? `<div class="link-preview-desc">${post.linkPreview.description}</div>` : ''}
            </div>
          </a>
        ` : ''}

        <!-- Media Container with 18+ Safe Mode Guard -->
        ${mediaUrl ? `
          <div class="post-media-container ${isBlurred ? 'sensitive-content-guard' : ''}">
            ${isBlurred ? `
              <div class="sensitive-overlay">
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
              </div>
            ` : ''}

            ${isVideo ? `
              <!-- Sleek HTML5 Custom Video Player -->
              <div class="custom-video-player ${isBlurred ? 'sensitive-blur' : ''}" data-id="${post.id}">
                <video 
                  class="custom-video-el" 
                  src="${mediaUrl}" 
                  preload="metadata"
                  ${post.posterUrl ? `poster="${post.posterUrl}"` : ''}
                  playsinline
                ></video>
                <button class="video-overlay-play-btn" aria-label="Play video" title="Play Video">
                  ${Diskrit.icons("play", "", 24)}
                </button>
                <div class="video-controls-bar">
                  <button class="video-ctrl-btn video-play-toggle-btn" aria-label="Play/Pause">
                    ${Diskrit.icons("play", "", 16)}
                  </button>
                  <div class="video-progress-container" title="Seek">
                    <div class="video-progress-filled"></div>
                  </div>
                  <span class="video-time-display">0:00 / 0:00</span>
                  <button class="video-ctrl-btn video-mute-btn" aria-label="Mute/Unmute">
                    ${Diskrit.icons("volume2", "", 16)}
                  </button>
                  <button class="video-ctrl-btn video-fullscreen-btn" aria-label="Fullscreen">
                    ${Diskrit.icons("maximize", "", 16)}
                  </button>
                </div>
              </div>
            ` : `
              <!-- Photo Container with Direct Fullscreen Lightbox Preview -->
              <div class="post-photo-wrapper ${isBlurred ? 'sensitive-blur' : ''}" data-id="${post.id}" title="Click to view full photo preview">
                <img 
                  class="post-photo-img" 
                  src="${mediaUrl}" 
                  alt="Post attachment" 
                  loading="lazy"
                >
                <div class="photo-expand-badge">
                  ${Diskrit.icons("expand", "", 13)}
                  <span>Preview</span>
                </div>
              </div>
            `}
          </div>
        ` : ''}

        <!-- Post Action Bar (44px min touch target) -->
        <div class="post-action-bar">
          <!-- Like Button -->
          <button 
            type="button" 
            class="post-action-btn like-btn ${post.isLiked ? 'liked' : ''}" 
            data-id="${post.id}" 
            aria-label="Like Post"
          >
            ${Diskrit.icons("heart", "", 20)}
            <span class="like-count">${post.likesCount || 0}</span>
          </button>

          <!-- Comment Button -->
          <button 
            type="button" 
            class="post-action-btn comment-toggle-btn" 
            data-id="${post.id}" 
            aria-label="View Comments"
          >
            ${Diskrit.icons("message", "", 20)}
            <span class="comment-count">${post.comments ? post.comments.length : 0}</span>
          </button>

          <!-- Bookmark Button -->
          <button 
            type="button" 
            class="post-action-btn bookmark-btn ${post.isBookmarked ? 'bookmarked' : ''}" 
            data-id="${post.id}" 
            aria-label="Bookmark Post"
          >
            ${Diskrit.icons("bookmark", "", 20)}
            <span>Save</span>
          </button>

          <!-- Share Button -->
          <button 
            type="button" 
            class="post-action-btn share-btn" 
            data-slug="${post.slug || post.id}" 
            aria-label="Share Post"
          >
            ${Diskrit.icons("share", "", 20)}
            <span>Share</span>
          </button>
        </div>

        <!-- Inline Comments Section (Expandable) -->
        <div class="post-comments-section" id="comments-sec-${post.id}" style="display: none;">
          <div class="comment-input-row">
            <img src="${user.avatar}" class="avatar avatar-sm" alt="${user.name}">
            <input 
              type="text" 
              class="comment-input" 
              placeholder="Write a constructive comment..." 
              id="comment-input-${post.id}"
            >
            <button class="btn btn-primary btn-sm submit-comment-btn" data-id="${post.id}">
              ${Diskrit.icons("send", "", 14)}
            </button>
          </div>
          <div class="comments-list" id="comments-list-${post.id}">
            ${(post.comments || []).map(c => `
              <div class="comment-item">
                <a href="#@${c.authorHandle || 'user'}" style="text-decoration: none; flex-shrink: 0;" title="View profile">
                  <img src="${c.authorAvatar || user.avatar}" class="avatar avatar-xs" alt="${c.authorName}">
                </a>
                <div class="comment-bubble">
                  <div class="comment-author">
                    <a href="#@${c.authorHandle || 'user'}" style="color: inherit; text-decoration: none; font-weight: 600;">${c.authorName}</a>
                    <span style="font-weight: normal; color: var(--text-muted); font-size: 11px; margin-left: 6px;">${c.time || 'Just now'}</span>
                  </div>
                  <div class="comment-text">${c.content}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </article>
    `;
  },

  attachEvents(container = document) {
    // 0. Card Click Redirection to Single Post View
    container.querySelectorAll(".post-card[data-post-url]").forEach(card => {
      card.addEventListener("click", (e) => {
        if (
          e.target.closest(
            "a, button, input, textarea, select, label, video, .custom-video-player, .video-ctrl-btn, .dropdown-menu, .post-action-bar, .bypass-sensitive-btn, .post-author-follow-btn, [data-lightbox], .photo-expand-badge"
          )
        ) {
          return;
        }
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
          return;
        }
        const postUrl = card.dataset.postUrl || card.getAttribute("data-post-url");
        if (postUrl) {
          if (e.ctrlKey || e.metaKey || e.button === 1) {
            window.open(postUrl, "_blank");
          } else {
            window.location.hash = postUrl.replace(/^#/, "");
          }
        }
      });
    });

    // 1. Follow Author toggle in post header
    container.querySelectorAll(".post-author-follow-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const handle = btn.dataset.handle;
        let following = Diskrit.storage.get("following_handles", ["marcus_chen", "sarahj"]);
        const isNowFollowing = !following.includes(handle);
        if (isNowFollowing) {
          following.push(handle);
          Diskrit.components.modals.toast(`Now following @${handle}`, "success");
        } else {
          following = following.filter(h => h !== handle);
          Diskrit.components.modals.toast(`Unfollowed @${handle}`, "info");
        }
        Diskrit.storage.set("following_handles", following);
        document.querySelectorAll(`.post-author-follow-btn[data-handle="${handle}"]`).forEach(b => {
          b.classList.toggle("following", isNowFollowing);
          b.textContent = isNowFollowing ? "Following" : "+ Follow";
        });
      });
    });

    // 2. Photo Lightbox click
    container.querySelectorAll(".post-photo-wrapper").forEach(wrapper => {
      wrapper.addEventListener("click", (e) => {
        if (e.target.closest(".bypass-sensitive-btn")) return;
        const card = wrapper.closest(".post-card");
        if (!card) return;
        const postId = card.dataset.id;
        const posts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
        const post = posts.find(p => p.id === postId);
        if (post && Diskrit.components.modals && Diskrit.components.modals.openMediaLightbox) {
          Diskrit.components.modals.openMediaLightbox(post);
        }
      });
    });

    // 3. Custom Video Player Controls
    container.querySelectorAll(".custom-video-player").forEach(player => {
      const video = player.querySelector(".custom-video-el");
      const overlayPlayBtn = player.querySelector(".video-overlay-play-btn");
      const ctrlPlayBtn = player.querySelector(".video-play-toggle-btn");
      const progressContainer = player.querySelector(".video-progress-container");
      const progressFilled = player.querySelector(".video-progress-filled");
      const timeDisplay = player.querySelector(".video-time-display");
      const muteBtn = player.querySelector(".video-mute-btn");
      const fullscreenBtn = player.querySelector(".video-fullscreen-btn");

      if (!video) return;

      const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
      };

      const togglePlay = () => {
        if (video.paused || video.ended) {
          // Pause any other playing videos in the feed
          document.querySelectorAll(".custom-video-el").forEach(v => {
            if (v !== video && !v.paused) v.pause();
          });
          video.play().catch(() => { });
        } else {
          video.pause();
        }
      };

      if (overlayPlayBtn) overlayPlayBtn.addEventListener("click", (e) => { e.stopPropagation(); togglePlay(); });
      if (ctrlPlayBtn) ctrlPlayBtn.addEventListener("click", (e) => { e.stopPropagation(); togglePlay(); });
      video.addEventListener("click", (e) => { e.stopPropagation(); togglePlay(); });

      video.addEventListener("play", () => {
        player.classList.add("is-playing");
        player.classList.remove("is-paused");
        if (ctrlPlayBtn) ctrlPlayBtn.innerHTML = Diskrit.icons("pause", "", 16);
      });

      video.addEventListener("pause", () => {
        player.classList.remove("is-playing");
        player.classList.add("is-paused");
        if (ctrlPlayBtn) ctrlPlayBtn.innerHTML = Diskrit.icons("play", "", 16);
      });

      video.addEventListener("timeupdate", () => {
        if (video.duration) {
          const percent = (video.currentTime / video.duration) * 100;
          if (progressFilled) progressFilled.style.width = `${percent}%`;
          if (timeDisplay) timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        }
      });

      video.addEventListener("loadedmetadata", () => {
        if (timeDisplay && video.duration) {
          timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
        }
      });

      if (progressContainer) {
        progressContainer.addEventListener("click", (e) => {
          e.stopPropagation();
          const rect = progressContainer.getBoundingClientRect();
          const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          if (video.duration) {
            video.currentTime = pos * video.duration;
          }
        });
      }

      if (muteBtn) {
        muteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          video.muted = !video.muted;
          muteBtn.innerHTML = Diskrit.icons(video.muted ? "volumeX" : "volume2", "", 16);
        });
      }

      if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!document.fullscreenElement) {
            if (player.requestFullscreen) {
              player.requestFullscreen();
            } else if (video.webkitEnterFullscreen) {
              video.webkitEnterFullscreen();
            }
          } else {
            if (document.exitFullscreen) document.exitFullscreen();
          }
        });
      }
    });

    // 4. Like toggle with heartPop micro-animation
    container.querySelectorAll(".like-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const posts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
        const post = posts.find(p => p.id === id);
        if (!post) return;

        post.isLiked = !post.isLiked;
        post.likesCount = post.isLiked ? (post.likesCount || 0) + 1 : Math.max(0, (post.likesCount || 0) - 1);
        Diskrit.storage.set("posts", posts);

        btn.classList.toggle("liked", post.isLiked);
        btn.querySelector(".like-count").textContent = post.likesCount;
        btn.querySelector("svg").style.animation = post.isLiked ? "heartPop 0.35s ease" : "none";
      });
    });

    // 5. Bookmark toggle
    container.querySelectorAll(".bookmark-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const posts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
        const post = posts.find(p => p.id === id);
        if (!post) return;

        post.isBookmarked = !post.isBookmarked;
        Diskrit.storage.set("posts", posts);

        // Update saved bookmarks array
        let saved = Diskrit.storage.get("savedBookmarks", Diskrit.mockData.savedBookmarks);
        if (post.isBookmarked) {
          if (!saved.some(s => s.postId === id)) {
            saved.unshift({
              id: `save-${Date.now()}`,
              postId: post.id,
              title: post.content.slice(0, 40) + "...",
              authorName: post.authorName,
              authorHandle: post.authorHandle,
              type: post.mediaType === "video" ? "video" : "post",
              thumbnail: post.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
              savedDate: new Date().toISOString().split('T')[0],
              daysLeft: 21,
              isPermanent: false
            });
          }
          btn.classList.add("bookmarked");
          Diskrit.components.modals.toast("Post saved to bookmarks library (21-day challenge)", "success");
        } else {
          saved = saved.filter(s => s.postId !== id);
          btn.classList.remove("bookmarked");
          Diskrit.components.modals.toast("Bookmark removed", "info");
        }
        Diskrit.storage.set("savedBookmarks", saved);
      });
    });

    // 6. Comment drawer expander toggle
    container.querySelectorAll(".comment-toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const sec = document.getElementById(`comments-sec-${id}`);
        if (sec) {
          sec.style.display = sec.style.display === "none" ? "flex" : "none";
          if (sec.style.display === "flex") {
            const input = document.getElementById(`comment-input-${id}`);
            if (input) input.focus();
          }
        }
      });
    });

    // 7. Comment submission
    container.querySelectorAll(".submit-comment-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const input = document.getElementById(`comment-input-${id}`);
        const text = input ? input.value.trim() : "";
        if (!text) return;

        const posts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
        const post = posts.find(p => p.id === id);
        if (!post) return;

        const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;
        const newComment = {
          id: `c-${Date.now()}`,
          authorName: user.name,
          authorHandle: user.handle,
          authorAvatar: user.avatar,
          content: text,
          time: "Just now"
        };

        post.comments = post.comments || [];
        post.comments.push(newComment);
        Diskrit.storage.set("posts", posts);

        // Append to DOM
        const list = document.getElementById(`comments-list-${id}`);
        if (list) {
          const item = document.createElement("div");
          item.className = "comment-item";
          item.innerHTML = `
            <a href="#@${user.handle}" style="text-decoration: none; flex-shrink: 0;">
              <img src="${user.avatar}" class="avatar avatar-xs" alt="${user.name}">
            </a>
            <div class="comment-bubble">
              <div class="comment-author">
                <a href="#@${user.handle}" style="color: inherit; text-decoration: none; font-weight: 600;">${user.name}</a>
                <span style="font-weight: normal; color: var(--text-muted); font-size: 11px; margin-left: 6px;">Just now</span>
              </div>
              <div class="comment-text">${text}</div>
            </div>
          `;
          list.appendChild(item);
        }

        input.value = "";
        const card = document.getElementById(`card-${id}`);
        if (card) {
          const counter = card.querySelector(".comment-count");
          if (counter) counter.textContent = post.comments.length;
        }
        Diskrit.components.modals.toast("Comment published!", "success");
      });
    });

    // 8. Options dropdown menu triggers
    container.querySelectorAll(".post-menu-trigger").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const menu = document.getElementById(`menu-${id}`);
        if (menu) {
          document.querySelectorAll(".dropdown-menu").forEach(m => {
            if (m !== menu) m.classList.remove("open");
          });
          menu.classList.toggle("open");
        }
      });
    });

    // 9. Universal Social Share Modal (X, WhatsApp, Telegram, LinkedIn, FB, Reddit, Direct Copy & QR)
    container.querySelectorAll(".share-btn, .post-action-copy-link").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const slug = btn.dataset.slug;
        if (Diskrit.components && Diskrit.components.shareModal) {
          Diskrit.components.shareModal.open(slug);
        } else {
          const shareUrl = `${window.location.origin}${window.location.pathname}#post/${slug}`;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl).then(() => {
              Diskrit.components.modals.toast("Post link copied to clipboard!", "success");
            });
          } else {
            Diskrit.components.modals.toast(`Link: ${shareUrl}`, "info");
          }
        }
      });
    });

    // 10. 18+ Sensitive content bypass button
    container.querySelectorAll(".bypass-sensitive-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const card = document.getElementById(`card-${id}`);
        if (card) {
          const overlay = card.querySelector(".sensitive-overlay");
          if (overlay) overlay.remove();
          card.querySelectorAll(".sensitive-blur").forEach(el => el.classList.remove("sensitive-blur"));
          Diskrit.components.modals.toast("Sensitive content revealed for this session", "info");
        }
      });
    });

    // 11. Admin Hide Post trigger
    container.querySelectorAll(".post-action-hide").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        Diskrit.components.modals.showHidePostModal(id, (reason, notes) => {
          const card = document.getElementById(`card-${id}`);
          if (card) card.remove();
          Diskrit.components.modals.toast(`Post #${id} hidden (${reason})`, "info");
        });
      });
    });

    // 12. Report post trigger
    container.querySelectorAll(".post-action-report").forEach(btn => {
      btn.addEventListener("click", () => {
        Diskrit.components.modals.toast("Thank you. Report received for community moderation.", "info");
      });
    });
  }
};
