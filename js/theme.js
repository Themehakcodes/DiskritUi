/**
 * DISKRIT THEME & ACCENT MANAGER
 * Handles light/dark switching, 12 accent colors, and unified Safe Mode toggle
 */

window.Diskrit = window.Diskrit || {};

Diskrit.theme = {
  currentTheme: "dark",
  currentAccent: "coral",

  accents: [
    { name: "coral", hex: "#f0644b", label: "Diskrit Coral" },
    { name: "indigo", hex: "#6366f1", label: "Indigo" },
    { name: "crimson", hex: "#ef4444", label: "Crimson" },
    { name: "amber", hex: "#f59e0b", label: "Amber" },
    { name: "emerald", hex: "#10b981", label: "Emerald" },
    { name: "cyan", hex: "#06b6d4", label: "Cyan" },
    { name: "violet", hex: "#8b5cf6", label: "Violet" },
    { name: "rose", hex: "#f43f5e", label: "Rose" },
    { name: "blue", hex: "#3b82f6", label: "Blue" },
    { name: "lime", hex: "#84cc16", label: "Lime" },
    { name: "gold", hex: "#eab308", label: "Gold" },
    { name: "fuchsia", hex: "#d946ef", label: "Fuchsia" }
  ],

  init() {
    this.currentTheme = Diskrit.storage.get("theme", "dark");
    this.currentAccent = "coral";

    this.applyTheme(this.currentTheme);
    this.applyAccent("coral");
  },

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    Diskrit.storage.set("theme", theme);
  },

  toggleTheme() {
    const nextTheme = this.currentTheme === "dark" ? "light" : "dark";
    this.applyTheme(nextTheme);
    return nextTheme;
  },

  applyAccent(accentName = "coral") {
    this.currentAccent = "coral";
    document.documentElement.setAttribute("data-accent", "coral");
    Diskrit.storage.set("accent", "coral");
  },

  // Safe Mode Management (Solves Flaw 2.4)
  isSafeMode() {
    return Diskrit.storage.get("safeMode", true);
  },

  setSafeMode(enabled) {
    Diskrit.storage.set("safeMode", enabled);
    // Notify DOM and re-render post sensitivities if needed
    document.dispatchEvent(new CustomEvent("diskrit:safemode-change", { detail: { enabled } }));
  }
};

Diskrit.theme.init();
