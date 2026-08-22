/**
 * Shapes for every JSONB payload in the schema.
 *
 * Postgres does not validate the inside of a JSONB column, so these interfaces
 * (and the Zod schemas in src/lib/validation.ts) are the actual contract.
 */

/* ---------- site_settings ---------- */

export interface NavLink {
  label: string;
  href: string;
  placement: "navbar" | "footer";
  isExternal?: boolean;
  icon?: string | null;
  order: number;
  visible: boolean;
}

export interface SocialLink {
  platform: string;
  label: string;
  url: string;
  icon?: string | null;
  /**
   * Either a hex value ("#0077b5") for a brand colour, or the literal token
   * "foreground" to follow the theme the way GitHub's mark does.
   */
  brandColor?: string | null;
  /** Icon colour once the brand fill is applied. */
  onBrandText?: "background" | "white" | "inherit";
  textBadge?: string | null;
  placements: string[];
  order: number;
}

export interface ButtonDef {
  label: string;
  href?: string | null;
  icon?: string | null;
  variant?: string;
  target?: "_self" | "_blank";
}

export type ButtonMap = Record<string, ButtonDef>;
export type TextMap = Record<string, string>;

/* ---------- page_sections.content ---------- */

export interface HeroRole {
  text: string;
  order: number;
}

export interface HeroStat {
  icon: string;
  iconBgClass: string;
  value: string;
  labelTop: string;
  labelBottom: string;
  order: number;
}

export interface HeroTechIcon {
  icon: string;
  name: string;
  colorClass: string;
  shadowClass: string;
  top: string;
  left: string;
  delay: number;
  order: number;
}

export interface AboutCard {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  order: number;
}

export interface AboutLabel {
  label: string;
  colorClass: string;
  positionClass: string;
  floatDuration: number;
  order: number;
}

export interface JourneyNode {
  year: string;
  title: string;
  order: number;
}

export interface SkillTag {
  group: "exploring" | "also_worked";
  name: string;
  order: number;
}

export interface AchievementItem {
  icon: string;
  title: string;
  description: string;
  badgeLabel: string;
  color: string;
  order: number;
}

export interface ContactChannel {
  type: "email" | "phone" | "location";
  label: string;
  value: string;
  href: string;
  icon: string;
  hoverColor: string;
  order: number;
}

export interface ShareTarget {
  platform: string;
  icon: string;
  urlTemplate: string;
  hoverColor: string;
  order: number;
}

export interface HeroContent {
  roles: HeroRole[];
  stats: HeroStat[];
  techIcons: HeroTechIcon[];
}

export interface AboutContent {
  cards: AboutCard[];
  labels: AboutLabel[];
  journey: JourneyNode[];
  image: string;
  imageAlt: string;
}

export interface SkillsContent {
  tags: SkillTag[];
}

export interface AchievementsContent {
  items: AchievementItem[];
}

export interface ContactContent {
  channels: ContactChannel[];
  form: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    successMessage: string;
    errorMessage: string;
  };
}

export interface ExperienceContent {
  responsibilitiesLabel: string;
  impactLabel: string;
  resumeCta: {
    title: string;
    description: string;
    href: string;
  };
}

export interface ProjectsContent {
  problemLabel: string;
  solutionLabel: string;
  outcomeLabel: string;
}

export interface BlogContent {
  meta: { title: string; description: string };
  listing: {
    featuredLabel: string;
    gridLabel: string;
    viewAllLabel: string;
    emptyLabel: string;
    readLabel: string;
  };
  detail: {
    backLabel: string;
    outroText: string;
    shareLabel: string;
    moreLabel: string;
    relatedLabel: string;
  };
  shareTargets: ShareTarget[];
}

export type SectionContent =
  | HeroContent
  | AboutContent
  | SkillsContent
  | AchievementsContent
  | ContactContent
  | ExperienceContent
  | ProjectsContent
  | BlogContent
  | Record<string, unknown>;

export interface PageSectionData {
  id: string;
  key: string;
  eyebrow: string | null;
  title: string | null;
  titleHighlight: string | null;
  description: string | null;
  content: SectionContent;
  sortOrder: number;
  isVisible: boolean;
}

/* ---------- skill_categories ---------- */

export interface SkillItem {
  name: string;
  icon: string;
  tooltip: string;
  order: number;
}

/* ---------- projects ---------- */

export interface GalleryItem {
  mediaId: string | null;
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  order: number;
}

export interface ProjectFeature {
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

export interface ArchitectureLayer {
  name: string;
  color: string;
  order: number;
}

export interface ProjectPoints {
  highlights: string[];
  learnings: string[];
  challenges: string[];
}

export interface ProjectInfo {
  role: string;
  duration: string;
  team: string;
  liveDemo: string;
  sourceCode: string;
}

/* ---------- blog ---------- */

export interface BlogCover {
  mediaId: string | null;
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
}
