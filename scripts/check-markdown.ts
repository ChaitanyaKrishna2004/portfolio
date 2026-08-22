// Loads every stored post, converts Markdown -> HTML -> Markdown, and reports
// what a save through the visual editor would change.
import { JSDOM } from "jsdom";

// Turndown needs a DOM. The browser supplies one; a CLI script does not.
const dom = new JSDOM("");
Object.assign(globalThis, {
  DOMParser: dom.window.DOMParser,
  document: dom.window.document,
  Node: dom.window.Node,
});

import { sequelize, BlogPost } from "../src/models";
import { markdownToHtml, htmlToMarkdown } from "../src/lib/markdown";

function norm(s: string) {
  return s.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

(async () => {
  const posts = await BlogPost.findAll({ order: [["slug", "ASC"]] });
  let issues = 0;

  for (const p of posts) {
    const before = norm(p.content);
    const after = norm(htmlToMarkdown(markdownToHtml(before)));

    const b = before.split("\n");
    const a = after.split("\n");
    const same = before === after;

    // Compare the structural markers that matter.
    const marks = (s: string) => ({
      h: (s.match(/^#{1,6} /gm) || []).length,
      bold: (s.match(/\*\*[^*]+\*\*/g) || []).length,
      ul: (s.match(/^[-*] /gm) || []).length,
      ol: (s.match(/^\d+\. /gm) || []).length,
      link: (s.match(/\[[^\]]+\]\([^)]+\)/g) || []).length,
      code: (s.match(/^```/gm) || []).length,
    });
    const mb = marks(before);
    const ma = marks(after);
    const lost = Object.entries(mb).filter(([k, v]) => v !== ma[k as keyof typeof ma]);

    console.log(`${p.slug.padEnd(20)} ${same ? "identical" : "reformatted"}  lines ${b.length}->${a.length}  ${lost.length ? "STRUCTURE CHANGED: " + JSON.stringify(lost) : "structure intact"}`);
    if (lost.length) issues++;
  }

  console.log(issues === 0 ? "\nOK: no post loses structure through the editor." : `\nPROBLEM: ${issues} post(s) changed structurally.`);
  await sequelize.close();
})();
