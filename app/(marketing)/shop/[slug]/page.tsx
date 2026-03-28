import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { BuyButton } from "@/components/shop/BuyButton";
import type { Metadata } from "next";

export const revalidate = 60;

type Price = { id: string; unit_amount: number; currency: string; interval: string | null; is_default: boolean; stripe_price_id: string };
type BundleItem = { description: string; sort_order: number };
type Product = {
  id: string; name: string; slug: string; type: string;
  short_description: string | null; description: string | null;
  prices: Price[]; product_bundle_items: BundleItem[];
};

export async function generateStaticParams() {
  try {
    const { data } = await supabaseAdmin
      .from("products")
      .select("slug")
      .eq("status", "active")
      .eq("is_public", true);
    return ((data ?? []) as { slug: string }[]).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { data } = await supabaseAdmin.from("products").select("name, short_description").eq("slug", slug).single();
    const d = data as { name: string; short_description: string | null } | null;
    if (!d) return {};
    return {
      title: `${d.name} | FlairCross Consultancy`,
      description: d.short_description ?? undefined,
    };
  } catch {
    return {};
  }
}

export default async function ShopProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: rawProduct } = await supabaseAdmin
    .from("products")
    .select("*, prices(*), product_bundle_items(description, sort_order)")
    .eq("slug", slug)
    .eq("status", "active")
    .eq("is_public", true)
    .single();

  if (!rawProduct) notFound();

  const product = rawProduct as unknown as Product;
  const prices = Array.isArray(product.prices) ? product.prices : [];
  const defaultPrice = prices.find((p) => p.is_default) ?? prices[0] ?? null;

  const bundleItems = (Array.isArray(product.product_bundle_items) ? product.product_bundle_items : [])
    .sort((a, b) => a.sort_order - b.sort_order);

  const formattedPrice = defaultPrice
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: defaultPrice.currency.toUpperCase() }).format(defaultPrice.unit_amount / 100)
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? product.short_description,
    offers: defaultPrice ? {
      "@type": "Offer",
      price: (defaultPrice.unit_amount / 100).toFixed(2),
      priceCurrency: defaultPrice.currency.toUpperCase(),
      availability: "https://schema.org/InStock",
    } : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-5 gap-12">
          {/* Left: details */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                {product.type === "one_time" ? "One-time payment" : product.type === "subscription" ? "Subscription" : "Bundle"}
              </span>
              <h1 className="text-3xl font-bold">{product.name}</h1>
            </div>

            {product.short_description && (
              <p className="text-lg text-muted-foreground">{product.short_description}</p>
            )}

            {product.description && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>{product.description}</p>
              </div>
            )}

            {bundleItems.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-semibold">What&apos;s included</h2>
                <ul className="space-y-2">
                  {bundleItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{item.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: pricing + CTA */}
          <div className="md:col-span-2">
            <div className="border rounded-2xl p-6 bg-card space-y-6 sticky top-24">
              {formattedPrice ? (
                <div>
                  <span className="text-4xl font-bold">{formattedPrice}</span>
                  {defaultPrice?.interval && (
                    <span className="text-muted-foreground ml-1.5">/{defaultPrice.interval}</span>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Contact for pricing</p>
              )}

              {defaultPrice && (
                <BuyButton
                  productId={product.id}
                  priceId={defaultPrice.id}
                  mode={product.type === "subscription" ? "subscription" : "payment"}
                />
              )}

              <p className="text-xs text-muted-foreground text-center">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
