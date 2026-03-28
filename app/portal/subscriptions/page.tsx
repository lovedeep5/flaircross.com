import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatPrice, subscriptionStatusLabel } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*, products(name, description), prices(unit_amount, currency, interval, nickname)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Subscriptions</h1>

      {subscriptions && subscriptions.length > 0 ? (
        <div className="space-y-4">
          {subscriptions.map((sub) => {
            const statusInfo = subscriptionStatusLabel(sub.status);
            const price = sub.prices as { unit_amount: number; currency: string; interval: string; nickname: string } | null;
            const product = sub.products as { name: string; description: string } | null;
            return (
              <div key={sub.id} className="border rounded-xl p-6 bg-card space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-semibold text-lg">{product?.name ?? "Subscription"}</h3>
                    {product?.description && <p className="text-sm text-muted-foreground mt-1">{product.description}</p>}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                    statusInfo.color === "green" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    statusInfo.color === "red" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                    statusInfo.color === "yellow" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                    "bg-muted text-muted-foreground"
                  }`}>{statusInfo.label}</span>
                </div>

                {price && (
                  <p className="text-3xl font-bold">
                    {formatPrice(price.unit_amount, price.currency)}
                    <span className="text-base font-normal text-muted-foreground">/{price.interval}</span>
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  {sub.current_period_start && (
                    <div>
                      <p className="font-medium text-foreground">Period started</p>
                      <p>{new Date(sub.current_period_start).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                    </div>
                  )}
                  {sub.current_period_end && (
                    <div>
                      <p className="font-medium text-foreground">{sub.cancel_at_period_end ? "Cancels on" : "Renews on"}</p>
                      <p>{new Date(sub.current_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                    </div>
                  )}
                </div>

                {sub.status === "past_due" && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-400">
                    ⚠️ Your payment failed. Please update your payment method to restore access.
                  </div>
                )}

                <form action="/api/stripe/portal" method="POST">
                  <button type="submit" className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                    Manage billing →
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border rounded-xl p-12 text-center bg-card">
          <p className="text-muted-foreground mb-4">No subscriptions yet.</p>
          <a href="/shop" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Browse plans →
          </a>
        </div>
      )}
    </div>
  );
}
