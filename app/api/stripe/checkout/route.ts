import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { priceId, productId } = await req.json();
    if (!priceId || !productId) return NextResponse.json({ error: "Missing priceId or productId" }, { status: 400 });

    // Verify user has access to this product
    const { data: product } = await supabaseAdmin
      .from("products")
      .select("id, type, stripe_product_id, is_public, assigned_user_id")
      .eq("id", productId)
      .single();

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    if (!product.is_public && product.assigned_user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: price } = await supabaseAdmin
      .from("prices")
      .select("stripe_price_id, interval")
      .eq("id", priceId)
      .single();

    if (!price) return NextResponse.json({ error: "Price not found" }, { status: 404 });

    // Get or create Stripe customer
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await supabaseAdmin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const isSubscription = !!price.interval;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: isSubscription ? "subscription" : "payment",
      line_items: [{ price: price.stripe_price_id, quantity: 1 }],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      metadata: {
        supabase_user_id: user.id,
        product_id: productId,
        price_id: priceId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
