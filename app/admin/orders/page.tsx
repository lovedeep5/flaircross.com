import { supabaseAdmin, requireAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

type OrderRow = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  profiles: { full_name: string | null; company_name: string | null } | null;
  products: { name: string; slug: string } | null;
};

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export default async function AdminOrdersPage() {
  try { await requireAdmin(); } catch { redirect("/portal/overview"); }

  const { data: rawOrders } = await supabaseAdmin
    .from("orders")
    .select("id, amount, currency, status, created_at, products(name, slug), profiles!user_id(full_name, company_name)")
    .order("created_at", { ascending: false });

  const orders = (rawOrders as unknown as OrderRow[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <span className="text-sm text-muted-foreground">{orders.length} total</span>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Product</th>
              <th className="text-left px-4 py-3 font-medium">Amount</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {!orders.length ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No orders yet</td></tr>
            ) : orders.map((o) => (
              <tr key={o.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">{o.profiles?.full_name || o.profiles?.company_name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.products?.name ?? "—"}</td>
                <td className="px-4 py-3 font-medium">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: (o.currency ?? "usd").toUpperCase() }).format((o.amount ?? 0) / 100)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] ?? "bg-muted text-muted-foreground"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
