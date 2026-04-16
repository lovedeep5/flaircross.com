import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { requireAdmin, supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
      .from("blog_api_keys")
      .select("id, name, key_prefix, is_active, last_used_at, created_at")
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
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Key name is required" }, { status: 400 });
    }

    const rawKey = "fc_blog_" + randomBytes(32).toString("hex");
    const keyHash = createHash("sha256").update(rawKey).digest("hex");
    const keyPrefix = rawKey.slice(0, 16);

    const { data, error } = await supabaseAdmin
      .from("blog_api_keys")
      .insert({ name: name.trim(), key_hash: keyHash, key_prefix: keyPrefix })
      .select("id, name, key_prefix, is_active, created_at")
      .single();

    if (error) throw error;

    return NextResponse.json({ ...data, rawKey }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}
