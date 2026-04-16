import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

const API_VERSION = "2026-03-25.dahlia" as const;

let _liveStripe: Stripe | null = null;
let _testStripe: Stripe | null = null;

type ModeCache = { testMode: boolean; fetchedAt: number };
let _modeCache: ModeCache | null = null;
const MODE_TTL_MS = 30_000;

function getLiveStripe(): Stripe {
  if (!_liveStripe) {
    const key = process.env.STRIPE_LIVE_SECRET_KEY?.trim();
    if (!key) throw new Error("Missing STRIPE_LIVE_SECRET_KEY");
    _liveStripe = new Stripe(key, { apiVersion: API_VERSION, typescript: true });
  }
  return _liveStripe;
}

function getTestStripe(): Stripe {
  if (!_testStripe) {
    const key = process.env.STRIPE_TEST_SECRET_KEY?.trim();
    if (!key) throw new Error("Missing STRIPE_TEST_SECRET_KEY");
    _testStripe = new Stripe(key, { apiVersion: API_VERSION, typescript: true });
  }
  return _testStripe;
}

function refreshModeCache(): void {
  (async () => {
    try {
      const { data } = await supabaseAdmin
        .from("app_settings")
        .select("value")
        .eq("key", "stripe_test_mode")
        .single();
      _modeCache = { testMode: data?.value === "true", fetchedAt: Date.now() };
    } catch {
      // Keep existing cache or fall back to env default on next call
    }
  })();
}

function getStripe(): Stripe {
  const stale = !_modeCache || Date.now() - _modeCache.fetchedAt > MODE_TTL_MS;
  if (stale) refreshModeCache();
  const testMode = _modeCache?.testMode ?? (process.env.STRIPE_TEST_MODE === "true");
  return testMode ? getTestStripe() : getLiveStripe();
}

// Called by the admin API route so the current process reflects the change immediately
export function setStripeModeCache(testMode: boolean): void {
  _modeCache = { testMode, fetchedAt: Date.now() };
}

export function isStripeTestMode(): boolean {
  return _modeCache?.testMode ?? (process.env.STRIPE_TEST_MODE === "true");
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
