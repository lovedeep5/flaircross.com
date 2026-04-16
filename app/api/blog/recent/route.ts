import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
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

    const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? "15"), 50);

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("slug, title, category, tags")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({ posts: data ?? [] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
