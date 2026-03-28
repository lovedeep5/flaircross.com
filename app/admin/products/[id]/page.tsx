import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: rawProduct } = await supabaseAdmin
    .from("products")
    .select("*, prices(*), product_bundle_items(description, sort_order)")
    .eq("id", id)
    .single();

  if (!rawProduct) notFound();

  type ProductFull = {
    id: string; name: string; slug: string; description: string | null; short_description: string | null;
    type: string; status: string; is_public: boolean;
    prices: { id: string; unit_amount: number; currency: string; interval: string | null; is_default: boolean }[];
    product_bundle_items: { description: string; sort_order: number }[];
  };

  const product = rawProduct as unknown as ProductFull;
  const defaultPrice = product.prices?.find((p) => p.is_default) ?? product.prices?.[0];
  const bundleItems = (product.product_bundle_items ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => ({ description: i.description }));

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <ProductForm initialData={{
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description ?? "",
        short_description: product.short_description ?? "",
        type: product.type,
        status: product.status,
        is_public: product.is_public,
        unit_amount: defaultPrice?.unit_amount ?? 0,
        currency: defaultPrice?.currency ?? "usd",
        interval: defaultPrice?.interval ?? "month",
        bundle_items: bundleItems,
      }} />
    </div>
  );
}
