import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("id, amount, currency, status, created_at, products(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      {orders && orders.length > 0 ? (
        <div className="border rounded-xl overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-medium">Amount</th>
                <th className="text-right px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => {
                const product = (order.products as unknown as { name: string } | null);
                return (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{product?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatPrice(order.amount ?? 0, order.currency ?? "usd")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "paid" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        order.status === "refunded" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                        "bg-muted text-muted-foreground"
                      }`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell text-muted-foreground text-xs">—</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border rounded-xl p-12 text-center bg-card">
          <p className="text-muted-foreground">No orders yet.</p>
        </div>
      )}
    </div>
  );
}
