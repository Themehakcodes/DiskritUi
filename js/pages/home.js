/**
 * DISKRIT HOME & VIDEO FEED PAGE
 * Handles /home and /home?feed=video with stories rail, composer, and post stream
 * Supports adaptive 2-column Grid view and single-column Stream view
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.home = {
  render(params = {}) {
    const feedFilter = params.feed; // "video", "photos", or undefined
    const stories = Diskrit.mockData.stories;
    let posts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
    const viewMode = Diskrit.storage.get("feedViewMode", "grid"); // Default to 2-column Grid

    if (feedFilter === "video") {
      posts = posts.filter(p => p.mediaType === "video");
    } else if (feedFilter === "photos") {
      posts = posts.filter(p => p.mediaType === "image");
    }

    return `
      <!-- Stories Rail Wrapper with Desktop Controls -->
      <div class="stories-rail-wrapper">
        <button class="stories-rail-scroll-btn prev" id="stories-scroll-prev" aria-label="Scroll stories left" title="Scroll left">
          ${Diskrit.icons("chevronLeft", "", 18)}
        </button>

        <section class="stories-rail" id="stories-rail" aria-label="Stories">
          ${stories.map(s => `
            <div class="story-card ${s.isOwn ? 'is-own-story' : ''}" data-id="${s.id}" title="${s.isOwn ? 'Your Story (Click to preview, + to add)' : s.userName + ' story'}">
              <img src="${s.mediaUrl}" class="story-card-bg" alt="${s.userName} story" loading="lazy">
              <div class="story-card-overlay"></div>
              <div class="story-avatar-wrap">
                <img src="${s.userAvatar}" class="avatar avatar-sm story-avatar-badge" alt="${s.userName}">
                ${s.isOwn ? `
                  <button class="story-add-badge" id="create-story-trigger" title="Add to story" aria-label="Add story">
                    ${Diskrit.icons("plus", "", 10)}
                  </button>
                ` : ''}
              </div>
              ${s.isOwn ? `
                <button class="story-add-pill-btn" id="create-story-pill-trigger" title="Create your story">
                  ${Diskrit.icons("plus", "", 10)}
                  <span>Add Story</span>
                </button>
              ` : `
                <span class="story-author-name">${s.userName}</span>
              `}
            </div>
          `).join('')}
        </section>

        <button class="stories-rail-scroll-btn next" id="stories-scroll-next" aria-label="Scroll stories right" title="Scroll right">
          ${Diskrit.icons("chevronRight", "", 18)}
        </button>
      </div>

      <!-- Feed Toolbar with Filter Pills & View Mode Switcher -->
      <div class="feed-toolbar">
        <div class="feed-tabs">
          <a 
            href="#home" 
            class="pill-tag ${!feedFilter ? 'selected' : ''}" 
            style="text-decoration: none;"
          >
            ${Diskrit.icons("home", "", 16)}
            <span>All Feeds</span>
          </a>
          <a 
            href="#home?feed=video" 
            class="pill-tag ${feedFilter === 'video' ? 'selected' : ''}" 
            style="text-decoration: none;"
          >
            ${Diskrit.icons("video", "", 16)}
            <span>Videos</span>
          </a>
          <a 
            href="#home?feed=photos" 
            class="pill-tag ${feedFilter === 'photos' ? 'selected' : ''}" 
            style="text-decoration: none;"
          >
            ${Diskrit.icons("image", "", 16)}
            <span>Photos</span>
          </a>
        </div>

        <!-- View Mode Switcher (Grid 2-col vs Stream 1-col) -->
        <div class="view-mode-switcher" aria-label="Feed display mode">
          <button 
            id="view-grid-btn" 
            class="view-mode-btn ${viewMode === 'grid' ? 'active' : ''}" 
            title="Two-column Grid View"
          >
            ${Diskrit.icons("grid", "", 14)}
            <span>Grid View</span>
          </button>
          <button 
            id="view-stream-btn" 
            class="view-mode-btn ${viewMode === 'stream' ? 'active' : ''}" 
            title="Single-column Stream View"
          >
            ${Diskrit.icons("list", "", 14)}
            <span>Stream View</span>
          </button>
        </div>
      </div>

      <!-- Post Composer (Open & Inviting by Default - Solves Flaw 3.1) -->
      ${Diskrit.components.composer.renderComposer()}

      <!-- Posts Timeline Stream (Responsive 2-col Grid or Stream) -->
      <section 
        id="posts-stream-container" 
        class="${viewMode === 'grid' ? 'posts-grid-view' : 'posts-stream-view'}"
      >
        ${posts.length === 0 ? `
          <div class="card" style="text-align: center; padding: var(--space-12); grid-column: 1 / -1;">
            <p style="color: var(--text-muted); font-size: var(--font-base);">No posts found in this feed view.</p>
          </div>
        ` : posts.map(p => Diskrit.components.postCard.renderPostCard(p)).join('')}
      </section>
    `;
  },

  attachEvents() {
    // 1. Attach view mode switcher handlers
    const gridBtn = document.getElementById("view-grid-btn");
    const streamBtn = document.getElementById("view-stream-btn");
    const container = document.getElementById("posts-stream-container");

    if (gridBtn && streamBtn && container) {
      gridBtn.addEventListener("click", () => {
        container.classList.remove("posts-stream-view");
        container.classList.add("posts-grid-view");
        gridBtn.classList.add("active");
        streamBtn.classList.remove("active");
        Diskrit.storage.set("feedViewMode", "grid");
        if (Diskrit.masonry) Diskrit.masonry.init(container);
        Diskrit.components.modals.toast("Switched to 2-column Grid View", "info");
      });

      streamBtn.addEventListener("click", () => {
        container.classList.remove("posts-grid-view");
        container.classList.add("posts-stream-view");
        container.querySelectorAll(".post-card, article, .card").forEach(el => el.style.gridRowEnd = "");
        streamBtn.classList.add("active");
        gridBtn.classList.remove("active");
        Diskrit.storage.set("feedViewMode", "stream");
        Diskrit.components.modals.toast("Switched to single-column Stream View", "info");
      });
    }

    // 2. Attach composer events
    Diskrit.components.composer.attachEvents((newPost) => {
      if (container) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = Diskrit.components.postCard.renderPostCard(newPost);
        const cardElem = tempDiv.firstElementChild;
        container.prepend(cardElem);
        Diskrit.components.postCard.attachEvents(cardElem);
        if (Diskrit.masonry && container.classList.contains("posts-grid-view")) {
          Diskrit.masonry.init(container);
        }
      }
    });

    // 3. Attach post card events & initialize Masonry Auto-Pack
    if (container) {
      Diskrit.components.postCard.attachEvents(container);
      const currentMode = Diskrit.storage.get("feedViewMode", "grid");
      if (currentMode === "grid" && Diskrit.masonry) {
        Diskrit.masonry.init(container);
      }
    }

    // 4. Stories rail scroll buttons & creator trigger
    const storiesRail = document.getElementById("stories-rail");
    const scrollPrev = document.getElementById("stories-scroll-prev");
    const scrollNext = document.getElementById("stories-scroll-next");
    if (storiesRail && scrollPrev && scrollNext) {
      scrollPrev.addEventListener("click", () => {
        storiesRail.scrollBy({ left: -260, behavior: "smooth" });
      });
      scrollNext.addEventListener("click", () => {
        storiesRail.scrollBy({ left: 260, behavior: "smooth" });
      });
    }

    const triggerStoryCreator = (e) => {
      if (e) e.stopPropagation();
      Diskrit.components.modals.openCreateStoryModal(() => {
        Diskrit.router.navigate(window.location.hash.slice(1) || "home");
      });
    };

    const createTrigger = document.getElementById("create-story-trigger");
    if (createTrigger) {
      createTrigger.addEventListener("click", triggerStoryCreator);
    }

    const createPill = document.getElementById("create-story-pill-trigger");
    if (createPill) {
      createPill.addEventListener("click", triggerStoryCreator);
    }

    // 5. Story fullscreen viewer on click
    document.querySelectorAll(".story-card").forEach(card => {
      card.addEventListener("click", () => {
        Diskrit.components.modals.openStoryViewer(card.dataset.id);
      });
    });
  }
};
