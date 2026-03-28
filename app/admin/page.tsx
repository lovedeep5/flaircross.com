import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/stripe";
import Link from "next/link";

export const dynamic = "force-dynamic";

type OrderRow = {
  id: string;
  amount: number;
  currency: string;
  profiles: { full_name: string | null } | null;
  products: { name: string } | null;
  prices: { unit_amount: number; currency: string } | null;
};

type SubPriceRow = {
  prices: { unit_amount: number; currency: string } | null;
};

export default async function AdminDashboard() {
  const [
    { count: totalUsers },
    { count: activeSubscriptions },
    { data: rawRecentOrders },
    { data: rawSubData },
    { data: recentUsers },
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
    supabaseAdmin.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabaseAdmin.from("orders").select("id, amount, currency, profiles!user_id(full_name), products(name), prices(unit_amount, currency)").order("created_at", { ascending: false }).limit(8),
    supabaseAdmin.from("subscriptions").select("prices(unit_amount, currency)").eq("status", "active"),
    supabaseAdmin.from("profiles").select("id, full_name, created_at").eq("role", "customer").order("created_at", { ascending: false }).limit(5),
  ]);

  const recentOrders = (rawRecentOrders as unknown as OrderRow[]) ?? [];
  const subData = (rawSubData as unknown as SubPriceRow[]) ?? [];
  type UserRow = { id: string; full_name: string | null; created_at: string };
  const typedRecentUsers = (recentUsers as unknown as UserRow[]) ?? [];

  // Calculate MRR
  const mrr = subData.reduce((sum, sub) => sum + (sub.prices?.unit_amount ?? 0), 0);

  const metrics = [
    { label: "MRR", value: formatPrice(mrr), sub: "Active subscriptions revenue" },
    { label: "Customers", value: String(totalUsers ?? 0), sub: "Registered accounts" },
    { label: "Active Subs", value: String(activeSubscriptions ?? 0), sub: "Currently billing" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="border rounded-xl p-5 bg-card">
            <p className="text-sm text-muted-foreground">{m.label}</p>
            <p className="text-3xl font-bold mt-1">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="border rounded-xl overflow-hidden bg-card">
            {recentOrders.length > 0 ? (
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Product</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                </tr></thead>
                <tbody className="divide-y">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">{o.profiles?.full_name || "—"}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{o.products?.name || "—"}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        {o.prices ? formatPrice(o.prices.unit_amount, o.prices.currency) : o.amount ? formatPrice(o.amount, o.currency) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground p-6">No orders yet.</p>
            )}
          </div>
        </div>

        {/* Recent users */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Signups</h2>
            <Link href="/admin/users" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="border rounded-xl overflow-hidden bg-card">
            {typedRecentUsers.length > 0 ? (
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-right px-4 py-3 font-medium">Joined</th>
                </tr></thead>
                <tbody className="divide-y">
                  {typedRecentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Link href={`/admin/users/${u.id}`} className="font-medium hover:text-primary transition-colors">
                          {u.full_name || "Unnamed"}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground text-xs">
                        {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground p-6">No users yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 flex-wrap">
        <Link href="/admin/products/new" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          + New Product
        </Link>
        <Link href="/admin/users" className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
          Manage Users
        </Link>
        <Link href="/shop" target="_blank" className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
          View Shop ↗
        </Link>
      </div>
    </div>
  );
}
