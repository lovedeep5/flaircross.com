import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { stripe, formatPrice } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  let invoices: import("stripe").Stripe.Invoice[] = [];

  if (profile?.stripe_customer_id) {
    const result = await stripe.invoices.list({
      customer: profile.stripe_customer_id,
      limit: 24,
    });
    invoices = result.data;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Invoices</h1>

      {invoices.length > 0 ? (
        <div className="border rounded-xl overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium">Invoice</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-medium">Amount</th>
                <th className="text-right px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{inv.number ?? inv.id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {new Date(inv.created * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatPrice(inv.amount_due, inv.currency)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      inv.status === "paid" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      inv.status === "open" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-muted text-muted-foreground"
                    }`}>{inv.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {inv.invoice_pdf && (
                      <a href={inv.invoice_pdf} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">
                        Download
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border rounded-xl p-12 text-center bg-card">
          <p className="text-muted-foreground">No invoices yet.</p>
        </div>
      )}
    </div>
  );
}
