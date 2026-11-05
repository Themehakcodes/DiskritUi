/**
 * DISKRIT CHATIFY MESSENGER & CHANNELS
 * Solves Flaws 7.1 & 7.2: Unified Diskrit skin, distinct user vs channel visual badges, responsive split pane
 */

window.Diskrit = window.Diskrit || {};
Diskrit.pages = Diskrit.pages || {};

Diskrit.pages.chat = {
  currentChatId: "chat-1",
  activeTab: "all", // all | direct | channels
  infoDrawerOpen: true,

  render(params = {}) {
    // Check if channel join invite token route (/chatify/channels/join/{token})
    if (params.token) {
      return this.renderInviteLanding(params.token);
    }

    if (params.id) {
      this.currentChatId = params.id.startsWith('chat-') || params.id.startsWith('channel-') 
        ? params.id 
        : `chat-${params.id}`;
    }

    if (params.channelId) {
      this.currentChatId = `channel-${params.channelId}`;
    }

    const conversations = Diskrit.mockData.chats.conversations;
    let filtered = conversations;
    if (this.activeTab === "direct") filtered = conversations.filter(c => c.type === "direct");
    if (this.activeTab === "channels") filtered = conversations.filter(c => c.type === "channel");

    // Locate active conversation
    const active = conversations.find(c => c.id === this.currentChatId || c.channelId === params.channelId) || conversations[0];
    this.currentChatId = active.id;

    return `
      <div class="messenger-container ${this.currentChatId ? 'mobile-chat-open' : ''}" id="messenger-app-container">
        <!-- Left Sidebar: Conversations & Channels List -->
        <div class="messenger-sidebar" id="messenger-conversations-sidebar">
          <div class="messenger-sidebar-header">
            <div class="messenger-header-row">
              <span class="messenger-title">Messages</span>
              <button class="btn-icon" id="create-channel-trigger-btn" title="Create New Channel" aria-label="Create Channel">
                ${Diskrit.icons("plus", "", 20)}
              </button>
            </div>

            <!-- Search input -->
            <div class="search-input-wrapper">
              <span class="search-input-icon">${Diskrit.icons("search", "", 16)}</span>
              <input type="text" id="messenger-filter-input" class="topbar-search-input" placeholder="Search chats..." style="padding-left: 2.4rem;">
            </div>

            <!-- Tab Switcher (Direct vs Channels) -->
            <div class="messenger-tabs">
              <div class="messenger-tab ${this.activeTab === 'all' ? 'active' : ''}" data-tab="all">All</div>
              <div class="messenger-tab ${this.activeTab === 'direct' ? 'active' : ''}" data-tab="direct">Direct</div>
              <div class="messenger-tab ${this.activeTab === 'channels' ? 'active' : ''}" data-tab="channels">Channels</div>
            </div>
          </div>

          <!-- Conversations scroll list -->
          <div class="conversation-list" id="conversations-scroll-list">
            ${filtered.map(c => `
              <div class="conversation-item ${c.id === this.currentChatId ? 'active' : ''}" data-id="${c.id}">
                ${c.type === 'channel' ? `
                  <!-- Channel Badge (Flaw 7.2) -->
                  <div class="channel-avatar-badge">${c.avatar}</div>
                ` : `
                  <!-- User Avatar (Flaw 7.2) -->
                  <div style="position: relative;">
                    <img src="${c.avatar}" class="avatar avatar-md" alt="${c.title}">
                    <span class="status-dot status-${c.status || 'offline'}" style="position: absolute; bottom: 0; right: 0;"></span>
                  </div>
                `}
                <div class="conversation-meta">
                  <div class="conversation-name-row">
                    <span class="conversation-name">${c.title}</span>
                    <span class="conversation-time">${c.lastTime}</span>
                  </div>
                  <span class="conversation-snippet">${c.lastMessage}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Center Workspace: Active Chat Stream -->
        <div class="messenger-active-chat" id="messenger-active-chat-pane">
          <!-- Chat Header -->
          <div class="chat-header">
            <div class="chat-user-header">
              <!-- Mobile back button to show conversation list -->
              <button class="btn-icon mobile-back-btn" id="mobile-back-to-contacts-btn" aria-label="Back to messages list">
                ${Diskrit.icons("chevronLeft", "", 20)}
              </button>

              ${active.type === 'channel' ? `
                <div class="channel-avatar-badge" style="width: 38px; height: 38px; font-size: 15px;">${active.avatar}</div>
              ` : `
                <div style="position: relative;">
                  <img src="${active.avatar}" class="avatar avatar-sm" alt="${active.title}">
                  <span class="status-dot status-${active.status || 'offline'}" style="position: absolute; bottom: 0; right: 0;"></span>
                </div>
              `}
              <div class="chat-user-header-text">
                <div class="chat-user-header-name">${active.title}</div>
                <div class="chat-user-header-status">
                  ${active.type === 'channel' 
                    ? `${active.memberCount} members ${active.isAnnouncement ? '• Broadcast mode' : ''}` 
                    : (active.status === 'online' ? 'Active now' : 'Offline')
                  }
                </div>
              </div>
            </div>

            <!-- Header actions -->
            <div style="display: flex; align-items: center; gap: 8px;">
              ${active.type === 'channel' ? `
                <button class="btn btn-secondary btn-sm copy-channel-invite-btn" data-token="${active.inviteToken}" title="Copy Invite Link">
                  ${Diskrit.icons("share", "", 14)}
                  <span>Invite</span>
                </button>
              ` : ''}
              <button class="btn-icon" id="toggle-chat-info-btn" title="Toggle Details Drawer" aria-label="Details">
                ${Diskrit.icons("more", "", 18)}
              </button>
            </div>
          </div>

          <!-- Messages Scroll View -->
          <div class="chat-messages-scroll" id="chat-messages-stream">
            ${(active.messages || []).map(m => `
              <div class="message-bubble-wrapper ${m.outgoing ? 'outgoing' : 'incoming'}">
                <div class="message-bubble">
                  ${m.text}
                </div>
                <div class="message-meta">
                  <span>${m.time}</span>
                  ${m.outgoing ? `<span>${Diskrit.icons("check", "", 12)}</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Chat Composer Input -->
          <div class="chat-composer">
            <button class="btn-icon" id="chat-attach-btn" title="Attach Media" aria-label="Attach Media">
              ${Diskrit.icons("image", "", 20)}
            </button>
            <button class="btn-icon" id="chat-emoji-trigger-btn" title="Insert Emoji" aria-label="Insert Emoji">
              ${Diskrit.icons("smile", "", 20)}
            </button>
            <div id="chat-emoji-popover" class="chat-emoji-popover" style="display: none;"></div>
            <input 
              type="text" 
              class="chat-input" 
              id="active-chat-input" 
              placeholder="${active.isAnnouncement ? 'Only channel administrators can post here...' : 'Write an encrypted message...'}" 
              ${active.isAnnouncement ? 'disabled' : ''}
            >
            <button class="btn btn-primary btn-sm" id="send-chat-msg-btn" ${active.isAnnouncement ? 'disabled' : ''} style="width: 42px; height: 42px; border-radius: 50%; padding: 0; flex-shrink: 0;" aria-label="Send Message">
              ${Diskrit.icons("send", "", 18)}
            </button>
          </div>
        </div>

        <!-- Right Side Info Drawer -->
        <div class="messenger-detail-drawer ${this.infoDrawerOpen ? '' : 'hidden'}" id="messenger-detail-drawer">
          ${active.type === 'channel' ? `
            <div class="channel-avatar-badge" style="width: 72px; height: 72px; font-size: 26px;">${active.avatar}</div>
          ` : `
            <img src="${active.avatar}" class="avatar avatar-xl" alt="${active.title}">
          `}
          <div style="text-align: center;">
            <div style="font-weight: 700; font-size: var(--font-md); color: var(--text-primary);">${active.title}</div>
            <div style="font-size: var(--font-xs); color: var(--text-muted); margin-top: 2px;">
              ${active.type === 'channel' ? `Public Discussion Hub &bull; ${active.memberCount} users` : '@handle'}
            </div>
          </div>

          <div style="width: 100%; border-top: 1px solid var(--border-subtle); padding-top: 16px; display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: var(--font-xs); color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Shared Media</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
              <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=150&q=80" style="border-radius: var(--radius-sm); height: 60px; width: 100%; object-fit: cover;">
              <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=150&q=80" style="border-radius: var(--radius-sm); height: 60px; width: 100%; object-fit: cover;">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80" style="border-radius: var(--radius-sm); height: 60px; width: 100%; object-fit: cover;">
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderInviteLanding(token) {
    return `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 70vh;">
        <div class="card" style="max-width: 440px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 40px;">
          <div class="channel-avatar-badge" style="width: 72px; height: 72px; font-size: 28px;">CL</div>
          <div>
            <h1 style="font-size: var(--font-xl); font-weight: 700;">Creator Lounge (VIP)</h1>
            <p style="color: var(--text-muted); font-size: var(--font-sm); margin-top: 6px;">
              Elena Rostova invited you to join this private Diskrit channel.
            </p>
          </div>
          <div class="badge badge-primary">88 Members Active</div>
          <div style="display: flex; gap: 12px; width: 100%; margin-top: 8px;">
            <a href="#chatify/channel/creator-lounge" class="btn btn-primary" style="flex: 1;">Accept & Join Channel</a>
            <a href="#home" class="btn btn-secondary" style="flex: 1;">Cancel</a>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents() {
    const stream = document.getElementById("chat-messages-stream");
    if (stream) {
      stream.scrollTop = stream.scrollHeight;
    }

    // 1. Create channel modal trigger
    const createBtn = document.getElementById("create-channel-trigger-btn");
    if (createBtn) {
      createBtn.addEventListener("click", () => {
        Diskrit.components.modals.showCreateChannelModal((channelData) => {
          const newChan = {
            id: `channel-${Date.now()}`,
            type: "channel",
            channelId: channelData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: `#${channelData.name}`,
            avatar: channelData.name.slice(0, 2).toUpperCase(),
            memberCount: 1,
            isAnnouncement: channelData.isAnnouncement,
            inviteToken: `join-${Date.now()}`,
            lastMessage: "Channel created.",
            lastTime: "Just now",
            messages: [
              { id: `m-${Date.now()}`, sender: "System", text: `Channel #${channelData.name} initialized.`, time: "Just now", outgoing: false }
            ]
          };
          Diskrit.mockData.chats.conversations.unshift(newChan);
          this.currentChatId = newChan.id;
          Diskrit.components.modals.toast(`Channel #${channelData.name} created!`, "success");
          
          const main = document.getElementById("app-main-content");
          if (main) {
            main.innerHTML = this.render();
            this.attachEvents();
          }
        });
      });
    }

    // 2. Select conversation item
    document.querySelectorAll(".conversation-item").forEach(item => {
      item.addEventListener("click", () => {
        this.currentChatId = item.dataset.id;
        const main = document.getElementById("app-main-content");
        if (main) {
          main.innerHTML = this.render();
          this.attachEvents();
        }
      });
    });

    // 3. Tab filter switcher (All vs Direct vs Channels)
    document.querySelectorAll(".messenger-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        this.activeTab = tab.dataset.tab;
        const main = document.getElementById("app-main-content");
        if (main) {
          main.innerHTML = this.render();
          this.attachEvents();
        }
      });
    });

    // 4. Send Message
    const sendBtn = document.getElementById("send-chat-msg-btn");
    const chatInput = document.getElementById("active-chat-input");

    const sendMessage = () => {
      const text = chatInput ? chatInput.value.trim() : "";
      if (!text) return;

      const conv = Diskrit.mockData.chats.conversations.find(c => c.id === this.currentChatId);
      if (conv) {
        const newMsg = {
          id: `m-${Date.now()}`,
          sender: "Alex Mercer",
          text: text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          outgoing: true
        };
        conv.messages.push(newMsg);
        conv.lastMessage = text;
        conv.lastTime = "Just now";

        // Append to DOM
        if (stream) {
          const div = document.createElement("div");
          div.className = "message-bubble-wrapper outgoing";
          div.innerHTML = `
            <div class="message-bubble">${text}</div>
            <div class="message-meta">
              <span>Just now</span>
              <span>${Diskrit.icons("check", "", 12)}</span>
            </div>
          `;
          stream.appendChild(div);
          stream.scrollTop = stream.scrollHeight;
        }
        chatInput.value = "";
      }
    };

    if (sendBtn) sendBtn.addEventListener("click", sendMessage);
    if (chatInput) {
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
      });
    }

    // Emoji Popover
    const emojiBtn = document.getElementById("chat-emoji-trigger-btn");
    const emojiPopover = document.getElementById("chat-emoji-popover");
    
    const emojiCategories = {
      smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😜', '🤪', '😎', '🤓', '🥳', '😏', '🤔'],
      gestures: ['👍', '👎', '👏', '🙌', '👐', '🤝', '✌️', '🤞', '🤟', '🤘', '🤙', '👋', '🙏', '💪', '👊', '✊', '🤛', '🤜'],
      hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '✨', '⭐'],
      tech: ['🔥', '⚡', '💻', '🖥️', '📱', '🎧', '📸', '🎨', '🚀', '🔮', '🤖', '👾', '🕹️', '🛰️', '💡', '📡', '💎', '🎉', '🏆', '☕']
    };

    let activeCategory = 'smileys';

    function renderEmojiGrid() {
      if (!emojiPopover) return;
      const emojis = emojiCategories[activeCategory] || emojiCategories.smileys;
      emojiPopover.innerHTML = `
        <div class="emoji-popover-header">
          <div class="emoji-popover-tabs">
            <button type="button" class="emoji-tab-btn ${activeCategory === 'smileys' ? 'active' : ''}" data-cat="smileys" title="Smileys">😀</button>
            <button type="button" class="emoji-tab-btn ${activeCategory === 'gestures' ? 'active' : ''}" data-cat="gestures" title="Gestures">👍</button>
            <button type="button" class="emoji-tab-btn ${activeCategory === 'hearts' ? 'active' : ''}" data-cat="hearts" title="Hearts">❤️</button>
            <button type="button" class="emoji-tab-btn ${activeCategory === 'tech' ? 'active' : ''}" data-cat="tech" title="Vibes & Tech">⚡</button>
          </div>
          <button type="button" class="btn-icon" id="close-emoji-popover-btn" style="width: 24px; height: 24px; padding: 0;" aria-label="Close emoji picker">
            ${Diskrit.icons("x", "", 14)}
          </button>
        </div>
        <div class="emoji-grid-container">
          ${emojis.map(e => `<button type="button" class="emoji-item-btn" data-emoji="${e}">${e}</button>`).join('')}
        </div>
      `;

      emojiPopover.querySelectorAll(".emoji-tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          activeCategory = btn.dataset.cat;
          renderEmojiGrid();
        });
      });

      const closeEmoji = emojiPopover.querySelector("#close-emoji-popover-btn");
      if (closeEmoji) {
        closeEmoji.addEventListener("click", (e) => {
          e.stopPropagation();
          emojiPopover.style.display = "none";
        });
      }

      emojiPopover.querySelectorAll(".emoji-item-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const em = btn.dataset.emoji;
          if (chatInput) {
            const start = chatInput.selectionStart || chatInput.value.length;
            const end = chatInput.selectionEnd || chatInput.value.length;
            chatInput.value = chatInput.value.substring(0, start) + em + chatInput.value.substring(end);
            chatInput.focus();
            chatInput.setSelectionRange(start + em.length, start + em.length);
          }
        });
      });
    }

    if (emojiBtn && emojiPopover) {
      emojiBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = emojiPopover.style.display === "flex";
        if (isOpen) {
          emojiPopover.style.display = "none";
        } else {
          renderEmojiGrid();
          emojiPopover.style.display = "flex";
        }
      });

      document.addEventListener("click", (e) => {
        if (!e.target.closest("#chat-emoji-popover") && !e.target.closest("#chat-emoji-trigger-btn")) {
          if (emojiPopover) emojiPopover.style.display = "none";
        }
      });
    }

    // 5. Toggle info drawer
    const toggleInfoBtn = document.getElementById("toggle-chat-info-btn");
    const detailDrawer = document.getElementById("messenger-detail-drawer");
    if (toggleInfoBtn && detailDrawer) {
      toggleInfoBtn.addEventListener("click", () => {
        this.infoDrawerOpen = !this.infoDrawerOpen;
        detailDrawer.classList.toggle("hidden", !this.infoDrawerOpen);
      });
    }

    // 6. Mobile back button
    const mobileBackBtn = document.getElementById("mobile-back-to-contacts-btn");
    const messengerContainer = document.getElementById("messenger-app-container");
    if (mobileBackBtn && messengerContainer) {
      mobileBackBtn.addEventListener("click", () => {
        messengerContainer.classList.remove("mobile-chat-open");
      });
    }

    // 7. Copy channel invite link
    document.querySelectorAll(".copy-channel-invite-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const token = btn.dataset.token;
        const url = `${window.location.origin}${window.location.pathname}#chatify/channels/join/${token}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            Diskrit.components.modals.toast("Channel invite link copied to clipboard!", "success");
          });
        }
      });
    });

    // 8. Filter conversations input
    const filterInput = document.getElementById("messenger-filter-input");
    if (filterInput) {
      filterInput.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase().trim();
        document.querySelectorAll(".conversation-item").forEach(item => {
          const name = item.querySelector(".conversation-name")?.textContent.toLowerCase() || "";
          item.style.display = name.includes(q) ? "flex" : "none";
        });
      });
    }
  }
};
