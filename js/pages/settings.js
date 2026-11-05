/**
 * DISKRIT SETTINGS & ACCOUNT HUB
 * Solves Flaws 6.1 & 5.3: Unified settings architecture merging Profile, Security, 2FA, Sessions & Pill Modals
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.settings = {
  currentSection: "profile", // profile | security | privacy | sessions

  render(params = {}) {
    if (params.section) {
      if (params.section === "info") this.currentSection = "profile";
      else if (params.section === "password") this.currentSection = "security";
      else if (params.section === "privacy") this.currentSection = "privacy";
      else this.currentSection = params.section;
    }

    const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;

    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-6);">
        <!-- Title Banner -->
        <div>
          <h1 style="font-size: var(--font-2xl); font-weight: 700;">Account Settings & Preferences</h1>
          <p style="color: var(--text-muted); font-size: var(--font-sm);">
            Manage your personal profile, credentials, privacy boundaries, and device sessions.
          </p>
        </div>

        <div class="settings-layout">
          <!-- Left Navigation Menu (Solves Flaw 6.1) -->
          <nav class="settings-nav-card" aria-label="Settings Sections">
            <button class="settings-nav-item ${this.currentSection === 'profile' ? 'active' : ''}" data-sec="profile">
              ${Diskrit.icons("user", "", 18)}
              <span>Profile & Identity</span>
            </button>
            <button class="settings-nav-item ${this.currentSection === 'security' ? 'active' : ''}" data-sec="security">
              ${Diskrit.icons("lock", "", 18)}
              <span>Password & 2FA</span>
            </button>
            <button class="settings-nav-item ${this.currentSection === 'privacy' ? 'active' : ''}" data-sec="privacy">
              ${Diskrit.icons("shield", "", 18)}
              <span>Privacy & Audience</span>
            </button>
            <button class="settings-nav-item ${this.currentSection === 'sessions' ? 'active' : ''}" data-sec="sessions">
              ${Diskrit.icons("activity", "", 18)}
              <span>Active Sessions</span>
            </button>
            <div class="dropdown-divider"></div>
            <a href="#saved" class="settings-nav-item">
              ${Diskrit.icons("bookmark", "", 18)}
              <span>Saved Library (21-Day)</span>
            </a>
            <a href="#notifications" class="settings-nav-item">
              ${Diskrit.icons("bell", "", 18)}
              <span>Notifications Center</span>
            </a>
            <div class="dropdown-divider"></div>
            <button class="settings-nav-item" id="settings-pwa-install-btn" style="color: var(--accent); background: none; border: none; cursor: pointer; text-align: left; width: 100%;">
              ${Diskrit.icons("download", "", 18)}
              <span>Install Diskrit PWA</span>
            </button>
          </nav>

          <!-- Right Content Card -->
          <div class="settings-content-card">
            ${this.renderSectionContent(user)}
          </div>
        </div>
      </div>
    `;
  },

  renderSectionContent(user) {
    if (this.currentSection === "profile") {
      return `
        <div class="settings-section-header">
          <h2 class="settings-section-title">Profile & Identity Setup</h2>
          <p class="settings-section-desc">Customize your public presence, demographic affiliations, and visual avatars.</p>
        </div>

        <form id="profile-info-form" style="display: flex; flex-direction: column; gap: var(--space-4);">
          <!-- Banner & Avatar Uploaders -->
          <div class="settings-media-row">
            <div class="settings-avatar-uploader" id="avatar-uploader-trigger" title="Upload new avatar">
              <img src="${user.avatar}" class="avatar avatar-xl" id="settings-avatar-preview" alt="${user.name}">
              <div class="uploader-overlay">
                ${Diskrit.icons("image", "", 24)}
              </div>
            </div>
            <div>
              <div style="font-weight: 600; font-size: var(--font-base);">Profile Avatar & Cover</div>
              <div style="font-size: var(--font-xs); color: var(--text-muted); margin-top: 2px;">
                JPG, PNG or GIF up to 5MB. Click the avatar to choose a new photo.
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="set-fullname" class="form-input" value="${user.name}">
            </div>
            <div class="form-group">
              <label class="form-label">Handle (Username)</label>
              <input type="text" id="set-handle" class="form-input" value="${user.handle}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Bio & Statement</label>
            <textarea id="set-bio" class="form-textarea" rows="3">${user.bio}</textarea>
          </div>

          <!-- Demographic Pill Tag Triggers (Solves Flaw 5.3) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            <div class="form-group">
              <label class="form-label">Sexual Orientation</label>
              <div style="display: flex; gap: 8px; align-items: center;">
                <input type="text" id="set-orientation" class="form-input" value="${user.orientation}" readonly>
                <button type="button" class="btn btn-secondary select-pill-btn" data-category="orientations">
                  Select
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Community Identity Role (40+ Roles)</label>
              <div style="display: flex; gap: 8px; align-items: center;">
                <input type="text" id="set-role" class="form-input" value="${user.identityRole}" readonly>
                <button type="button" class="btn btn-secondary select-pill-btn" data-category="identityRoles">
                  Select
                </button>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            <div class="form-group">
              <label class="form-label">City</label>
              <input type="text" id="set-city" class="form-input" value="${user.city}">
            </div>
            <div class="form-group">
              <label class="form-label">Country</label>
              <input type="text" id="set-country" class="form-input" value="${user.country}">
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: var(--space-4);">
            <button type="button" class="btn btn-primary" id="save-profile-btn">
              ${Diskrit.icons("check", "", 16)}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      `;
    }

    if (this.currentSection === "security") {
      return `
        <div class="settings-section-header">
          <h2 class="settings-section-title">Password & Security</h2>
          <p class="settings-section-desc">Rotate your login password and manage two-factor authentication safeguards.</p>
        </div>

        <form id="password-form" style="display: flex; flex-direction: column; gap: var(--space-4); max-width: 520px;">
          <div class="form-group">
            <label class="form-label">Current Password</label>
            <input type="password" id="cur-pass" class="form-input" placeholder="••••••••••••">
          </div>
          <div class="form-group">
            <label class="form-label">New Password</label>
            <input type="password" id="new-pass" class="form-input" placeholder="At least 8 characters">
          </div>
          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <input type="password" id="conf-pass" class="form-input" placeholder="••••••••••••">
          </div>
          <button type="button" class="btn btn-primary" id="update-pass-btn" style="width: fit-content;">
            Update Password
          </button>
        </form>

        <div class="dropdown-divider" style="margin: var(--space-6) 0;"></div>

        <!-- 2FA Section (Absorbed from Jetstream - Solves Flaw 6.1) -->
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; font-size: var(--font-base);">Two-Factor Authentication (2FA)</div>
              <div style="font-size: var(--font-sm); color: var(--text-muted); margin-top: 2px;">
                Protect your account with a time-based one-time password (TOTP) authenticator app.
              </div>
            </div>
            <span class="badge badge-success">Enabled</span>
          </div>

          <div style="background: var(--bg-surface-elevated); padding: 16px; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
              ${Diskrit.icons("shield", "text-success", 24)}
              <div>
                <div style="font-weight: 600; font-size: var(--font-sm);">Google Authenticator / 1Password Connected</div>
                <div style="font-size: var(--font-xs); color: var(--text-muted);">Configured on Oct 12, 2026</div>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm" id="view-recovery-codes-btn">View Recovery Codes</button>
          </div>
        </div>
      `;
    }

    if (this.currentSection === "privacy") {
      return `
        <div class="settings-section-header">
          <h2 class="settings-section-title">Privacy & Audience Rules</h2>
          <p class="settings-section-desc">Govern who can access your content and control interaction boundaries.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--space-6);">
          <!-- Profile Visibility -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: var(--space-4); border-bottom: 1px solid var(--border-subtle);">
            <div>
              <div style="font-weight: 600; font-size: var(--font-base);">Profile Visibility</div>
              <div style="font-size: var(--font-sm); color: var(--text-muted); max-width: 480px; margin-top: 2px;">
                Choose whether your profile and posts are open for public following or restricted to accepted mutual friends.
              </div>
            </div>
            <select id="privacy-profile-type-select" class="form-select" style="width: 180px;">
              <option value="public" ${user.profileType === 'public' ? 'selected' : ''}>Public Creator</option>
              <option value="private" ${user.profileType === 'private' ? 'selected' : ''}>Private (Friends Only)</option>
            </select>
          </div>

          <!-- Anonymous Comments Toggle -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: var(--space-4); border-bottom: 1px solid var(--border-subtle);">
            <div>
              <div style="font-weight: 600; font-size: var(--font-base);">Allow Anonymous Comments</div>
              <div style="font-size: var(--font-sm); color: var(--text-muted); max-width: 480px; margin-top: 2px;">
                Permit other community members to reply to your posts using Diskrit's encrypted anonymous mode.
              </div>
            </div>
            <label class="switch">
              <input type="checkbox" id="privacy-anon-comments-toggle" ${user.allowAnonymousComments ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>

          <!-- Safe Mode Global Preference -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 600; font-size: var(--font-base);">Safe Mode (Adult Content Filter)</div>
              <div style="font-size: var(--font-sm); color: var(--text-muted); max-width: 480px; margin-top: 2px;">
                When active, all 18+ sensitive and mature content is blurred behind a consent overlay.
              </div>
            </div>
            <label class="switch switch-safe">
              <input type="checkbox" id="privacy-safemode-toggle" ${Diskrit.theme.isSafeMode() ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>
      `;
    }

    if (this.currentSection === "sessions") {
      return `
        <div class="settings-section-header">
          <h2 class="settings-section-title">Active Browser Sessions</h2>
          <p class="settings-section-desc">Audit and manage active devices and browsers logged into your account.</p>
        </div>

        <div class="active-sessions-list">
          <div class="session-item">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="color: var(--color-success);">${Diskrit.icons("activity", "", 24)}</div>
              <div>
                <div style="font-weight: 600; font-size: var(--font-sm);">Linux Desktop &bull; Chrome 130.0</div>
                <div style="font-size: var(--font-xs); color: var(--text-muted);">Current Active Session &bull; IP: 192.168.1.42</div>
              </div>
            </div>
            <span class="badge badge-success">This Device</span>
          </div>

          <div class="session-item">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="color: var(--text-muted);">${Diskrit.icons("zap", "", 24)}</div>
              <div>
                <div style="font-weight: 600; font-size: var(--font-sm);">iPhone 15 Pro &bull; Safari Mobile PWA</div>
                <div style="font-size: var(--font-xs); color: var(--text-muted);">Last active 3 hours ago &bull; San Francisco, CA</div>
              </div>
            </div>
            <button class="btn btn-secondary btn-sm revoke-session-btn">Revoke</button>
          </div>
        </div>

        <div style="margin-top: var(--space-6);">
          <button class="btn btn-danger" id="logout-all-sessions-btn">
            Log Out Other Browser Sessions
          </button>
        </div>
      `;
    }
  },

  attachEvents() {
    // 1. Navigation items
    document.querySelectorAll(".settings-nav-item[data-sec]").forEach(item => {
      item.addEventListener("click", () => {
        this.currentSection = item.dataset.sec;
        const main = document.getElementById("app-main-content");
        if (main) {
          main.innerHTML = this.render();
          this.attachEvents();
        }
      });
    });

    // 2. Pill Tag Modals (Solves Flaw 5.3)
    document.querySelectorAll(".select-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.category;
        const title = cat === "orientations" ? "Select Sexual Orientation" : "Select Community Identity Role";
        Diskrit.components.modals.showPillTagModal(title, cat, (selected) => {
          if (cat === "orientations") {
            document.getElementById("set-orientation").value = selected;
          } else {
            document.getElementById("set-role").value = selected;
          }
          Diskrit.components.modals.toast(`Selected: ${selected}`, "info");
        });
      });
    });

    // 3. Save Profile Form
    const saveProfileBtn = document.getElementById("save-profile-btn");
    if (saveProfileBtn) {
      saveProfileBtn.addEventListener("click", () => {
        const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;
        user.name = document.getElementById("set-fullname").value.trim();
        user.handle = document.getElementById("set-handle").value.trim();
        user.bio = document.getElementById("set-bio").value.trim();
        user.orientation = document.getElementById("set-orientation").value;
        user.identityRole = document.getElementById("set-role").value;
        user.city = document.getElementById("set-city").value.trim();
        user.country = document.getElementById("set-country").value.trim();

        Diskrit.storage.set("currentUser", user);
        Diskrit.components.modals.toast("Profile details updated successfully!", "success");
      });
    }

    // 4. Update Password
    const updatePassBtn = document.getElementById("update-pass-btn");
    if (updatePassBtn) {
      updatePassBtn.addEventListener("click", () => {
        const cur = document.getElementById("cur-pass").value;
        const next = document.getElementById("new-pass").value;
        const conf = document.getElementById("conf-pass").value;
        if (!next || next.length < 8) {
          Diskrit.components.modals.toast("Password must be at least 8 characters", "error");
          return;
        }
        if (next !== conf) {
          Diskrit.components.modals.toast("Passwords do not match", "error");
          return;
        }
        Diskrit.components.modals.toast("Password successfully changed!", "success");
        document.getElementById("cur-pass").value = "";
        document.getElementById("new-pass").value = "";
        document.getElementById("conf-pass").value = "";
      });
    }

    // 5. Privacy controls
    const profileTypeSelect = document.getElementById("privacy-profile-type-select");
    if (profileTypeSelect) {
      profileTypeSelect.addEventListener("change", (e) => {
        const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;
        user.profileType = e.target.value;
        Diskrit.storage.set("currentUser", user);
        Diskrit.components.modals.toast(`Profile set to ${user.profileType === 'public' ? 'Public Creator' : 'Private (Friends Only)'}`, "success");
      });
    }

    const safeToggle = document.getElementById("privacy-safemode-toggle");
    if (safeToggle) {
      safeToggle.addEventListener("change", (e) => {
        if (!e.target.checked) {
          Diskrit.components.modals.showAdultWarningModal(() => {
            Diskrit.theme.setSafeMode(false);
            Diskrit.components.modals.toast("Safe Mode disabled", "info");
          });
        } else {
          Diskrit.theme.setSafeMode(true);
          Diskrit.components.modals.toast("Safe Mode enabled", "success");
        }
      });
    }

    // 6. View recovery codes
    const recoveryBtn = document.getElementById("view-recovery-codes-btn");
    if (recoveryBtn) {
      recoveryBtn.addEventListener("click", () => {
        const codes = ["a8f2-991c", "4e71-2b08", "91c4-77aa", "d209-11ff", "6b38-54c2"];
        Diskrit.components.modals.openModal(
          "Emergency 2FA Recovery Codes",
          `<div style="font-family: var(--font-mono); font-size: 14px; background: var(--bg-surface-elevated); padding: 16px; border-radius: var(--radius-md); line-height: 2;">
            ${codes.map(c => `<div>${c}</div>`).join('')}
           </div>
           <p style="font-size: var(--font-xs); color: var(--text-muted); margin-top: 12px;">Keep these recovery codes stored in a secure password vault.</p>`,
          `<button class="btn btn-primary modal-close-btn" style="width: 100%;">I have saved my codes</button>`
        );
      });
    }

    // 7. PWA install trigger in settings
    const settingsPwaBtn = document.getElementById("settings-pwa-install-btn");
    if (settingsPwaBtn) {
      settingsPwaBtn.addEventListener("click", () => {
        if (Diskrit.pwa) {
          Diskrit.pwa.promptInstall();
        }
      });
    }
  }
};
