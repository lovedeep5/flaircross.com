import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";

export const revalidate = 60;

export const metadata = {
  title: "Shop | FlairCross Consultancy",
  description: "Browse our web development packages, automation services, and managed hosting subscriptions.",
};

type ShopProduct = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  type: string;
  prices: { unit_amount: number; currency: string; interval: string | null; is_default: boolean }[];
};

const TYPE_LABEL: Record<string, string> = {
  one_time: "One-time",
  subscription: "Subscription",
  bundle: "Bundle",
};

export default async function ShopPage() {
  let products: ShopProduct[] = [];
  try {
    const { data } = await supabaseAdmin
      .from("products")
      .select("id, name, slug, short_description, type, prices(unit_amount, currency, interval, is_default)")
      .eq("status", "active")
      .eq("is_public", true)
      .order("created_at", { ascending: false });
    products = (data as unknown as ShopProduct[]) ?? [];
  } catch {
    // DB not configured yet — show empty state
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold">Services & Products</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Website builds, automation setups, and managed hosting plans — transparent pricing, no surprise invoices.
        </p>
      </div>

      {!products.length ? (
        <p className="text-center text-muted-foreground py-16">No products available yet. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const prices = Array.isArray(p.prices) ? p.prices : [];
            const defaultPrice = prices.find((pr) => pr.is_default) ?? prices[0] ?? null;
            const formattedPrice = defaultPrice
              ? new Intl.NumberFormat("en-US", { style: "currency", currency: defaultPrice.currency.toUpperCase() }).format(defaultPrice.unit_amount / 100)
              : null;

            return (
              <Link key={p.id} href={`/shop/${p.slug}`} className="group border rounded-2xl p-6 bg-card hover:border-primary/50 hover:shadow-md transition-all space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-lg group-hover:text-primary transition-colors">{p.name}</h2>
                  <span className="shrink-0 inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    {TYPE_LABEL[p.type] ?? p.type}
                  </span>
                </div>
                {p.short_description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.short_description}</p>
                )}
                {formattedPrice && (
                  <div className="pt-2">
                    <span className="text-2xl font-bold">{formattedPrice}</span>
                    {defaultPrice?.interval && (
                      <span className="text-sm text-muted-foreground ml-1">/{defaultPrice.interval}</span>
                    )}
                  </div>
                )}
                <div className="text-sm text-primary font-medium group-hover:underline">View details →</div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
