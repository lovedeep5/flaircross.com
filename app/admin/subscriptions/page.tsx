import { supabaseAdmin, requireAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

type SubRow = {
  id: string;
  status: string;
  current_period_end: string | null;
  created_at: string;
  profiles: { full_name: string | null; company_name: string | null } | null;
  products: { name: string } | null;
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  trialing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  past_due: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  canceled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  incomplete: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

export default async function AdminSubscriptionsPage() {
  try { await requireAdmin(); } catch { redirect("/portal/overview"); }

  const { data: rawSubs } = await supabaseAdmin
    .from("subscriptions")
    .select("id, status, current_period_end, created_at, products(name), profiles!user_id(full_name, company_name)")
    .order("created_at", { ascending: false });

  const subs = (rawSubs as unknown as SubRow[]) ?? [];
  const activeSubs = subs.filter((s) => s.status === "active" || s.status === "trialing");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <span className="text-sm text-muted-foreground">{activeSubs.length} active of {subs.length} total</span>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Plan</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Renews</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Started</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {!subs.length ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No subscriptions yet</td></tr>
            ) : subs.map((s) => (
              <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">{s.profiles?.full_name || s.profiles?.company_name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.products?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s.status] ?? "bg-muted text-muted-foreground"}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                  {new Date(s.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
