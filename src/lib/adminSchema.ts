/**
 * Describes every editable resource once. The list pages, edit forms and the
 * generic CRUD API all read from here.
 *
 * Plain data only — no model imports — because the client forms import it too.
 *
 * Structured types (list / objectList / keyValue / objectMap / group) exist so
 * JSONB columns get real inputs instead of a textarea full of braces.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "date"
  | "mdx"
  | "select"
  | "color"
  | "icon"
  | "media"
  | "json"
  // structured JSONB editors
  | "list"
  | "objectList"
  | "keyValue"
  | "objectMap"
  | "group";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  options?: string[];
  readOnly?: boolean;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  /** Sub-fields for objectList / objectMap / group. */
  itemFields?: FieldDef[];
  /** Which sub-field labels each row in an objectList. */
  itemTitleKey?: string;
  /** Singular noun for the "Add" button. */
  itemLabel?: string;
  /** Column labels for keyValue editors. */
  keyLabel?: string;
  valueLabel?: string;
  /** Width hint inside an object row: full row or half. */
  span?: "full" | "half";
  /** For media fields: the accept attribute on the file input. */
  accept?: string;
}

export interface ColumnDef {
  key: string;
  label: string;
  type?: "text" | "boolean" | "date" | "badge";
}

export interface ResourceDef {
  slug: string;
  label: string;
  singular: string;
  model: string;
  icon: string;
  description?: string;
  singleton?: boolean;
  canCreate: boolean;
  canDelete: boolean;
  orderBy: [string, "ASC" | "DESC"][];
  titleField: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  /** Groups the fields into labelled panels on the edit screen. */
  groups?: { title: string; description?: string; keys: string[] }[];
}

/* ------------------------------------------------------------ shared bits */

const ACCENTS = ["accent-coral", "accent-violet", "accent-pink", "foreground"];

const order: FieldDef = { key: "order", label: "Order", type: "number", span: "half" };

const boolField = (key: string, label: string, help?: string): FieldDef => ({
  key, label, type: "boolean", help,
});

/* --------------------------------------------------- nested sub-schemas */

const NAV_LINK_FIELDS: FieldDef[] = [
  { key: "label", label: "Label", type: "text", span: "half", required: true },
  { key: "href", label: "Link", type: "text", span: "half", placeholder: "/blog" },
  { key: "placement", label: "Shown in", type: "select", options: ["navbar", "footer"], span: "half" },
  order,
  { key: "icon", label: "Icon", type: "icon", span: "half" },
  { key: "isExternal", label: "Opens in a new tab", type: "boolean" },
  { key: "visible", label: "Visible", type: "boolean" },
];

const SOCIAL_FIELDS: FieldDef[] = [
  { key: "label", label: "Name", type: "text", span: "half", required: true },
  { key: "platform", label: "Key", type: "text", span: "half", help: "Lowercase identifier." },
  { key: "url", label: "Profile URL", type: "text" },
  { key: "icon", label: "Icon", type: "icon", span: "half", help: "Leave empty to show the text badge." },
  { key: "textBadge", label: "Text badge", type: "text", span: "half", placeholder: "TUF" },
  { key: "brandColor", label: "Brand colour", type: "color", span: "half", help: "A hex value, or “foreground” to follow the theme." },
  { key: "onBrandText", label: "Icon colour on fill", type: "select", options: ["white", "background", "inherit"], span: "half" },
  { key: "placements", label: "Show in", type: "list", itemLabel: "placement", help: "hero, contact, footer" },
  order,
];

const BUTTON_FIELDS: FieldDef[] = [
  { key: "label", label: "Button text", type: "text", required: true, span: "half" },
  { key: "href", label: "Link", type: "text", span: "half" },
  { key: "icon", label: "Icon", type: "icon", span: "half" },
  { key: "variant", label: "Style", type: "select", options: ["solid", "outline", "ghost", "violet", "link"], span: "half" },
  { key: "target", label: "Opens", type: "select", options: ["_self", "_blank"], span: "half" },
];

const SKILL_FIELDS: FieldDef[] = [
  { key: "name", label: "Skill", type: "text", span: "half", required: true },
  { key: "icon", label: "Icon", type: "icon", span: "half" },
  { key: "tooltip", label: "Tooltip", type: "text", placeholder: "Frontend · UI Development" },
  order,
];

const GALLERY_FIELDS: FieldDef[] = [
  { key: "url", label: "Image", type: "media", accept: "image/*", required: true },
  { key: "alt", label: "Alt text", type: "text", help: "Describes the image to screen readers." },
  order,
];

const FEATURE_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", type: "text", span: "half", required: true },
  { key: "icon", label: "Icon", type: "icon", span: "half" },
  { key: "description", label: "Description", type: "textarea", rows: 2 },
  { key: "color", label: "Accent", type: "select", options: ACCENTS, span: "half" },
  order,
];

const ARCHITECTURE_FIELDS: FieldDef[] = [
  { key: "name", label: "Layer", type: "text", required: true },
  { key: "color", label: "Accent", type: "select", options: ACCENTS, span: "half" },
  order,
];

/* -------------------------------------- page_sections content, per key */

const HERO_CONTENT: FieldDef[] = [
  {
    key: "roles", label: "Rotating job titles", type: "objectList", itemLabel: "title", itemTitleKey: "text",
    help: "Cycled under the heading.",
    itemFields: [
      { key: "text", label: "Title", type: "text", required: true },
      order,
    ],
  },
  {
    key: "stats", label: "Stat cards", type: "objectList", itemLabel: "stat", itemTitleKey: "value",
    itemFields: [
      { key: "value", label: "Number", type: "text", span: "half", required: true, placeholder: "10+" },
      { key: "icon", label: "Icon", type: "icon", span: "half" },
      { key: "labelTop", label: "Label line 1", type: "text", span: "half" },
      { key: "labelBottom", label: "Label line 2", type: "text", span: "half" },
      { key: "iconBgClass", label: "Icon background class", type: "text", help: "Tailwind classes; must be safelisted in globals.css." },
      order,
    ],
  },
  {
    key: "techIcons", label: "Floating tech icons", type: "objectList", itemLabel: "icon", itemTitleKey: "name",
    help: "The badges orbiting your photo.",
    itemFields: [
      { key: "name", label: "Name", type: "text", span: "half", required: true },
      { key: "icon", label: "Icon", type: "icon", span: "half" },
      { key: "colorClass", label: "Colour class", type: "text", span: "half" },
      { key: "shadowClass", label: "Glow class", type: "text", span: "half" },
      { key: "top", label: "Top position", type: "text", span: "half", placeholder: "5%" },
      { key: "left", label: "Left position", type: "text", span: "half", placeholder: "-5%" },
      { key: "delay", label: "Float delay (s)", type: "number", span: "half" },
      order,
    ],
  },
];

const ABOUT_CONTENT: FieldDef[] = [
  { key: "image", label: "Photo", type: "media", accept: "image/*", span: "half" },
  { key: "imageAlt", label: "Photo alt text", type: "text", span: "half" },
  {
    key: "cards", label: "Feature cards", type: "objectList", itemLabel: "card", itemTitleKey: "title",
    itemFields: [
      { key: "icon", label: "Emoji or icon", type: "text", span: "half" },
      { key: "title", label: "Title", type: "text", span: "half", required: true },
      { key: "subtitle", label: "Subtitle", type: "text" },
      { key: "description", label: "Description", type: "textarea", rows: 3 },
      order,
    ],
  },
  {
    key: "labels", label: "Floating labels", type: "objectList", itemLabel: "label", itemTitleKey: "label",
    help: "The pills around your photo.",
    itemFields: [
      { key: "label", label: "Text", type: "text", required: true, span: "half" },
      { key: "colorClass", label: "Colour class", type: "text", span: "half" },
      { key: "positionClass", label: "Position classes", type: "text" },
      { key: "floatDuration", label: "Float duration (s)", type: "number", span: "half" },
      order,
    ],
  },
  {
    key: "journey", label: "Timeline", type: "objectList", itemLabel: "milestone", itemTitleKey: "year",
    itemFields: [
      { key: "year", label: "Year", type: "text", span: "half", required: true },
      { key: "title", label: "Milestone", type: "text" },
      order,
    ],
  },
];

const SKILLS_CONTENT: FieldDef[] = [
  { key: "exploringLabel", label: "“Exploring” heading", type: "text", span: "half" },
  { key: "alsoWorkedLabel", label: "“Also worked with” heading", type: "text", span: "half" },
  {
    key: "tags", label: "Secondary tags", type: "objectList", itemLabel: "tag", itemTitleKey: "name",
    itemFields: [
      { key: "name", label: "Tag", type: "text", required: true, span: "half" },
      { key: "group", label: "Row", type: "select", options: ["exploring", "also_worked"], span: "half" },
      order,
    ],
  },
];

const PROJECTS_CONTENT: FieldDef[] = [
  { key: "problemLabel", label: "“Problem” label", type: "text", span: "half" },
  { key: "solutionLabel", label: "“Solution” label", type: "text", span: "half" },
  { key: "outcomeLabel", label: "“Outcome” label", type: "text", span: "half" },
];

const EXPERIENCE_CONTENT: FieldDef[] = [
  { key: "responsibilitiesLabel", label: "“Responsibilities” label", type: "text", span: "half" },
  { key: "impactLabel", label: "“Impact” label", type: "text", span: "half" },
  {
    key: "resumeCta", label: "Résumé call-to-action", type: "group",
    itemFields: [
      { key: "title", label: "Heading", type: "text" },
      { key: "description", label: "Description", type: "text" },
      { key: "href", label: "Résumé file", type: "media", accept: "application/pdf" },
    ],
  },
];

const ACHIEVEMENTS_CONTENT: FieldDef[] = [
  {
    key: "items", label: "Achievement cards", type: "objectList", itemLabel: "achievement", itemTitleKey: "title",
    itemFields: [
      { key: "title", label: "Title", type: "text", required: true, span: "half" },
      { key: "icon", label: "Icon", type: "icon", span: "half" },
      { key: "description", label: "Description", type: "textarea", rows: 3 },
      { key: "badgeLabel", label: "Badge", type: "text", span: "half" },
      { key: "color", label: "Accent", type: "select", options: ACCENTS, span: "half" },
      order,
    ],
  },
];

const CONTACT_CONTENT: FieldDef[] = [
  {
    key: "channels", label: "Contact methods", type: "objectList", itemLabel: "method", itemTitleKey: "value",
    itemFields: [
      { key: "type", label: "Kind", type: "select", options: ["email", "phone", "location"], span: "half" },
      { key: "icon", label: "Icon", type: "icon", span: "half" },
      { key: "value", label: "Shown as", type: "text", required: true },
      { key: "href", label: "Link", type: "text", help: "mailto:… or tel:…" },
      { key: "label", label: "Internal label", type: "text", span: "half" },
      { key: "hoverColor", label: "Hover accent", type: "select", options: ACCENTS, span: "half" },
      order,
    ],
  },
  {
    key: "form", label: "Contact form", type: "group",
    itemFields: [
      { key: "nameLabel", label: "Name label", type: "text", span: "half" },
      { key: "namePlaceholder", label: "Name placeholder", type: "text", span: "half" },
      { key: "emailLabel", label: "Email label", type: "text", span: "half" },
      { key: "emailPlaceholder", label: "Email placeholder", type: "text", span: "half" },
      { key: "messageLabel", label: "Message label", type: "text", span: "half" },
      { key: "messagePlaceholder", label: "Message placeholder", type: "text", span: "half" },
      { key: "submitLabel", label: "Submit button", type: "text", span: "half" },
      { key: "successMessage", label: "Success message", type: "textarea", rows: 2 },
      { key: "errorMessage", label: "Error message", type: "textarea", rows: 2 },
    ],
  },
];

const BLOG_CONTENT: FieldDef[] = [
  {
    key: "meta", label: "Page metadata", type: "group",
    itemFields: [
      { key: "title", label: "Browser title", type: "text" },
      { key: "description", label: "Meta description", type: "textarea", rows: 2 },
    ],
  },
  {
    key: "listing", label: "Blog index labels", type: "group",
    itemFields: [
      { key: "featuredLabel", label: "Featured heading", type: "text", span: "half" },
      { key: "gridLabel", label: "Grid heading", type: "text", span: "half" },
      { key: "viewAllLabel", label: "“View all” text", type: "text", span: "half" },
      { key: "readLabel", label: "“Read” link text", type: "text", span: "half" },
      { key: "emptyLabel", label: "Empty state", type: "text" },
    ],
  },
  {
    key: "detail", label: "Article page labels", type: "group",
    itemFields: [
      { key: "backLabel", label: "Back link", type: "text", span: "half" },
      { key: "relatedLabel", label: "Related heading", type: "text", span: "half" },
      { key: "shareLabel", label: "Share button", type: "text", span: "half" },
      { key: "moreLabel", label: "More button", type: "text", span: "half" },
      { key: "outroText", label: "Closing line", type: "textarea", rows: 2 },
    ],
  },
  {
    key: "shareTargets", label: "Share buttons", type: "objectList", itemLabel: "network", itemTitleKey: "platform",
    itemFields: [
      { key: "platform", label: "Network", type: "text", required: true, span: "half" },
      { key: "icon", label: "Icon", type: "icon", span: "half" },
      { key: "urlTemplate", label: "Share URL", type: "text", help: "Use {url} and {title} as placeholders." },
      { key: "hoverColor", label: "Hover accent", type: "select", options: ACCENTS, span: "half" },
      order,
    ],
  },
];

export const SECTION_CONTENT_SCHEMAS: Record<string, FieldDef[]> = {
  hero: HERO_CONTENT,
  about: ABOUT_CONTENT,
  skills: SKILLS_CONTENT,
  projects: PROJECTS_CONTENT,
  experience: EXPERIENCE_CONTENT,
  achievements: ACHIEVEMENTS_CONTENT,
  contact: CONTACT_CONTENT,
  blog: BLOG_CONTENT,
};

/* ------------------------------------------------------------ resources */

export const RESOURCES: ResourceDef[] = [
  {
    slug: "settings",
    label: "Site settings",
    singular: "Site settings",
    model: "SiteSetting",
    icon: "Sparkles",
    description: "Brand, metadata, navigation, buttons and reusable labels.",
    singleton: true,
    canCreate: false,
    canDelete: false,
    orderBy: [["createdAt", "ASC"]],
    titleField: "brandName",
    columns: [],
    groups: [
      { title: "Brand", keys: ["brandName", "brandSuffix", "profilePhotoUrl", "resumeUrl", "defaultTheme"] },
      { title: "Search & sharing", keys: ["metaTitle", "metaDescription"] },
      { title: "Wording", keys: ["availabilityText", "footerTagline", "copyrightName"] },
      { title: "Navigation", description: "Links in the header and footer.", keys: ["navLinks"] },
      { title: "Social profiles", keys: ["socialLinks"] },
      { title: "Buttons", description: "Every call-to-action label and where it points.", keys: ["buttons"] },
      { title: "Interface labels", description: "Small pieces of wording reused across the site.", keys: ["uiTexts"] },
    ],
    fields: [
      { key: "brandName", label: "Brand name", type: "text", required: true, span: "half", help: "Shown in the navbar and footer." },
      { key: "brandSuffix", label: "Accent character", type: "text", span: "half", help: "The coloured character after the name." },
      { key: "profilePhotoUrl", label: "Profile photo", type: "media", accept: "image/*", span: "half" },
      { key: "resumeUrl", label: "Résumé (PDF)", type: "media", accept: "application/pdf", span: "half" },
      { key: "defaultTheme", label: "Default theme", type: "select", options: ["dark", "light", "system"], span: "half" },
      { key: "metaTitle", label: "Browser title", type: "text", required: true },
      { key: "metaDescription", label: "Meta description", type: "textarea", rows: 3 },
      { key: "availabilityText", label: "Availability badge", type: "text", help: "The pill above the hero heading." },
      { key: "footerTagline", label: "Footer tagline", type: "text" },
      { key: "copyrightName", label: "Copyright name", type: "text" },
      {
        key: "navLinks", label: "Navigation links", type: "objectList",
        itemLabel: "link", itemTitleKey: "label", itemFields: NAV_LINK_FIELDS,
      },
      {
        key: "socialLinks", label: "Social profiles", type: "objectList",
        itemLabel: "profile", itemTitleKey: "label", itemFields: SOCIAL_FIELDS,
      },
      {
        key: "buttons", label: "Buttons", type: "objectMap",
        itemLabel: "button", itemFields: BUTTON_FIELDS, keyLabel: "Button key",
        help: "The key is referenced in code — renaming one falls back to a default label.",
      },
      {
        key: "uiTexts", label: "Interface labels", type: "keyValue",
        keyLabel: "Key", valueLabel: "Text", itemLabel: "label",
      },
    ],
  },
  {
    slug: "sections",
    label: "Page sections",
    singular: "Section",
    model: "PageSection",
    icon: "Layout",
    description: "Headings and content for each block of the home page.",
    canCreate: true,
    canDelete: true,
    orderBy: [["sortOrder", "ASC"]],
    titleField: "key",
    columns: [
      { key: "key", label: "Section", type: "badge" },
      { key: "title", label: "Heading" },
      { key: "sortOrder", label: "Order" },
      { key: "isVisible", label: "Visible", type: "boolean" },
    ],
    groups: [
      { title: "Heading", keys: ["key", "eyebrow", "title", "titleHighlight", "description"] },
      { title: "Content", description: "The fields below change depending on which section this is.", keys: ["content"] },
      { title: "Display", keys: ["sortOrder", "isVisible"] },
    ],
    fields: [
      { key: "key", label: "Section key", type: "text", required: true, span: "half", help: "Referenced in code — renaming hides the section until the code matches." },
      { key: "sortOrder", label: "Order", type: "number", span: "half" },
      { key: "eyebrow", label: "Eyebrow", type: "text", span: "half", help: "Small uppercase label above the heading." },
      { key: "title", label: "Heading", type: "text", span: "half", help: "The plain part." },
      { key: "titleHighlight", label: "Highlighted words", type: "text", span: "half", help: "Rendered in the gradient." },
      { key: "description", label: "Description", type: "textarea", rows: 4 },
      { key: "content", label: "Section content", type: "group", itemFields: [] },
      boolField("isVisible", "Visible on the site"),
    ],
  },
  {
    slug: "skills",
    label: "Skills",
    singular: "Skill category",
    model: "SkillCategory",
    icon: "Cpu",
    description: "Categories and the technologies orbiting each one.",
    canCreate: true,
    canDelete: true,
    orderBy: [["sortOrder", "ASC"]],
    titleField: "name",
    columns: [
      { key: "name", label: "Category" },
      { key: "slug", label: "Slug", type: "badge" },
      { key: "sortOrder", label: "Order" },
      { key: "isDefault", label: "Default", type: "boolean" },
      { key: "isVisible", label: "Visible", type: "boolean" },
    ],
    groups: [
      { title: "Category", keys: ["name", "slug", "sortOrder", "isDefault", "isVisible"] },
      { title: "Skills", description: "Each becomes a node in the orbit.", keys: ["skills"] },
    ],
    fields: [
      { key: "name", label: "Category name", type: "text", required: true, span: "half" },
      { key: "slug", label: "Slug", type: "text", required: true, span: "half" },
      { key: "sortOrder", label: "Order", type: "number", span: "half" },
      boolField("isDefault", "Opens by default", "The category shown when the section loads."),
      boolField("isVisible", "Visible"),
      {
        key: "skills", label: "Skills", type: "objectList",
        itemLabel: "skill", itemTitleKey: "name", itemFields: SKILL_FIELDS,
      },
    ],
  },
  {
    slug: "projects",
    label: "Projects",
    singular: "Project",
    model: "Project",
    icon: "Briefcase",
    description: "Home page cards and the full detail pages.",
    canCreate: true,
    canDelete: true,
    orderBy: [["sortOrder", "ASC"]],
    titleField: "title",
    columns: [
      { key: "title", label: "Project" },
      { key: "slug", label: "Slug", type: "badge" },
      { key: "sortOrder", label: "Order" },
      { key: "isFeatured", label: "Featured", type: "boolean" },
      { key: "isPublished", label: "Published", type: "boolean" },
    ],
    groups: [
      { title: "Basics", keys: ["title", "slug", "role", "category", "sortOrder", "isFeatured", "isPublished"] },
      { title: "Home page card", description: "The three-part story shown in the carousel.", keys: ["problem", "solution", "outcome", "techCard"] },
      { title: "Detail page", keys: ["description", "overview", "about", "techDetail"] },
      { title: "Links & media", keys: ["videoUrl", "demoUrl", "githubUrl", "gallery"] },
      { title: "Features", keys: ["features"] },
      { title: "Architecture", keys: ["architecture"] },
      { title: "Highlights, learnings & challenges", keys: ["points"] },
      { title: "Project info panel", keys: ["projectInfo"] },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, span: "half" },
      { key: "slug", label: "Slug", type: "text", required: true, span: "half", help: "The URL: /projects/<slug>" },
      { key: "role", label: "Your role", type: "text", span: "half" },
      { key: "category", label: "Category", type: "text", span: "half" },
      { key: "sortOrder", label: "Order", type: "number", span: "half" },
      boolField("isFeatured", "Show in the home carousel"),
      boolField("isPublished", "Published"),
      { key: "problem", label: "The problem", type: "textarea", rows: 3 },
      { key: "solution", label: "The solution", type: "textarea", rows: 3 },
      { key: "outcome", label: "Measurable outcome", type: "textarea", rows: 2 },
      { key: "techCard", label: "Tech chips on the card", type: "list", itemLabel: "technology" },
      { key: "description", label: "Short description", type: "textarea", rows: 3 },
      { key: "overview", label: "Overview", type: "textarea", rows: 4 },
      { key: "about", label: "About the project", type: "textarea", rows: 5 },
      { key: "techDetail", label: "Tech chips on the detail page", type: "list", itemLabel: "technology" },
      { key: "videoUrl", label: "Showcase video", type: "media", accept: "video/*", help: "Autoplays on the home page card." },
      { key: "demoUrl", label: "Live demo", type: "text", span: "half" },
      { key: "githubUrl", label: "Source code", type: "text", span: "half" },
      { key: "gallery", label: "Gallery", type: "objectList", itemLabel: "image", itemTitleKey: "url", itemFields: GALLERY_FIELDS },
      { key: "features", label: "Feature grid", type: "objectList", itemLabel: "feature", itemTitleKey: "title", itemFields: FEATURE_FIELDS },
      { key: "architecture", label: "Architecture layers", type: "objectList", itemLabel: "layer", itemTitleKey: "name", itemFields: ARCHITECTURE_FIELDS },
      {
        key: "points", label: "Bullet lists", type: "group",
        itemFields: [
          { key: "highlights", label: "Key highlights", type: "list", itemLabel: "highlight" },
          { key: "learnings", label: "What you learned", type: "list", itemLabel: "learning" },
          { key: "challenges", label: "Challenges", type: "list", itemLabel: "challenge" },
        ],
      },
      {
        key: "projectInfo", label: "Info panel", type: "group",
        itemFields: [
          { key: "role", label: "Role", type: "text", span: "half" },
          { key: "duration", label: "Duration", type: "text", span: "half" },
          { key: "team", label: "Team size", type: "text", span: "half" },
          { key: "liveDemo", label: "Live demo", type: "text", span: "half" },
          { key: "sourceCode", label: "Source code", type: "text" },
        ],
      },
    ],
  },
  {
    slug: "experiences",
    label: "Experience",
    singular: "Role",
    model: "Experience",
    icon: "Server",
    description: "Your professional history.",
    canCreate: true,
    canDelete: true,
    orderBy: [["sortOrder", "ASC"]],
    titleField: "company",
    columns: [
      { key: "company", label: "Company" },
      { key: "role", label: "Role" },
      { key: "duration", label: "Duration" },
      { key: "sortOrder", label: "Order" },
    ],
    groups: [
      { title: "Position", keys: ["company", "role", "companyUrl", "duration", "sortOrder", "isCurrent"] },
      { title: "What you did", keys: ["points", "impact"] },
      { title: "Technologies", keys: ["stack"] },
    ],
    fields: [
      { key: "company", label: "Company", type: "text", required: true, span: "half" },
      { key: "role", label: "Role", type: "text", required: true, span: "half" },
      { key: "companyUrl", label: "Company website", type: "text", span: "half" },
      { key: "duration", label: "Duration", type: "text", span: "half", placeholder: "Sep 2025 – Present" },
      { key: "sortOrder", label: "Order", type: "number", span: "half" },
      boolField("isCurrent", "Current role"),
      { key: "points", label: "Key responsibilities", type: "list", itemLabel: "responsibility" },
      { key: "impact", label: "Measurable impact", type: "textarea", rows: 3 },
      { key: "stack", label: "Tech stack", type: "list", itemLabel: "technology" },
    ],
  },
  {
    slug: "blog",
    label: "Blog posts",
    singular: "Post",
    model: "BlogPost",
    icon: "BookOpen",
    description: "Articles, written in Markdown.",
    canCreate: true,
    canDelete: true,
    orderBy: [["publishedAt", "DESC"]],
    titleField: "title",
    columns: [
      { key: "title", label: "Post" },
      { key: "category", label: "Category", type: "badge" },
      { key: "publishedAt", label: "Published", type: "date" },
      { key: "isFeatured", label: "Featured", type: "boolean" },
      { key: "isPublished", label: "Live", type: "boolean" },
    ],
    groups: [
      { title: "Article", keys: ["title", "slug", "excerpt", "category", "publishedAt", "readTime"] },
      { title: "Body", description: "Markdown. Headings, lists, links and code blocks all work.", keys: ["content"] },
      { title: "Cover image", keys: ["cover"] },
      { title: "Publishing", keys: ["isFeatured", "isPublished", "tags", "relatedSlugs", "viewCount"] },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", required: true, span: "half", help: "The URL: /blog/<slug>" },
      { key: "category", label: "Category", type: "text", span: "half" },
      { key: "excerpt", label: "Excerpt", type: "textarea", rows: 3, help: "Shown on cards and under the title." },
      { key: "publishedAt", label: "Publish date", type: "date", required: true, span: "half" },
      { key: "readTime", label: "Read time", type: "text", span: "half", help: "Leave empty to calculate from word count." },
      { key: "content", label: "Body", type: "mdx", rows: 26 },
      {
        key: "cover", label: "Cover image", type: "group",
        itemFields: [
          { key: "url", label: "Image", type: "media", accept: "image/*" },
          { key: "alt", label: "Alt text", type: "text", help: "Describes the image to screen readers." },
        ],
      },
      boolField("isFeatured", "Pin to the featured slot", "Otherwise the newest post is featured."),
      boolField("isPublished", "Published"),
      { key: "tags", label: "Tags", type: "list", itemLabel: "tag" },
      { key: "relatedSlugs", label: "Related posts", type: "list", itemLabel: "slug", help: "Leave empty to pick recent posts in the same category." },
      { key: "viewCount", label: "Views", type: "number", readOnly: true, span: "half" },
    ],
  },
  {
    slug: "media",
    label: "Media",
    singular: "Media item",
    model: "Media",
    icon: "Database",
    description: "Everything you have uploaded. Drop new files in from here or from any image field.",
    // Rows are created by uploading, never by hand.
    canCreate: false,
    canDelete: true,
    orderBy: [["createdAt", "DESC"]],
    titleField: "url",
    columns: [
      { key: "url", label: "File" },
      { key: "type", label: "Type", type: "badge" },
      { key: "folder", label: "Folder" },
      { key: "isArchived", label: "Archived", type: "boolean" },
    ],
    fields: [
      { key: "url", label: "File", type: "media", required: true },
      { key: "altText", label: "Alt text", type: "text", help: "Describes the image to screen readers." },
      { key: "folder", label: "Folder", type: "text", span: "half" },
      { key: "type", label: "Type", type: "select", options: ["image", "video", "document"], span: "half", readOnly: true },
      { key: "format", label: "Format", type: "text", span: "half", readOnly: true },
      { key: "provider", label: "Stored on", type: "text", span: "half", readOnly: true },
      { key: "width", label: "Width", type: "number", span: "half", readOnly: true },
      { key: "height", label: "Height", type: "number", span: "half", readOnly: true },
      boolField("isArchived", "Archived", "Hidden from pickers; existing references keep working."),
    ],
  },
  {
    slug: "messages",
    label: "Inbox",
    singular: "Message",
    model: "ContactMessage",
    icon: "Mail",
    description: "Enquiries from the contact form.",
    canCreate: false,
    canDelete: true,
    orderBy: [["createdAt", "DESC"]],
    titleField: "name",
    columns: [
      { key: "name", label: "From" },
      { key: "email", label: "Email" },
      { key: "status", label: "Status", type: "badge" },
      { key: "createdAt", label: "Received", type: "date" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", readOnly: true, span: "half" },
      { key: "email", label: "Email", type: "text", readOnly: true, span: "half" },
      { key: "subject", label: "Subject", type: "text", readOnly: true },
      { key: "message", label: "Message", type: "textarea", rows: 10, readOnly: true },
      { key: "status", label: "Status", type: "select", options: ["new", "read", "replied", "spam"], span: "half" },
      { key: "createdAt", label: "Received", type: "date", readOnly: true, span: "half" },
    ],
  },
];

export function getResource(slug: string): ResourceDef | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}

/**
 * Page sections share one `content` column whose shape depends on the row's
 * key, so the editable sub-fields are resolved per record rather than declared
 * statically. Falls back to a raw JSON editor for an unrecognised key.
 */
export function resolveFields(resource: ResourceDef, row: Record<string, unknown>): FieldDef[] {
  if (resource.slug !== "sections") return resource.fields;

  const schema = SECTION_CONTENT_SCHEMAS[String(row.key ?? "")];

  return resource.fields.map((f) => {
    if (f.key !== "content") return f;
    if (!schema) {
      return {
        ...f,
        type: "json" as FieldType,
        rows: 18,
        help: "No structured editor for this section key yet — edit the raw data carefully.",
      };
    }
    return { ...f, itemFields: schema };
  });
}

/** Fields the API is allowed to write for a resource. */
export function writableKeys(resource: ResourceDef): string[] {
  return resource.fields.filter((f) => !f.readOnly).map((f) => f.key);
}

/** Structured JSONB editors send real objects, so no JSON.parse is needed. */
export const STRUCTURED_TYPES: FieldType[] = ["list", "objectList", "keyValue", "objectMap", "group"];

export function isStructured(type: FieldType): boolean {
  return STRUCTURED_TYPES.includes(type);
}
