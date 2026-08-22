import type { CSSProperties } from "react";
import type { SocialLink } from "@/types/content";

/**
 * Social buttons mix two kinds of colour, and they can't be handled the same
 * way:
 *
 *  - "foreground" is a theme token. It has to stay a Tailwind class so it keeps
 *    inverting between light and dark — GitHub's mark relies on this.
 *  - A hex value is a fixed brand colour. Those go through inline styles and a
 *    CSS variable, which also keeps them out of Tailwind's safelist problem.
 */

// Literal classes so Tailwind can see them.
const ON_BRAND_TEXT: Record<string, string> = {
  background: "text-background",
  white: "text-white",
  inherit: "",
};

const ON_BRAND_TEXT_HOVER: Record<string, string> = {
  background: "hover:text-background",
  white: "hover:text-white",
  inherit: "",
};

export function isThemeToken(brandColor?: string | null): boolean {
  return !brandColor || !brandColor.startsWith("#");
}

/** Solid filled circle, as used in the hero. */
export function solidSocial(social: SocialLink): {
  className: string;
  style?: CSSProperties;
  glowClassName: string;
  glowStyle?: CSSProperties;
} {
  const text = ON_BRAND_TEXT[social.onBrandText ?? "white"] ?? "";

  if (isThemeToken(social.brandColor)) {
    return {
      className: `bg-foreground ${text || "text-background"}`,
      glowClassName: "bg-foreground/40",
    };
  }

  return {
    className: text || "text-white",
    style: { backgroundColor: social.brandColor as string },
    glowClassName: "",
    // "80" is 50% alpha, matching the /50 the original markup used.
    glowStyle: { backgroundColor: `${social.brandColor}80` },
  };
}

/** Outlined circle that fills on hover, as used in the contact section. */
export function hoverSocial(social: SocialLink): {
  className: string;
  style?: CSSProperties;
} {
  if (isThemeToken(social.brandColor)) {
    return { className: "hover:bg-foreground hover:text-background" };
  }

  const text = ON_BRAND_TEXT_HOVER[social.onBrandText ?? "inherit"] ?? "";

  return {
    className: `hover:bg-[var(--brand)] hover:border-[var(--brand)] ${text}`,
    style: { "--brand": social.brandColor } as CSSProperties,
  };
}
