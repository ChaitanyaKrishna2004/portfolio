/**
 * Transcribes the current hardcoded content into Postgres.
 *
 *   npm run db:seed
 *
 * Content tables are cleared and rewritten each run. contact_messages,
 * admin_users and audit_logs are never touched — those hold real data.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Model, ModelStatic } from "sequelize";
import {
  sequelize,
  SiteSetting,
  PageSection,
  SkillCategory,
  Project,
  Experience,
  BlogPost,
  Media,
} from "../src/models";

const RESUME = "/Paruchuri_Chaitanya_Krishna_Resume.pdf";

/** Shape of each entry in src/data/data.json, the detail-page source. */
interface ProjectDetailJson {
  category?: string;
  description?: string;
  video?: string;
  gallery?: string[];
  technologies?: string[];
  overview?: string;
  about?: string;
  features?: { title: string; description: string; icon: string; color: string }[];
  architecture?: { name: string; color: string }[];
  challenges?: string[];
  learnings?: string[];
  highlights?: string[];
  projectInfo?: {
    role: string;
    duration: string;
    team: string;
    liveDemo: string;
    sourceCode: string;
  };
}

/* ------------------------------------------------------------------ media */

const MEDIA_SEED = [
  { url: "/photo.jpeg", type: "image", altText: "Paruchuri Chaitanya Krishna", folder: "profile", format: "jpeg" },
  { url: "/DevTinder.mp4", type: "video", altText: "DevTinder walkthrough", folder: "projects", format: "mp4" },
  { url: "/SnapCart-Food-Cart.mp4", type: "video", altText: "SnapCart walkthrough", folder: "projects", format: "mp4" },
  { url: RESUME, type: "document", altText: "Resume", folder: "documents", format: "pdf" },
  { url: "/images/blog/ai-agents.jpg", type: "image", altText: "Collaborative AI agents", folder: "blog", format: "jpg" },
  { url: "/images/blog/design.jpg", type: "image", altText: "Design system", folder: "blog", format: "jpg" },
  { url: "/images/blog/inventory.jpg", type: "image", altText: "Inventory management system", folder: "blog", format: "jpg" },
  { url: "/images/blog/scaling.jpg", type: "image", altText: "Scaling Node.js", folder: "blog", format: "jpg" },
  { url: "/images/blog/security.jpg", type: "image", altText: "Modern web security", folder: "blog", format: "jpg" },
  { url: "/images/projects/devtinder/dashboard.png", type: "image", altText: "DevTinder dashboard", folder: "projects/devtinder", format: "png" },
  { url: "/images/projects/devtinder/discover.png", type: "image", altText: "DevTinder discover", folder: "projects/devtinder", format: "png" },
  { url: "/images/projects/devtinder/matches.png", type: "image", altText: "DevTinder matches", folder: "projects/devtinder", format: "png" },
  { url: "/images/projects/devtinder/profile.png", type: "image", altText: "DevTinder profile", folder: "projects/devtinder", format: "png" },
];

/* ------------------------------------------------------------- site-wide */

const NAV_LINKS = [
  { label: "Home", href: "/", placement: "navbar" as const, isExternal: false, icon: null, order: 1, visible: true },
  { label: "Blog", href: "/blog", placement: "navbar" as const, isExternal: false, icon: null, order: 2, visible: true },
];

// brandColor is either a hex brand value or the literal token "foreground",
// which follows the theme. onBrandText is the icon colour once filled.
const SOCIAL_LINKS = [
  {
    platform: "github", label: "GitHub", url: "https://github.com/ChaitanyaKrishna2004/",
    icon: "FaGithub", brandColor: "foreground", onBrandText: "background", textBadge: null,
    placements: ["hero", "contact", "footer"], order: 1,
  },
  {
    platform: "linkedin", label: "LinkedIn",
    url: "https://www.linkedin.com/in/paruchuri-chaitanya-krishna-768557255/?skipRedirect=true",
    icon: "FaLinkedin", brandColor: "#0077b5", onBrandText: "white", textBadge: null,
    placements: ["hero", "contact", "footer"], order: 2,
  },
  {
    platform: "leetcode", label: "LeetCode", url: "https://leetcode.com/u/chaitanya2004/",
    icon: "SiLeetcode", brandColor: "#ffa116", onBrandText: "white", textBadge: "LC",
    placements: ["hero", "contact"], order: 3,
  },
  {
    platform: "takeuforward", label: "TakeUForward",
    url: "https://takeuforward.org/profile/krishnaparuchuri2004",
    icon: null, brandColor: "#ef4444", onBrandText: "white", textBadge: "TUF",
    placements: ["hero", "contact"], order: 4,
  },
];

const BUTTONS = {
  "hero.viewProjects": { label: "View Projects", href: "#projects", icon: "ArrowRight", variant: "solid", target: "_self" },
  "hero.resume": { label: "Resume", href: RESUME, icon: "Download", variant: "outline", target: "_blank" },
  "navbar.backToProjects": { label: "Back to Projects", href: "/#projects", icon: "ArrowLeft", variant: "link", target: "_self" },
  "project.liveDemo": { label: "Live Demo", href: null, icon: "ExternalLink", variant: "solid", target: "_blank" },
  "project.source": { label: "Source", href: null, icon: "FaGithub", variant: "ghost", target: "_blank" },
  "project.details": { label: "Project Details", href: null, icon: "ArrowRight", variant: "violet", target: "_self" },
  "contact.send": { label: "Send Message", href: null, icon: "Send", variant: "solid", target: "_self" },
  "blog.readArticle": { label: "Read Article", href: null, icon: "ArrowRight", variant: "link", target: "_self" },
  "blog.share": { label: "Share Article", href: null, icon: "Share2", variant: "violet", target: "_self" },
  "blog.readMore": { label: "Read More", href: "/blog", icon: null, variant: "ghost", target: "_self" },
};

const UI_TEXTS = {
  "project.problemLabel": "The Problem",
  "project.solutionLabel": "The Solution",
  "project.outcomeLabel": "Measurable Outcome",
  "experience.responsibilitiesLabel": "Key Responsibilities",
  "experience.impactLabel": "Measurable Impact",
  "projectDetail.aboutLabel": "About the Project",
  "projectDetail.learnedLabel": "What I Learned",
  "projectDetail.challengesLabel": "Challenges",
  "projectDetail.architectureLabel": "Project Architecture",
  "projectDetail.overviewLabel": "Overview",
  "projectDetail.highlightsLabel": "Key Highlights",
  "projectDetail.infoLabel": "Project Info",
  "projectDetail.infoRole": "Role",
  "projectDetail.infoDuration": "Duration",
  "projectDetail.infoTeam": "Team Size",
  "projectDetail.infoLiveDemo": "Live Demo",
  "projectDetail.infoSourceCode": "Source Code",
  "about.journeyLabel": "MY JOURNEY",
};

/* -------------------------------------------------------------- sections */

const SECTIONS = [
  {
    key: "hero", eyebrow: null, title: "Hi, I'm Chaitanya.", titleHighlight: null,
    description:
      "building applications that are fast, secure, and incredibly easy to use. I love turning complex problems into simple, elegant solutions.",
    sortOrder: 1,
    content: {
      roles: [
        { text: "Full Stack Developer", order: 1 },
        { text: "MERN Stack Developer", order: 2 },
        { text: "Backend Developer", order: 3 },
        { text: "Frontend Developer", order: 4 },
        { text: "Software Developer", order: 5 },
        { text: "Web Developer", order: 6 },
      ],
      stats: [
        { icon: "Briefcase", iconBgClass: "bg-orange-100 dark:bg-orange-500/20", value: "10+", labelTop: "Projects", labelBottom: "Completed", order: 1 },
        { icon: "User", iconBgClass: "bg-indigo-100 dark:bg-indigo-500/20", value: "2+", labelTop: "Years of", labelBottom: "Experience", order: 2 },
        { icon: "Code2", iconBgClass: "bg-fuchsia-100 dark:bg-fuchsia-500/20", value: "5+", labelTop: "Technologies", labelBottom: "Mastered", order: 3 },
        { icon: "Coffee", iconBgClass: "bg-rose-100 dark:bg-rose-500/20", value: "100%", labelTop: "Commitment &", labelBottom: "Dedication", order: 4 },
      ],
      techIcons: [
        { icon: "SiReact", name: "React", colorClass: "text-[#61DAFB]", shadowClass: "shadow-[#61DAFB]/30", top: "5%", left: "-5%", delay: 0, order: 1 },
        { icon: "SiNodedotjs", name: "Node.js", colorClass: "text-[#339933]", shadowClass: "shadow-[#339933]/30", top: "70%", left: "-15%", delay: 1.5, order: 2 },
        { icon: "SiMongodb", name: "MongoDB", colorClass: "text-[#47A248]", shadowClass: "shadow-[#47A248]/30", top: "85%", left: "80%", delay: 3, order: 3 },
        { icon: "SiJavascript", name: "JavaScript", colorClass: "text-[#F7DF1E]", shadowClass: "shadow-[#F7DF1E]/30", top: "-5%", left: "75%", delay: 2, order: 4 },
        { icon: "SiGit", name: "Git", colorClass: "text-[#F05032]", shadowClass: "shadow-[#F05032]/30", top: "40%", left: "95%", delay: 4, order: 5 },
      ],
    },
  },
  {
    key: "about", eyebrow: "ABOUT ME", title: "Building things I’m", titleHighlight: "curious about.",
    description:
      "I’m a full-stack developer who enjoys turning ideas into practical digital products. I like working across backend architecture, frontend experiences, APIs, databases, and deployment. My cybersecurity background also pushes me to think about security while building — not after.",
    sortOrder: 2,
    content: {
      image: "/photo.jpeg",
      imageAlt: "Chaitanya Workspace",
      cards: [
        { icon: "⚡", title: "BUILD", subtitle: "Full-Stack Engineering", description: "Designing and developing complete applications from frontend interfaces to scalable backend systems.", order: 1 },
        { icon: "🔐", title: "PROTECT", subtitle: "Security Mindset", description: "Applying cybersecurity principles to build applications that are not only functional, but secure by design.", order: 2 },
        { icon: "🚀", title: "SHIP", subtitle: "Product Thinking", description: "Taking an idea from architecture and development to deployment and a usable final product.", order: 3 },
      ],
      labels: [
        { label: "Backend", colorClass: "", positionClass: "-top-4 -left-6 sm:-left-12", floatDuration: 6, order: 1 },
        { label: "Security", colorClass: "text-accent-coral", positionClass: "top-1/2 -right-8 sm:-right-14", floatDuration: 5, order: 2 },
        { label: "Full Stack", colorClass: "text-accent-violet", positionClass: "-bottom-6 left-6 sm:left-12", floatDuration: 7, order: 3 },
      ],
      journey: [
        { year: "2022", title: "B.Tech — Computer Science", order: 1 },
        { year: "2024", title: "Cybersecurity / VAPT", order: 2 },
        { year: "2025", title: "Full-Stack Development", order: 3 },
        { year: "2026", title: "Building & Shipping Products", order: 4 },
      ],
    },
  },
  {
    key: "skills", eyebrow: "SKILLS", title: "Tools I use to", titleHighlight: "build.",
    description: "A collection of technologies I use to design, develop, secure, and ship digital products.",
    sortOrder: 3,
    content: {
      exploringLabel: "Currently Exploring",
      alsoWorkedLabel: "Also Worked With",
      tags: [
        { group: "exploring", name: "AI Agents", order: 1 },
        { group: "exploring", name: "Socket.IO", order: 2 },
        { group: "exploring", name: "System Design", order: 3 },
        { group: "exploring", name: "Cloud Architecture", order: 4 },
        { group: "also_worked", name: ".NET", order: 1 },
        { group: "also_worked", name: "C#", order: 2 },
        { group: "also_worked", name: "IIS", order: 3 },
        { group: "also_worked", name: "TFS", order: 4 },
        { group: "also_worked", name: "Bash", order: 5 },
      ],
    },
  },
  {
    key: "projects", eyebrow: "PROJECTS", title: "Featured", titleHighlight: "Work.",
    description: "A selection of robust, scalable applications I've engineered to solve real-world problems.",
    sortOrder: 4,
    content: {
      problemLabel: "The Problem",
      solutionLabel: "The Solution",
      outcomeLabel: "Measurable Outcome",
    },
  },
  {
    key: "experience", eyebrow: "EXPERIENCE", title: "Professional", titleHighlight: "Experience.",
    description: "A track record of building robust, scalable applications and securing digital assets across diverse professional environments.",
    sortOrder: 5,
    content: {
      responsibilitiesLabel: "Key Responsibilities",
      impactLabel: "Measurable Impact",
      resumeCta: {
        title: "Download Full Resume",
        description: "Get a comprehensive overview of my experience and skills.",
        href: RESUME,
      },
    },
  },
  {
    key: "achievements", eyebrow: "ACHIEVEMENTS", title: "Milestones &", titleHighlight: "Accolades.",
    description: "A track record of continuous learning, certifications, and problem-solving.",
    sortOrder: 6,
    content: {
      items: [
        { icon: "ShieldCheck", title: "CEHv12 Certified", description: "Certified Ethical Hacker with a score of 92%, demonstrating deep understanding of modern security vectors.", badgeLabel: "Top 8% Percentile", color: "accent-coral", order: 1 },
        { icon: "BookOpen", title: "Published Author", description: "Co-authored a comprehensive paper on advanced web application security assessment techniques.", badgeLabel: "Research & Security", color: "accent-violet", order: 2 },
        { icon: "Award", title: "Problem Solver", description: "Solved 250+ algorithmic and data structure problems, consistently improving logic and efficiency.", badgeLabel: "LeetCode", color: "foreground", order: 3 },
      ],
    },
  },
  {
    key: "contact", eyebrow: "CONTACT", title: "Let's build something", titleHighlight: "extraordinary.",
    description: "Whether you have a project in mind, a full-time opportunity, or just want to chat about code—I'm always open to discussing new ideas.",
    sortOrder: 7,
    content: {
      channels: [
        { type: "email", label: "Email", value: "paruchurichaitanyakrishna6@gmail.com", href: "mailto:paruchurichaitanyakrishna6@gmail.com", icon: "Mail", hoverColor: "accent-coral", order: 1 },
        { type: "phone", label: "Phone", value: "+91 9398130661", href: "tel:+919398130661", icon: "Phone", hoverColor: "accent-violet", order: 2 },
      ],
      form: {
        nameLabel: "Name",
        namePlaceholder: "John Doe",
        emailLabel: "Email",
        emailPlaceholder: "john@example.com",
        messageLabel: "Message",
        messagePlaceholder: "Tell me about your project...",
        submitLabel: "Send Message",
        successMessage: "Thanks — your message is on its way. I'll get back to you soon.",
        errorMessage: "Something went wrong sending that. Please try again, or email me directly.",
      },
    },
  },
  {
    key: "blog", eyebrow: null, title: "The", titleHighlight: "Archive",
    description: "Thoughts, learnings, and engineering deep dives.",
    sortOrder: 8,
    content: {
      meta: {
        title: "Blog | Chaitanya Krishna",
        description: "Read my latest articles on software engineering, web security, and tech.",
      },
      listing: {
        featuredLabel: "Latest Post",
        gridLabel: "More Articles",
        viewAllLabel: "View all",
        emptyLabel: "No posts found.",
        readLabel: "Read Article",
      },
      detail: {
        backLabel: "ALL ARTICLES",
        outroText: "Thanks for reading! If you enjoyed this, please share it.",
        shareLabel: "Share Article",
        moreLabel: "Read More",
        relatedLabel: "More Articles",
      },
      shareTargets: [
        { platform: "twitter", icon: "FaTwitter", urlTemplate: "https://twitter.com/intent/tweet?url={url}&text={title}", hoverColor: "accent-violet", order: 1 },
        { platform: "linkedin", icon: "FaLinkedin", urlTemplate: "https://www.linkedin.com/sharing/share-offsite/?url={url}", hoverColor: "accent-coral", order: 2 },
      ],
    },
  },
];

/* ---------------------------------------------------------------- skills */

const SKILL_CATEGORIES = [
  {
    name: "✦ Full Stack", slug: "full-stack", sortOrder: 1, isDefault: true,
    skills: [
      { name: "React.js", icon: "SiReact", tooltip: "Frontend · UI Development", order: 1 },
      { name: "Next.js", icon: "SiNextdotjs", tooltip: "Frontend · Full Stack Framework", order: 2 },
      { name: "Tailwind CSS", icon: "SiTailwindcss", tooltip: "Frontend · Styling", order: 3 },
      { name: "Node.js", icon: "SiNodedotjs", tooltip: "Backend · APIs", order: 4 },
      { name: "MongoDB", icon: "SiMongodb", tooltip: "Database · NoSQL", order: 5 },
      { name: "SQL Server", icon: "Database", tooltip: "Database · Relational", order: 6 },
      { name: "AWS EC2", icon: "FaAws", tooltip: "Cloud · Infrastructure", order: 7 },
      { name: "Git", icon: "SiGit", tooltip: "DevOps · Version Control", order: 8 },
      { name: "JavaScript", icon: "SiJavascript", tooltip: "Language · Core Logic", order: 9 },
      { name: "Python", icon: "SiPython", tooltip: "Language · Scripting", order: 10 },
    ],
  },
  {
    name: "Frontend", slug: "frontend", sortOrder: 2, isDefault: false,
    skills: [
      { name: "React.js", icon: "SiReact", tooltip: "Frontend · UI Development", order: 1 },
      { name: "Next.js", icon: "SiNextdotjs", tooltip: "Frontend · Full Stack Framework", order: 2 },
      { name: "Tailwind CSS", icon: "SiTailwindcss", tooltip: "Frontend · Styling", order: 3 },
      { name: "Redux", icon: "SiRedux", tooltip: "Frontend · State Management", order: 4 },
      { name: "HTML/CSS", icon: "SiHtml5", tooltip: "Frontend · Core Web", order: 5 },
    ],
  },
  {
    name: "Backend", slug: "backend", sortOrder: 3, isDefault: false,
    skills: [
      { name: "Node.js", icon: "SiNodedotjs", tooltip: "Backend · APIs", order: 1 },
      { name: "Express.js", icon: "SiExpress", tooltip: "Backend · Server Framework", order: 2 },
      { name: ".NET", icon: "SiDotnet", tooltip: "Backend · Enterprise Framework", order: 3 },
      { name: "C#", icon: "Code2", tooltip: "Backend · Server Logic", order: 4 },
    ],
  },
  {
    name: "Databases", slug: "databases", sortOrder: 4, isDefault: false,
    skills: [
      { name: "MongoDB", icon: "SiMongodb", tooltip: "Database · NoSQL", order: 1 },
      { name: "SQL Server", icon: "Database", tooltip: "Database · Relational", order: 2 },
      { name: "Mongoose", icon: "Database", tooltip: "Database · ODM", order: 3 },
      { name: "Sequelize", icon: "SiSequelize", tooltip: "Database · ORM", order: 4 },
    ],
  },
  {
    name: "DevOps & Cloud", slug: "devops-cloud", sortOrder: 5, isDefault: false,
    skills: [
      { name: "AWS EC2", icon: "FaAws", tooltip: "Cloud · Infrastructure", order: 1 },
      { name: "Nginx", icon: "SiNginx", tooltip: "Server · Reverse Proxy", order: 2 },
      { name: "Cloudflare", icon: "SiCloudflare", tooltip: "CDN · Security", order: 3 },
      { name: "Git", icon: "SiGit", tooltip: "DevOps · Version Control", order: 4 },
      { name: "IIS / TFS", icon: "Terminal", tooltip: "Server · CI/CD", order: 5 },
    ],
  },
  {
    name: "Security", slug: "security", sortOrder: 6, isDefault: false,
    skills: [
      { name: "Burp Suite", icon: "Shield", tooltip: "Security · Pentesting", order: 1 },
      { name: "Nmap", icon: "Shield", tooltip: "Security · Network Mapping", order: 2 },
      { name: "Metasploit", icon: "SiKalilinux", tooltip: "Security · Exploitation", order: 3 },
      { name: "OWASP", icon: "SiOwasp", tooltip: "Security · Guidelines", order: 4 },
    ],
  },
  {
    name: "Languages", slug: "languages", sortOrder: 7, isDefault: false,
    skills: [
      { name: "JavaScript", icon: "SiJavascript", tooltip: "Language · Web", order: 1 },
      { name: "Python", icon: "SiPython", tooltip: "Language · Scripting", order: 2 },
      { name: "C++", icon: "SiCplusplus", tooltip: "Language · Systems", order: 3 },
      { name: "Bash", icon: "SiGnubash", tooltip: "Language · Shell", order: 4 },
      { name: "DSA / OOP", icon: "Code2", tooltip: "Computer Science", order: 5 },
    ],
  },
];

/* -------------------------------------------------------------- projects */
// Card-level copy lives here; the deep detail-page fields come from data.json
// so nothing is retyped by hand.

const PROJECT_CARDS = [
  {
    slug: "devtinder", dataKey: "devtinder", title: "DevTinder",
    role: "Full Stack Developer Networking Platform",
    problem: "Developers needed a streamlined platform to find co-founders, mentors, and collaborators based on specific tech stacks and interests.",
    solution: "Built a swipe/request-based matching platform with robust REST APIs, achieving 99% uptime and low-latency matches.",
    outcome: "Successfully matched hundreds of developers with 99% platform uptime.",
    techCard: ["React.js", "Node.js", "Express.js", "MongoDB", "AWS EC2"],
    videoUrl: "/DevTinder.mp4", githubUrl: "#", demoUrl: "#", sortOrder: 1,
  },
  {
    slug: "clickcart", dataKey: "clickcart", title: "ClickCart",
    role: "Full Stack E-Commerce Platform",
    problem: "Small businesses needed an out-of-the-box e-commerce solution with integrated RBAC admin panels.",
    solution: "Developed a comprehensive platform featuring cart, secure checkout, order history, and a role-based admin dashboard.",
    outcome: "Reduced manual order processing time by integrating an automated checkout pipeline.",
    techCard: ["React.js", "Node.js", "Express.js", "MS SQL Server"],
    videoUrl: "", githubUrl: "#", demoUrl: "#", sortOrder: 2,
  },
  {
    slug: "food-ordering-web-app", dataKey: "food-ordering-web-app", title: "Food Ordering Web App",
    role: "Frontend Engineer",
    problem: "Users experienced slow load times and janky UI while searching for restaurants.",
    solution: "Implemented Shimmer UI for loading states, optimized search/filtering with Redux Toolkit, and wrote comprehensive Jest tests.",
    outcome: "Improved perceived performance and established a bug-free critical path.",
    techCard: ["React.js", "Redux Toolkit", "Tailwind CSS", "Jest"],
    videoUrl: "/SnapCart-Food-Cart.mp4", githubUrl: "#", demoUrl: "#", sortOrder: 3,
  },
];

/* ------------------------------------------------------------ experience */

const EXPERIENCES = [
  {
    role: "Full Stack Intern",
    company: "Futuresoft (India) Pvt. Ltd",
    duration: "Sep 2025 – Present",
    points: [
      "Built a Multi-Branch Inventory Management System and Client Billing & Subscription Monitor.",
      "Engineered role-based access control (RBAC) and secure JWT authentication workflows.",
      "Deployed scalable solutions on IIS with TFS version control.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MS SQL Server", "Sequelize"],
    impact: "Reduced manual tracking effort and eliminated missed payment incidents through automated monitoring.",
    sortOrder: 1, isCurrent: true,
  },
  {
    role: "Cyber Security Intern",
    company: "Antihak AI Cyber Security Pvt. Ltd",
    duration: "Nov 2024 – Feb 2025",
    points: [
      "Performed comprehensive Vulnerability Assessment and Penetration Testing (VAPT).",
      "Generated detailed, OWASP-aligned vulnerability reports.",
    ],
    stack: ["Burp Suite", "Nmap", "Metasploit", "OWASP"],
    impact: "Identified and documented critical security flaws, providing actionable remediation steps to fortify digital assets.",
    sortOrder: 2, isCurrent: false,
  },
];

/* -------------------------------------------------------------------- run */

async function main() {
  await sequelize.authenticate();
  console.log(`connected → ${process.env.DB_NAME}`);

  await sequelize.transaction(async (tx) => {
    // Content tables only. Messages, users and audit history survive re-seeds.
    const contentModels: ModelStatic<Model>[] = [
      SiteSetting, PageSection, SkillCategory, Project, Experience, BlogPost, Media,
    ];
    for (const M of contentModels) {
      await M.destroy({ where: {}, transaction: tx });
    }

    /* media */
    const media = await Media.bulkCreate(
      MEDIA_SEED.map((m) => ({ ...m, provider: "local" })),
      { transaction: tx, returning: true }
    );
    const byUrl = new Map(media.map((m) => [m.url, m]));
    console.log(`  media              ${media.length}`);

    /* site settings */
    await SiteSetting.create(
      {
        brandName: "Chaitanya",
        brandSuffix: ".",
        metaTitle: "Chaitanya Krishna | Full Stack Developer",
        metaDescription:
          "Portfolio of Paruchuri Chaitanya Krishna, a Full Stack Developer building premium, scalable web applications.",
        profilePhotoId: byUrl.get("/photo.jpeg")?.id ?? null,
        profilePhotoUrl: "/photo.jpeg",
        resumeUrl: RESUME,
        availabilityText: "Available for new opportunities",
        footerTagline: "Crafting beautiful digital products.",
        copyrightName: "Paruchuri Chaitanya Krishna",
        defaultTheme: "dark",
        navLinks: NAV_LINKS,
        socialLinks: SOCIAL_LINKS,
        buttons: BUTTONS,
        uiTexts: UI_TEXTS,
      },
      { transaction: tx }
    );
    console.log("  site_settings      1");

    /* sections */
    await PageSection.bulkCreate(
      SECTIONS.map((s) => ({ ...s, isVisible: true })),
      { transaction: tx }
    );
    console.log(`  page_sections      ${SECTIONS.length}`);

    /* skills */
    await SkillCategory.bulkCreate(
      SKILL_CATEGORIES.map((c) => ({ ...c, isVisible: true })),
      { transaction: tx }
    );
    console.log(`  skill_categories   ${SKILL_CATEGORIES.length}`);

    /* projects — card copy here, detail payload from data.json */
    const detail = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "src/data/data.json"), "utf8")
    ) as Record<string, ProjectDetailJson>;

    const projectRows = PROJECT_CARDS.map((p) => {
      const d = detail[p.dataKey] ?? {};
      return {
        slug: p.slug,
        title: p.title,
        role: p.role,
        category: d.category ?? "",
        problem: p.problem,
        solution: p.solution,
        outcome: p.outcome,
        description: d.description ?? "",
        overview: d.overview ?? "",
        about: d.about ?? "",
        videoUrl: p.videoUrl || d.video || null,
        githubUrl: p.githubUrl,
        demoUrl: p.demoUrl,
        techCard: p.techCard,
        techDetail: d.technologies ?? [],
        gallery: (d.gallery ?? []).map((url: string, i: number) => ({
          mediaId: byUrl.get(url)?.id ?? null,
          url,
          alt: `${p.title} screenshot ${i + 1}`,
          order: i + 1,
        })),
        features: (d.features ?? []).map((f, i) => ({ ...f, order: i + 1 })),
        architecture: (d.architecture ?? []).map((a, i) => ({ ...a, order: i + 1 })),
        points: {
          highlights: d.highlights ?? [],
          learnings: d.learnings ?? [],
          challenges: d.challenges ?? [],
        },
        projectInfo: d.projectInfo ?? {},
        sortOrder: p.sortOrder,
        isFeatured: true,
        isPublished: true,
      };
    });

    await Project.bulkCreate(projectRows, { transaction: tx });
    console.log(`  projects           ${projectRows.length}`);

    /* experience */
    await Experience.bulkCreate(EXPERIENCES, { transaction: tx });
    console.log(`  experiences        ${EXPERIENCES.length}`);

    /* blog — read the MDX files rather than retyping them */
    const postsDir = path.join(process.cwd(), "src/content/blog");
    const files = fs.existsSync(postsDir)
      ? fs.readdirSync(postsDir).filter((f) => /\.mdx?$/.test(f))
      : [];

    const posts = files.map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data, content } = matter(raw);
      const url = data.image ?? "/images/blog/inventory.jpg";
      return {
        slug: file.replace(/\.mdx?$/, ""),
        title: data.title ?? "Untitled",
        excerpt: data.excerpt ?? "",
        content,
        category: data.category ?? "General",
        tags: [],
        cover: {
          mediaId: byUrl.get(url)?.id ?? null,
          url,
          alt: data.title ?? "",
        },
        readTime: data.readTime ?? null,
        relatedSlugs: null,
        isFeatured: false,
        isPublished: true,
        publishedAt: new Date(data.date ?? Date.now()),
        viewCount: 0,
      };
    });

    // Preserve today's behaviour: newest post occupies the hero card.
    posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    if (posts.length) posts[0].isFeatured = true;

    await BlogPost.bulkCreate(posts, { transaction: tx });
    console.log(`  blog_posts         ${posts.length}`);
  });

  console.log("\nseed complete");
  await sequelize.close();
}

main().catch((err) => {
  console.error("seed failed —", err);
  process.exit(1);
});
