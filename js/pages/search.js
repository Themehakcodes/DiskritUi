/**
 * DISKRIT GLOBAL SEARCH & HASHTAG DISCOVERY PAGE
 * Handles /search and /tags/{tag} topical feeds
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.search = {
  render(params = {}) {
    const isTagFeed = !!params.tag;
    const query = (params.q || params.tag || '').toLowerCase().trim();

    if (isTagFeed) {
      return this.renderHashtagFeed(params.tag, params.feed);
    }

    return this.renderSearchResults(query);
  },

  renderHashtagFeed(tag, feedFilter) {
    const cleanTag = tag.replace('#', '');
    const allPosts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
    let matchedPosts = allPosts.filter(p => (p.content || '').toLowerCase().includes(`#${cleanTag.toLowerCase()}`));
    
    if (feedFilter === "video") {
      matchedPosts = matchedPosts.filter(p => p.mediaType === "video");
    } else if (feedFilter === "photos") {
      matchedPosts = matchedPosts.filter(p => p.mediaType === "image");
    }

    const trendingMeta = Diskrit.mockData.trendingHashtags.find(t => t.tag.toLowerCase() === `#${cleanTag.toLowerCase()}`) || {
      count: `${matchedPosts.length} posts`,
      views: "140K views"
    };

    const followedTags = Diskrit.storage.get("followed_tags", ["#generative", "#cyberpunk"]);
    const isFollowed = followedTags.includes(`#${cleanTag.toLowerCase()}`);
    const viewMode = Diskrit.storage.get("feedViewMode", "grid");

    // Creators who posted with this tag
    const creatorHandles = [...new Set(matchedPosts.map(p => p.authorHandle))];
    const allUsers = Diskrit.mockData.users.concat(Diskrit.mockData.currentUser);
    const topCreators = creatorHandles.map(h => allUsers.find(u => u.handle === h)).filter(Boolean);

    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-5);">
        <!-- Hashtag Hero Header Banner -->
        <div class="card" style="background: var(--bg-card); border-color: var(--border-medium); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 60px; height: 60px; border-radius: var(--radius-xl); background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; border: 1px solid var(--accent);">
              #
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h1 style="font-size: var(--font-2xl); font-weight: 800; color: var(--text-primary); margin: 0;">#${cleanTag}</h1>
                <span class="badge" style="background: var(--accent-light); color: var(--accent); font-weight: 600;">Trending Topic</span>
              </div>
              <div style="font-size: var(--font-sm); color: var(--text-muted); margin-top: 4px;">
                ${trendingMeta.count} &bull; ${trendingMeta.views} &bull; Community Topic Feed
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn ${isFollowed ? 'btn-secondary' : 'btn-primary'} btn-sm" id="follow-hashtag-btn" data-tag="#${cleanTag.toLowerCase()}" style="gap: 6px;">
              ${Diskrit.icons(isFollowed ? "check" : "plus", "", 16)}
              <span id="follow-hashtag-label">${isFollowed ? 'Following Tag' : 'Follow Topic'}</span>
            </button>
            <button class="btn btn-secondary btn-sm" id="share-hashtag-btn" style="gap: 6px;" title="Copy topic link">
              ${Diskrit.icons("share", "", 16)}
              <span>Share</span>
            </button>
          </div>
        </div>

        ${topCreators.length > 0 ? `
          <!-- Top Creators in this topic -->
          <div class="card" style="padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: var(--font-xs); font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Active Creators:</span>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                ${topCreators.map(c => `
                  <a href="#@${c.handle}" class="pill-tag" style="text-decoration: none; padding: 2px 10px; gap: 6px;">
                    <img src="${c.avatar}" style="width: 18px; height: 18px; border-radius: 50%; object-fit: cover;">
                    <span style="font-weight: 600; font-size: var(--font-xs);">${c.name}</span>
                  </a>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Filter Pills & View Switcher -->
        <div class="feed-toolbar" style="margin-top: 4px;">
          <div class="feed-tabs">
            <a 
              href="#tags/${cleanTag}" 
              class="pill-tag ${!feedFilter ? 'selected' : ''}" 
              style="text-decoration: none;"
            >
              ${Diskrit.icons("home", "", 16)}
              <span>All Posts (${allPosts.filter(p => (p.content || '').toLowerCase().includes('#' + cleanTag.toLowerCase())).length})</span>
            </a>
            <a 
              href="#tags/${cleanTag}?feed=video" 
              class="pill-tag ${feedFilter === 'video' ? 'selected' : ''}" 
              style="text-decoration: none;"
            >
              ${Diskrit.icons("video", "", 16)}
              <span>Videos (${allPosts.filter(p => (p.content || '').toLowerCase().includes('#' + cleanTag.toLowerCase()) && p.mediaType === 'video').length})</span>
            </a>
            <a 
              href="#tags/${cleanTag}?feed=photos" 
              class="pill-tag ${feedFilter === 'photos' ? 'selected' : ''}" 
              style="text-decoration: none;"
            >
              ${Diskrit.icons("image", "", 16)}
              <span>Photos (${allPosts.filter(p => (p.content || '').toLowerCase().includes('#' + cleanTag.toLowerCase()) && p.mediaType === 'image').length})</span>
            </a>
          </div>

          <div class="view-mode-switcher" aria-label="Tag feed display mode">
            <button 
              id="tag-view-grid-btn" 
              class="view-mode-btn ${viewMode === 'grid' ? 'active' : ''}" 
              title="Two-column Masonry View"
            >
              ${Diskrit.icons("grid", "", 14)}
              <span>Grid View</span>
            </button>
            <button 
              id="tag-view-stream-btn" 
              class="view-mode-btn ${viewMode === 'stream' ? 'active' : ''}" 
              title="Single-column Stream View"
            >
              ${Diskrit.icons("list", "", 14)}
              <span>Stream View</span>
            </button>
          </div>
        </div>

        <!-- Tagged Posts Stream (Responsive 2-Col Masonry or 1-Col Stream) -->
        <section 
          id="hashtag-posts-container" 
          class="${viewMode === 'grid' ? 'posts-grid-view' : 'posts-stream-view'}"
        >
          ${matchedPosts.length === 0 ? `
            <div class="card" style="text-align: center; padding: 48px var(--space-6); grid-column: 1 / -1; width: 100%;">
              <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
              <h3 style="font-size: var(--font-base); font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">No posts found</h3>
              <p style="color: var(--text-muted); font-size: var(--font-sm);">No posts currently match this filter under #${cleanTag}.</p>
            </div>
          ` : matchedPosts.map(p => Diskrit.components.postCard.renderPostCard(p)).join('')}
        </section>
      </div>
    `;
  },

  renderSearchResults(query) {
    const allUsers = Diskrit.mockData.users.concat(Diskrit.mockData.currentUser);
    const allPosts = Diskrit.storage.get("posts", Diskrit.mockData.posts);

    const matchedUsers = query ? allUsers.filter(u => 
      u.name.toLowerCase().includes(query) || 
      u.handle.toLowerCase().includes(query) || 
      (u.bio || '').toLowerCase().includes(query)
    ) : allUsers.slice(0, 4);

    const matchedPosts = query ? allPosts.filter(p => 
      (p.content || '').toLowerCase().includes(query)
    ) : allPosts;

    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-6);">
        <!-- Search Header -->
        <div class="card" style="display: flex; flex-direction: column; gap: 14px;">
          <h1 style="font-size: var(--font-xl); font-weight: 700;">
            ${query ? `Search Results for "${query}"` : 'Explore Community & Content'}
          </h1>
          <div class="search-input-wrapper">
            <span class="search-input-icon">${Diskrit.icons("search", "", 18)}</span>
            <input 
              type="text" 
              id="search-page-input" 
              class="form-input" 
              value="${query}" 
              placeholder="Search people, tags, topics..."
              style="padding-left: 2.6rem;"
            >
          </div>
        </div>

        <!-- Matched Creators Grid -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="font-size: var(--font-md); font-weight: 700; color: var(--text-primary);">
            Creators & Accounts (${matchedUsers.length})
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-4);">
            ${matchedUsers.map(u => `
              <div class="card" style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                <a href="#@${u.handle}" style="display: flex; align-items: center; gap: 12px; text-decoration: none;">
                  <img src="${u.avatar}" class="avatar avatar-md" alt="${u.name}">
                  <div>
                    <div style="font-weight: 600; font-size: var(--font-sm); color: var(--text-primary);">${u.name}</div>
                    <div style="font-size: var(--font-xs); color: var(--text-muted);">@${u.handle}</div>
                  </div>
                </a>
                <button class="btn btn-secondary btn-sm follow-user-btn" data-handle="${u.handle}">
                  ${u.profileType === 'public' ? 'Follow' : 'Add'}
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Matched Posts Stream -->
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="font-size: var(--font-md); font-weight: 700; color: var(--text-primary);">
            Relevant Posts (${matchedPosts.length})
          </div>
          <!-- Matched Posts Stream (Adaptive Grid) -->
          <div class="posts-grid-view" id="search-posts-stream">
            ${matchedPosts.length === 0 ? `
              <div class="card" style="text-align: center; padding: 40px; grid-column: 1 / -1;">
                <p style="color: var(--text-muted);">No posts matched your search keyword.</p>
              </div>
            ` : matchedPosts.map(p => Diskrit.components.postCard.renderPostCard(p)).join('')}
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    // Search page input listener
    const input = document.getElementById("search-page-input");
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const val = input.value.trim();
          window.location.hash = `#search?q=${encodeURIComponent(val)}`;
        }
      });
    }

    // Follow / Unfollow hashtag button
    const followTagBtn = document.getElementById("follow-hashtag-btn");
    if (followTagBtn) {
      followTagBtn.addEventListener("click", () => {
        const tag = followTagBtn.dataset.tag;
        let followed = Diskrit.storage.get("followed_tags", ["#generative", "#cyberpunk"]);
        const label = document.getElementById("follow-hashtag-label");

        if (followed.includes(tag)) {
          followed = followed.filter(t => t !== tag);
          Diskrit.storage.set("followed_tags", followed);
          followTagBtn.classList.remove("btn-secondary");
          followTagBtn.classList.add("btn-primary");
          if (label) label.textContent = "Follow Topic";
          Diskrit.components.modals.toast(`Unfollowed ${tag}`, "info");
        } else {
          followed.push(tag);
          Diskrit.storage.set("followed_tags", followed);
          followTagBtn.classList.remove("btn-primary");
          followTagBtn.classList.add("btn-secondary");
          if (label) label.textContent = "Following Tag";
          Diskrit.components.modals.toast(`Now following topic ${tag}! Added to your feed.`, "success");
        }
      });
    }

    // View mode switcher for hashtag feed
    const tagGridBtn = document.getElementById("tag-view-grid-btn");
    const tagStreamBtn = document.getElementById("tag-view-stream-btn");
    const hashtagContainer = document.getElementById("hashtag-posts-container");

    if (tagGridBtn && tagStreamBtn && hashtagContainer) {
      tagGridBtn.addEventListener("click", () => {
        hashtagContainer.classList.remove("posts-stream-view");
        hashtagContainer.classList.add("posts-grid-view");
        tagGridBtn.classList.add("active");
        tagStreamBtn.classList.remove("active");
        Diskrit.storage.set("feedViewMode", "grid");
        if (Diskrit.masonry) Diskrit.masonry.init(hashtagContainer);
        Diskrit.components.modals.toast("Switched to 2-column Grid View", "info");
      });

      tagStreamBtn.addEventListener("click", () => {
        hashtagContainer.classList.remove("posts-grid-view");
        hashtagContainer.classList.add("posts-stream-view");
        hashtagContainer.querySelectorAll(".post-card, article, .card").forEach(el => el.style.gridRowEnd = "");
        tagStreamBtn.classList.add("active");
        tagGridBtn.classList.remove("active");
        Diskrit.storage.set("feedViewMode", "stream");
        Diskrit.components.modals.toast("Switched to single-column Stream View", "info");
      });
    }

    // Share hashtag button (Universal Social Media Share Modal)
    const shareTagBtn = document.getElementById("share-hashtag-btn");
    if (shareTagBtn) {
      shareTagBtn.addEventListener("click", () => {
        const hash = window.location.hash.slice(1);
        const tag = hash.replace(/^tags\//, '').split('?')[0] || 'generative';
        const tagData = {
          id: `tag-${tag}`,
          slug: `tags/${tag}`,
          content: `Explore trending creative posts and discussions tagged #${tag} on Diskrit.`,
          authorName: `#${tag} Community Topic`,
          authorHandle: `tags/${tag}`,
          authorAvatar: "assets/images/logo.png"
        };
        if (Diskrit.components && Diskrit.components.shareModal) {
          Diskrit.components.shareModal.open(tagData);
        } else {
          const url = window.location.href;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
              Diskrit.components.modals.toast("Hashtag link copied to clipboard!", "success");
            });
          }
        }
      });
    }

    // Attach post card events & auto-pack masonry
    const stream = document.getElementById("search-posts-stream") || document.getElementById("hashtag-posts-container");
    if (stream) {
      Diskrit.components.postCard.attachEvents(stream);
      if (Diskrit.masonry && stream.classList.contains("posts-grid-view")) {
        Diskrit.masonry.init(stream);
      }
    }
  }
};
