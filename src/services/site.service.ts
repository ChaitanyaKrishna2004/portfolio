import "server-only";
import { cache } from "react";
import { SiteSetting, PageSection } from "@/models";
import type {
  ButtonDef, ButtonMap, NavLink, PageSectionData, SocialLink, TextMap,
} from "@/types/content";

export interface SiteData {
  brandName: string;
  brandSuffix: string;
  metaTitle: string;
  metaDescription: string;
  profilePhotoUrl: string;
  resumeUrl: string;
  availabilityText: string;
  footerTagline: string;
  copyrightName: string;
  defaultTheme: string;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  buttons: ButtonMap;
  uiTexts: TextMap;
}

/**
 * `cache()` dedupes within a single render pass, so a page that needs site
 * settings in three components still issues one query.
 */
export const getSiteSettings = cache(async (): Promise<SiteData> => {
  const row = await SiteSetting.findOne({ order: [["createdAt", "ASC"]] });

  if (!row) {
    throw new Error("site_settings is empty — run `npm run db:seed`.");
  }

  return {
    brandName: row.brandName,
    brandSuffix: row.brandSuffix ?? ".",
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription ?? "",
    profilePhotoUrl: row.profilePhotoUrl ?? "/photo.jpeg",
    resumeUrl: row.resumeUrl ?? "#",
    availabilityText: row.availabilityText ?? "",
    footerTagline: row.footerTagline ?? "",
    copyrightName: row.copyrightName ?? row.brandName,
    defaultTheme: row.defaultTheme ?? "dark",
    navLinks: (row.navLinks ?? []).filter((l) => l.visible).sort((a, b) => a.order - b.order),
    socialLinks: (row.socialLinks ?? []).slice().sort((a, b) => a.order - b.order),
    buttons: row.buttons ?? {},
    uiTexts: row.uiTexts ?? {},
  };
});

export const getNavLinks = cache(async (placement: "navbar" | "footer" = "navbar") => {
  const site = await getSiteSettings();
  return site.navLinks.filter((l) => l.placement === placement);
});

export const getSocialLinks = cache(async (placement?: string) => {
  const site = await getSiteSettings();
  return placement
    ? site.socialLinks.filter((s) => s.placements?.includes(placement))
    : site.socialLinks;
});

/** Never throws — a missing key renders the fallback instead of blanking the UI. */
export function button(map: ButtonMap, key: string, fallback?: Partial<ButtonDef>): ButtonDef {
  return map[key] ?? { label: fallback?.label ?? "", ...fallback };
}

export function text(map: TextMap, key: string, fallback = ""): string {
  return map[key] ?? fallback;
}

/* ---------- page sections ---------- */

function toPlain(row: PageSection): PageSectionData {
  return {
    id: row.id,
    key: row.key,
    eyebrow: row.eyebrow,
    title: row.title,
    titleHighlight: row.titleHighlight,
    description: row.description,
    content: row.content ?? {},
    sortOrder: row.sortOrder,
    isVisible: row.isVisible,
  };
}

export const getAllSections = cache(async (): Promise<Record<string, PageSectionData>> => {
  const rows = await PageSection.findAll({ order: [["sortOrder", "ASC"]] });
  return Object.fromEntries(rows.map((r) => [r.key, toPlain(r)]));
});

export const getSection = cache(async <T = Record<string, unknown>>(key: string) => {
  const row = await PageSection.findOne({ where: { key } });
  if (!row) {
    throw new Error(`page_sections has no row for "${key}" — run \`npm run db:seed\`.`);
  }
  const plain = toPlain(row);
  return plain as PageSectionData & { content: T };
});
