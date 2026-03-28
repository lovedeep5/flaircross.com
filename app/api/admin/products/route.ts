import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, prices(*), profiles!assigned_user_id(full_name)")
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
    const { name, slug, description, short_description, type, status, is_public, unit_amount, currency, interval, bundle_items } = body;

    // Create Stripe product
    const stripeProduct = await stripe.products.create({
      name,
      description: description || undefined,
      metadata: { supabase_slug: slug },
    });

    // Create Stripe price
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: unit_amount,
      currency: currency ?? "usd",
      ...(type === "subscription" && interval
        ? { recurring: { interval } }
        : {}),
    });

    // Insert product into Supabase
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .insert({ name, slug, description, short_description, type, status: status ?? "active", is_public: is_public ?? true, stripe_product_id: stripeProduct.id })
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
    console.error("[admin/products POST]", err);
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}
