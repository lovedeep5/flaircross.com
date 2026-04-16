import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("id, slug, title, status, featured, category, published_at, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { slug, title, description, excerpt, content, category, reading_time, tags, featured, status } = body;

    const payload: Record<string, unknown> = {
      slug,
      title,
      description: description || null,
      excerpt: excerpt || null,
      content: content || null,
      category: category || null,
      reading_time: reading_time || null,
      tags: tags ?? [],
      featured: featured ?? false,
      status: status ?? "draft",
    };

    if (status === "published") {
      payload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin.from("blog_posts").insert(payload).select().single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}
