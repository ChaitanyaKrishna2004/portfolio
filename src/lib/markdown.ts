import { marked } from "marked";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

/**
 * The blog stores Markdown, because MDXRemote renders it and the original
 * .mdx files were written that way. The admin editor is visual, so it needs a
 * lossless-enough round trip in both directions.
 *
 * Markdown stays the source of truth — HTML only ever exists inside the editor.
 */

marked.setOptions({
  gfm: true,
  breaks: false,
});

export function markdownToHtml(markdown: string): string {
  if (!markdown?.trim()) return "";
  const html = marked.parse(markdown, { async: false }) as string;

  // Alignment is stored as align="center" (see the turndown rule below).
  // TipTap's TextAlign extension reads style.textAlign, so translate on the
  // way in — this is what makes alignment survive a reload.
  return html.replace(
    /\salign="(left|center|right|justify)"/gi,
    (_m, dir) => ` style="text-align: ${dir}"`
  );
}

let turndown: TurndownService | null = null;

function getTurndown(): TurndownService {
  if (turndown) return turndown;

  turndown = new TurndownService({
    headingStyle: "atx",           // "## Heading", not underlines
    bulletListMarker: "-",         // matches the existing posts
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    strongDelimiter: "**",
    linkStyle: "inlined",
  });

  // Tables, strikethrough and task lists.
  turndown.use(gfm);

  // Turndown pads list items to "-   item" (marker + 3 spaces). The existing
  // posts use "- item", so match that and keep diffs clean.
  turndown.addRule("tightListItem", {
    filter: "li",
    replacement: (content, node, options) => {
      const body = content
        .replace(/^\n+/, "")
        .replace(/\n+$/, "\n")
        .replace(/\n/gm, "\n  ");

      const parent = node.parentNode as HTMLElement | null;
      let prefix = `${options.bulletListMarker} `;

      if (parent?.nodeName === "OL") {
        const start = parent.getAttribute("start");
        const index = Array.prototype.indexOf.call(parent.children, node);
        prefix = `${start ? Number(start) + index : index + 1}. `;
      }

      const needsBreak = node.nextSibling && !/\n$/.test(body);
      return prefix + body + (needsBreak ? "\n" : "");
    },
  });

  // Turndown drops underline (no Markdown equivalent); keep it as raw HTML so
  // the intent survives a round trip rather than silently vanishing.
  turndown.addRule("underline", {
    filter: ["u"],
    replacement: (content) => (content ? `<u>${content}</u>` : ""),
  });

  // Markdown has no alignment syntax, so it is emitted as raw HTML.
  //
  // It must be align="center", NOT style="text-align: center": the blog renders
  // through MDX, where an inline style has to be a JS object, and a string
  // would be a build-time error. `align` is a plain string attribute that MDX,
  // React and browsers all accept.
  turndown.addRule("alignedBlock", {
    filter: (node) => {
      if (node.nodeName !== "P" && !/^H[1-6]$/.test(node.nodeName)) return false;
      const align = (node as HTMLElement).style?.textAlign;
      return !!align && align !== "left" && align !== "start";
    },
    replacement: (content, node) => {
      const el = node as HTMLElement;
      const tag = el.nodeName.toLowerCase();
      return `\n\n<${tag} align="${el.style.textAlign}">${content}</${tag}>\n\n`;
    },
  });

  return turndown;
}

export function htmlToMarkdown(html: string): string {
  if (!html?.trim()) return "";
  // TipTap emits an empty paragraph for a blank document.
  if (html === "<p></p>") return "";
  return getTurndown()
    .turndown(html)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Rough reading time, matching the blog service's 200 wpm. */
export function wordCount(markdown: string): number {
  return markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
}
