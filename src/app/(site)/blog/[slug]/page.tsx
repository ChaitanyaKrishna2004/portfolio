import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { ReadingProgress, FloatingSocials, PremiumHero, PremiumContent } from "./ClientComponents";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/services/blog.service";
import { getSection } from "@/services/site.service";
import type { BlogContent } from "@/types/content";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: post.image ? { images: [post.image] } : undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [post, section] = await Promise.all([
    getPostBySlug(slug),
    getSection<BlogContent>("blog"),
  ]);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug);
  const copy = section.content.detail;

  return (
    <article className="min-h-screen bg-noise pb-12">
      <ReadingProgress />
      <FloatingSocials
        shareTargets={section.content.shareTargets ?? []}
        title={post.title}
      />

      <PremiumHero post={post} backLabel={copy.backLabel} />

      <PremiumContent
        outroText={copy.outroText}
        shareLabel={copy.shareLabel}
        moreLabel={copy.moreLabel}
      >
        {/* GFM enables the tables, strikethrough and task lists the admin
            editor can produce — without it they render as literal text. */}
        <MDXRemote
          source={post.content}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </PremiumContent>

      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pb-24 relative z-30">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">{copy.relatedLabel}</h2>
            <Link href="/blog" className="text-sm font-bold text-accent-violet hover:text-accent-coral transition-colors flex items-center">
              {section.content.listing.viewAllLabel} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.slug} className="group block h-full">
                <article className="glass-panel border-white/10 hover:border-accent-violet/30 transition-all duration-300 rounded-3xl overflow-hidden h-full flex flex-col shadow-lg hover:shadow-xl hover:-translate-y-1 bg-background/60 backdrop-blur-xl">
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.cover?.alt || relatedPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60" />
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 bg-accent-violet/10 text-accent-violet text-[10px] font-bold uppercase tracking-wider rounded-full border border-accent-violet/20">
                        {relatedPost.category}
                      </span>
                      <span className="flex items-center text-xs font-medium text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" /> {relatedPost.date}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-accent-violet transition-colors line-clamp-2 leading-tight">
                      {relatedPost.title}
                    </h3>

                    <p className="text-foreground/70 mb-6 line-clamp-2 text-sm flex-1 leading-relaxed">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
