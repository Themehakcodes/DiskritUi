/**
 * DISKRIT PUBLIC & LEGAL POLICIES MODULE
 * Shared unified layout with 1-click policy pills for About, Terms, Privacy, Cookies, Acceptable Use, Disclaimer & A11y
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.legal = {
  render(doc = "about") {
    const docs = {
      about: {
        title: "About Diskrit",
        desc: "Platform introduction, mission statement, and core principles",
        icon: "sparkles",
        content: `
          <h3>Welcome to Diskrit</h3>
          <p>Diskrit is an open, modern social networking platform engineered for high-fidelity discovery, creative media streaming, and community connection with uncompromised privacy controls.</p>
          <br>
          <h3>Our Three Foundational Pillars</h3>
          <ul style="list-style: disc; padding-left: 20px; line-height: 1.8; color: var(--text-secondary);">
            <li><strong>Creator Empowerment:</strong> Direct audience connection with zero algorithmic shadow-banning or artificial engagement dampening.</li>
            <li><strong>Expressive Privacy & Identity:</strong> Native encrypted anonymous posting, granular public vs. private social graph controls, and comprehensive demographic identity expression.</li>
            <li><strong>Radical Performance:</strong> Built on pure web standards with zero heavy framework bloat for instantaneous responsiveness across desktop and mobile.</li>
          </ul>
        `
      },
      terms: {
        title: "Terms of Service",
        desc: "User agreement, account responsibilities, and intellectual property terms",
        icon: "lock",
        content: `
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing or registering with Diskrit, you enter into a binding agreement to adhere to these community terms and standards.</p>
          <br>
          <h3>2. User Content & Licensing</h3>
          <p>You retain full ownership and intellectual property rights over all photos, audio, videos, and texts you publish on Diskrit. By publishing content to public timelines, you grant Diskrit a non-exclusive license to syndicate and host your media for platform display.</p>
          <br>
          <h3>3. Community Standards & Prohibited Conduct</h3>
          <p>Harassment, abusive behavior, malicious software distribution, non-consensual media sharing, and automated bot spam are strictly prohibited and subject to immediate account termination.</p>
        `
      },
      privacy: {
        title: "Privacy & Data Policy",
        desc: "Transparency in telemetry, data storage, and user privacy safeguards",
        icon: "shield",
        content: `
          <h3>1. Zero Data Harvesting</h3>
          <p>Diskrit does not sell personal profile dossiers, search queries, or private communications to third-party data brokers or behavioral advertising networks.</p>
          <br>
          <h3>2. Anonymous Mode Safeguards</h3>
          <p>When posting via Diskrit's Anonymous toggle, your identity is detached from public indexation. Your handle and profile avatar are masked across all client timelines.</p>
          <br>
          <h3>3. 21-Day Auto-Expiring Bookmarks</h3>
          <p>Saved items in your personal library are set to auto-expire after 21 days by default to minimize permanent digital clutter, unless you explicitly select "Keep Forever" to archive items permanently.</p>
        `
      },
      cookies: {
        title: "Cookie & Local Storage Policy",
        desc: "How Diskrit utilizes cookies and browser local storage for optimal functionality",
        icon: "activity",
        content: `
          <h3>Essential Storage Usage</h3>
          <p>Diskrit utilizes local storage exclusively for state persistence: your theme preference (Dark/Light), active accent color palette, Safe Mode status, and session authentication tokens.</p>
          <br>
          <h3>No Invasive Tracking Cookies</h3>
          <p>We do not use cross-site tracking pixels or fingerprinting techniques across external domains.</p>
        `
      },
      "acceptable-use": {
        title: "Acceptable Use Policy",
        desc: "Platform rules of conduct, safety guidelines, and prohibited activities",
        icon: "shieldAlert",
        content: `
          <h3>Prohibited Behaviors</h3>
          <p>The following activities result in immediate action, content hiding, or permanent account bans:</p>
          <ul style="list-style: disc; padding-left: 20px; line-height: 1.8; color: var(--text-secondary);">
            <li>Spreading malicious code, exploits, or phishing vectors.</li>
            <li>Hate speech targeting protected attributes or violent threats.</li>
            <li>Posting unflagged explicit adult media outside of Safe Mode classifications.</li>
            <li>Operating unauthorized automated scraping bots.</li>
          </ul>
        `
      },
      disclaimer: {
        title: "Legal Disclaimer",
        desc: "Limitations of liability and warranties",
        icon: "globe",
        content: `
          <h3>User-Generated Content Disclaimer</h3>
          <p>Diskrit operates as an interactive platform for user-generated content. Views, statements, and media posted by creators represent their independent opinions and not the official endorsement of Diskrit Media Inc.</p>
        `
      },
      accessibility: {
        title: "Accessibility Statement",
        desc: "WCAG 2.1 AA compliance commitments and universal design standards",
        icon: "eye",
        content: `
          <h3>Our Commitment to Accessibility</h3>
          <p>Diskrit is built from the ground up to support accessible web standards, ensuring contrast ratios exceed WCAG 2.1 AA thresholds (minimum 4.5:1), touch targets meet or exceed 44x44px, and interactive elements feature descriptive aria-labels.</p>
        `
      }
    };

    const activeDoc = docs[doc] || docs.about;

    return `
      <div style="display: flex; flex-direction: column; gap: var(--space-6); max-width: 860px; margin: 0 auto; width: 100%;">
        <!-- Legal Document Switcher Pills -->
        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; border-bottom: 1px solid var(--border-subtle); scrollbar-width: none;">
          <a href="#legal/about" class="pill-tag ${doc === 'about' ? 'selected' : ''}">About</a>
          <a href="#legal/terms" class="pill-tag ${doc === 'terms' ? 'selected' : ''}">Terms</a>
          <a href="#legal/privacy" class="pill-tag ${doc === 'privacy' ? 'selected' : ''}">Privacy</a>
          <a href="#legal/cookies" class="pill-tag ${doc === 'cookies' ? 'selected' : ''}">Cookies</a>
          <a href="#legal/acceptable-use" class="pill-tag ${doc === 'acceptable-use' ? 'selected' : ''}">Acceptable Use</a>
          <a href="#legal/disclaimer" class="pill-tag ${doc === 'disclaimer' ? 'selected' : ''}">Disclaimer</a>
          <a href="#legal/accessibility" class="pill-tag ${doc === 'accessibility' ? 'selected' : ''}">Accessibility</a>
        </div>

        <!-- Document Card -->
        <div class="card" style="padding: var(--space-8); display: flex; flex-direction: column; gap: var(--space-6);">
          <div style="display: flex; align-items: center; gap: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: var(--space-5);">
            <div style="width: 52px; height: 52px; border-radius: var(--radius-xl); background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center;">
              ${Diskrit.icons(activeDoc.icon, "", 26)}
            </div>
            <div>
              <h1 style="font-size: var(--font-2xl); font-weight: 800;">${activeDoc.title}</h1>
              <p style="color: var(--text-muted); font-size: var(--font-sm);">${activeDoc.desc}</p>
            </div>
          </div>

          <div style="color: var(--text-secondary); line-height: 1.7; font-size: var(--font-base);">
            ${activeDoc.content}
          </div>

          <div style="border-top: 1px solid var(--border-subtle); padding-top: var(--space-4); display: flex; justify-content: space-between; align-items: center; font-size: var(--font-xs); color: var(--text-muted);">
            <span>Last revised: October 2026</span>
            <a href="#home" class="btn btn-secondary btn-sm">Return to Newsfeed</a>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {}
};
