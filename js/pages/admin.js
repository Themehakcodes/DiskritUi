/**
 * DISKRIT SUPERADMIN & AD NETWORK PORTAL
 * Solves Flaws 8.1 & 8.2: Sleek dark admin skin, KPI charts, moderation queues & Interactive Ad Studio
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.admin = {
  render(view = "dashboard", params = {}) {
    return `
      <div class="admin-container">
        <!-- Sub-navigation Tabs for Admin Portal -->
        <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; overflow-x: auto;">
          <a href="#superadmin/dashboard" class="pill-tag ${view === 'dashboard' ? 'selected' : ''}">
            ${Diskrit.icons("activity", "", 16)}
            <span>Dashboard</span>
          </a>
          <a href="#superadmin/users" class="pill-tag ${view === 'users' ? 'selected' : ''}">
            ${Diskrit.icons("users", "", 16)}
            <span>User Governance</span>
          </a>
          <a href="#superadmin/all-posts" class="pill-tag ${view === 'all-posts' ? 'selected' : ''}">
            ${Diskrit.icons("home", "", 16)}
            <span>All Posts</span>
          </a>
          <a href="#superadmin/reports" class="pill-tag ${view === 'reports' ? 'selected' : ''}">
            ${Diskrit.icons("shieldAlert", "", 16)}
            <span>Reports Queue (${Diskrit.mockData.admin.kpis.pendingReports})</span>
          </a>
          <a href="#superadmin/rejected-posts" class="pill-tag ${view === 'rejected-posts' ? 'selected' : ''}">
            ${Diskrit.icons("eyeOff", "", 16)}
            <span>AI Moderation (${Diskrit.mockData.admin.kpis.aiModerationFlags})</span>
          </a>
          <a href="#superadmin/ad-websites" class="pill-tag ${view.startsWith('ad-websites') ? 'selected' : ''}">
            ${Diskrit.icons("globe", "", 16)}
            <span>Connected Ad Network</span>
          </a>
        </div>

        ${this.renderViewContent(view, params)}
      </div>
    `;
  },

  renderViewContent(view, params) {
    if (view === "users") return this.renderUsersTable();
    if (view === "all-posts") return this.renderAllPosts();
    if (view === "reports") return this.renderReportsQueue();
    if (view === "rejected-posts") return this.renderAIModerationQueue();
    if (view === "ad-websites") {
      if (params.id) return this.renderAdStudio(params.id);
      if (params.isCreate) return this.renderCreateWebsite();
      return this.renderAdWebsites();
    }
    return this.renderDashboard();
  },

  // 1. Superadmin Dashboard View
  renderDashboard() {
    const kpis = Diskrit.mockData.admin.kpis;

    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-6);">
        <!-- Title & Subtitle -->
        <div class="admin-header-row">
          <div class="admin-title-group">
            <h1 class="admin-title">Platform Command Center</h1>
            <p class="admin-subtitle">Real-time telemetry, user growth velocity, and active safety queues.</p>
          </div>
          <span class="badge badge-primary">Superadmin Tier Active</span>
        </div>

        <!-- KPI Cards Grid -->
        <div class="kpi-grid">
          <div class="kpi-card kpi-success">
            <span class="kpi-label">Registered Users</span>
            <div class="kpi-value-row">
              <span class="kpi-value">${kpis.totalUsers}</span>
              <span class="kpi-trend">${kpis.usersGrowth}</span>
            </div>
          </div>

          <div class="kpi-card">
            <span class="kpi-label">Community Posts</span>
            <div class="kpi-value-row">
              <span class="kpi-value">${kpis.totalPosts}</span>
              <span class="kpi-trend">${kpis.postsGrowth}</span>
            </div>
          </div>

          <div class="kpi-card kpi-warning">
            <span class="kpi-label">Pending User Reports</span>
            <div class="kpi-value-row">
              <span class="kpi-value">${kpis.pendingReports}</span>
              <a href="#superadmin/reports" class="widget-link">Triage Queue &rarr;</a>
            </div>
          </div>

          <div class="kpi-card kpi-danger">
            <span class="kpi-label">AI Filter Flags</span>
            <div class="kpi-value-row">
              <span class="kpi-value">${kpis.aiModerationFlags}</span>
              <a href="#superadmin/rejected-posts" class="widget-link">Review &rarr;</a>
            </div>
          </div>
        </div>

        <!-- SVG Analytics Charts Row -->
        <div class="charts-row">
          <!-- Growth Area Chart -->
          <div class="chart-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 700; font-size: var(--font-base);">Platform Growth (7-Day Velocity)</div>
                <div style="font-size: var(--font-xs); color: var(--text-muted);">Daily active users vs post creation volume</div>
              </div>
              <span class="badge badge-success">+24.8% vs last week</span>
            </div>
            
            <div class="chart-canvas-container">
              <svg width="100%" height="220" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.45"/>
                    <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.0"/>
                  </linearGradient>
                </defs>
                <!-- Grid lines -->
                <line x1="0" y1="40" x2="600" y2="40" stroke="var(--border-subtle)" stroke-dasharray="4"/>
                <line x1="0" y1="100" x2="600" y2="100" stroke="var(--border-subtle)" stroke-dasharray="4"/>
                <line x1="0" y1="160" x2="600" y2="160" stroke="var(--border-subtle)" stroke-dasharray="4"/>
                <!-- Filled area curve -->
                <path d="M 0 170 Q 100 130 200 145 T 400 70 T 600 30 L 600 200 L 0 200 Z" fill="url(#chartGradient)"/>
                <!-- Line curve -->
                <path d="M 0 170 Q 100 130 200 145 T 400 70 T 600 30" fill="none" stroke="var(--accent)" stroke-width="3"/>
                <!-- Data dots -->
                <circle cx="200" cy="145" r="5" fill="var(--accent)" stroke="#fff" stroke-width="2"/>
                <circle cx="400" cy="70" r="5" fill="var(--accent)" stroke="#fff" stroke-width="2"/>
                <circle cx="600" cy="30" r="5" fill="var(--accent)" stroke="#fff" stroke-width="2"/>
              </svg>
            </div>
          </div>

          <!-- Activity Distribution Donut Chart -->
          <div class="chart-card">
            <div style="font-weight: 700; font-size: var(--font-base);">Activity Share</div>
            <div class="chart-canvas-container">
              <svg width="180" height="180" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border-subtle)" stroke-width="14"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="var(--accent)" stroke-width="14" stroke-dasharray="140 100" stroke-dashoffset="0"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" stroke-width="14" stroke-dasharray="60 180" stroke-dashoffset="-140"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" stroke-width="14" stroke-dasharray="39 201" stroke-dashoffset="-200"/>
              </svg>
            </div>
            <div style="display: flex; justify-content: space-around; font-size: var(--font-xs); color: var(--text-muted);">
              <div><span style="color: var(--accent);">&bull;</span> Posts (58%)</div>
              <div><span style="color: #10b981;">&bull;</span> Shorts (25%)</div>
              <div><span style="color: #f59e0b;">&bull;</span> Chat (17%)</div>
            </div>
          </div>
        </div>

        <!-- Recent Audit Overview -->
        <div class="admin-table-container">
          <div class="admin-table-toolbar">
            <span style="font-weight: 700; font-size: var(--font-sm);">Recent Post Submissions</span>
            <a href="#superadmin/all-posts" class="btn btn-secondary btn-sm">View Full Catalog</a>
          </div>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Excerpt</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${Diskrit.mockData.admin.allPostsTable.slice(0, 3).map(p => `
                <tr>
                  <td style="font-weight: 600; color: var(--text-primary);">${p.author}</td>
                  <td>${p.excerpt}</td>
                  <td><span class="badge ${p.status.includes('Active') ? 'badge-success' : 'badge-danger'}">${p.status}</span></td>
                  <td>${p.date}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 2. Users Management
  renderUsersTable() {
    const users = Diskrit.mockData.admin.usersTable;
    return `
      <div class="admin-table-container">
        <div class="admin-table-toolbar">
          <div style="font-weight: 700; font-size: var(--font-base);">User Governance & Account Safety</div>
          <div class="search-input-wrapper" style="min-width: 240px;">
            <input type="text" class="form-input" placeholder="Search user by email or handle..." style="height: 36px;">
          </div>
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr id="admin-user-row-${u.id}">
                <td>
                  <div style="font-weight: 600; color: var(--text-primary);">${u.name}</div>
                  <div style="font-size: var(--font-xs); color: var(--text-muted);">${u.handle}</div>
                </td>
                <td>${u.email}</td>
                <td><span class="badge badge-neutral">${u.role}</span></td>
                <td>
                  <span class="badge ${u.status === 'Active' ? 'badge-success' : 'badge-danger'} status-badge">
                    ${u.status}
                  </span>
                </td>
                <td>${u.joined}</td>
                <td>
                  <button class="btn btn-secondary btn-sm toggle-ban-btn" data-id="${u.id}" data-status="${u.status}">
                    ${u.status === 'Active' ? 'Ban User' : 'Restore'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // 3. All Posts Management
  renderAllPosts() {
    const posts = Diskrit.mockData.admin.allPostsTable;
    return `
      <div class="admin-table-container">
        <div class="admin-table-toolbar">
          <div style="font-weight: 700; font-size: var(--font-base);">All Community Posts & Content Triage</div>
          <div class="search-input-wrapper" style="min-width: 240px;">
            <input type="text" class="form-input" placeholder="Search posts..." style="height: 36px;">
          </div>
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Author</th>
              <th>Media</th>
              <th>Content Excerpt</th>
              <th>Status</th>
              <th>Created</th>
              <th>Moderation</th>
            </tr>
          </thead>
          <tbody>
            ${posts.map(p => `
              <tr id="admin-post-row-${p.id}">
                <td style="font-weight: 600;">${p.author}</td>
                <td><span class="badge badge-neutral">${p.media}</span></td>
                <td>${p.excerpt}</td>
                <td><span class="badge ${p.status.includes('Active') ? 'badge-success' : 'badge-danger'}">${p.status}</span></td>
                <td>${p.date}</td>
                <td>
                  ${p.status.includes('Active') ? `
                    <button class="btn btn-danger btn-sm admin-hide-post-btn" data-id="${p.id}">
                      Hide Post
                    </button>
                  ` : `
                    <button class="btn btn-secondary btn-sm admin-restore-post-btn" data-id="${p.id}">
                      Reactivate
                    </button>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // 4. Reported Posts Queue
  renderReportsQueue() {
    const reports = Diskrit.mockData.admin.reportsQueue;
    return `
      <div class="admin-table-container">
        <div class="admin-table-toolbar">
          <div style="font-weight: 700; font-size: var(--font-base);">Community Flagged Reports Queue</div>
          <span class="badge badge-warning">${reports.length} Open Reports</span>
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Reporter</th>
              <th>Offending Account</th>
              <th>Violation Reason</th>
              <th>Notes / Message</th>
              <th>Triage Action</th>
            </tr>
          </thead>
          <tbody>
            ${reports.map(r => `
              <tr id="rep-row-${r.id}">
                <td>#${r.id}</td>
                <td style="font-weight: 600;">${r.reporter}</td>
                <td>${r.postAuthor}</td>
                <td><span class="badge badge-danger">${r.reason}</span></td>
                <td>${r.message}</td>
                <td>
                  <button class="btn btn-danger btn-sm delete-reported-post-btn" data-id="${r.id}">
                    Permanently Delete
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // 5. AI Moderation Review Queue
  renderAIModerationQueue() {
    const aiQueue = Diskrit.mockData.admin.aiModerationQueue;
    return `
      <div class="admin-table-container">
        <div class="admin-table-toolbar">
          <div style="font-weight: 700; font-size: var(--font-base);">AI Safety Filter Review Queue</div>
          <span class="badge badge-danger">${aiQueue.length} Auto-Flagged</span>
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Author</th>
              <th>Content Sample</th>
              <th>AI Safety Rationale</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${aiQueue.map(item => `
              <tr id="ai-row-${item.id}">
                <td>#${item.id}</td>
                <td style="font-weight: 600;">${item.author}</td>
                <td>${item.excerpt}</td>
                <td><span class="badge badge-warning">${item.aiFlag}</span></td>
                <td>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn btn-primary btn-sm ai-approve-btn" data-id="${item.id}" title="Approve false positive">
                      Approve
                    </button>
                    <button class="btn btn-danger btn-sm ai-delete-btn" data-id="${item.id}">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // 6. Connected Websites Ad Network
  renderAdWebsites() {
    const sites = Diskrit.mockData.admin.connectedWebsites;
    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-6);">
        <div class="admin-header-row">
          <div>
            <h1 class="admin-title">External Ad Distribution Network</h1>
            <p class="admin-subtitle">Syndicate Diskrit widgets and native ad units across external WordPress and web publishers.</p>
          </div>
          <a href="#superadmin/ad-websites/create" class="btn btn-primary">
            ${Diskrit.icons("plus", "", 16)}
            <span>Connect New Website</span>
          </a>
        </div>

        <!-- Network Stats -->
        <div class="kpi-grid">
          <div class="kpi-card kpi-success">
            <span class="kpi-label">Connected Domains</span>
            <div class="kpi-value">${sites.length} Active</div>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Total Impressions</span>
            <div class="kpi-value">${Diskrit.mockData.admin.kpis.networkImpressions}</div>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Verified Clicks</span>
            <div class="kpi-value">${Diskrit.mockData.admin.kpis.networkClicks}</div>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Network CTR</span>
            <div class="kpi-value">${Diskrit.mockData.admin.kpis.networkCtr}</div>
          </div>
        </div>

        <div class="admin-table-container">
          <div class="admin-table-toolbar">
            <span style="font-weight: 700;">Publisher Directory</span>
          </div>
          <table class="admin-table">
            <thead>
              <tr>
                <th>Domain Name</th>
                <th>API Site Key</th>
                <th>Default Format</th>
                <th>Theme</th>
                <th>CTR</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${sites.map(s => `
                <tr>
                  <td>
                    <div style="font-weight: 600; color: var(--text-primary);">${s.name}</div>
                    <div style="font-size: var(--font-xs); color: var(--text-muted);">${s.domain}</div>
                  </td>
                  <td><code style="font-size: 11px; background: var(--bg-surface-elevated); padding: 2px 6px; border-radius: 4px;">${s.key}</code></td>
                  <td><span class="badge badge-neutral">${s.defaultFormat}</span></td>
                  <td>${s.theme}</td>
                  <td style="font-weight: 600; color: var(--color-success);">${s.ctr}</td>
                  <td><span class="badge badge-success">${s.status}</span></td>
                  <td>
                    <a href="#superadmin/ad-websites/${s.id}" class="btn btn-secondary btn-sm">
                      Open Ad Studio
                    </a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 7. Interactive Live Ad Preview Studio (Documented in handoff 2.6.7)
  renderAdStudio(siteId) {
    const sites = Diskrit.mockData.admin.connectedWebsites;
    const site = sites.find(s => s.id === siteId) || sites[0];

    return `
      <div class="ad-studio-container">
        <!-- Studio Header -->
        <div class="admin-header-row">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <a href="#superadmin/ad-websites" class="btn btn-ghost btn-sm">
                ${Diskrit.icons("chevronLeft", "", 16)}
                <span>Back to Publishers</span>
              </a>
            </div>
            <h1 class="admin-title">Ad Studio: ${site.name}</h1>
            <p class="admin-subtitle">Live WYSIWYG configurator & embed snippet generator for <strong>${site.domain}</strong></p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" id="regenerate-key-btn">Regenerate Key</button>
            <span class="badge badge-success" style="align-self: center;">Connected & Active</span>
          </div>
        </div>

        <!-- Studio Controls Bar -->
        <div class="ad-studio-controls">
          <!-- Viewport Switcher -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: var(--font-xs); color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Viewport:</span>
            <button class="pill-tag studio-viewport-btn selected" data-viewport="desktop">Desktop (100%)</button>
            <button class="pill-tag studio-viewport-btn" data-viewport="tablet">Tablet (540px)</button>
            <button class="pill-tag studio-viewport-btn" data-viewport="mobile">Mobile (340px)</button>
          </div>

          <!-- Format Selector -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: var(--font-xs); color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Ad Format:</span>
            <select id="studio-format-select" class="form-select" style="width: 140px; height: 34px; padding: 2px 10px; font-size: var(--font-xs);">
              <option value="card">Card Unit</option>
              <option value="banner">Leaderboard</option>
              <option value="floating">Floating Pill</option>
              <option value="story">Story Widget</option>
            </select>
          </div>

          <!-- Preview Theme Toggle -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: var(--font-xs); color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Preview Theme:</span>
            <button class="btn btn-secondary btn-sm" id="studio-theme-toggle-btn" style="padding: 4px 10px;">
              Dark Preview
            </button>
          </div>
        </div>

        <!-- Live Preview Canvas -->
        <div class="ad-viewport-preview-wrapper">
          <div class="ad-preview-viewport viewport-desktop" id="studio-live-canvas">
            <!-- Simulated publisher webpage content -->
            <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; margin-bottom: 16px; font-weight: 700; color: var(--text-muted); font-size: 13px;">
              Publisher Article: "The Future of Cyber Aesthetics in 2026"
            </div>
            
            <!-- The Live Rendered Diskrit Ad Unit -->
            <div id="rendered-ad-unit-container">
              <div class="mock-ad-card">
                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80" alt="Sponsored Ad">
                <div class="mock-ad-card-body">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="badge badge-primary">Promoted via Diskrit</span>
                    <span style="font-size: 11px; color: var(--text-muted);">diskrit.io</span>
                  </div>
                  <div style="font-weight: 700; font-size: var(--font-base);">Procedural Audio & Synthesizer Toolkit</div>
                  <div style="font-size: var(--font-xs); color: var(--text-secondary);">Real-time generative harmonics directly in the browser. Try the open live beta now.</div>
                  <button class="btn btn-primary btn-sm" style="margin-top: 8px;">Explore Now &rarr;</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Embed Code Snippet Generator -->
        <div class="card" style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; font-size: var(--font-base);">Embed HTML Snippet</div>
              <div style="font-size: var(--font-xs); color: var(--text-muted);">Paste this single line of JavaScript before the closing &lt;/body&gt; tag on <strong>${site.domain}</strong>:</div>
            </div>
            <button class="btn btn-secondary btn-sm" id="copy-snippet-btn" style="gap: 6px;">
              ${Diskrit.icons("copy", "", 14)}
              <span>Copy Snippet</span>
            </button>
          </div>
          <div class="code-snippet-box" id="snippet-text-container">
&lt;!-- Diskrit Native Publisher Widget --&gt;
&lt;div class="diskrit-ad-slot" data-site-key="${site.key}" data-format="${site.defaultFormat.toLowerCase()}"&gt;&lt;/div&gt;
&lt;script async src="https://cdn.diskrit.io/sdk/adnet-v2.js"&gt;&lt;/script&gt;
          </div>
        </div>
      </div>
    `;
  },

  // 8. Connect New Website Form
  renderCreateWebsite() {
    return `
      <div class="card" style="max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-4);">
        <h2 style="font-size: var(--font-xl); font-weight: 700;">Connect External Publisher Website</h2>
        <p style="font-size: var(--font-sm); color: var(--text-muted);">Register a new WordPress or third-party web domain into Diskrit's syndicate ad network.</p>

        <form id="connect-site-form" style="display: flex; flex-direction: column; gap: var(--space-4);">
          <div class="form-group">
            <label class="form-label">Publisher Site Name</label>
            <input type="text" id="site-name-input" class="form-input" placeholder="e.g. Cyberpunk Weekly" required>
          </div>

          <div class="form-group">
            <label class="form-label">Primary Domain (FQDN)</label>
            <input type="text" id="site-domain-input" class="form-input" placeholder="e.g. cyberpunkweekly.org" required>
          </div>

          <div class="form-group">
            <label class="form-label">Allowed Origin Headers (CORS Protection)</label>
            <input type="text" class="form-input" value="https://cyberpunkweekly.org, https://www.cyberpunkweekly.org">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label">Default Ad Format</label>
              <select class="form-select" id="site-format-select">
                <option value="Card">Card Unit</option>
                <option value="Banner">Leaderboard Banner</option>
                <option value="Floating">Floating Widget</option>
                <option value="Story">Story Unit</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Default Theme</label>
              <select class="form-select">
                <option value="Dark">Dark Mode</option>
                <option value="Light">Light Mode</option>
              </select>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px;">
            <a href="#superadmin/ad-websites" class="btn btn-secondary">Cancel</a>
            <button type="button" class="btn btn-primary" id="submit-connect-site-btn">Register Publisher</button>
          </div>
        </form>
      </div>
    `;
  },

  attachEvents(view = "dashboard") {
    // Ban / Unban user toggle
    document.querySelectorAll(".toggle-ban-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const row = document.getElementById(`admin-user-row-${btn.dataset.id}`);
        const badge = row ? row.querySelector(".status-badge") : null;
        if (btn.dataset.status === "Active") {
          btn.dataset.status = "Banned";
          btn.textContent = "Restore";
          if (badge) {
            badge.textContent = "Banned";
            badge.className = "badge badge-danger status-badge";
          }
          Diskrit.components.modals.toast("Account suspended and banned", "info");
        } else {
          btn.dataset.status = "Active";
          btn.textContent = "Ban User";
          if (badge) {
            badge.textContent = "Active";
            badge.className = "badge badge-success status-badge";
          }
          Diskrit.components.modals.toast("Account restored to Active", "success");
        }
      });
    });

    // Hide post in admin table
    document.querySelectorAll(".admin-hide-post-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        Diskrit.components.modals.showHidePostModal(id, (reason) => {
          const row = document.getElementById(`admin-post-row-${id}`);
          if (row) {
            row.querySelector("td:nth-child(4)").innerHTML = `<span class="badge badge-danger">Hidden (${reason})</span>`;
            btn.textContent = "Reactivate";
            btn.className = "btn btn-secondary btn-sm admin-restore-post-btn";
          }
          Diskrit.components.modals.toast(`Post hidden: ${reason}`, "info");
        });
      });
    });

    // Delete reported post
    document.querySelectorAll(".delete-reported-post-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const row = document.getElementById(`rep-row-${id}`);
        if (row) row.remove();
        Diskrit.components.modals.toast("Post permanently deleted from platform", "success");
      });
    });

    // AI approve / delete
    document.querySelectorAll(".ai-approve-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const row = document.getElementById(`ai-row-${id}`);
        if (row) row.remove();
        Diskrit.components.modals.toast("Post approved! False positive overridden and restored to feed.", "success");
      });
    });

    document.querySelectorAll(".ai-delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const row = document.getElementById(`ai-row-${id}`);
        if (row) row.remove();
        Diskrit.components.modals.toast("Violation confirmed. Post purged.", "info");
      });
    });

    // Live Ad Studio Controls
    const canvas = document.getElementById("studio-live-canvas");
    document.querySelectorAll(".studio-viewport-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".studio-viewport-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        const vp = btn.dataset.viewport;
        if (canvas) {
          canvas.className = `ad-preview-viewport viewport-${vp}`;
        }
      });
    });

    const formatSelect = document.getElementById("studio-format-select");
    const adContainer = document.getElementById("rendered-ad-unit-container");
    if (formatSelect && adContainer) {
      formatSelect.addEventListener("change", (e) => {
        const fmt = e.target.value;
        if (fmt === "banner") {
          adContainer.innerHTML = `
            <div class="mock-ad-banner">
              <div>
                <span class="badge badge-primary">Promoted</span>
                <div style="font-weight: 700; font-size: var(--font-sm); margin-top: 4px;">Procedural Audio & Synthesizer Toolkit</div>
              </div>
              <button class="btn btn-primary btn-sm">Explore Now</button>
            </div>
          `;
        } else if (fmt === "floating") {
          adContainer.innerHTML = `
            <div style="display: inline-flex; align-items: center; gap: 12px; background: var(--accent); color: #fff; padding: 10px 16px; border-radius: 9999px; box-shadow: var(--shadow-lg);">
              <span style="font-weight: 700; font-size: 13px;">Experience Diskrit Ad Network</span>
              <button class="btn btn-secondary btn-sm" style="background: #fff; color: #000; border: none; padding: 2px 10px;">Try Free</button>
            </div>
          `;
        } else {
          adContainer.innerHTML = `
            <div class="mock-ad-card">
              <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80" alt="Sponsored Ad">
              <div class="mock-ad-card-body">
                <span class="badge badge-primary">Promoted via Diskrit</span>
                <div style="font-weight: 700; font-size: var(--font-base);">Procedural Audio & Synthesizer Toolkit</div>
                <div style="font-size: var(--font-xs); color: var(--text-secondary);">Real-time generative harmonics directly in the browser.</div>
                <button class="btn btn-primary btn-sm" style="margin-top: 8px;">Explore Now &rarr;</button>
              </div>
            </div>
          `;
        }
      });
    }

    const copyBtn = document.getElementById("copy-snippet-btn");
    const snippetBox = document.getElementById("snippet-text-container");
    if (copyBtn && snippetBox) {
      copyBtn.addEventListener("click", () => {
        const text = snippetBox.innerText;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            Diskrit.components.modals.toast("Embed script copied to clipboard!", "success");
          });
        }
      });
    }

    // Connect site submit
    const submitSiteBtn = document.getElementById("submit-connect-site-btn");
    if (submitSiteBtn) {
      submitSiteBtn.addEventListener("click", () => {
        const name = document.getElementById("site-name-input").value.trim();
        const domain = document.getElementById("site-domain-input").value.trim();
        const fmt = document.getElementById("site-format-select").value;
        if (!name || !domain) {
          Diskrit.components.modals.toast("Please fill in site name and domain", "error");
          return;
        }

        const newSite = {
          id: `site-${Date.now()}`,
          name: name,
          domain: domain,
          key: `dsk_live_${Math.random().toString(36).substring(2, 10)}`,
          defaultFormat: fmt,
          theme: "Dark",
          impressions: "0",
          clicks: "0",
          ctr: "0%",
          status: "Active"
        };
        Diskrit.mockData.admin.connectedWebsites.push(newSite);
        Diskrit.components.modals.toast(`Domain ${domain} registered into syndicate network!`, "success");
        window.location.hash = `#superadmin/ad-websites/${newSite.id}`;
      });
    }
  }
};
