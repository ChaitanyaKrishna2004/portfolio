import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getPostSlugs } from "@/lib/mdx";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug: slug.replace(/\.mdx?$/, "") }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = getPostBySlug(params.slug);
    return {
      title: `${post.title} | Blog`,
      description: post.excerpt,
    };
  } catch (e) {
    return { title: "Post Not Found" };
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    const post = getPostBySlug(params.slug);

    return (
      <div className="container mx-auto px-6 py-24 sm:py-32 max-w-3xl min-h-screen">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-medium text-white/50 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm font-medium text-white/50 mb-6">
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {post.date}</span>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {post.readTime}</span>
            <span className="px-2.5 py-1 bg-white/5 rounded-full text-accent-cyan">{post.category}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">{post.title}</h1>
          <p className="text-xl text-white/60">{post.excerpt}</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-accent-cyan hover:prose-a:text-accent-cyan/80 prose-strong:text-white prose-p:text-white/80 prose-li:text-white/80">
          <MDXRemote source={post.content} />
        </div>
      </div>
    );
  } catch (e) {
    notFound();
  }
}
