/**
 * DISKRIT AUTHENTICATION & ONBOARDING
 * Split-screen modern forms for Login, Register, Forgot/Reset Password, 2FA Challenge & Email Verify
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.auth = {
  render(view = "login", params = {}) {
    return `
      <div class="auth-wrapper">
        <!-- Left Hero Banner -->
        <div class="auth-hero-side">
          <div class="auth-hero-glow"></div>
          
          <div style="display: flex; align-items: center; gap: 10px; position: relative; z-index: 2;">
            <img src="assets/images/logo.png" style="height: 36px; width: auto; object-fit: contain;" alt="Diskrit">
            <span style="font-size: var(--font-xl); font-weight: 800; color: #ffffff;">Diskrit</span>
          </div>

          <div class="auth-hero-content">
            <span class="badge badge-primary" style="width: fit-content; font-size: 11px;">Next-Gen Social Network</span>
            <h1 class="auth-hero-title">Experience Pure Content Discovery & Free Expression.</h1>
            <p class="auth-hero-desc">
              Fast, high-fidelity feeds, immersive vertical shorts, encrypted direct messaging, and community-first privacy controls.
            </p>
          </div>

          <div style="font-size: var(--font-xs); color: #94a3b8; position: relative; z-index: 2;">
            &copy; 2026 Diskrit Media Inc. All rights reserved.
          </div>
        </div>

        <!-- Right Form Side -->
        <div class="auth-form-side">
          ${this.renderFormView(view, params)}
        </div>
      </div>
    `;
  },

  renderFormView(view, params) {
    if (view === "register") {
      return `
        <div class="auth-card">
          <div class="auth-card-header">
            <h2 class="auth-title">Create your account</h2>
            <p class="auth-subtitle">Join the Diskrit community today. Already registered? <a href="#login" style="color: var(--accent); font-weight: 600;">Sign In</a></p>
          </div>

          <form id="auth-register-form" style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Full Name</label>
                <input type="text" id="reg-name" class="form-input" placeholder="Alex Mercer" required>
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Handle</label>
                <input type="text" id="reg-handle" class="form-input" placeholder="alexmercer" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="reg-email" class="form-input" placeholder="alex@domain.com" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Gender</label>
                <select class="form-select" id="reg-gender">
                  <option value="Other">Non-Binary / Other</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
              <div class="form-group" style="margin: 0;">
                <label class="form-label">Birth Date</label>
                <input type="date" class="form-input" id="reg-dob" value="2000-01-01">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="reg-pass" class="form-input" placeholder="Create strong password" required>
            </div>

            <div style="display: flex; align-items: flex-start; gap: 8px; font-size: var(--font-xs); color: var(--text-muted);">
              <input type="checkbox" id="reg-terms" required style="margin-top: 2px;">
              <label for="reg-terms">I agree to Diskrit's <a href="#legal/terms" style="color: var(--accent);">Terms of Service</a> and <a href="#legal/privacy" style="color: var(--accent);">Privacy Policy</a>.</label>
            </div>

            <button type="button" class="btn btn-primary btn-lg" id="submit-register-btn" style="width: 100%; margin-top: 4px;">
              Create Account
            </button>
          </form>
        </div>
      `;
    }

    if (view === "forgot-password") {
      return `
        <div class="auth-card">
          <div class="auth-card-header">
            <h2 class="auth-title">Reset password</h2>
            <p class="auth-subtitle">Enter your registered email address to receive password recovery instructions.</p>
          </div>

          <form id="auth-forgot-form" style="display: flex; flex-direction: column; gap: var(--space-4);">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="forgot-email" class="form-input" placeholder="alex@domain.com" required>
            </div>

            <button type="button" class="btn btn-primary btn-lg" id="submit-forgot-btn" style="width: 100%;">
              Send Reset Link
            </button>

            <a href="#login" style="text-align: center; font-size: var(--font-sm); color: var(--accent); font-weight: 600; margin-top: 8px;">
              Return to Log In
            </a>
          </form>
        </div>
      `;
    }

    if (view === "two-factor") {
      return `
        <div class="auth-card" style="text-align: center;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; margin: 0 auto 8px;">
            ${Diskrit.icons("lock", "", 28)}
          </div>
          <div class="auth-card-header">
            <h2 class="auth-title">Two-Factor Authentication</h2>
            <p class="auth-subtitle">Enter the 6-digit TOTP verification code from your authenticator app.</p>
          </div>

          <div class="two-factor-inputs">
            <input type="text" maxlength="1" class="two-factor-digit" autofocus>
            <input type="text" maxlength="1" class="two-factor-digit">
            <input type="text" maxlength="1" class="two-factor-digit">
            <input type="text" maxlength="1" class="two-factor-digit">
            <input type="text" maxlength="1" class="two-factor-digit">
            <input type="text" maxlength="1" class="two-factor-digit">
          </div>

          <button type="button" class="btn btn-primary btn-lg" id="submit-2fa-btn" style="width: 100%; margin-top: 12px;">
            Verify & Continue
          </button>

          <a href="#login" style="font-size: var(--font-xs); color: var(--text-muted); margin-top: 16px;">
            Use Emergency Recovery Code instead
          </a>
        </div>
      `;
    }

    if (view === "email-verify") {
      return `
        <div class="auth-card" style="text-align: center;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: var(--color-success); display: flex; align-items: center; justify-content: center; margin: 0 auto 8px;">
            ${Diskrit.icons("sparkles", "", 28)}
          </div>
          <div class="auth-card-header">
            <h2 class="auth-title">Verify your email address</h2>
            <p class="auth-subtitle">We have dispatched a verification email to your inbox. Please click the link to confirm your account.</p>
          </div>

          <button type="button" class="btn btn-primary btn-lg" id="resend-verify-email-btn" style="width: 100%; margin-top: 12px;">
            Resend Verification Email
          </button>

          <a href="#home" class="btn btn-secondary btn-sm" style="margin-top: 12px; width: 100%;">
            Continue to Feed
          </a>
        </div>
      `;
    }

    // Default: Login
    return `
      <div class="auth-card">
        <div class="auth-card-header">
          <h2 class="auth-title">Welcome back</h2>
          <p class="auth-subtitle">New to Diskrit? <a href="#register" style="color: var(--accent); font-weight: 600;">Create an account</a></p>
        </div>

        <form id="auth-login-form" style="display: flex; flex-direction: column; gap: var(--space-4);">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="login-email" class="form-input" value="alex@diskrit.io" required>
          </div>

          <div class="form-group">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label class="form-label">Password</label>
              <a href="#forgot-password" style="font-size: var(--font-xs); color: var(--accent);">Forgot password?</a>
            </div>
            <input type="password" id="login-pass" class="form-input" value="password123" required>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="login-remember" checked>
            <label for="login-remember" style="font-size: var(--font-xs); color: var(--text-secondary);">Remember this device for 30 days</label>
          </div>

          <button type="button" class="btn btn-primary btn-lg" id="submit-login-btn" style="width: 100%; margin-top: 4px;">
            Log In to Diskrit
          </button>
        </form>

        <div class="auth-divider">
          <span class="auth-divider-text">Or continue with</span>
        </div>

        <!-- Social Auth Row -->
        <div class="social-auth-row">
          <button class="social-auth-btn social-login-action" data-provider="Google" title="Sign in with Google">
            G
          </button>
          <button class="social-auth-btn social-login-action" data-provider="X / Twitter" title="Sign in with X">
            𝕏
          </button>
          <button class="social-auth-btn social-login-action" data-provider="Telegram" title="Sign in with Telegram">
            TG
          </button>
          <button class="social-auth-btn social-login-action" data-provider="Facebook" title="Sign in with Facebook">
            f
          </button>
        </div>
      </div>
    `;
  },

  attachEvents(view = "login") {
    // Login Submit
    const loginBtn = document.getElementById("submit-login-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        Diskrit.components.modals.toast("Authentication verified! Logging in...", "success");
        setTimeout(() => {
          window.location.hash = "#two-factor-challenge";
        }, 600);
      });
    }

    // Register Submit
    const regBtn = document.getElementById("submit-register-btn");
    if (regBtn) {
      regBtn.addEventListener("click", () => {
        Diskrit.components.modals.toast("Account created! Directing to email verification...", "success");
        setTimeout(() => {
          window.location.hash = "#email/verify";
        }, 600);
      });
    }

    // Forgot Password Submit
    const forgotBtn = document.getElementById("submit-forgot-btn");
    if (forgotBtn) {
      forgotBtn.addEventListener("click", () => {
        Diskrit.components.modals.toast("Password reset instructions emailed!", "success");
      });
    }

    // 2FA Submit & Auto-focus advancement
    const digitInputs = document.querySelectorAll(".two-factor-digit");
    digitInputs.forEach((input, idx) => {
      input.addEventListener("input", () => {
        if (input.value && idx < digitInputs.length - 1) {
          digitInputs[idx + 1].focus();
        }
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && idx > 0) {
          digitInputs[idx - 1].focus();
        }
      });
    });

    const verify2faBtn = document.getElementById("submit-2fa-btn");
    if (verify2faBtn) {
      verify2faBtn.addEventListener("click", () => {
        Diskrit.components.modals.toast("2FA TOTP code verified! Welcome, Alex.", "success");
        setTimeout(() => {
          window.location.hash = "#home";
        }, 500);
      });
    }

    // Social login click simulation
    document.querySelectorAll(".social-login-action").forEach(btn => {
      btn.addEventListener("click", () => {
        Diskrit.components.modals.toast(`Simulating OAuth login with ${btn.dataset.provider}...`, "info");
        setTimeout(() => {
          window.location.hash = "#home";
        }, 600);
      });
    });

    const resendBtn = document.getElementById("resend-verify-email-btn");
    if (resendBtn) {
      resendBtn.addEventListener("click", () => {
        Diskrit.components.modals.toast("Fresh verification email sent!", "success");
      });
    }
  }
};
