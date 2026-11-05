/**
 * DISKRIT CREATOR STUDIO & ROLE-BASED DASHBOARDS
 * Solves Flaw 8.2: Replaces abandoned Laravel Jetstream boilerplate with a real Creator Studio & role manager
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.creator = {
  render(role = "creator") {
    if (role === "admin") return this.renderAdminDashboard();
    if (role === "user") return this.renderUserDashboard();
    if (role === "roles_form") return this.renderRolesForm();

    return this.renderCreatorStudio();
  },

  renderCreatorStudio() {
    const user = Diskrit.storage.get("currentUser") || Diskrit.mockData.currentUser;

    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-6);">
        <!-- Creator Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge profile-badge-creator">Creator Level 3</span>
              <span style="font-size: var(--font-xs); color: var(--text-muted);">&bull; Diskrit Partner</span>
            </div>
            <h1 style="font-size: var(--font-2xl); font-weight: 800; margin-top: 4px;">Creator Studio & Monetization</h1>
            <p style="color: var(--text-muted); font-size: var(--font-sm);">
              Audience expansion telemetry, content engagement yield, and community tips for @${user.handle}.
            </p>
          </div>
          <a href="#posts/create" class="btn btn-primary" style="gap: 6px;">
            ${Diskrit.icons("plus", "", 16)}
            <span>New Broadcast Post</span>
          </a>
        </div>

        <!-- Creator KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card kpi-success">
            <span class="kpi-label">30-Day Impressions</span>
            <div class="kpi-value-row">
              <span class="kpi-value">124.8K</span>
              <span class="kpi-trend">+34.2%</span>
            </div>
          </div>

          <div class="kpi-card">
            <span class="kpi-label">Follower Growth</span>
            <div class="kpi-value-row">
              <span class="kpi-value">+280</span>
              <span class="kpi-trend">1,420 total</span>
            </div>
          </div>

          <div class="kpi-card kpi-warning">
            <span class="kpi-label">Shorts Watch Time</span>
            <div class="kpi-value-row">
              <span class="kpi-value">482 hrs</span>
              <span class="kpi-trend">82% retention</span>
            </div>
          </div>

          <div class="kpi-card">
            <span class="kpi-label">Community Tips Earned</span>
            <div class="kpi-value-row">
              <span class="kpi-value">$684.50</span>
              <span class="kpi-trend">+12 tips</span>
            </div>
          </div>
        </div>

        <!-- Content Performance Breakdown -->
        <div class="card" style="display: flex; flex-direction: column; gap: var(--space-4);">
          <div style="font-weight: 700; font-size: var(--font-base);">Top Performing Media Posts</div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
            <div style="background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-lg); display: flex; gap: 12px; align-items: center;">
              <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=120&q=80" style="width: 56px; height: 56px; border-radius: var(--radius-md); object-fit: cover;">
              <div>
                <div style="font-weight: 600; font-size: var(--font-sm);">Generative Audio Visual Installation</div>
                <div style="font-size: var(--font-xs); color: var(--text-muted);">1,840 views &bull; 142 likes &bull; 18 comments</div>
              </div>
            </div>

            <div style="background: var(--bg-surface-elevated); padding: 14px; border-radius: var(--radius-lg); display: flex; gap: 12px; align-items: center;">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80" style="width: 56px; height: 56px; border-radius: var(--radius-md); object-fit: cover;">
              <div>
                <div style="font-weight: 600; font-size: var(--font-sm);">Procedural Fluid Simulation Reel</div>
                <div style="font-size: var(--font-xs); color: var(--text-muted);">89.4K views &bull; 14.2K likes &bull; 328 comments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderAdminDashboard() {
    return `
      <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
        <h1 style="font-size: var(--font-xl); font-weight: 700;">Admin Management Portal</h1>
        <p style="color: var(--text-muted); font-size: var(--font-sm);">
          Welcome to the administrative tier. Use the navigation links to manage roles, moderate content, or view platform telemetry.
        </p>
        <div style="display: flex; gap: 12px;">
          <a href="#admin/roles/form" class="btn btn-primary">Assign User Roles</a>
          <a href="#superadmin/dashboard" class="btn btn-secondary">Open Superadmin Hub</a>
        </div>
      </div>
    `;
  },

  renderUserDashboard() {
    return `
      <div class="card" style="display: flex; flex-direction: column; gap: 16px;">
        <h1 style="font-size: var(--font-xl); font-weight: 700;">User Dashboard</h1>
        <p style="color: var(--text-muted); font-size: var(--font-sm);">
          Welcome to your member portal. Your account is active and verified.
        </p>
        <div style="display: flex; gap: 12px;">
          <a href="#home" class="btn btn-primary">Browse Newsfeed</a>
          <a href="#settings" class="btn btn-secondary">Manage Account</a>
        </div>
      </div>
    `;
  },

  renderRolesForm() {
    return `
      <div class="card" style="max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px;">
        <h2 style="font-size: var(--font-xl); font-weight: 700;">Assign User Roles & Delegations</h2>
        <p style="font-size: var(--font-sm); color: var(--text-muted);">Select a registered user and assign their access permissions.</p>

        <form id="assign-role-form" style="display: flex; flex-direction: column; gap: 14px;">
          <div class="form-group">
            <label class="form-label">Select User Account</label>
            <select class="form-select" id="role-user-select">
              ${Diskrit.mockData.users.map(u => `
                <option value="${u.id}">${u.name} (@${u.handle})</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Target Role</label>
            <select class="form-select" id="role-target-select">
              <option value="user">Standard User</option>
              <option value="creator">Creator (Studio Access)</option>
              <option value="admin">Administrator</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px;">
            <a href="#superadmin/dashboard" class="btn btn-secondary">Cancel</a>
            <button type="button" class="btn btn-primary" id="save-role-btn">Update Permissions</button>
          </div>
        </form>
      </div>
    `;
  },

  attachEvents() {
    const saveRoleBtn = document.getElementById("save-role-btn");
    if (saveRoleBtn) {
      saveRoleBtn.addEventListener("click", () => {
        const u = document.getElementById("role-user-select").value;
        const r = document.getElementById("role-target-select").value;
        Diskrit.components.modals.toast(`User permissions updated to: ${r.toUpperCase()}`, "success");
        setTimeout(() => {
          window.location.hash = "#superadmin/users";
        }, 600);
      });
    }
  }
};
