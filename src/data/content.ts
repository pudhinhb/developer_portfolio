export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface ProjectLink {
  label: string;
  url: string;
  primary?: boolean;
}

export interface Project {
  key: string;
  name: string;
  img: string;
  w: number;
  h: number;
  cat: string;
  year: string;
  accent: string;
  title: string;
  tagline?: string;
  description?: string;
  highlights?: string[];
  techStack?: string[];
  role?: string;
  stats?: { label: string; value: string };
  links?: ProjectLink[];
  teaser?: boolean;
}

export interface TechIdea {
  no: string;
  title: string;
  description: string;
  tags: string[];
}

export interface SkillGroup {
  name: string;
  items: string[];
}

export interface FooterColumnItem {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  items: FooterColumnItem[];
}

export interface SocialItem {
  label: string;
  href: string;
}

export interface PortfolioContent {
  nav: NavItem[];
  cta: { label: string; href: string };
  headline: string;
  role: [string, string];
  meta: string[];
  notification: {
    name: string;
    time: string;
    lead: string;
    message: string;
  };
  section2: {
    sideLeft: [string, string];
    sideRight: [string, string];
  };
  works: {
    brand: string;
    projects: Project[];
  };
  bigRobot: {
    labels: { left: string; right: string };
    eyebrow: string;
    titleLines: [string, string];
    description: string;
    hint: string;
    techIdeas: TechIdea[];
  };
  editorial: {
    eyebrow: string;
    statement: [string, string];
    note: string;
    skills: {
      title: string;
      groups: SkillGroup[];
    };
    mindset: {
      title: string;
      lines: string[];
    };
    exploring: {
      title: string;
      items: string[];
    };
    ending: {
      lines: string[];
      note: string;
    };
  };
  smallRobot: {
    eyebrow: string;
    titleLines: [string, string];
    description: string;
    note: string;
  };
  footer: {
    eyebrow: string;
    headline: [string, string];
    line: string;
    email: string;
    emailLabel: string;
    columns: FooterColumn[];
    social: SocialItem[];
    legal: string;
    note: string;
    backToTop: string;
  };
  about: {
    boxes: {
      who: { title: string; sub: string };
      what: { title: string; sub: string };
      think: { title: string; sub: string };
    };
    views: {
      who: { eyebrow: string; head: string; text: string };
      what: { eyebrow: string; head: string; text: string };
      think: { eyebrow: string; head: string; text: string };
    };
  };
}

/**
 * Dynamically calculates years of experience from career start date (Feb 2024),
 * ensuring the portfolio stays automatically updated over time.
 */
export const getExperienceYears = (): string => {
  const start = new Date(2024, 1, 1); // February 2024
  const now = new Date();
  const diffYears = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const years = Math.max(2, Math.floor(diffYears));
  return `${years}+`;
};

export const expYears = getExperienceYears();

export const heroContent: PortfolioContent = {
  nav: [
    { label: "Work", href: "#work", active: true },
    { label: "About", href: "#section-03" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],

  cta: { label: "Let’s Talk", href: "#contact" },

  headline: "PUDHINRAJ",
  role: ["AI & Flutter", "Software Engineer"],
  meta: ["AI/ML", "Flutter", "iOS & Android", "Security"],

  notification: {
    name: "Pudhinraj H B",
    time: "now",
    lead: "AI & Mobile Engineer",
    message: `${expYears} years shipping AI-infused iOS & Android mobile apps, Dart SDKs, and production SaaS systems.`,
  },

  section2: {
    sideLeft: ["Pudhinraj H B", "Solutions."],
    sideRight: ["AI Driven.", "Performance."],
  },

  /* My Works — real-world projects from H B Pudhinraj's resume */
  works: {
    brand: "Pudhinraj H B",
    projects: [
      {
        key: "temp-mail-blocker",
        name: "Temp Mail Blocker",
        img: "/assets/project-temp-mail.jpg",
        w: 1200,
        h: 675,
        cat: "SaaS · ML & Flutter SDK",
        year: "2025",
        accent: "#ff4757",
        title: "ML-Powered Disposable Email Detection SDK & Extension",
        tagline: "Prevent fake account spam & protect SaaS user databases in real time.",
        role: "Lead Software Engineer · Architecture & Solo Delivery",
        description:
          "Engineered the core API and SDK for a SaaS platform dedicated to detecting and blocking temporary/disposable emails at signup. Published as an open-source Flutter package on pub.dev and accompanied by a production Chrome Web Store extension and Next.js portal.",
        highlights: [
          "Published public Flutter package on pub.dev for frictionless drop-in app integration.",
          "Engineered companion Chrome Extension for real-time inbox and spreadsheet email validation.",
          "Trained custom ML risk-scoring model to classify emerging disposable domain clusters with 98.4% precision.",
          "High-concurrency backend responding in sub-50ms latency across global edge endpoints.",
        ],
        techStack: ["Flutter", "Dart", "Machine Learning", "pub.dev", "Chrome Extension", "Next.js", "REST APIs"],
        stats: { label: "Ecosystem Status", value: "pub.dev Verified" },
        links: [
          { label: "View on pub.dev", url: "https://pub.dev/packages/temp_mail_blocker", primary: true },
          { label: "Chrome Web Store", url: "https://chromewebstore.google.com" },
          { label: "GitHub Profile", url: "https://github.com/pudhinhb" },
        ],
      },
      {
        key: "sprintly",
        name: "Sprintly",
        img: "/assets/project-sprintly.jpg",
        w: 1200,
        h: 675,
        cat: "Enterprise SaaS · HRMS",
        year: "2025",
        accent: "#2ed573",
        title: "Enterprise HRMS with Biometric Attendance & Real-Time Comms",
        tagline: "Automated task allocation, biometric physical presence & socket communication.",
        role: "Full-Stack Flutter & Dart Backend Engineer",
        description:
          "Architected an enterprise HRMS platform designed for automated task allocation, WFH request permissions, physical biometric presence verification, and low-latency team collaboration. Currently scoped for commercial SaaS expansion.",
        highlights: [
          "Integrated dual biometric authentication: physical fingerprint scanner and AI facial recognition.",
          "Engineered low-latency socket communication for real-time employee check-ins and active statuses.",
          "Built Slack-style instant messaging, VoIP voice calling, and video collaboration with Dart backend.",
          "Implemented clean Provider/BLoC state architecture with robust offline-first caching.",
        ],
        techStack: ["Flutter", "Dart Backend", "WebSockets", "Biometric SDK", "Face Recognition", "Socket.IO", "REST APIs"],
        stats: { label: "Comms Latency", value: "< 80ms Sockets" },
        links: [
          { label: "View Architecture", url: "https://github.com/pudhinhb", primary: true },
          { label: "LinkedIn Post", url: "https://linkedin.com/in/pudhinraj-h-b" },
        ],
      },
      {
        key: "taxiby",
        name: "Taxiby",
        img: "/assets/project-taxiby.jpg",
        w: 1200,
        h: 675,
        cat: "iOS & Android · Logistics",
        year: "2024",
        accent: "#ffa502",
        title: "Full-Scale Ride-Hailing App with Live GPS & iOS PiP",
        tagline: "Instant driver dispatch, live route simulation, and iOS Picture-in-Picture.",
        role: "Solo Mobile Architect & App Store Release Manager",
        description:
          "Engineered solo end-to-end: a high-demand ride-hailing platform (Ola/Uber style) providing instant driver matching, real-time fare calculation, animated polyline routes, and live location synchronization.",
        highlights: [
          "Built 100% solo from UI/UX and socket architecture to Apple App Store & Google Play releases.",
          "Engineered native iOS Picture-in-Picture (PiP) floating live location tracking via platform channels.",
          "Real-time bidirectional WebSocket synchronization for driver positions and rider ETA updates.",
          "Over 100+ active installs across Google Play Store and Apple App Store post-launch.",
        ],
        techStack: ["Flutter", "iOS (Swift)", "Android (Kotlin)", "WebSockets", "Google Maps SDK", "Platform Channels"],
        stats: { label: "Production Reach", value: "100+ Live Installs" },
        links: [
          { label: "Google Play Store", url: "https://play.google.com", primary: true },
          { label: "App Store Connect", url: "https://apple.com" },
        ],
      },
      {
        key: "talkpay",
        name: "TalkPay",
        img: "/assets/project-talkpay.svg",
        w: 1200,
        h: 800,
        cat: "Native Android · Kotlin",
        year: "2024",
        accent: "#1e90ff",
        title: "Native Android Caller ID & Telephony Call Management",
        tagline: "Truecaller-style caller identification, call overlay, and local DB caching.",
        role: "Native Android Developer",
        description:
          "A Truecaller-style caller identification, spam call filtering, and telephony dialer utility built natively for Android in modern Kotlin with high-performance local SQLite/Room caching and Google AdMob monetization.",
        highlights: [
          "Natively engineered in Kotlin utilizing Android Jetpack, Coroutines, Flow, and Room DB.",
          "Integrated TelecomManager APIs with custom system alert window overlays for incoming calls.",
          "Achieved 500+ active installs on Google Play Store with top-tier user retention.",
          "Zero-latency contact lookup through memory-indexed database queries.",
        ],
        techStack: ["Kotlin", "Android Jetpack", "TelecomManager", "Room Database", "Coroutines", "Google Play Console"],
        stats: { label: "Play Store Reach", value: "500+ Active Installs" },
        links: [
          { label: "Google Play Store", url: "https://play.google.com", primary: true },
          { label: "GitHub Profile", url: "https://github.com/pudhinhb" },
        ],
      },
      {
        key: "amaramba",
        name: "Amaramba",
        img: "/assets/project-amaramba.svg",
        w: 1200,
        h: 800,
        cat: "FinTech · iOS & Android",
        year: "2024",
        accent: "#9b59b6",
        title: "Real-Time Stock Market Tracking & Trading for International Client",
        tagline: "Live tick streams, candlestick charting, and bank-grade trading security.",
        role: "Lead Mobile Developer & Client Liaison",
        description:
          "Engineered for an international client in Zimbabwe, handling direct client consultation, requirements gathering, and end-to-end production deployment on both iOS and Android platforms.",
        highlights: [
          "Built interactive real-time candlestick stock charts with dynamic technical indicator overlays.",
          "Direct international client handling across requirements, weekly sprint demos, and app releases.",
          "Engineered bank-grade transaction encryption, tokenized biometric auth, and zero data leak architecture.",
          "Fully managed deployment across Apple App Store Connect and Google Play Console.",
        ],
        techStack: ["Flutter", "Dart", "Financial Charting", "WebSockets", "iOS & Android", "FinTech Security"],
        stats: { label: "Client Scope", value: "International (Zimbabwe)" },
        links: [
          { label: "Case Study Overview", url: "https://github.com/pudhinhb", primary: true },
          { label: "LinkedIn Connect", url: "https://linkedin.com/in/pudhinraj-h-b" },
        ],
      },
    ],
  },

  /* ---- BIG ROBOT section (The Mind / Technology Thinking) ---- */
  bigRobot: {
    labels: { left: "iOS & Android · AI Engineer", right: "Networking · Cyber Security" },
    eyebrow: "( 05 · The Mind )",
    titleLines: ["I build iOS & Android apps", "that are intelligent, robust and fast."],
    description: "Bridging the gap between intelligent AI systems, high-performance iOS and Android mobile architecture, and rock-solid cyber security.",
    hint: "Scroll to move through the ideas.",

    techIdeas: [
      {
        no: "01",
        title: "AI & Deep Learning Systems",
        description: "Researching and integrating deep learning models — from LiDAR point cloud noise filtering to real-time ML risk scoring.",
        tags: ["Deep Learning", "Machine Learning", "LiDAR", "Python", "Azure AI-900", "PointNet"],
      },
      {
        no: "02",
        title: "iOS & Android Mobile Architecture",
        description: "Building production Flutter applications with clean BLoC/Provider architecture, native platform channels (Swift/Kotlin), and silky rendering.",
        tags: ["iOS", "Android", "Flutter", "Dart", "Kotlin", "Swift", "App Store", "Google Play"],
      },
      {
        no: "03",
        title: "Real-Time WebSockets & Backends",
        description: "Engineering low-latency socket communication, custom Dart backends, live GPS location streams, and socket voice/video pipelines.",
        tags: ["WebSockets", "Dart Backend", "Firebase", "Supabase", "REST APIs", "Socket.IO"],
      },
      {
        no: "04",
        title: "Cyber Security & Defensive Design",
        description: "Grounding every application in core computer science, networking protocols (CCNA), secure keychain storage, and packet analysis.",
        tags: ["Cyber Security", "Networking", "CCNA", "Kali Linux", "Data Protection", "Security Auditing"],
      },
    ],
  },

  /* ---- EDITORIAL / SKILLS section (The Method & Skills) ---- */
  editorial: {
    eyebrow: "( 06 · The Method )",
    statement: ["Code is my craft.", "Intelligence is my engine."],
    note: "Focused on where intelligent systems meet high-performance iOS & Android mobile engineering.",
    skills: {
      title: "I Work With",
      groups: [
        { name: "AI & ML", items: ["Deep Learning", "Machine Learning", "Python", "Azure AI", "LiDAR Filtering"] },
        { name: "Mobile (iOS & Android)", items: ["Flutter", "Dart", "iOS / Xcode", "Android / Kotlin", "Google Play Console", "App Store Connect"] },
        { name: "Backend & Cloud", items: ["Dart Backend", "Firebase", "Supabase", "WebSockets", "REST APIs", "AWS"] },
        { name: "Security & Systems", items: ["Networking (CCNA)", "Cyber Security", "Kali Linux", "Git / GitHub", "Next.js"] },
      ],
    },
    mindset: {
      title: "Architect → Build → Secure → Ship",
      lines: [
        "I architect for long-term scalability.",
        "I build with intelligent, responsive algorithms.",
        "I secure against vulnerabilities and data leaks.",
        "And I ship production-grade software that delivers impact.",
      ],
    },
    exploring: {
      title: "Currently Exploring",
      items: [
        "AI-infused mobile application pipelines",
        "On-device neural network inference",
        "Distributed real-time communication systems",
        "Advanced Flutter desktop & web tooling",
        "Autonomous agents and ML-driven automation",
      ],
    },
    ending: {
      lines: ["Always building.", "Always shipping.", "Still curious."],
      note: `${expYears} years of hands-on delivery and counting.`,
    },
  },

  /* ---- SMALL ROBOT section ---- */
  smallRobot: {
    eyebrow: "( 06 · Still Curious )",
    titleLines: ["Always looking", "for the next challenge."],
    description: "A small machine, quietly paying attention — the way I approach engineering and problem-solving.",
    note: "Move your cursor · it follows",
  },

  /* ---- FOOTER ---- */
  footer: {
    eyebrow: "( 07 · Contact )",
    headline: ["Let’s build", "something intelligent."],
    line: "Open to full-time engineering roles, AI & mobile consulting, and high-impact software ventures.",
    email: "hbpudhinraj@gmail.com",
    emailLabel: "Say hello",
    columns: [
      {
        title: "Sections",
        items: [
          { label: "Hero", href: "#top" },
          { label: "Creative", href: "#work" },
          { label: "About", href: "#section-03" },
          { label: "Selected Works", href: "#projects" },
          { label: "The Mind", href: "#think" },
        ],
      },
      {
        title: "Connect",
        items: [
          { label: "GitHub", href: "https://github.com/pudhinhb" },
          { label: "LinkedIn", href: "https://linkedin.com/in/pudhinraj-h-b" },
          { label: "pub.dev Package", href: "https://pub.dev/packages/temp_mail_blocker" },
          { label: "Coimbatore, Tamil Nadu", href: "#contact" },
        ],
      },
    ],
    social: [
      { label: "GitHub", href: "https://github.com/pudhinhb" },
      { label: "LinkedIn", href: "https://linkedin.com/in/pudhinraj-h-b" },
      { label: "pub.dev", href: "https://pub.dev/packages/temp_mail_blocker" },
    ],
    legal: "© 2026 H B Pudhinraj",
    note: "Engineered with Flutter, AI, and Next.js.",
    backToTop: "Back to top",
  },

  /* About Me chapter */
  about: {
    boxes: {
      who: { title: "Who I Am", sub: "Pudhinraj H B — AI & Flutter Engineer." },
      what: { title: "What I Do", sub: "iOS & Android Apps · AI Models · Dart SDKs" },
      think: { title: "How I Think", sub: "Architect · Build · Secure · Ship · Impact" },
    },
    views: {
      who: {
        eyebrow: "01 — Who I Am",
        head: "Pudhinraj H B",
        text: `Flutter, iOS & Android Developer and AI Engineer with ${expYears} years of hands-on industry experience building cross-platform mobile applications from architecture through Play Store & App Store releases. Strong foundation in Computer Science, Networking, and Cyber Security with a track record of solo delivery, SaaS product engineering, and AI/ML research.`,
      },
      what: {
        eyebrow: "02 — What I Do",
        head: "Code Into Solutions.",
        text: "End-to-end engineering across AI-infused iOS & Android mobile apps, published pub.dev packages, real-time WebSocket communication, Dart backends, and full-cycle App Store and Google Play releases.",
      },
      think: {
        eyebrow: "03 — How I Think",
        head: "Architecture to Impact",
        text: "“Clean architecture is not a constraint; it is the foundation of scale, security, and velocity.” Architect → Build → Secure → Ship.",
      },
    },
  },
};
