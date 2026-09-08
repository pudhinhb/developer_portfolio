export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
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

export const heroContent: PortfolioContent = {
  nav: [
    { label: "Work", href: "#work", active: true },
    { label: "About", href: "#section-03" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],

  cta: { label: "Let’s Talk", href: "#contact" },

  headline: "Gireesh",
  role: ["Aesthetic", "Software Developer"],
  meta: ["Web", "App", "Code"],

  notification: {
    name: "Gireesh",
    time: "now",
    lead: "Aesthetic",
    message: "software developer — building clean code and digital solutions.",
  },

  section2: {
    sideLeft: ["MyCreativeHunch", "Solutions."],
    sideRight: ["Passion.", "Creativity."],
  },

  /* My Works — add projects here (image + metadata per card); the Works
     carousel builds itself from this array. `teaser: true` cards are
     decorative edge slices and never become the active project. */
  works: {
    brand: "MyCreativeHunch Studio",
    projects: [
      {
        key: "tourtripx",
        name: "TourtripX",
        img: "/assets/work-tourtripx.jpg",
        w: 498,
        h: 405,
        cat: "SaaS · Travel",
        year: "2024",
        accent: "#4da3ff",
        title: "Smart Flight Booking CRM built for Flight Management",
      },
      {
        key: "classlogic",
        name: "ClassLogic",
        img: "/assets/work-classlogic.jpg",
        w: 383,
        h: 363,
        cat: "EdTech · SaaS",
        year: "2024",
        accent: "#a8e063",
        title: "Digital Learning Platform built for Seamless Education",
      },
      {
        key: "couchops",
        name: "Couchops",
        img: "/assets/work-couchops.jpg",
        w: 186,
        h: 362,
        cat: "SaaS · Platform",
        year: "2023",
        accent: "#f28b3c",
        title: "The #1 Digital platform trusted by Consultants",
      },
    ],
  },

  /* ---- BIG ROBOT section (the original large Nexbot experience) ---- */
  bigRobot: {
    labels: { left: "Computer Science Student", right: "Software · Creative Technology" },
    eyebrow: "( 05 · The Mind )",
    titleLines: ["I build software that", "looks as good as it works."],
    description: "I like understanding what’s underneath the interface — then finding a better way to build it.",
    hint: "Scroll to move through the ideas.",

    /* the panels that travel through the 3D space — add or edit freely */
    techIdeas: [
      {
        no: "01",
        title: "AI & Intelligent Systems",
        description: "Exploring how software can become more adaptive, useful and intelligent.",
        tags: ["AI", "Machine Learning", "LLMs", "Automation", "Experimentation"],
      },
      {
        no: "02",
        title: "Software & Systems",
        description: "Understanding how individual pieces become systems that actually work together.",
        tags: ["Algorithms", "Architecture", "APIs", "Databases", "Web", "System Design"],
      },
    ],
  },

  /* ---- EDITORIAL / SKILLS section (scroll-choreographed) ---- */
  editorial: {
    eyebrow: "( 06 · The Method )",
    statement: ["Code is my medium.", "Curiosity is my engine."],
    note: "I’m interested in what happens when technical thinking meets good design.",
    skills: {
      title: "I Work With",
      groups: [
        { name: "Languages", items: ["JavaScript", "Python", "Java", "C / C++"] },
        { name: "Web", items: ["HTML", "CSS", "React", "Next.js", "Responsive Design"] },
        { name: "Tools", items: ["Git", "GitHub", "Figma", "VS Code"] },
      ],
    },
    mindset: {
      title: "Learn → Build → Break → Improve",
      lines: [
        "I learn by building.",
        "I build by experimenting.",
        "I experiment by breaking things.",
        "And I improve by understanding why they broke.",
      ],
    },
    exploring: {
      title: "Currently Exploring",
      items: [
        "Building better web experiences",
        "Learning system design",
        "Experimenting with AI",
        "Understanding software architecture",
        "Creating interactive interfaces",
      ],
    },
    ending: {
      lines: ["Still learning.", "Still building.", "Still curious."],
      note: "And probably always will be.",
    },
  },

  /* ---- SMALL ROBOT section ---- */
  smallRobot: {
    eyebrow: "( 06 · Still Curious )",
    titleLines: ["Always looking", "for the next thing."],
    description: "A small machine, quietly paying attention — the way I try to.",
    note: "Move your cursor · it follows",
  },

  /* ---- FOOTER ---- */
  footer: {
    eyebrow: "( 07 · Contact )",
    headline: ["Let’s build", "something good."],
    line: "Open to internships, freelance work and interesting problems.",
    email: "kolligireeshkumarreddy@gmail.com",
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
        title: "Method",
        items: [
          { label: "How I think", href: "#method" },
          { label: "What I work with", href: "#method" },
          { label: "Currently exploring", href: "#method" },
          { label: "Still curious", href: "#curious" },
        ],
      },
    ],
    social: [],
    legal: "© 2026 Gireesh",
    note: "Built with code and curiosity.",
    backToTop: "Back to top",
  },

  /* About Me chapter */
  about: {
    boxes: {
      who: { title: "Who I Am", sub: "Gireesh — aesthetic software developer." },
      what: { title: "What I Do", sub: "Web · App · Code" },
      think: { title: "How I Think", sub: "Idea · Design · Develop · Deploy · Impact" },
    },
    views: {
      who: {
        eyebrow: "01 — Who I Am",
        head: "Gireesh",
        text: "Aesthetic software developer — building clean code and digital solutions.",
      },
      what: {
        eyebrow: "02 — What I Do",
        head: "Code Into Solutions.",
        text: "Where code meets creative thinking — web, apps, systems, APIs, AI and automation. Built with passion, driven by creativity.",
      },
      think: {
        eyebrow: "03 — How I Think",
        head: "Idea to Impact",
        text: "Idea · Design · Develop · Deploy · Impact.",
      },
    },
  },
};
