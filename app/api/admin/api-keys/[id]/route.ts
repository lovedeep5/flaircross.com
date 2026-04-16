import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, supabaseAdmin } from "@/lib/supabase/admin";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { error } = await supabaseAdmin
      .from("blog_api_keys")
      .update({ is_active: false })
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}
