import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { data, error } = await supabaseAdmin.from("blog_posts").select("*").eq("id", id).single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { slug, title, description, excerpt, content, category, reading_time, tags, featured, status } = body;

    const updates: Record<string, unknown> = {
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
      updated_at: new Date().toISOString(),
    };

    if (status === "published") {
      const { data: existing } = await supabaseAdmin
        .from("blog_posts")
        .select("published_at")
        .eq("id", id)
        .single();
      if (!existing?.published_at) {
        updates.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabaseAdmin.from("blog_posts").update(updates).eq("id", id).select().single();
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
      }
      throw error;
    }
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}
