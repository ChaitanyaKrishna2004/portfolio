import "server-only";
import { cache } from "react";
import { Op } from "sequelize";
import { BlogPost } from "@/models";
import type { BlogCover } from "@/types/content";

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image: string;
  cover: BlogCover | null;
  readTime: string;
  /** ISO yyyy-mm-dd — matches what the pages displayed when posts were MDX. */
  date: string;
  /** Long-form label, if you'd rather render "15 October 2025". */
  dateLabel: string;
  isFeatured: boolean;
  viewCount: number;
}

const FALLBACK_COVER = "/images/blog/inventory.jpg";
const WORDS_PER_MINUTE = 200;

function readTimeFor(content: string): string {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`;
}

function toPlain(row: BlogPost): BlogPostData {
  const published = new Date(row.publishedAt);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content,
    category: row.category ?? "General",
    tags: row.tags ?? [],
    image: row.cover?.url || FALLBACK_COVER,
    cover: row.cover ?? null,
    readTime: row.readTime || readTimeFor(row.content),
    date: published.toISOString().slice(0, 10),
    dateLabel: published.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    isFeatured: row.isFeatured,
    viewCount: row.viewCount,
  };
}

export const getAllPosts = cache(async (): Promise<BlogPostData[]> => {
  const rows = await BlogPost.findAll({
    where: { isPublished: true },
    order: [["publishedAt", "DESC"]],
  });
  return rows.map(toPlain);
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPostData | null> => {
  const row = await BlogPost.findOne({ where: { slug, isPublished: true } });
  return row ? toPlain(row) : null;
});

export const getPostSlugs = cache(async (): Promise<string[]> => {
  const rows = await BlogPost.findAll({
    where: { isPublished: true },
    attributes: ["slug"],
  });
  return rows.map((r) => r.slug);
});

/**
 * The pinned post, falling back to the newest — which is exactly what the
 * listing did before, when it just took posts[0].
 */
export const getFeaturedPost = cache(async (): Promise<BlogPostData | null> => {
  const pinned = await BlogPost.findOne({
    where: { isPublished: true, isFeatured: true },
    order: [["publishedAt", "DESC"]],
  });
  if (pinned) return toPlain(pinned);

  const newest = await BlogPost.findOne({
    where: { isPublished: true },
    order: [["publishedAt", "DESC"]],
  });
  return newest ? toPlain(newest) : null;
});

/**
 * Hand-picked via related_slugs when set. Otherwise recent posts in the same
 * category, topped up with other recent posts so the rail is always full.
 */
export const getRelatedPosts = cache(
  async (slug: string, limit = 3): Promise<BlogPostData[]> => {
    const post = await BlogPost.findOne({ where: { slug } });
    if (!post) return [];

    if (post.relatedSlugs?.length) {
      const rows = await BlogPost.findAll({
        where: { slug: { [Op.in]: post.relatedSlugs }, isPublished: true },
      });
      const order = new Map(post.relatedSlugs.map((s, i) => [s, i]));
      return rows
        .sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0))
        .slice(0, limit)
        .map(toPlain);
    }

    const sameCategory = await BlogPost.findAll({
      where: { isPublished: true, category: post.category, slug: { [Op.ne]: slug } },
      order: [["publishedAt", "DESC"]],
      limit,
    });

    if (sameCategory.length >= limit) return sameCategory.map(toPlain);

    const exclude = [slug, ...sameCategory.map((r) => r.slug)];
    const filler = await BlogPost.findAll({
      where: { isPublished: true, slug: { [Op.notIn]: exclude } },
      order: [["publishedAt", "DESC"]],
      limit: limit - sameCategory.length,
    });

    return [...sameCategory, ...filler].map(toPlain);
  }
);

export async function incrementViewCount(slug: string): Promise<void> {
  await BlogPost.increment("viewCount", { where: { slug } });
}
