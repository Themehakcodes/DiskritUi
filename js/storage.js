/**
 * DISKRIT STORAGE SERVICE
 * Centralized, fault-tolerant persistence wrapper for demo state
 */

window.Diskrit = window.Diskrit || {};

Diskrit.storage = {
  _memoryFallback: {},

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`diskrit_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return this._memoryFallback[key] !== undefined ? this._memoryFallback[key] : defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(`diskrit_${key}`, JSON.stringify(value));
    } catch (e) {
      this._memoryFallback[key] = value;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(`diskrit_${key}`);
    } catch (e) {
      delete this._memoryFallback[key];
    }
  },

  // State initializers
  init() {
    const existingPosts = this.get("posts");
    if (!existingPosts || existingPosts.length < Diskrit.mockData.posts.length) {
      this.set("posts", Diskrit.mockData.posts);
    }
    if (!this.get("currentUser")) {
      this.set("currentUser", Diskrit.mockData.currentUser);
    }
    if (!this.get("savedBookmarks")) {
      this.set("savedBookmarks", Diskrit.mockData.savedBookmarks);
    }
    if (!this.get("safeMode")) {
      this.set("safeMode", true); // Default Safe Mode ON
    }
    if (!this.get("theme")) {
      this.set("theme", "dark");
    }
    if (!this.get("accent")) {
      this.set("accent", "indigo");
    }
    if (!this.get("notifications")) {
      this.set("notifications", Diskrit.mockData.notifications);
    }
  }
};

Diskrit.storage.init();
