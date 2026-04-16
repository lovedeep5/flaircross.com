import { NextResponse } from "next/server";
import { requireAdmin, supabaseAdmin } from "@/lib/supabase/admin";
import { setStripeModeCache } from "@/lib/stripe";

export async function GET() {
  try {
    await requireAdmin();
    const { data } = await supabaseAdmin
      .from("app_settings")
      .select("value")
      .eq("key", "stripe_test_mode")
      .single();
    return NextResponse.json({ testMode: data?.value === "true" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const { testMode } = await req.json();
    await supabaseAdmin.from("app_settings").upsert({
      key: "stripe_test_mode",
      value: String(Boolean(testMode)),
      updated_at: new Date().toISOString(),
    });
    setStripeModeCache(Boolean(testMode));
    return NextResponse.json({ testMode: Boolean(testMode) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
