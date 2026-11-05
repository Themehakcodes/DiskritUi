/**
 * DISKRIT SHORTS & REELS PAGE (Instagram-Style Vertical Snap Scroll Feed)
 * Solves Flaws 4.1, 4.2 & 4.3:
 * - Continuous Instagram / TikTok vertical scroll snap physics
 * - Adaptive fill: 100% edge-to-edge on mobile/tablet, 9:16 vertical on desktop
 * - Autoplay active video & auto-pause background videos via IntersectionObserver
 * - Global audio synchronization across all reels
 * - Double-tap/double-click heart burst animation & single-tap play/pause
 * - Native-feeling slide-over comments bottom sheet
 * - Desktop arrow buttons, wheel, touch gesture, and keyboard (J/K/Arrows) navigation
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.shorts = {
  isMuted: true,
  activeSlideIndex: 0,
  _observer: null,
  _keyHandler: null,

  render() {
    const shorts = Diskrit.mockData.shorts;

    return `
      <div class="shorts-feed-viewport" id="shorts-feed-viewport" aria-label="Shorts Feed">
        ${shorts.map((short, index) => this.renderShortSlide(short, index)).join('')}
      </div>
    `;
  },

  renderShortSlide(short, index) {
    const followingList = Diskrit.storage.get("following_handles", ["marcus_chen", "sarahj"]);
    const isFollowing = followingList.includes(short.creatorHandle);

    return `
      <section class="shorts-slide" data-index="${index}" data-id="${short.id}" id="slide-${short.id}">
        <!-- Ambient video glow for desktop cinematic mode -->
        <img src="${short.posterUrl}" class="shorts-ambient-glow" alt="Ambient glow">

        <div class="shorts-player-wrapper">
          <!-- Video Card Player -->
          <div class="shorts-player-card" data-id="${short.id}">
            <video 
              class="shorts-video-element" 
              src="${short.videoUrl}" 
              poster="${short.posterUrl}" 
              loop 
              playsinline 
              preload="metadata"
              ${this.isMuted ? 'muted' : ''}
            ></video>

            <!-- Tap play/pause indicator -->
            <div class="shorts-play-indicator">
              ${Diskrit.icons("play", "", 32)}
            </div>

            <!-- Floating Right Action Rail -->
            <div class="shorts-action-sidebar">
              <!-- Like Button -->
              <button class="shorts-action-btn ${short.isLiked ? 'liked' : ''} shorts-like-btn" data-id="${short.id}" title="Like Video" aria-label="Like Video">
                <div class="shorts-action-icon-circle">
                  ${Diskrit.icons("heart", "", 24)}
                </div>
                <span class="shorts-action-label like-count">${short.likesCount}</span>
              </button>

              <!-- Comments Button -->
              <button class="shorts-action-btn shorts-comments-btn" data-id="${short.id}" title="View Comments" aria-label="Comments">
                <div class="shorts-action-icon-circle">
                  ${Diskrit.icons("message", "", 24)}
                </div>
                <span class="shorts-action-label comment-count">${short.comments.length}</span>
              </button>

              <!-- Share Button -->
              <button class="shorts-action-btn shorts-share-btn" data-id="${short.id}" title="Share Reel" aria-label="Share">
                <div class="shorts-action-icon-circle">
                  ${Diskrit.icons("share", "", 24)}
                </div>
                <span class="shorts-action-label">Share</span>
              </button>

              <!-- Sound Toggle Button -->
              <button class="shorts-action-btn shorts-sound-btn" title="Toggle Audio" aria-label="Toggle Sound">
                <div class="shorts-action-icon-circle sound-icon-circle">
                  ${Diskrit.icons(this.isMuted ? "volumeX" : "volume2", "", 22)}
                </div>
                <span class="shorts-action-label sound-label">${this.isMuted ? 'Muted' : 'Sound'}</span>
              </button>
            </div>

            <!-- Bottom Creator & Caption Overlay -->
            <div class="shorts-bottom-overlay">
              <div class="shorts-creator-row">
                <img src="${short.creatorAvatar}" class="avatar avatar-sm" alt="${short.creatorName}">
                <a href="#@${short.creatorHandle}" class="shorts-creator-name">@${short.creatorHandle}</a>
                <button class="shorts-follow-btn ${isFollowing ? 'following' : ''}" data-handle="${short.creatorHandle}">${isFollowing ? 'Following' : 'Follow'}</button>
              </div>
              <div class="shorts-caption">
                ${short.caption}
              </div>
              <div class="shorts-audio-tag">
                ${Diskrit.icons("zap", "", 12)}
                <span>${short.viewsCount} views &bull; Original Audio</span>
              </div>
            </div>

            <!-- Slide-Over Comments Drawer (Solves Flaw 4.3) -->
            <div class="shorts-comments-drawer" id="comments-drawer-${short.id}">
              <div class="comments-drawer-handle"></div>
              <div class="comments-drawer-header">
                <span style="font-weight: 600; font-size: var(--font-sm);">Comments (${short.comments.length})</span>
                <button class="btn-icon close-comments-btn" data-id="${short.id}" style="color: var(--text-muted);" aria-label="Close comments">
                  ${Diskrit.icons("x", "", 18)}
                </button>
              </div>
              <div class="comments-drawer-body" id="comments-list-${short.id}">
                ${short.comments.map(c => `
                  <div class="comment-item">
                    <div class="comment-bubble" style="width: 100%;">
                      <div class="comment-author">${c.author} <span style="font-size: 11px; color: var(--text-muted); font-weight: normal; margin-left: 6px;">${c.time}</span></div>
                      <div class="comment-text">${c.text}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="comments-drawer-footer">
                <div class="comment-input-row">
                  <input type="text" class="comment-input short-comment-input" data-id="${short.id}" placeholder="Add a comment to this short...">
                  <button class="btn btn-primary btn-sm short-comment-submit-btn" data-id="${short.id}">
                    ${Diskrit.icons("send", "", 14)}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Up/Down Navigation Buttons (Outside Card, visible on widescreen) -->
          <div class="shorts-desktop-nav">
            <button class="shorts-nav-arrow-btn desktop-prev-btn" title="Previous Short (Up Arrow / K)">
              ${Diskrit.icons("chevronUp", "", 22)}
            </button>
            <button class="shorts-nav-arrow-btn desktop-next-btn" title="Next Short (Down Arrow / J)">
              ${Diskrit.icons("chevronDown", "", 22)}
            </button>
          </div>
        </div>
      </section>
    `;
  },

  attachEvents() {
    const viewport = document.getElementById("shorts-feed-viewport");
    if (!viewport) return;

    const slides = Array.from(document.querySelectorAll(".shorts-slide"));
    if (slides.length === 0) return;

    // 1. Setup IntersectionObserver for Instagram-style auto-play & auto-pause
    if ("IntersectionObserver" in window) {
      if (this._observer) {
        this._observer.disconnect();
      }

      this._observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const video = entry.target.querySelector("video");
          const index = parseInt(entry.target.dataset.index, 10);

          if (entry.isIntersecting) {
            this.activeSlideIndex = index;
            if (video) {
              video.muted = this.isMuted;
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  // If browser blocked autoplay with sound, fallback to muted autoplay
                  video.muted = true;
                  video.play().catch(() => {});
                });
              }
            }
          } else {
            if (video) {
              video.pause();
            }
          }
        });
      }, {
        root: viewport,
        threshold: 0.6
      });

      slides.forEach(slide => this._observer.observe(slide));
    } else {
      // Fallback: play first video
      const firstVideo = slides[0].querySelector("video");
      if (firstVideo) firstVideo.play().catch(() => {});
    }

    // 2. Tap to Play/Pause & Double-Tap to Like on Video
    slides.forEach(slide => {
      const video = slide.querySelector("video");
      const indicator = slide.querySelector(".shorts-play-indicator");
      const card = slide.querySelector(".shorts-player-card");
      let lastTap = 0;

      if (video && card) {
        card.addEventListener("click", (e) => {
          // Ignore clicks on buttons, overlays, or drawer
          if (e.target.closest("button") || e.target.closest(".shorts-action-sidebar") || e.target.closest(".shorts-bottom-overlay") || e.target.closest(".shorts-comments-drawer")) {
            return;
          }

          const currentTime = new Date().getTime();
          const tapGap = currentTime - lastTap;

          if (tapGap < 320 && tapGap > 0) {
            // DOUBLE TAP / DOUBLE CLICK: Instagram Heart Pop!
            this.triggerHeartPop(card);
            this.likeShort(slide.dataset.id, slide);
            lastTap = 0;
          } else {
            // SINGLE TAP: Toggle Play/Pause
            lastTap = currentTime;
            setTimeout(() => {
              if (new Date().getTime() - lastTap >= 300 && lastTap !== 0) {
                if (video.paused) {
                  video.play().catch(() => {});
                  if (indicator) {
                    indicator.innerHTML = Diskrit.icons("play", "", 32);
                    indicator.classList.add("active");
                    setTimeout(() => indicator.classList.remove("active"), 400);
                  }
                } else {
                  video.pause();
                  if (indicator) {
                    indicator.innerHTML = Diskrit.icons("pause", "", 32);
                    indicator.classList.add("active");
                    setTimeout(() => indicator.classList.remove("active"), 400);
                  }
                }
                lastTap = 0;
              }
            }, 300);
          }
        });
      }
    });

    // 3. Like Button Toggle
    document.querySelectorAll(".shorts-like-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const slide = document.getElementById(`slide-${id}`);
        this.likeShort(id, slide);
      });
    });

    // 4. Global Sound Toggle Across All Reels
    document.querySelectorAll(".shorts-sound-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.isMuted = !this.isMuted;
        this.syncAudioState();
      });
    });

    // 5. Comments Slide-Over Drawer
    document.querySelectorAll(".shorts-comments-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const drawer = document.getElementById(`comments-drawer-${id}`);
        if (drawer) drawer.classList.add("open");
      });
    });

    document.querySelectorAll(".close-comments-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const drawer = document.getElementById(`comments-drawer-${id}`);
        if (drawer) drawer.classList.remove("open");
      });
    });

    // 6. Submit New Comment
    document.querySelectorAll(".short-comment-submit-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.submitComment(id);
      });
    });

    document.querySelectorAll(".short-comment-input").forEach(input => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const id = input.dataset.id;
          this.submitComment(id);
        }
      });
    });

    // 7. Universal Share Modal for Shorts
    document.querySelectorAll(".shorts-share-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const shorts = Diskrit.mockData.shorts || [];
        const short = shorts.find(s => s.id === id) || { id, title: "Short Reel" };
        const shareData = {
          id: short.id,
          slug: `shorts?id=${short.id}`,
          content: short.title || short.caption || "Watch this reel on Diskrit Shorts",
          authorName: short.creatorName || short.authorName || "Creator",
          authorHandle: short.creatorHandle || short.authorHandle || "creator",
          authorAvatar: short.creatorAvatar || short.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=280&q=80",
          mediaUrl: short.videoUrl || short.posterUrl
        };

        if (Diskrit.components.shareModal) {
          Diskrit.components.shareModal.open(shareData);
        } else {
          const url = `${window.location.origin}${window.location.pathname}#shorts?id=${id}`;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
              Diskrit.components.modals.toast("Reel link copied to clipboard!", "success");
            });
          }
        }
      });
    });

    // 8. Follow Creator Button (Synced with Global Storage)
    document.querySelectorAll(".shorts-follow-btn").forEach(btn => {
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
        document.querySelectorAll(`.shorts-follow-btn[data-handle="${handle}"]`).forEach(b => {
          b.classList.toggle("following", isNowFollowing);
          b.textContent = isNowFollowing ? "Following" : "Follow";
        });
      });
    });

    // 9. Desktop Arrow Navigation Buttons (Smooth Snap Scroll)
    document.querySelectorAll(".desktop-prev-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const slideHeight = viewport.clientHeight;
        viewport.scrollBy({ top: -slideHeight, behavior: "smooth" });
      });
    });

    document.querySelectorAll(".desktop-next-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const slideHeight = viewport.clientHeight;
        viewport.scrollBy({ top: slideHeight, behavior: "smooth" });
      });
    });

    // 10. Keyboard Navigation (Arrows & J/K & Space & Mute)
    if (this._keyHandler) {
      window.removeEventListener("keydown", this._keyHandler);
    }

    this._keyHandler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      const slideHeight = viewport.clientHeight;
      if (e.key === "ArrowDown" || e.key === "j" || e.key === "J") {
        e.preventDefault();
        viewport.scrollBy({ top: slideHeight, behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "k" || e.key === "K") {
        e.preventDefault();
        viewport.scrollBy({ top: -slideHeight, behavior: "smooth" });
      } else if (e.key === "m" || e.key === "M") {
        this.isMuted = !this.isMuted;
        this.syncAudioState();
      } else if (e.key === " ") {
        e.preventDefault();
        const activeSlide = slides[this.activeSlideIndex];
        if (activeSlide) {
          const video = activeSlide.querySelector("video");
          if (video) {
            if (video.paused) video.play().catch(() => {});
            else video.pause();
          }
        }
      }
    };
    window.addEventListener("keydown", this._keyHandler);

    // Register cleanup callback for router unmount
    Diskrit.cleanup = () => {
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
      if (this._keyHandler) {
        window.removeEventListener("keydown", this._keyHandler);
        this._keyHandler = null;
      }
      document.querySelectorAll(".shorts-video-element").forEach(v => v.pause());
    };
  },

  syncAudioState() {
    document.querySelectorAll(".shorts-video-element").forEach(v => {
      v.muted = this.isMuted;
    });

    document.querySelectorAll(".sound-icon-circle").forEach(circle => {
      circle.innerHTML = Diskrit.icons(this.isMuted ? "volumeX" : "volume2", "", 22);
    });

    document.querySelectorAll(".sound-label").forEach(lbl => {
      lbl.textContent = this.isMuted ? "Muted" : "Sound";
    });

    Diskrit.components.modals.toast(this.isMuted ? "Audio muted" : "Audio unmuted", "info");
  },

  likeShort(id, slide) {
    const shorts = Diskrit.mockData.shorts;
    const item = shorts.find(s => s.id === id);
    if (!item) return;

    item.isLiked = !item.isLiked;
    if (slide) {
      const btn = slide.querySelector(".shorts-like-btn");
      const count = slide.querySelector(".like-count");
      if (btn) btn.classList.toggle("liked", item.isLiked);
      if (count) {
        const raw = item.rawLikes || 14200;
        const newCount = item.isLiked ? (raw + 1) : raw;
        count.textContent = newCount > 1000 ? `${(newCount / 1000).toFixed(1)}K` : newCount;
      }
    }
  },

  triggerHeartPop(card) {
    if (!card) return;
    const heart = document.createElement("div");
    heart.className = "double-tap-heart";
    heart.innerHTML = Diskrit.icons("heart", "", 84);
    card.appendChild(heart);
    setTimeout(() => heart.remove(), 850);
  },

  submitComment(id) {
    const input = document.querySelector(`.short-comment-input[data-id="${id}"]`);
    const list = document.getElementById(`comments-list-${id}`);
    const slide = document.getElementById(`slide-${id}`);
    const text = input ? input.value.trim() : "";
    if (!text) return;

    const short = Diskrit.mockData.shorts.find(s => s.id === id);
    if (short) {
      const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;
      const newComment = {
        author: user.name,
        text: text,
        time: "Just now"
      };
      short.comments.push(newComment);

      if (list) {
        const commentDiv = document.createElement("div");
        commentDiv.className = "comment-item";
        commentDiv.innerHTML = `
          <div class="comment-bubble" style="width: 100%;">
            <div class="comment-author">${user.name} <span style="font-size: 11px; color: var(--text-muted); font-weight: normal; margin-left: 6px;">Just now</span></div>
            <div class="comment-text">${text}</div>
          </div>
        `;
        list.appendChild(commentDiv);
        list.scrollTop = list.scrollHeight;
      }

      if (slide) {
        const countSpan = slide.querySelector(".comment-count");
        if (countSpan) countSpan.textContent = short.comments.length;
        const headerSpan = slide.querySelector(".comments-drawer-header span");
        if (headerSpan) headerSpan.textContent = `Comments (${short.comments.length})`;
      }

      input.value = "";
      Diskrit.components.modals.toast("Comment added!", "success");
    }
  }
};
