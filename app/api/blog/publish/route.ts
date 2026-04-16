import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "Missing X-API-Key header" }, { status: 401 });
    }

    const keyHash = createHash("sha256").update(apiKey).digest("hex");

    const { data: keyRecord, error: keyError } = await supabaseAdmin
      .from("blog_api_keys")
      .select("id, is_active")
      .eq("key_hash", keyHash)
      .single();

    if (keyError || !keyRecord || !keyRecord.is_active) {
      return NextResponse.json({ error: "Invalid or revoked API key" }, { status: 401 });
    }

    await supabaseAdmin
      .from("blog_api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", keyRecord.id);

    const body = await req.json();
    const { slug, title, description, excerpt, content, category, readingTime, tags, featured, status } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: "slug and title are required" }, { status: 400 });
    }

    const postStatus = status ?? "published";

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .upsert(
        {
          slug,
          title,
          description: description || null,
          excerpt: excerpt || null,
          content: content || null,
          category: category || null,
          reading_time: readingTime || null,
          tags: tags ?? [],
          featured: featured ?? false,
          status: postStatus,
          published_at: postStatus === "published" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, post: data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
