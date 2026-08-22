import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { getAllPosts, getFeaturedPost } from "@/services/blog.service";
import { getSection } from "@/services/site.service";
import type { BlogContent } from "@/types/content";

export async function generateMetadata() {
  const section = await getSection<BlogContent>("blog");
  return {
    title: section.content.meta?.title ?? "Blog",
    description: section.content.meta?.description ?? "",
  };
}

export default async function BlogListing() {
  const [posts, featuredPost, section] = await Promise.all([
    getAllPosts(),
    getFeaturedPost(),
    getSection<BlogContent>("blog"),
  ]);

  const copy = section.content.listing;

  if (posts.length === 0 || !featuredPost) {
    return (
      <div className="container mx-auto px-6 py-24 min-h-screen">{copy?.emptyLabel ?? "No posts found."}</div>
    );
  }

  const regularPosts = posts.filter((p) => p.slug !== featuredPost.slug);

  return (
    <div className="container mx-auto px-6 py-24 sm:py-32 max-w-7xl min-h-screen">
      <div className="mb-16">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-foreground">
          {section.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent-coral)] to-[var(--color-accent-violet)]">
            {section.titleHighlight}
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">{section.description}</p>
      </div>

      {/* Featured Post */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-foreground">{copy.featuredLabel}</h2>
        <Link href={`/blog/${featuredPost.slug}`} className="group block">
          <article className="bg-card border border-border hover:border-border-hover transition-colors rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md">
            <div className="relative w-full md:w-1/2 lg:w-3/5 h-72 md:h-auto md:min-h-[450px] overflow-hidden">
              <Image
                src={featuredPost.image}
                alt={featuredPost.cover?.alt || featuredPost.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <div className="p-10 md:w-1/2 lg:w-2/5 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground mb-6">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {featuredPost.date}</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {featuredPost.readTime}</span>
                <span className="px-3 py-1 bg-muted rounded-full text-foreground">{featuredPost.category}</span>
              </div>

              <h3 className="text-4xl font-bold mb-6 text-card-foreground group-hover:text-[var(--color-accent-violet)] transition-colors leading-tight">
                {featuredPost.title}
              </h3>

              <p className="text-muted-foreground mb-8 line-clamp-3 text-lg leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="text-sm font-semibold flex items-center text-foreground group-hover:text-[var(--color-accent-violet)] transition-colors mt-auto">
                {copy.readLabel} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </article>
        </Link>
      </div>

      {/* Grid Posts */}
      {regularPosts.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6 text-foreground">{copy.gridLabel}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group block h-full">
                <article className="bg-card border border-border hover:border-border-hover transition-colors rounded-3xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-md">
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.cover?.alt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground mb-4 flex-wrap">
                      <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                      <span className="px-2 py-0.5 bg-muted rounded-full text-foreground">{post.category}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-card-foreground group-hover:text-[var(--color-accent-violet)] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground mb-6 line-clamp-2 text-sm flex-1 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="text-sm font-semibold flex items-center text-foreground group-hover:text-[var(--color-accent-violet)] transition-colors mt-auto">
                      {copy.readLabel} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
