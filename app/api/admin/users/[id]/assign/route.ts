import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id: userId } = await params;
    const body = await req.json();
    const { name, description, short_description, unit_amount, currency, interval, type, bundle_items } = body;

    // Verify user exists
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (authError || !authUser.user) throw new Error("User not found");

    // Create Stripe product
    const stripeProduct = await stripe.products.create({
      name,
      description: description || undefined,
      metadata: { supabase_user_id: userId, private: "true" },
    });

    // Create Stripe price
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount,
      currency: currency ?? "usd",
      ...(type === "subscription" && interval ? { recurring: { interval } } : {}),
    });

    // Insert product into Supabase (private, assigned to user)
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .insert({
        name,
        description,
        short_description,
        slug: `private-${userId.slice(0, 8)}-${Date.now()}`,
        type: type ?? "subscription",
        status: "active",
        is_public: false,
        assigned_user_id: userId,
        stripe_product_id: stripeProduct.id,
      })
      .select()
      .single();

    if (productError) throw productError;

    // Insert price
    await supabaseAdmin.from("prices").insert({
      product_id: product.id,
      nickname: type === "subscription" ? `${interval}ly` : "One-time",
      unit_amount,
      currency: currency ?? "usd",
      interval: interval ?? null,
      stripe_price_id: stripePrice.id,
      is_default: true,
    });

    // Insert bundle items if present
    if (type === "bundle" && bundle_items?.length > 0) {
      await supabaseAdmin.from("product_bundle_items").insert(
        bundle_items.map((item: { description: string }, idx: number) => ({
          product_id: product.id,
          description: item.description,
          sort_order: idx,
        }))
      );
    }

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("[admin/users/assign POST]", err);
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}
