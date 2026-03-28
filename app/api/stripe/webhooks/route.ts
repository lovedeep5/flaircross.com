import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

async function getUserIdByCustomer(customerId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  return data?.id ?? null;
}

async function getSupabasePriceId(stripePriceId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("prices")
    .select("id, product_id")
    .eq("stripe_price_id", stripePriceId)
    .single();
  return data ? data.id : null;
}

async function getSupabaseProductAndPriceIds(stripePriceId: string) {
  const { data } = await supabaseAdmin
    .from("prices")
    .select("id, product_id")
    .eq("stripe_price_id", stripePriceId)
    .single();
  return data ?? null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const productId = session.metadata?.product_id;
        const priceId = session.metadata?.price_id;

        if (!userId || !productId || !priceId) break;

        if (session.mode === "payment" && session.payment_status === "paid") {
          await supabaseAdmin.from("orders").upsert({
            user_id: userId,
            product_id: productId,
            price_id: priceId,
            stripe_session_id: session.id,
            stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
            status: "paid",
            amount_paid: session.amount_total ?? 0,
            currency: session.currency ?? "usd",
          }, { onConflict: "stripe_session_id" });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        const userId = await getUserIdByCustomer(customerId);
        if (!userId) break;

        const stripePriceId = sub.items.data[0]?.price?.id;
        if (!stripePriceId) break;

        const ids = await getSupabaseProductAndPriceIds(stripePriceId);
        if (!ids) break;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subAny = sub as any;
        await supabaseAdmin.from("subscriptions").upsert({
          user_id: userId,
          product_id: ids.product_id,
          price_id: ids.id,
          stripe_subscription_id: sub.id,
          stripe_customer_id: customerId,
          status: sub.status,
          current_period_start: subAny.current_period_start ? new Date(subAny.current_period_start * 1000).toISOString() : null,
          current_period_end: subAny.current_period_end ? new Date(subAny.current_period_end * 1000).toISOString() : null,
          cancel_at_period_end: subAny.cancel_at_period_end ?? false,
          canceled_at: subAny.canceled_at ? new Date(subAny.canceled_at * 1000).toISOString() : null,
          trial_start: subAny.trial_start ? new Date(subAny.trial_start * 1000).toISOString() : null,
          trial_end: subAny.trial_end ? new Date(subAny.trial_end * 1000).toISOString() : null,
        }, { onConflict: "stripe_subscription_id" });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "canceled", canceled_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "invoice.payment_succeeded": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inv = event.data.object as any;
        const subId = typeof inv.subscription === "string" ? inv.subscription : inv.subscription?.id;
        if (!subId) break;

        const stripeSub = await stripe.subscriptions.retrieve(subId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stripeSubAny = stripeSub as any;
        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "active",
            current_period_start: stripeSubAny.current_period_start ? new Date(stripeSubAny.current_period_start * 1000).toISOString() : null,
            current_period_end: stripeSubAny.current_period_end ? new Date(stripeSubAny.current_period_end * 1000).toISOString() : null,
          })
          .eq("stripe_subscription_id", subId);
        break;
      }

      case "invoice.payment_failed": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inv = event.data.object as any;
        const subId = typeof inv.subscription === "string" ? inv.subscription : inv.subscription?.id;
        if (subId) {
          await supabaseAdmin
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", subId);
        }
        break;
      }
    }
  } catch (err) {
    console.error(`[webhook] Error handling ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
