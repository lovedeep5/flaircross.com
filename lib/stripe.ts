import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getStripe() {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY?.trim().replace(/\s*#.*$/, "");
    if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
    _stripe = new Stripe(key, { apiVersion: "2026-03-25.dahlia", typescript: true });
  }
  return _stripe;
}

// Proxy preserves `stripe.products.create(...)` syntax used across routes
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Format cents to display string: 4999 → "$49.99"
export function formatPrice(amount: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount / 100);
}

// Map Stripe subscription status to a display label + color
export function subscriptionStatusLabel(status: string) {
  const map: Record<string, { label: string; color: string }> = {
    active: { label: "Active", color: "green" },
    trialing: { label: "Trial", color: "blue" },
    past_due: { label: "Past Due", color: "red" },
    canceled: { label: "Canceled", color: "gray" },
    unpaid: { label: "Unpaid", color: "red" },
    incomplete: { label: "Incomplete", color: "yellow" },
    incomplete_expired: { label: "Expired", color: "gray" },
    paused: { label: "Paused", color: "yellow" },
  };
  return map[status] ?? { label: status, color: "gray" };
}
