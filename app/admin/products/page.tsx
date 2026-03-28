import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/stripe";
import Link from "next/link";

export const dynamic = "force-dynamic";

type ProductRow = {
  id: string; name: string; type: string; status: string; is_public: boolean;
  prices: { unit_amount: number; currency: string; interval: string | null; is_default: boolean }[];
  profiles: { full_name: string | null } | null;
};

export default async function AdminProductsPage() {
  const { data: rawProducts } = await supabaseAdmin
    .from("products")
    .select("id, name, type, status, is_public, prices(unit_amount, currency, interval, is_default), profiles!assigned_user_id(full_name)")
    .order("created_at", { ascending: false });

  const products = (rawProducts as unknown as ProductRow[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          + New Product
        </Link>
      </div>

      <div className="border rounded-xl overflow-hidden bg-card">
        {products.length > 0 ? (
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Price</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Visibility</th>
              <th className="text-right px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr></thead>
            <tbody className="divide-y">
              {products.map((p) => {
                const prices = Array.isArray(p.prices) ? p.prices : [];
                const defaultPrice = prices.find((pr) => pr.is_default) ?? prices[0] ?? null;
                const assignedUser = p.profiles;
                return (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">{p.type}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                      {defaultPrice ? `${formatPrice(defaultPrice.unit_amount, defaultPrice.currency)}${defaultPrice.interval ? `/${defaultPrice.interval}` : ""}` : "—"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                      {p.is_public ? "Public" : assignedUser ? `Private → ${assignedUser.full_name}` : "Private"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${p.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/products/${p.id}`} className="text-primary hover:underline text-xs">Edit</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No products yet.</p>
            <Link href="/admin/products/new" className="text-primary hover:underline text-sm">Create your first product →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
