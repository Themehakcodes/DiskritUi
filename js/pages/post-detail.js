/**
 * DISKRIT SINGLE POST PERMALINK & POST ANALYTICS
 * Handles /post/{slug} detail view and /post/{id}/analytics insight dashboard
 * Feature: Thread navigation (Previous/Next post), author bio sidebar, and auto-expanded comments
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.postDetail = {
  render(params = {}) {
    if (params.isAnalytics) {
      return this.renderAnalytics(params.id);
    }
    return this.renderPermalink(params.slug);
  },

  renderPermalink(slug) {
    const posts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
    const postIdx = posts.findIndex(p => p.slug === slug || p.id === slug);
    const post = postIdx !== -1 ? posts[postIdx] : posts[0];

    const prevPost = postIdx > 0 ? posts[postIdx - 1] : null;
    const nextPost = postIdx < posts.length - 1 && postIdx !== -1 ? posts[postIdx + 1] : null;

    // Author info
    const author = Diskrit.mockData.users.find(u => u.handle === post.authorHandle) || {
      name: post.authorName,
      handle: post.authorHandle,
      avatar: post.authorAvatar,
      bio: "Creator & contributor on Diskrit.",
      profileType: "public",
      followersCount: 1200
    };

    const followingList = Diskrit.storage.get("following_handles", ["marcus_chen", "sarahj"]);
    const isFollowing = followingList.includes(post.authorHandle);

    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-4); max-width: 900px; margin: 0 auto; width: 100%;">
        <!-- Header: Breadcrumb & Post Navigation -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 4px 0;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <a href="#home" class="btn btn-ghost btn-sm" style="gap: 6px;" title="Return to newsfeed">
              ${Diskrit.icons("chevronLeft", "", 16)}
              <span>Back to Feed</span>
            </a>
            <span style="color: var(--text-muted);">&bull;</span>
            <span class="badge badge-primary" style="font-size: 11px;">Single Post Thread</span>
          </div>

          <!-- Prev/Next Navigation Controls -->
          <div style="display: flex; align-items: center; gap: 8px;">
            ${prevPost ? `
              <a href="#post/${prevPost.slug || prevPost.id}" class="btn btn-secondary btn-sm" style="gap: 6px;" title="Previous post by ${prevPost.authorName}">
                ${Diskrit.icons("arrowLeft", "", 14)}
                <span>Previous</span>
              </a>
            ` : `
              <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.4; gap: 6px;">
                ${Diskrit.icons("arrowLeft", "", 14)}
                <span>Previous</span>
              </button>
            `}
            ${nextPost ? `
              <a href="#post/${nextPost.slug || nextPost.id}" class="btn btn-secondary btn-sm" style="gap: 6px;" title="Next post by ${nextPost.authorName}">
                <span>Next</span>
                ${Diskrit.icons("arrowRight", "", 14)}
              </a>
            ` : `
              <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.4; gap: 6px;">
                <span>Next</span>
                ${Diskrit.icons("arrowRight", "", 14)}
              </button>
            `}
            <button class="btn btn-secondary btn-sm" id="post-detail-header-share-btn" title="Share this post" style="gap: 6px;">
              ${Diskrit.icons("share", "", 14)}
              <span>Share</span>
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: var(--space-5);" class="post-detail-layout">
          <!-- Main Post Card Container -->
          <div id="permalink-card-container">
            ${Diskrit.components.postCard.renderPostCard(post)}
          </div>

          <!-- Right Sidebar: Author Snapshot & Context -->
          <aside style="display: flex; flex-direction: column; gap: var(--space-4);" class="post-detail-sidebar">
            <div class="card" style="padding: var(--space-4); display: flex; flex-direction: column; gap: 12px;">
              <div style="font-size: var(--font-xs); font-weight: 700; color: var(--text-muted); text-transform: uppercase;">About the Author</div>
              
              <div style="display: flex; align-items: center; gap: 12px;">
                <a href="#@${post.authorHandle}" style="text-decoration: none;">
                  <img src="${post.authorAvatar}" class="avatar avatar-lg" alt="${post.authorName}">
                </a>
                <div style="min-width: 0;">
                  <a href="#@${post.authorHandle}" style="font-weight: 700; color: var(--text-primary); text-decoration: none; font-size: 15px; display: block;" class="author-hover-link">${post.authorName}</a>
                  <a href="#@${post.authorHandle}" style="font-size: 12px; color: var(--accent); text-decoration: none;">@${post.authorHandle}</a>
                </div>
              </div>

              ${author.bio ? `
                <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; margin: 0;">${author.bio}</p>
              ` : ''}

              <div style="display: flex; gap: 8px; margin-top: 4px;">
                ${!post.isAnonymous ? `
                  <button class="btn ${isFollowing ? 'btn-secondary' : 'btn-primary'} btn-sm post-author-follow-btn" data-handle="${post.authorHandle}" style="flex: 1;">
                    ${isFollowing ? 'Following' : '+ Follow'}
                  </button>
                  <a href="#chatify/${author.id || 'user'}" class="btn btn-secondary btn-sm" style="flex: 1; justify-content: center;" title="Send direct message">
                    ${Diskrit.icons("message", "", 14)}
                    <span>Message</span>
                  </a>
                ` : `
                  <div class="badge" style="width: 100%; justify-content: center; background: var(--bg-surface-elevated); color: var(--accent);">Encrypted Poster</div>
                `}
              </div>
            </div>

            <!-- Thread Navigation Tips -->
            <div class="card" style="padding: var(--space-4); display: flex; flex-direction: column; gap: 8px;">
              <div style="font-size: var(--font-xs); font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Thread Shortcuts</div>
              <div style="font-size: 12px; color: var(--text-muted); line-height: 1.5;">
                Use <kbd style="background: var(--bg-surface-elevated); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-subtle); color: var(--text-primary);">←</kbd> and <kbd style="background: var(--bg-surface-elevated); padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border-subtle); color: var(--text-primary);">→</kbd> arrow keys to jump between posts in the stream.
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;
  },

  renderAnalytics(id) {
    const posts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
    const post = posts.find(p => p.id === id || p.slug === id) || posts[0];

    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-6);">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <a href="#post/${post.slug || post.id}" class="btn btn-ghost btn-sm" style="gap: 6px;">
                ${Diskrit.icons("chevronLeft", "", 16)}
                <span>Back to Post</span>
              </a>
            </div>
            <h1 style="font-size: var(--font-2xl); font-weight: 700;">Post Performance Analytics</h1>
            <p style="color: var(--text-muted); font-size: var(--font-sm);">
              Author insights for: "${post.content.slice(0, 50)}..."
            </p>
          </div>
          <span class="badge badge-primary">Author View Only</span>
        </div>

        <!-- 4-Metric KPI Grid -->
        <div class="kpi-grid">
          <div class="kpi-card kpi-success">
            <span class="kpi-label">Total Impressions & Views</span>
            <div class="kpi-value-row">
              <span class="kpi-value">${post.viewsCount || 1840}</span>
              <span class="kpi-trend">+18.4%</span>
            </div>
          </div>

          <div class="kpi-card">
            <span class="kpi-label">Hearts & Likes</span>
            <div class="kpi-value-row">
              <span class="kpi-value">${post.likesCount || 0}</span>
              <span class="kpi-trend">7.8% CTR</span>
            </div>
          </div>

          <div class="kpi-card">
            <span class="kpi-label">Discussion Comments</span>
            <div class="kpi-value-row">
              <span class="kpi-value">${post.comments ? post.comments.length : 0}</span>
              <span class="kpi-trend">+4 today</span>
            </div>
          </div>

          <div class="kpi-card">
            <span class="kpi-label">Published On</span>
            <div class="kpi-value-row">
              <span class="kpi-value" style="font-size: var(--font-xl);">${post.createdAt || 'Recent'}</span>
            </div>
          </div>
        </div>

        <!-- Post Snapshot Preview -->
        <div class="card" style="display: flex; flex-direction: column; gap: 14px;">
          <div style="font-weight: 700; font-size: var(--font-md);">Content Overview</div>
          <div style="background: var(--bg-surface-elevated); padding: 16px; border-radius: var(--radius-lg); font-size: var(--font-sm); line-height: 1.6;">
            ${post.content}
          </div>
        </div>

        <!-- Comments & Engagement Stream -->
        <div class="card" style="display: flex; flex-direction: column; gap: 14px;">
          <div style="font-weight: 700; font-size: var(--font-md);">Audience Responses (${post.comments ? post.comments.length : 0})</div>
          ${(!post.comments || post.comments.length === 0) ? `
            <div style="color: var(--text-muted); font-size: var(--font-sm);">No comments on this post yet.</div>
          ` : post.comments.map(c => `
            <div class="comment-item" style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
              <a href="#@${c.authorHandle || 'user'}">
                <img src="${c.authorAvatar}" class="avatar avatar-sm" alt="${c.authorName}">
              </a>
              <div class="comment-bubble" style="width: 100%;">
                <div class="comment-author">
                  <a href="#@${c.authorHandle || 'user'}" style="color: inherit; text-decoration: none; font-weight: 600;">${c.authorName}</a>
                  <span style="font-weight: normal; color: var(--text-muted); font-size: 11px; margin-left: 6px;">${c.time}</span>
                </div>
                <div class="comment-text">${c.content}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  attachEvents() {
    const permalinkContainer = document.getElementById("permalink-card-container");
    if (permalinkContainer) {
      Diskrit.components.postCard.attachEvents(permalinkContainer);
      // Auto-open comment drawer on single post view
      const commentsSec = permalinkContainer.querySelector(".post-comments-section");
      if (commentsSec) {
        commentsSec.style.display = "flex";
      }
    }

    // Top action row share button
    const headerShareBtn = document.getElementById("post-detail-header-share-btn");
    if (headerShareBtn) {
      headerShareBtn.addEventListener("click", () => {
        const posts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
        const hash = window.location.hash.slice(1);
        const slug = hash.replace(/^post\//, "").split("/")[0];
        const post = posts.find(p => p.slug === slug || p.id === slug) || posts[0];
        if (Diskrit.components && Diskrit.components.shareModal) {
          Diskrit.components.shareModal.open(post);
        }
      });
    }

    // Attach follow button in author snapshot card
    document.querySelectorAll(".post-detail-sidebar .post-author-follow-btn").forEach(btn => {
      btn.addEventListener("click", () => {
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
          if (b.classList.contains("btn")) {
            b.classList.toggle("btn-secondary", isNowFollowing);
            b.classList.toggle("btn-primary", !isNowFollowing);
          }
        });
      });
    });
  }
};
