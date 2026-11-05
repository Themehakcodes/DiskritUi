/**
 * DISKRIT MASONRY AUTO-ADAPT GRID ENGINE
 * Solves: Awkward row voids in 2-column post feeds
 * Dynamically packs grid items using micro-row CSS grid units with real-time ResizeObserver
 */

window.Diskrit = window.Diskrit || {};

Diskrit.masonry = {
  activeObservers: new Map(),

  ROW_HEIGHT: 4,
  ROW_GAP: 16,

  calculateSpan(height) {
    return Math.ceil((height + this.ROW_GAP) / (this.ROW_HEIGHT + this.ROW_GAP));
  },

  adjustItem(item) {
    if (!item) return;
    if (window.innerWidth <= 860) {
      item.style.gridRowEnd = "";
      return;
    }

    // Measure rendered height of card
    const height = item.getBoundingClientRect().height;
    if (height > 0) {
      const span = this.calculateSpan(height);
      item.style.gridRowEnd = `span ${span}`;
    }
  },

  init(container) {
    if (!container) return;
    if (!container.classList.contains("posts-grid-view")) return;

    // Disconnect previous observer on this container if any
    if (this.activeObservers.has(container)) {
      this.activeObservers.get(container).disconnect();
      this.activeObservers.delete(container);
    }

    if (window.innerWidth <= 860) {
      container.querySelectorAll(".post-card, article, .card").forEach(el => {
        el.style.gridRowEnd = "";
      });
      return;
    }

    const items = container.querySelectorAll(".post-card, article, .card");
    if (items.length === 0) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.adjustItem(entry.target);
      }
    });

    items.forEach(item => {
      this.adjustItem(item);
      observer.observe(item);
    });

    this.activeObservers.set(container, observer);

    // Watch for newly added media (images/videos)
    container.querySelectorAll("img, video").forEach(media => {
      const card = media.closest(".post-card, article, .card");
      if (!card) return;

      if (media.tagName.toLowerCase() === "img") {
        if (!media.complete) {
          media.addEventListener("load", () => this.adjustItem(card), { once: true });
        }
      } else if (media.tagName.toLowerCase() === "video") {
        media.addEventListener("loadedmetadata", () => this.adjustItem(card), { once: true });
      }
    });

    // Run a second pass after initial layout paint
    requestAnimationFrame(() => {
      items.forEach(item => this.adjustItem(item));
    });
  },

  updateAll() {
    document.querySelectorAll(".posts-grid-view").forEach(grid => {
      this.init(grid);
    });
  }
};

// Global resize listener
window.addEventListener("resize", () => {
  if (Diskrit.masonry) {
    Diskrit.masonry.updateAll();
  }
});

