/**
 * DISKRIT CENTRAL MOCK DATA
 * Comprehensive centralized dataset for users, feeds, videos, shorts, chat, notifications, admin & demographic tags
 */

window.Diskrit = window.Diskrit || {};

Diskrit.mockData = {
  currentUser: {
    id: "user-current",
    name: "Alex Mercer",
    handle: "alexmercer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=280&q=80",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    role: "Creator",
    profileType: "public",
    bio: "Digital artist & sound designer. Exploring generative cyber aesthetics & decentralized media. 🎧",
    gender: "Other",
    birthdate: "1998-04-12",
    orientation: "Demisexual",
    identityRole: "Switch",
    city: "San Francisco",
    state: "California",
    country: "United States",
    joinedDate: "January 2024",
    followersCount: 1420,
    followingCount: 385,
    friendsCount: 124,
    postsCount: 42,
    twoFactorEnabled: true,
    allowAnonymousComments: true,
    safeModeEnabled: true
  },

  users: [
    {
      id: "user-1",
      name: "Elena Rostova",
      handle: "elena",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=280&q=80",
      banner: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
      role: "User",
      profileType: "private",
      bio: "Film photographer & espresso enthusiast. Only mutual friends can see my private timeline. 📷☕",
      orientation: "Queer",
      identityRole: "Explorer",
      city: "Berlin",
      country: "Germany",
      followersCount: 680,
      followingCount: 210,
      friendsCount: 88,
      status: "online",
      relationship: "friend" // friend, pending, requested, following, none
    },
    {
      id: "user-2",
      name: "Marcus Chen",
      handle: "marcus_chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=280&q=80",
      banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      role: "Creator",
      profileType: "public",
      bio: "Lead Systems Architect & open web purist. Building blazing fast interfaces with zero framework bloat. 🚀",
      orientation: "Heterosexual",
      identityRole: "Dominant",
      city: "Vancouver",
      country: "Canada",
      followersCount: 8940,
      followingCount: 180,
      friendsCount: 310,
      status: "online",
      relationship: "following"
    },
    {
      id: "user-3",
      name: "Sarah Jenkins",
      handle: "sarahj",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=280&q=80",
      banner: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      role: "Creator",
      profileType: "public",
      bio: "Visual storyteller, adventure videographer & certified drone pilot. Chasing golden hour sunsets worldwide. 🌅",
      orientation: "Bisexual",
      identityRole: "Primal",
      city: "Sydney",
      country: "Australia",
      followersCount: 15400,
      followingCount: 420,
      friendsCount: 195,
      status: "offline",
      relationship: "following"
    },
    {
      id: "user-4",
      name: "David Kim",
      handle: "davidk",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=280&q=80",
      banner: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
      role: "User",
      profileType: "private",
      bio: "Audiophile, modular synthesizer tinkerer, night runner. 🌙",
      orientation: "Straight",
      identityRole: "Submissive",
      city: "Seoul",
      country: "South Korea",
      followersCount: 320,
      followingCount: 190,
      friendsCount: 75,
      status: "online",
      relationship: "requested"
    },
    {
      id: "user-5",
      name: "Jordan Bell",
      handle: "jordanb",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=280&q=80",
      banner: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80",
      role: "Creator",
      profileType: "private",
      bio: "Underground visual archivist & neo-noir street photographer. All gallery archives are strictly for approved contacts.",
      orientation: "Queer",
      identityRole: "Explorer",
      city: "Shinjuku",
      country: "Japan",
      followersCount: 512,
      followingCount: 140,
      friendsCount: 62,
      status: "offline",
      relationship: "none"
    },
    {
      id: "user-6",
      name: "Maya Lin",
      handle: "mayalin",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=280&q=80",
      banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      role: "Creator",
      profileType: "public",
      bio: "Interactive shader engineer & GPU compute enthusiast. Crafting procedural mathematics into living visual lightscapes. ⚡",
      orientation: "Pansexual",
      identityRole: "Creative",
      city: "Taipei",
      country: "Taiwan",
      followersCount: 11800,
      followingCount: 310,
      friendsCount: 144,
      status: "online",
      relationship: "none"
    }
  ],

  stories: [
    {
      id: "story-1",
      userName: "Your Story",
      handle: "alexmercer",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=280&q=80",
      mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=85",
      isOwn: true,
      time: "Just now",
      caption: "Testing our generative visual canvas in the studio ✨"
    },
    {
      id: "story-2",
      userName: "Elena Rostova",
      handle: "elena",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=280&q=80",
      mediaUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=85",
      time: "2h ago",
      caption: "Early morning fog rising over the Spree ☕ Berlin moments"
    },
    {
      id: "story-3",
      userName: "Sarah Jenkins",
      handle: "sarahj",
      userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=280&q=80",
      mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85",
      time: "3h ago",
      caption: "Golden hour along Highway 1 cliffs 🌅 Big Sur"
    },
    {
      id: "story-4",
      userName: "Marcus Chen",
      handle: "marcus_chen",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=280&q=80",
      mediaUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=85",
      time: "5h ago",
      caption: "Late night subterranean audio experiments & modular synth patch breakdown 🎛️"
    },
    {
      id: "story-5",
      userName: "David Kim",
      handle: "davidk",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=280&q=80",
      mediaUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85",
      time: "6h ago",
      caption: "Brutalist concrete gallery acoustics test in Gangnam 🏛️"
    },
    {
      id: "story-6",
      userName: "Maya Lin",
      handle: "mayalin",
      userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=280&q=80",
      mediaUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=85",
      time: "7h ago",
      caption: "Simulating 100k WebGL particles at 60fps in vanilla JavaScript ⚡"
    },
    {
      id: "story-7",
      userName: "Priya Patel",
      handle: "priya",
      userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=280&q=80",
      mediaUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=85",
      time: "9h ago",
      caption: "Ambient drone rehearsals for Tokyo media showcase 🎧"
    },
    {
      id: "story-8",
      userName: "Jordan Bell",
      handle: "jordanb",
      userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=280&q=80",
      mediaUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=85",
      time: "11h ago",
      caption: "Neo-noir street reflection in Shinjuku rain 🌧️"
    }
  ],

  posts: [
    {
      id: "post-1",
      slug: "generative-audio-visual-installation-cyber-aesthetic",
      authorId: "user-current",
      authorName: "Alex Mercer",
      authorHandle: "alexmercer",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=280&q=80",
      location: "San Francisco, CA",
      createdAt: "25m ago",
      timestamp: "2026-10-28T20:55:00Z",
      content: "Finalizing our multi-channel generative audio installation for the upcoming Tokyo Media Arts Festival. Real-time procedural textures mapped directly to synthesizer harmonics. What do you think of this visual flow? #generative #digitalart #future #tokyo",
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
      likesCount: 142,
      commentsCount: 18,
      sharesCount: 34,
      isLiked: true,
      isBookmarked: false,
      isAnonymous: false,
      isSensitive: false,
      viewsCount: 1840,
      comments: [
        {
          id: "c-1",
          authorName: "Marcus Chen",
          authorHandle: "marcus_chen",
          authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
          content: "The contrast between the chromatic aberration and the deep navy blacks is pristine.",
          time: "15m ago"
        },
        {
          id: "c-2",
          authorName: "Elena Rostova",
          authorHandle: "elena",
          authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
          content: "Can't wait to see this in person! Phenomenal work Alex.",
          time: "8m ago"
        }
      ]
    },
    {
      id: "post-alex-2",
      slug: "eurorack-modular-generative-sound-design",
      authorId: "user-current",
      authorName: "Alex Mercer",
      authorHandle: "alexmercer",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=280&q=80",
      location: "San Francisco, CA",
      createdAt: "1h ago",
      timestamp: "2026-10-28T19:50:00Z",
      content: "Deep patch testing with our Eurorack modular rig. Feeding harmonic sine outputs directly into algorithmic visual displacement. Full breakdown coming to Creator Studio soon! 🎛️ #generative #sounddesign #modular #ambient",
      mediaType: "video",
      mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      posterUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
      likesCount: 289,
      commentsCount: 34,
      sharesCount: 52,
      isLiked: false,
      isBookmarked: true,
      isAnonymous: false,
      isSensitive: false,
      viewsCount: 3200,
      comments: [
        {
          id: "c-a2-1",
          authorName: "David Kim",
          authorHandle: "davidk",
          authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
          content: "Those low-frequency oscillators are so smooth. What filter module are you using?",
          time: "40m ago"
        }
      ]
    },
    {
      id: "post-alex-3",
      slug: "procedural-vector-textures-mathematical-gradients",
      authorId: "user-current",
      authorName: "Alex Mercer",
      authorHandle: "alexmercer",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=280&q=80",
      location: "San Francisco, CA",
      createdAt: "5h ago",
      timestamp: "2026-10-28T16:00:00Z",
      content: "Procedural vector textures rendered in real-time at 4K resolution. Pure mathematical gradients with zero raster artifacts. 📐✨ #generative #digitalart #creativecoding",
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
      likesCount: 412,
      commentsCount: 27,
      sharesCount: 68,
      isLiked: true,
      isBookmarked: false,
      isAnonymous: false,
      isSensitive: false,
      viewsCount: 4620,
      comments: []
    },
    {
      id: "post-maya-1",
      slug: "compute-shader-webgl-particle-system",
      authorId: "user-6",
      authorName: "Maya Lin",
      authorHandle: "mayalin",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=280&q=80",
      location: "Taipei, Taiwan",
      createdAt: "3h ago",
      timestamp: "2026-10-28T18:00:00Z",
      content: "Live compute shader demo: 100,000 particles interacting with gravitational attractors in WebGL at 60fps. Zero dropped frames on mobile! 🚀⚡ #generative #webgl #shaders #creativecoding",
      mediaType: "video",
      mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      posterUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
      likesCount: 980,
      commentsCount: 65,
      sharesCount: 112,
      isLiked: true,
      isBookmarked: true,
      isAnonymous: false,
      isSensitive: false,
      viewsCount: 8900,
      comments: []
    },
    {
      id: "post-alex-4",
      slug: "ambient-drone-frequency-procedural-particles",
      authorId: "user-current",
      authorName: "Alex Mercer",
      authorHandle: "alexmercer",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=280&q=80",
      location: "San Francisco, CA",
      createdAt: "1d ago",
      timestamp: "2026-10-27T21:00:00Z",
      content: "Late-night studio capture: ambient drone frequencies modulating procedural wave particles in real time. 🌊 #generative #soundscape #audioreactive",
      mediaType: "video",
      mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      posterUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
      likesCount: 645,
      commentsCount: 42,
      sharesCount: 91,
      isLiked: false,
      isBookmarked: false,
      isAnonymous: false,
      isSensitive: false,
      viewsCount: 5120,
      comments: []
    },
    {
      id: "post-alex-5",
      slug: "diskrit-sovereign-creator-manifesto",
      authorId: "user-current",
      authorName: "Alex Mercer",
      authorHandle: "alexmercer",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=280&q=80",
      location: "San Francisco, CA",
      createdAt: "3d ago",
      timestamp: "2026-10-25T14:30:00Z",
      content: "The future of social media isn't algorithmic engagement farming or surveillance feeds. It's sovereign digital spaces where creators own their audience, privacy is respected, and expression is authentic. Diskrit is building exactly this. #privacy #freespeech #future",
      mediaType: "none",
      likesCount: 820,
      commentsCount: 78,
      sharesCount: 145,
      isLiked: true,
      isBookmarked: true,
      isAnonymous: false,
      isSensitive: false,
      viewsCount: 9400,
      comments: []
    },
    {
      id: "post-2",
      slug: "coastal-drone-cinematography-pacific-horizon",
      authorId: "user-3",
      authorName: "Sarah Jenkins",
      authorHandle: "sarahj",
      authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=280&q=80",
      location: "Big Sur, California",
      createdAt: "2h ago",
      timestamp: "2026-10-28T19:20:00Z",
      content: "Golden hour over the cliffs of Big Sur. Captured this 4K loop right before the marine fog rolled in. Nature always delivers the best color palette. #cinematic #sunset #california #dronevideo",
      mediaType: "video",
      mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      posterUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      likesCount: 389,
      commentsCount: 42,
      sharesCount: 67,
      isLiked: false,
      isBookmarked: true,
      isAnonymous: false,
      isSensitive: false,
      viewsCount: 4120,
      comments: [
        {
          id: "c-3",
          authorName: "David Kim",
          authorHandle: "davidk",
          authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
          content: "That transition through the fog is so peaceful.",
          time: "1h ago"
        }
      ]
    },
    {
      id: "post-3",
      slug: "anonymous-thoughts-on-modern-digital-freedom",
      authorId: "anon-42",
      authorName: "Anonymous User",
      authorHandle: "anonymous",
      authorAvatar: "ghost",
      location: "Encrypted Network",
      createdAt: "4h ago",
      timestamp: "2026-10-28T17:15:00Z",
      content: "Diskrit's anonymous posting mode is genuinely refreshing. In an era where every thought is tied to algorithmic personal branding and corporate dossiers, having a space to ask questions or share vulnerably without identity baggage is revolutionary. Keep this culture alive. #privacy #freespeech #anonymous",
      mediaType: "none",
      likesCount: 512,
      commentsCount: 63,
      sharesCount: 88,
      isLiked: false,
      isBookmarked: false,
      isAnonymous: true,
      isSensitive: false,
      viewsCount: 6200,
      comments: []
    },
    {
      id: "post-4",
      slug: "neon-noir-cyber-club-underground-showcase",
      authorId: "user-2",
      authorName: "Marcus Chen",
      authorHandle: "marcus_chen",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=280&q=80",
      location: "Neo-Berlin Underground",
      createdAt: "6h ago",
      timestamp: "2026-10-28T15:30:00Z",
      content: "Late night subterranean audio experiments with deep bass frequency modulation. Warning: high decibel output and strobe visuals. Flagged 18+ for adult nightlife content. #adultcontent #cyberclub #techno #berlin",
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80",
      likesCount: 220,
      commentsCount: 31,
      sharesCount: 19,
      isLiked: false,
      isBookmarked: false,
      isAnonymous: false,
      isSensitive: true, // Controlled by Safe Mode
      viewsCount: 2950,
      comments: []
    },
    {
      id: "post-5",
      slug: "kyoto-morning-light-35mm-analog-series",
      authorId: "user-1",
      authorName: "Elena Rostova",
      authorHandle: "elena",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=280&q=80",
      location: "Gion, Kyoto",
      createdAt: "5h ago",
      timestamp: "2026-10-28T16:20:00Z",
      content: "Medium format film captures from the quiet morning streets of Gion. No digital color grading, just natural dawn light through wooden lattices. 📸⛩️ #filmphotography #analog #kyoto #streetphotography",
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
      likesCount: 642,
      commentsCount: 52,
      sharesCount: 41,
      isLiked: false,
      isBookmarked: false,
      isAnonymous: false,
      isSensitive: false,
      viewsCount: 5120,
      comments: []
    },
    {
      id: "post-6",
      slug: "brutalist-concrete-spatial-acoustics-seoul",
      authorId: "user-4",
      authorName: "David Kim",
      authorHandle: "davidk",
      authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=280&q=80",
      location: "Seoul, South Korea",
      createdAt: "7h ago",
      timestamp: "2026-10-28T14:10:00Z",
      content: "Acoustic exploration inside the newly commissioned underground concrete amphitheater. Sound reflections measured at 4.2s reverb decay. Architecture meets raw spatial resonance. #architecture #brutalism #sounddesign #seoul",
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
      likesCount: 418,
      commentsCount: 39,
      sharesCount: 28,
      isLiked: false,
      isBookmarked: false,
      isAnonymous: false,
      isSensitive: false,
      viewsCount: 3820,
      comments: []
    },
    {
      id: "post-7",
      slug: "procedural-particle-shaders-vanilla-webgl",
      authorId: "user-5",
      authorName: "Maya Lin",
      authorHandle: "mayalin",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=280&q=80",
      location: "Zurich, Switzerland",
      createdAt: "9h ago",
      timestamp: "2026-10-28T12:00:00Z",
      content: "Prototyping procedural particle storms in WebGL with custom compute shaders. 60 FPS running smoothly directly in vanilla JS with zero framework bloat. ⚡ #webgl #creativecoding #shaders #javascript",
      mediaType: "video",
      mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      posterUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
      likesCount: 890,
      commentsCount: 94,
      sharesCount: 112,
      isLiked: true,
      isBookmarked: true,
      isAnonymous: false,
      isSensitive: false,
      viewsCount: 7850,
      comments: []
    },
    {
      id: "post-8",
      slug: "mathematical-typographic-grids-modern-web",
      authorId: "user-2",
      authorName: "Marcus Chen",
      authorHandle: "marcus_chen",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=280&q=80",
      location: "Vancouver, Canada",
      createdAt: "12h ago",
      timestamp: "2026-10-28T09:15:00Z",
      content: "Designing interfaces with strict mathematical typographic grids and pure CSS variables. When layout adapts fluidly to 4K displays instead of artificially boxing users in, the entire product elevates. #uidesign #css #webdev #designsystems",
      mediaType: "none",
      likesCount: 734,
      commentsCount: 81,
      sharesCount: 95,
      isLiked: false,
      isBookmarked: false,
      isAnonymous: false,
      isSensitive: false,
      viewsCount: 6410,
      comments: []
    }
  ],

  shorts: [
    {
      id: "short-1",
      creatorName: "Alex Mercer",
      creatorHandle: "alexmercer",
      creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=280&q=80",
      caption: "Real-time procedural fluid simulation reacting to bass frequencies 🌊 #creativecoding #3dart #procedural",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      posterUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      likesCount: "14.2K",
      rawLikes: 14200,
      commentsCount: "328",
      viewsCount: "89.4K",
      isLiked: true,
      comments: [
        { author: "Elena Rostova", text: "The fluid physics look so organic! What engine did you use?", time: "2h ago" },
        { author: "Marcus Chen", text: "Pure shader wizardry 🔥", time: "4h ago" }
      ]
    },
    {
      id: "short-2",
      creatorName: "Sarah Jenkins",
      creatorHandle: "sarahj",
      creatorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=280&q=80",
      caption: "Chasing storms across the southern rim canyon. That lightning arc was unreal! ⚡ #nature #drone #cinematography",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      posterUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      likesCount: "28.6K",
      rawLikes: 28600,
      commentsCount: "512",
      viewsCount: "140K",
      isLiked: false,
      comments: [
        { author: "David Kim", text: "Incredible timing! Were you manual flying?", time: "1h ago" }
      ]
    },
    {
      id: "short-3",
      creatorName: "Marcus Chen",
      creatorHandle: "marcus_chen",
      creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=280&q=80",
      caption: "Why clean CSS variables beats compiling 200MB of JavaScript bundles every single time. ⚡ #webdev #frontend #performance",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
      posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
      likesCount: "9.8K",
      rawLikes: 9800,
      commentsCount: "419",
      viewsCount: "52.1K",
      isLiked: false,
      comments: [
        { author: "Alex Mercer", text: "Amen. Native Web standards are undefeated.", time: "30m ago" }
      ]
    },
    {
      id: "short-4",
      creatorName: "Elena Rostova",
      creatorHandle: "elena",
      creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=280&q=80",
      caption: "Studio session breakdown: layering analog synth arpeggios with 808 sub-bass 🎹🎚️ #sounddesign #producer #electronicmusic",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      posterUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80",
      likesCount: "34.1K",
      rawLikes: 34100,
      commentsCount: "672",
      viewsCount: "182K",
      isLiked: true,
      comments: [
        { author: "Marcus Chen", text: "That filter cutoff sweep at 0:08 is filthy 🔥", time: "1h ago" },
        { author: "David Kim", text: "What compressor plugin is on the master chain?", time: "3h ago" }
      ]
    },
    {
      id: "short-5",
      creatorName: "David Kim",
      creatorHandle: "davidk",
      creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=280&q=80",
      caption: "Late night sprint through neon alleys in Shibuya. Rain reflections hit different 🌧️🏙️ #tokyo #nightphotography #streetstyle",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      posterUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
      likesCount: "19.5K",
      rawLikes: 19500,
      commentsCount: "440",
      viewsCount: "98.2K",
      isLiked: false,
      comments: [
        { author: "Sarah Jenkins", text: "The reflections on the asphalt look like an anime still!", time: "45m ago" }
      ]
    }
  ],

  savedBookmarks: [
    {
      id: "save-1",
      postId: "post-2",
      title: "Coastal Drone Cinematography Pacific Horizon",
      authorName: "Sarah Jenkins",
      authorHandle: "sarahj",
      type: "video",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      savedDate: "2026-10-24",
      daysLeft: 17, // 21-day auto-expiry (Flaw 6.2)
      isPermanent: false
    },
    {
      id: "save-2",
      postId: "post-1",
      title: "Generative Audio Visual Installation",
      authorName: "Alex Mercer",
      authorHandle: "alexmercer",
      type: "post",
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
      savedDate: "2026-10-10",
      daysLeft: 3, // Critical countdown alert!
      isPermanent: false
    }
  ],

  friendRequests: [
    {
      id: "fr-1",
      name: "David Kim",
      handle: "davidk",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=280&q=80",
      mutualCount: 12,
      location: "Seoul, South Korea"
    },
    {
      id: "fr-2",
      name: "Maya Lin",
      handle: "mayalin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=280&q=80",
      mutualCount: 4,
      location: "Singapore"
    }
  ],

  trendingHashtags: [
    { tag: "#generative", count: "24.8K posts", views: "340K views" },
    { tag: "#tokyofestival", count: "18.2K posts", views: "210K views" },
    { tag: "#webstandards", count: "14.5K posts", views: "190K views" },
    { tag: "#cyberpunk", count: "12.1K posts", views: "155K views" },
    { tag: "#cinematography", count: "9.4K posts", views: "88K views" }
  ],

  notifications: [
    {
      id: "notif-1",
      type: "like",
      actorName: "Sarah Jenkins",
      actorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
      text: "liked your post 'Generative Audio Visual Installation'",
      time: "10m ago",
      targetUrl: "#post/generative-audio-visual-installation-cyber-aesthetic",
      isUnread: true
    },
    {
      id: "notif-2",
      type: "comment",
      actorName: "Marcus Chen",
      actorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      text: "commented on your video: 'The contrast is pristine.'",
      time: "32m ago",
      targetUrl: "#post/generative-audio-visual-installation-cyber-aesthetic",
      isUnread: true
    },
    {
      id: "notif-3",
      type: "channel_invite",
      actorName: "Elena Rostova",
      actorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      text: "invited you to join the private channel #creator-lounge",
      time: "2h ago",
      targetUrl: "#chatify/channel/creator-lounge",
      isUnread: false
    }
  ],

  chats: {
    conversations: [
      {
        id: "chat-1",
        type: "direct", // direct vs channel
        targetId: "user-1",
        title: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=280&q=80",
        lastMessage: "Did you finish the audio rendering for Tokyo?",
        lastTime: "14:22",
        status: "online",
        messages: [
          { id: "m-1", sender: "Elena Rostova", text: "Hey Alex! Loved your new preview.", time: "14:15", outgoing: false },
          { id: "m-2", sender: "Alex Mercer", text: "Thanks Elena! Almost ready for the live showcase.", time: "14:18", outgoing: true },
          { id: "m-3", sender: "Elena Rostova", text: "Did you finish the audio rendering for Tokyo?", time: "14:22", outgoing: false }
        ]
      },
      {
        id: "chat-2",
        type: "direct",
        targetId: "user-2",
        title: "Marcus Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=280&q=80",
        lastMessage: "Checked the CSS tokens, looking super clean.",
        lastTime: "11:05",
        status: "online",
        messages: [
          { id: "m-4", sender: "Marcus Chen", text: "Checked the CSS tokens, looking super clean.", time: "11:05", outgoing: false }
        ]
      },
      {
        id: "channel-1",
        type: "channel",
        channelId: "general-community",
        title: "Diskrit Global Community",
        avatar: "#",
        memberCount: 1420,
        isAnnouncement: false,
        inviteToken: "join-global-4921",
        lastMessage: "Welcome all new creators joining today!",
        lastTime: "12:40",
        messages: [
          { id: "m-5", sender: "Marcus Chen", text: "Welcome all new creators joining today!", time: "12:40", outgoing: false }
        ]
      },
      {
        id: "channel-2",
        type: "channel",
        channelId: "creator-lounge",
        title: "Creator Lounge (VIP)",
        avatar: "CL",
        memberCount: 88,
        isAnnouncement: true,
        inviteToken: "join-lounge-9821",
        lastMessage: "Weekly monetization analytics are now available.",
        lastTime: "Yesterday",
        messages: [
          { id: "m-6", sender: "Diskrit Official", text: "Weekly monetization analytics are now available.", time: "Yesterday", outgoing: false }
        ]
      }
    ]
  },

  admin: {
    kpis: {
      totalUsers: "28,450",
      usersGrowth: "+14.2% this week",
      totalPosts: "142,800",
      postsGrowth: "+22.8% this week",
      pendingReports: 14,
      aiModerationFlags: 8,
      networkImpressions: "2.4M",
      networkClicks: "148.6K",
      networkCtr: "6.18%"
    },
    usersTable: [
      { id: "u-101", name: "Alex Mercer", handle: "@alexmercer", email: "alex@diskrit.io", role: "Creator", status: "Active", joined: "2024-01-10" },
      { id: "u-102", name: "Elena Rostova", handle: "@elena", email: "elena@berlinmail.de", role: "User", status: "Active", joined: "2024-02-14" },
      { id: "u-103", name: "Marcus Chen", handle: "@marcus_chen", email: "marcus@chensystems.io", role: "Superadmin", status: "Active", joined: "2023-11-05" },
      { id: "u-104", name: "SpamBot99", handle: "@free_crypto_now", email: "bot99@throwaway.xyz", role: "User", status: "Banned", joined: "2026-10-27" }
    ],
    allPostsTable: [
      { id: "p-201", author: "Alex Mercer", excerpt: "Finalizing our multi-channel generative audio installation...", media: "image", status: "Active", date: "Oct 28, 2026" },
      { id: "p-202", author: "Sarah Jenkins", excerpt: "Golden hour over the cliffs of Big Sur. Captured this 4K...", media: "video", status: "Active", date: "Oct 28, 2026" },
      { id: "p-203", author: "Marcus Chen", excerpt: "Subterranean audio experiments with deep bass frequency...", media: "image", status: "Active (18+)", date: "Oct 28, 2026" },
      { id: "p-204", author: "SpamBot99", excerpt: "Click here for guaranteed 500% instant returns on Bitcoin...", media: "none", status: "Hidden (Spam)", date: "Oct 27, 2026" }
    ],
    reportsQueue: [
      { id: "rep-1", reporter: "David Kim", postAuthor: "SpamBot99", reason: "Commercial spam & phishing links", message: "User is posting automated telegram bot spam in replies.", status: "Pending" },
      { id: "rep-2", reporter: "Elena Rostova", postAuthor: "TrollAccount", reason: "Harassment & abusive language", message: "Repeatedly posting defamatory insults on public threads.", status: "Under Review" }
    ],
    aiModerationQueue: [
      { id: "ai-1", author: "Marcus Chen", excerpt: "Late night subterranean audio experiments... strobe visuals.", aiFlag: "Potential 18+ Strobe/Adult Content (Score: 89%)", status: "Flagged" },
      { id: "ai-2", author: "DarkViper", excerpt: "Leaked database credentials download mirror...", aiFlag: "Malicious Software / Exploit Attempt (Score: 98%)", status: "Auto-Hidden" }
    ],
    connectedWebsites: [
      { id: "site-1", name: "Cyberpunk Zine", domain: "cyberpunk-zine.com", key: "dsk_live_992a71bf", defaultFormat: "Card", theme: "Dark", impressions: "840K", clicks: "54K", ctr: "6.4%", status: "Active" },
      { id: "site-2", name: "Design Weekly", domain: "designweekly.io", key: "dsk_live_883c55de", defaultFormat: "Banner", theme: "Light", impressions: "620K", clicks: "38K", ctr: "6.1%", status: "Active" },
      { id: "site-3", name: "Synth Pulse", domain: "synthpulse.org", key: "dsk_live_114f77ba", defaultFormat: "Floating", theme: "Dark", impressions: "490K", clicks: "31K", ctr: "6.3%", status: "Active" },
      { id: "site-4", name: "Indie Creator Hub", domain: "indiecreator.net", key: "dsk_live_662d99aa", defaultFormat: "Story", theme: "Dark", impressions: "450K", clicks: "25K", ctr: "5.6%", status: "Active" }
    ]
  },

  // Flaw 5.3 Demographic Pill Options
  demographics: {
    orientations: [
      "Straight", "Heterosexual", "Homosexual", "Gay", "Lesbian", "Bisexual", 
      "Pansexual", "Demisexual", "Asexual", "Queer", "Questioning", "Skoliosexual", 
      "Omnisexual", "Polysexual", "Greysexual", "Androsexual", "Gynosexual", 
      "Sapiosexual", "Fluid", "Abrosexual", "Prefer not to say"
    ],
    identityRoles: [
      "Dominant", "Submissive", "Switch", "Master", "Mistress", "Slave", 
      "Rope Bunny", "Rigger", "Primal", "Prey", "Predator", "Pet", "Handler", 
      "Caregiver", "Little", "Middle", "Brat", "Brat Tamer", "Sadist", 
      "Masochist", "Sensualist", "Voyeur", "Exhibitionist", "Degrader", "Praise Junkie", 
      "Service Top", "Service Bottom", "Impact Player", "Explorer", "Vanilla", 
      "Bondage Enthusiast", "Latex Lover", "Leather", "Kitten", "Puppy", 
      "Daddy", "Mommy", "Switch / Fluid", "Hedonist", "Observer", "Curious", 
      "Non-Conformist", "Autonomous"
    ]
  }
};
