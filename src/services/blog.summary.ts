import type { BlogPostData } from "./blog.service";

export type BlogPostSummary = Omit<BlogPostData, "content">;

/** Drops the MDX body — listings and related-post rails never render it. */
export function omitContent(post: BlogPostData): BlogPostSummary {
  const summary = { ...post } as Partial<BlogPostData>;
  delete summary.content;
  return summary as BlogPostSummary;
}
