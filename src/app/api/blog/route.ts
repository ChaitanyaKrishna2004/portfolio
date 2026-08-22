import { NextResponse } from "next/server";
import { getAllPosts } from "@/services/blog.service";
import { omitContent } from "@/services/blog.summary";

export const runtime = "nodejs";

export async function GET() {
  try {
    const posts = await getAllPosts();
    // The MDX body is large and not useful in a listing response.
    const summaries = posts.map((post) => omitContent(post));
    return NextResponse.json({ ok: true, count: summaries.length, posts: summaries });
  } catch (err) {
    console.error("[api/blog]", err);
    return NextResponse.json({ ok: false, error: "Could not load posts." }, { status: 500 });
  }
}
