import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata = {
  title: "Blog | Chaitanya Krishna",
  description: "Read my latest articles on software engineering, web security, and tech.",
};

export default function BlogListing() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-6 py-24 sm:py-32 max-w-4xl min-h-screen">
      <div className="mb-16">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-violet">Archive</span>
        </h1>
        <p className="text-xl text-white/60">Thoughts, learnings, and engineering deep dives.</p>
      </div>

      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug}>
            <article className="glass-panel group relative flex flex-col sm:flex-row gap-6 p-6 sm:p-8 rounded-3xl transition-colors hover:bg-white/[0.05]">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
              
              <div className="flex-1">
                <div className="flex items-center gap-4 text-xs font-medium text-white/50 mb-3">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {post.readTime}</span>
                  <span className="px-2 py-1 bg-white/5 rounded-full text-accent-cyan">{post.category}</span>
                </div>
                
                <h2 className="text-2xl font-bold mb-3 group-hover:text-accent-cyan transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-white/70 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="text-sm font-semibold flex items-center text-white/90 group-hover:text-white transition-colors">
                  Read Article <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
