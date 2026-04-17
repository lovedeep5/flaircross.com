import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const { data: existing } = await supabaseAdmin.from("products").select("stripe_product_id").eq("id", id).single();

    // Sync to Stripe if name/description changed
    if (existing?.stripe_product_id && (body.name || body.description !== undefined)) {
      await stripe.products.update(existing.stripe_product_id, {
        ...(body.name ? { name: body.name } : {}),
        ...(body.description !== undefined ? { description: body.description || "" } : {}),
        active: body.status !== "archived",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .update({ name: body.name, slug: body.slug, description: body.description, short_description: body.short_description, status: body.status, is_public: body.is_public, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
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

    const { data: existing } = await supabaseAdmin.from("products").select("stripe_product_id").eq("id", id).single();
    if (existing?.stripe_product_id) {
      try { await stripe.products.update(existing.stripe_product_id, { active: false }); } catch { /* ignore mode mismatch */ }
    }

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}
