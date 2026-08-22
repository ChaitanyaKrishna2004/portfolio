import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_PATH = path.join(process.cwd(), "src/content/blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  image: string;
  content: string;
};

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_PATH)) return [];
  return fs.readdirSync(POSTS_PATH).filter((path) => /\.mdx?$/.test(path));
}

export function getPostBySlug(slug: string): BlogPost {
  const realSlug = slug.replace(/\.mdx?$/, "");
  const fullPath = path.join(POSTS_PATH, `${realSlug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title || "Untitled",
    date: data.date || "Unknown Date",
    readTime: data.readTime || "5 min read",
    category: data.category || "General",
    excerpt: data.excerpt || "",
    image: data.image || "/images/blog/inventory.jpg",
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
