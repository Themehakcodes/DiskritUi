/**
 * DISKRIT USER PROFILE PAGE
 * Handles public and private profiles, visitor preview, demographic badges, tabs, and direct privacy toggle
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.profile = {
  activeTab: "posts",
  isVisitorPreview: false,

  render(params = {}) {
    const handle = (params.handle || 'alexmercer').replace('@', '');
    const currentUser = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;
    const isRealOwn = handle === currentUser.handle;
    const isOwn = isRealOwn && !this.isVisitorPreview;
    
    // Find target user
    const targetUser = isRealOwn ? currentUser : 
      (Diskrit.mockData.users.find(u => u.handle === handle) || currentUser);

    // Get relationships & following state
    const relationships = Diskrit.storage.get("user_relationships", {});
    const rel = relationships[targetUser.handle] || targetUser.relationship || "none";
    
    const followingList = Diskrit.storage.get("following_handles", ["marcus_chen", "sarahj"]);
    const isFollowing = followingList.includes(targetUser.handle);

    // Determine privacy wall state
    // Locked if user is private AND not own AND not a confirmed friend
    const isPrivateLocked = targetUser.profileType === 'private' && !isOwn && rel !== 'friend';

    const allPosts = Diskrit.storage.get("posts", Diskrit.mockData.posts);
    const userPosts = allPosts.filter(p => p.authorHandle === targetUser.handle);
    const videoPosts = userPosts.filter(p => p.mediaType === "video");
    const savedBookmarks = Diskrit.storage.get("savedBookmarks", Diskrit.mockData.savedBookmarks);

    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-4);">
        ${this.isVisitorPreview ? `
          <!-- Visitor Preview Notice Banner -->
          <div class="profile-preview-banner">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 20px;">👁️</span>
              <div>
                <strong>Visitor Preview Active:</strong> You are viewing @${targetUser.handle} as an external visitor (${targetUser.profileType === 'private' ? 'Private profile - locked' : 'Public creator profile - unlocked'}).
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" id="exit-preview-mode-btn" style="gap: 6px;">
              ${Diskrit.icons("x", "", 14)}
              <span>Exit Preview</span>
            </button>
          </div>
        ` : ''}

        <!-- Profile Card & Modern Header -->
        <div class="profile-card">
          <!-- Cover Banner -->
          <div class="profile-banner">
            <img src="${targetUser.banner}" class="profile-banner-img" alt="Profile banner" loading="lazy">
          </div>

          <!-- Header Body -->
          <div class="profile-header-content">
            <!-- Row: Avatar + Action Bar -->
            <div class="profile-avatar-row">
              <div class="profile-avatar-container">
                <img src="${targetUser.avatar}" class="profile-avatar-img" alt="${targetUser.name}">
              </div>

              <!-- Action Bar -->
              <div class="profile-actions-group">
                ${isOwn ? `
                  <!-- Quick Privacy Mode Toggle for Profile Owner -->
                  <button 
                    class="privacy-toggle-btn ${targetUser.profileType === 'public' ? 'is-active-public' : ''}" 
                    id="profile-quick-privacy-toggle" 
                    title="Click to toggle your profile between Public and Private"
                  >
                    ${Diskrit.icons(targetUser.profileType === 'public' ? "globe" : "lock", "", 14)}
                    <span>${targetUser.profileType === 'public' ? 'Public Creator' : 'Private Profile'}</span>
                  </button>

                  <!-- Preview as Visitor Toggle -->
                  <button class="btn btn-secondary btn-sm" id="profile-preview-visitor-btn" title="See what your profile looks like to non-friends" style="gap: 6px;">
                    ${Diskrit.icons("eye", "", 14)}
                    <span>Preview as Visitor</span>
                  </button>

                  <!-- Edit Profile Trigger Modal -->
                  <button class="btn btn-secondary btn-sm" id="profile-edit-modal-btn" style="gap: 6px;">
                    ${Diskrit.icons("settings", "", 14)}
                    <span>Edit Profile</span>
                  </button>

                  <a href="#creator/dashboard" class="btn btn-primary btn-sm" style="gap: 6px;">
                    ${Diskrit.icons("barChart", "", 14)}
                    <span>Studio</span>
                  </a>
                ` : `
                  ${targetUser.profileType === 'public' ? `
                    <button class="btn ${isFollowing ? 'btn-secondary' : 'btn-primary'} btn-sm profile-follow-action-btn" data-handle="${targetUser.handle}" data-type="public">
                      ${isFollowing ? 'Following ✓' : 'Follow Creator'}
                    </button>
                  ` : `
                    ${rel === 'friend' ? `
                      <button class="btn btn-secondary btn-sm profile-follow-action-btn" data-handle="${targetUser.handle}" data-type="friend">
                        Friends ✓
                      </button>
                    ` : rel === 'requested' ? `
                      <button class="btn btn-secondary btn-sm profile-follow-action-btn" data-handle="${targetUser.handle}" data-type="requested">
                        Request Pending
                      </button>
                    ` : `
                      <button class="btn btn-primary btn-sm profile-follow-action-btn" data-handle="${targetUser.handle}" data-type="none">
                        Add Friend
                      </button>
                    `}
                  `}

                  <a href="#chatify/${targetUser.id}" class="btn btn-secondary btn-sm" title="Direct Message" style="gap: 6px;">
                    ${Diskrit.icons("message", "", 14)}
                    <span>Message</span>
                  </a>

                  ${this.isVisitorPreview ? `
                    <button class="btn btn-ghost btn-sm" id="exit-preview-mode-btn-2" title="Return to Owner View">
                      Exit Preview
                    </button>
                  ` : `
                    <button class="btn-icon profile-more-btn" title="More Options">
                      ${Diskrit.icons("more", "", 18)}
                    </button>
                  `}
                `}
              </div>
            </div>

            <!-- Identity & Badges -->
            <div class="profile-info">
              <div class="profile-name-row">
                <h1 class="profile-display-name">${targetUser.name}</h1>
                <span class="profile-handle">@${targetUser.handle}</span>
                
                ${targetUser.profileType === 'public' ? `
                  <span class="badge profile-badge-creator">
                    ${Diskrit.icons("sparkles", "", 12)} Public Creator
                  </span>
                ` : rel === 'friend' ? `
                  <span class="badge profile-badge-friend">
                    ${Diskrit.icons("check", "", 12)} Mutual Friend &bull; Private
                  </span>
                ` : `
                  <span class="badge profile-badge-private">
                    ${Diskrit.icons("lock", "", 12)} Private Profile
                  </span>
                `}
              </div>

              <p class="profile-bio">${targetUser.bio || 'Exploring new creative horizons on Diskrit.'}</p>

              <!-- Mutual Friend Banner Note for Private Friend -->
              ${!isOwn && targetUser.profileType === 'private' && rel === 'friend' ? `
                <div style="background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.25); border-radius: var(--radius-md); padding: 8px 14px; font-size: var(--font-xs); color: #22c55e; display: flex; align-items: center; gap: 8px;">
                  ${Diskrit.icons("check", "", 14)}
                  <span>You and ${targetUser.name} are confirmed mutual friends. Her private gallery and videos are accessible to you.</span>
                </div>
              ` : ''}

              <!-- Demographic Tags Row -->
              <div class="profile-tags-row">
                ${targetUser.orientation ? `
                  <span class="pill-tag" style="font-size: var(--font-xs); padding: 2px 10px;">
                    ${targetUser.orientation}
                  </span>
                ` : ''}
                ${targetUser.identityRole ? `
                  <span class="pill-tag" style="font-size: var(--font-xs); padding: 2px 10px;">
                    ${targetUser.identityRole}
                  </span>
                ` : ''}
                <span class="pill-tag" style="font-size: var(--font-xs); padding: 2px 10px;">
                  ${Diskrit.icons("mapPin", "", 12)}
                  <span>${targetUser.city || 'Global'}, ${targetUser.country || 'Earth'}</span>
                </span>
                <span class="pill-tag" style="font-size: var(--font-xs); padding: 2px 10px;">
                  ${Diskrit.icons("clock", "", 12)}
                  <span>Joined ${targetUser.joinedDate || '2024'}</span>
                </span>
              </div>

              <!-- Connection Counts -->
              <div class="profile-meta-stats">
                <div class="stat-item">
                  <span class="stat-count">${targetUser.followersCount || 0}</span>
                  <span>Followers</span>
                </div>
                <div class="stat-item">
                  <span class="stat-count">${targetUser.followingCount || 0}</span>
                  <span>Following</span>
                </div>
                <div class="stat-item">
                  <span class="stat-count">${targetUser.friendsCount || 0}</span>
                  <span>Mutual Friends</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sticky Horizontal Tabs Bar -->
          <div class="profile-tabs-bar">
            <button class="profile-tab-item ${this.activeTab === 'posts' ? 'active' : ''}" data-tab="posts">
              ${Diskrit.icons("home", "", 16)}
              <span>Posts (${userPosts.length})</span>
            </button>
            <button class="profile-tab-item ${this.activeTab === 'about' ? 'active' : ''}" data-tab="about">
              ${Diskrit.icons("user", "", 16)}
              <span>About & Bio</span>
            </button>
            <button class="profile-tab-item ${this.activeTab === 'video' ? 'active' : ''}" data-tab="video">
              ${Diskrit.icons("video", "", 16)}
              <span>Videos (${videoPosts.length})</span>
            </button>
            ${isOwn ? `
              <button class="profile-tab-item ${this.activeTab === 'saved' ? 'active' : ''}" data-tab="saved">
                ${Diskrit.icons("bookmark", "", 16)}
                <span>Saved Library</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Tab Body Content -->
        <div id="profile-tab-content-container">
          ${isPrivateLocked ? `
            <!-- Privacy Locked Wall -->
            <div class="privacy-wall-card">
              <div class="privacy-wall-icon">
                ${Diskrit.icons("lock", "", 32)}
              </div>
              <h2 style="font-size: var(--font-xl); font-weight: 700; color: var(--text-primary); margin: 0;">This Account is Private</h2>
              <p style="color: var(--text-muted); font-size: var(--font-sm); max-width: 440px; margin: 0; line-height: 1.5;">
                ${rel === 'requested' 
                  ? `Your friend request to @${targetUser.handle} has been sent and is awaiting approval. Once accepted, all posts and videos will unlock.`
                  : `Photos, videos, and identity portfolio updates from @${targetUser.handle} are only accessible to confirmed mutual friends.`
                }
              </p>

              <div style="display: flex; gap: 8px; margin-top: 8px;">
                ${rel === 'requested' ? `
                  <button class="btn btn-secondary btn-sm" id="wall-cancel-request-btn" data-handle="${targetUser.handle}">
                    Cancel Request
                  </button>
                ` : `
                  <button class="btn btn-primary btn-sm" id="wall-send-request-btn" data-handle="${targetUser.handle}">
                    ${Diskrit.icons("plus", "", 16)}
                    <span>Add Friend</span>
                  </button>
                `}
              </div>

              <div style="font-size: var(--font-xs); color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-top: 12px;">
                ${Diskrit.icons("shield", "", 14)}
                <span>Encrypted Social Graph Privacy Active</span>
              </div>
            </div>
          ` : this.renderActiveTab(targetUser, userPosts, videoPosts, savedBookmarks)}
        </div>
      </div>
    `;
  },

  renderActiveTab(targetUser, userPosts, videoPosts, savedBookmarks) {
    if (this.activeTab === "about") {
      return `
        <div class="card" style="display: flex; flex-direction: column; gap: var(--space-4);">
          <h2 style="font-size: var(--font-lg); font-weight: 700; color: var(--text-primary);">Detailed Bio & Identity Information</h2>
          <p style="color: var(--text-secondary); line-height: 1.6;">${targetUser.bio || 'Exploring new creative horizons on Diskrit.'}</p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 8px;">
            <div style="background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div style="font-size: var(--font-xs); color: var(--text-muted); text-transform: uppercase;">Orientation</div>
              <div style="font-weight: 600; margin-top: 4px; color: var(--text-primary);">${targetUser.orientation || 'Not specified'}</div>
            </div>
            <div style="background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div style="font-size: var(--font-xs); color: var(--text-muted); text-transform: uppercase;">Identity Role</div>
              <div style="font-weight: 600; margin-top: 4px; color: var(--text-primary);">${targetUser.identityRole || 'Not specified'}</div>
            </div>
            <div style="background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div style="font-size: var(--font-xs); color: var(--text-muted); text-transform: uppercase;">Location</div>
              <div style="font-weight: 600; margin-top: 4px; color: var(--text-primary);">${targetUser.city || 'Global'}, ${targetUser.country || 'Earth'}</div>
            </div>
            <div style="background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div style="font-size: var(--font-xs); color: var(--text-muted); text-transform: uppercase;">Profile Type</div>
              <div style="font-weight: 600; margin-top: 4px; color: var(--accent);">${targetUser.profileType === 'public' ? 'Public Creator' : 'Private (Friends Only)'}</div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeTab === "video") {
      return `
        <div class="posts-grid-view">
          ${videoPosts.length === 0 ? `
            <div class="card" style="text-align: center; padding: 48px var(--space-6); width: 100%;">
              <div style="font-size: 32px; margin-bottom: 8px;">🎬</div>
              <h3 style="font-size: var(--font-base); font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">No video posts</h3>
              <p style="color: var(--text-muted); font-size: var(--font-sm);">No video posts published on this timeline yet.</p>
            </div>
          ` : videoPosts.map(p => Diskrit.components.postCard.renderPostCard(p)).join('')}
        </div>
      `;
    }

    if (this.activeTab === "saved") {
      return `
        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
          <div style="font-size: var(--font-sm); color: var(--text-muted);">Showing your bookmarked posts and videos:</div>
          <div class="posts-grid-view">
            ${savedBookmarks.map(b => `
              <div class="card" style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <img src="${b.thumbnail}" style="width: 60px; height: 60px; border-radius: var(--radius-md); object-fit: cover;" alt="${b.title}">
                  <div>
                    <div style="font-weight: 600; font-size: var(--font-sm); color: var(--text-primary);">${b.title}</div>
                    <div style="font-size: var(--font-xs); color: var(--text-muted);">by @${b.authorHandle} &bull; Expires in ${b.daysLeft} days</div>
                  </div>
                </div>
                <a href="#post/${b.postId}" class="btn btn-secondary btn-sm">View Item</a>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Default: Posts
    return `
      <div class="posts-grid-view">
        ${userPosts.length === 0 ? `
          <div class="card" style="text-align: center; padding: 48px var(--space-6); width: 100%;">
            <div style="font-size: 32px; margin-bottom: 8px;">📝</div>
            <h3 style="font-size: var(--font-base); font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">No posts published yet</h3>
            <p style="color: var(--text-muted); font-size: var(--font-sm);">Posts shared by @${targetUser.handle} will appear here.</p>
          </div>
        ` : userPosts.map(p => Diskrit.components.postCard.renderPostCard(p)).join('')}
      </div>
    `;
  },

  openEditProfileModal(user) {
    const bodyHtml = `
      <div style="display: flex; flex-direction: column; gap: var(--space-4);">
        <div>
          <label style="display: block; font-size: var(--font-sm); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Display Name</label>
          <input type="text" id="edit-profile-name" class="input" style="width: 100%;" value="${user.name}">
        </div>

        <div>
          <label style="display: block; font-size: var(--font-sm); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Profile Visibility & Privacy</label>
          <select id="edit-profile-type" class="form-select" style="width: 100%;">
            <option value="public" ${user.profileType === 'public' ? 'selected' : ''}>Public Creator (Anyone can follow and see posts)</option>
            <option value="private" ${user.profileType === 'private' ? 'selected' : ''}>Private Profile (Only accepted friends can see posts)</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: var(--font-sm); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Bio</label>
          <textarea id="edit-profile-bio" class="input" style="width: 100%; min-height: 80px; resize: vertical;">${user.bio || ''}</textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="display: block; font-size: var(--font-sm); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">City</label>
            <input type="text" id="edit-profile-city" class="input" style="width: 100%;" value="${user.city || ''}">
          </div>
          <div>
            <label style="display: block; font-size: var(--font-sm); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Country</label>
            <input type="text" id="edit-profile-country" class="input" style="width: 100%;" value="${user.country || ''}">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="display: block; font-size: var(--font-sm); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Orientation</label>
            <input type="text" id="edit-profile-orientation" class="input" style="width: 100%;" value="${user.orientation || ''}">
          </div>
          <div>
            <label style="display: block; font-size: var(--font-sm); font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">Identity Role</label>
            <input type="text" id="edit-profile-role" class="input" style="width: 100%;" value="${user.identityRole || ''}">
          </div>
        </div>
      </div>
    `;

    const footerHtml = `
      <button class="btn btn-secondary modal-cancel-btn">Cancel</button>
      <button class="btn btn-primary modal-save-profile-btn">Save Changes</button>
    `;

    const modal = Diskrit.components.modals.openModal("Edit Profile", bodyHtml, footerHtml);

    modal.backdrop.querySelector(".modal-cancel-btn").addEventListener("click", () => modal.close());
    modal.backdrop.querySelector(".modal-save-profile-btn").addEventListener("click", () => {
      user.name = modal.backdrop.querySelector("#edit-profile-name").value.trim() || user.name;
      user.profileType = modal.backdrop.querySelector("#edit-profile-type").value;
      user.bio = modal.backdrop.querySelector("#edit-profile-bio").value.trim();
      user.city = modal.backdrop.querySelector("#edit-profile-city").value.trim();
      user.country = modal.backdrop.querySelector("#edit-profile-country").value.trim();
      user.orientation = modal.backdrop.querySelector("#edit-profile-orientation").value.trim();
      user.identityRole = modal.backdrop.querySelector("#edit-profile-role").value.trim();

      Diskrit.storage.set("currentUser", user);
      modal.close();
      Diskrit.components.modals.toast("Profile updated successfully!", "success");

      const mainContent = document.getElementById("app-main-content");
      if (mainContent) {
        mainContent.innerHTML = Diskrit.pages.profile.render({ handle: user.handle });
        Diskrit.pages.profile.attachEvents();
      }
    });
  },

  attachEvents() {
    const refreshView = () => {
      const mainContent = document.getElementById("app-main-content");
      if (mainContent) {
        const hash = window.location.hash.split('?')[0];
        const handle = hash.replace('#', '');
        mainContent.innerHTML = this.render({ handle });
        this.attachEvents();
      }
    };

    // 1. Tabs switcher
    document.querySelectorAll(".profile-tab-item").forEach(tab => {
      tab.addEventListener("click", () => {
        this.activeTab = tab.dataset.tab;
        refreshView();
      });
    });

    // 2. Quick Privacy Mode Switcher (Public vs Private) for Profile Owner
    const privacyToggle = document.getElementById("profile-quick-privacy-toggle");
    if (privacyToggle) {
      privacyToggle.addEventListener("click", () => {
        const currentUser = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;
        const newType = currentUser.profileType === 'public' ? 'private' : 'public';
        currentUser.profileType = newType;
        Diskrit.storage.set("currentUser", currentUser);
        
        if (newType === 'private') {
          Diskrit.components.modals.toast("🔒 Profile set to Private (Friends Only). Posts hidden from non-friends.", "info");
        } else {
          Diskrit.components.modals.toast("🌐 Profile set to Public Creator. Anyone can follow and view posts.", "success");
        }
        refreshView();
      });
    }

    // 3. Visitor Preview Toggle
    const previewBtn = document.getElementById("profile-preview-visitor-btn");
    if (previewBtn) {
      previewBtn.addEventListener("click", () => {
        this.isVisitorPreview = true;
        Diskrit.components.modals.toast("👁️ Previewing profile as an external visitor", "info");
        refreshView();
      });
    }

    // 4. Exit Visitor Preview
    const exitBtn = document.getElementById("exit-preview-mode-btn");
    const exitBtn2 = document.getElementById("exit-preview-mode-btn-2");
    [exitBtn, exitBtn2].filter(Boolean).forEach(btn => {
      btn.addEventListener("click", () => {
        this.isVisitorPreview = false;
        Diskrit.components.modals.toast("Returned to Profile Owner view", "info");
        refreshView();
      });
    });

    // 5. Edit Profile Modal
    const editBtn = document.getElementById("profile-edit-modal-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;
        this.openEditProfileModal(user);
      });
    }

    // 6. Follow / Friend request action button in header
    document.querySelectorAll(".profile-follow-action-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const handle = btn.dataset.handle;
        const type = btn.dataset.type;

        if (type === "public") {
          let following = Diskrit.storage.get("following_handles", ["marcus_chen", "sarahj"]);
          if (following.includes(handle)) {
            following = following.filter(h => h !== handle);
            Diskrit.storage.set("following_handles", following);
            Diskrit.components.modals.toast(`Unfollowed @${handle}`, "info");
          } else {
            following.push(handle);
            Diskrit.storage.set("following_handles", following);
            Diskrit.components.modals.toast(`Now following @${handle}!`, "success");
          }
          refreshView();
        } else {
          // Private friend flow
          const relationships = Diskrit.storage.get("user_relationships", {});
          const curRel = relationships[handle] || "none";

          if (curRel === "none" || type === "none") {
            relationships[handle] = "requested";
            Diskrit.storage.set("user_relationships", relationships);
            Diskrit.components.modals.toast(`Friend request sent to @${handle}! 📬`, "success");
          } else if (curRel === "requested" || type === "requested") {
            relationships[handle] = "none";
            Diskrit.storage.set("user_relationships", relationships);
            Diskrit.components.modals.toast(`Cancelled friend request to @${handle}`, "info");
          } else if (curRel === "friend" || type === "friend") {
            if (confirm(`Remove @${handle} from your confirmed friends?`)) {
              relationships[handle] = "none";
              Diskrit.storage.set("user_relationships", relationships);
              Diskrit.components.modals.toast(`Removed @${handle} from friends`, "info");
            }
          }
          refreshView();
        }
      });
    });

    // 7. Privacy Wall Action Buttons
    const wallSendBtn = document.getElementById("wall-send-request-btn");
    if (wallSendBtn) {
      wallSendBtn.addEventListener("click", () => {
        const handle = wallSendBtn.dataset.handle;
        const relationships = Diskrit.storage.get("user_relationships", {});
        relationships[handle] = "requested";
        Diskrit.storage.set("user_relationships", relationships);
        Diskrit.components.modals.toast(`Friend request sent to @${handle}! 📬`, "success");
        refreshView();
      });
    }

    const wallCancelBtn = document.getElementById("wall-cancel-request-btn");
    if (wallCancelBtn) {
      wallCancelBtn.addEventListener("click", () => {
        const handle = wallCancelBtn.dataset.handle;
        const relationships = Diskrit.storage.get("user_relationships", {});
        relationships[handle] = "none";
        Diskrit.storage.set("user_relationships", relationships);
        Diskrit.components.modals.toast(`Cancelled friend request to @${handle}`, "info");
        refreshView();
      });
    }

    // 8. Post card event delegations & masonry packing
    const postContainer = document.getElementById("profile-tab-content-container");
    if (postContainer) {
      Diskrit.components.postCard.attachEvents(postContainer);
      if (Diskrit.masonry) {
        const grid = postContainer.querySelector(".posts-grid-view");
        if (grid) Diskrit.masonry.init(grid);
      }
    }
  }
};
