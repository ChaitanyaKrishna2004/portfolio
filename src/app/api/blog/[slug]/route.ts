import { NextResponse } from "next/server";
import { getPostBySlug, getRelatedPosts } from "@/services/blog.service";
import { omitContent } from "@/services/blog.summary";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ ok: false, error: "No post with that slug." }, { status: 404 });
    }

    const related = (await getRelatedPosts(slug)).map((p) => omitContent(p));
    return NextResponse.json({ ok: true, post, related });
  } catch (err) {
    console.error("[api/blog/:slug]", err);
    return NextResponse.json({ ok: false, error: "Could not load the post." }, { status: 500 });
  }
}
