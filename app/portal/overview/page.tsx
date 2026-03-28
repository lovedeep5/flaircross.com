import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice, subscriptionStatusLabel } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function PortalOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: subscriptions }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    supabase
      .from("subscriptions")
      .select("*, products(name), prices(unit_amount, currency, interval)")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing", "past_due"])
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("*, products(name), prices(unit_amount, currency)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {firstName} 👋</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s an overview of your account.</p>
      </div>

      {/* Active subscriptions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Plans</h2>
          <Link href="/portal/subscriptions" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        {subscriptions && subscriptions.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {subscriptions.map((sub) => {
              const statusInfo = subscriptionStatusLabel(sub.status);
              const price = sub.prices as { unit_amount: number; currency: string; interval: string } | null;
              const product = sub.products as { name: string } | null;
              return (
                <div key={sub.id} className="border rounded-xl p-5 bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-semibold">{product?.name ?? "Plan"}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      statusInfo.color === "green" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      statusInfo.color === "red" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                      "bg-muted text-muted-foreground"
                    }`}>{statusInfo.label}</span>
                  </div>
                  {price && (
                    <p className="text-2xl font-bold">
                      {formatPrice(price.unit_amount, price.currency)}
                      <span className="text-sm font-normal text-muted-foreground">/{price.interval}</span>
                    </p>
                  )}
                  {sub.current_period_end && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {sub.cancel_at_period_end ? "Cancels" : "Renews"} on{" "}
                      {new Date(sub.current_period_end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border rounded-xl p-8 text-center bg-card">
            <p className="text-muted-foreground mb-4">No active plans yet.</p>
            <Link href="/shop" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              Browse plans →
            </Link>
          </div>
        )}
      </section>

      {/* Recent orders */}
      {orders && orders.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/portal/orders" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="border rounded-xl overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-right px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => {
                  const price = order.prices as { unit_amount: number; currency: string } | null;
                  const product = order.products as { name: string } | null;
                  return (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{product?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {price ? formatPrice(price.unit_amount, price.currency) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === "paid" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Manage billing CTA */}
      <section className="border rounded-xl p-6 bg-card flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-semibold">Manage billing</h3>
          <p className="text-sm text-muted-foreground">Update payment method, download invoices, or cancel subscriptions.</p>
        </div>
        <form action="/api/stripe/portal" method="POST">
          <button type="submit" className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
            Open billing portal →
          </button>
        </form>
      </section>
    </div>
  );
}
