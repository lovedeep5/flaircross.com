import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { UserDetailClient } from "@/components/admin/UserDetailClient";

type RawSub = { id: string; status: string; current_period_end: string | null; products: { name: string }[] | { name: string } | null };
type RawOrder = { id: string; amount: number; currency: string; status: string; created_at: string; products: { name: string }[] | { name: string } | null };
type RawAssigned = { id: string; name: string; type: string; status: string; prices: { unit_amount: number; currency: string; interval: string | null }[] };

function normProd(p: unknown): { name: string } | null {
  if (!p) return null;
  return (Array.isArray(p) ? p[0] : p) as { name: string } | null;
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(id);
  if (!authUser?.user) notFound();

  const { data: profileData } = await supabaseAdmin
    .from("profiles")
    .select("full_name, company_name, phone, role, stripe_customer_id")
    .eq("id", id)
    .single();

  const profile = profileData as { full_name: string | null; company_name: string | null; phone: string | null; role: string; stripe_customer_id: string | null } | null;

  const { data: rawSubs } = await supabaseAdmin
    .from("subscriptions")
    .select("id, status, current_period_end, products(name)")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  const { data: rawOrders } = await supabaseAdmin
    .from("orders")
    .select("id, amount, currency, status, created_at, products(name)")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  const { data: rawAssigned } = await supabaseAdmin
    .from("products")
    .select("id, name, type, status, prices(unit_amount, currency, interval)")
    .eq("assigned_user_id", id)
    .eq("is_public", false);

  const subs = ((rawSubs ?? []) as unknown as RawSub[]).map((s) => ({
    id: s.id, status: s.status, current_period_end: s.current_period_end,
    products: normProd(s.products),
  }));

  const orders = ((rawOrders ?? []) as unknown as RawOrder[]).map((o) => ({
    id: o.id, amount: o.amount, currency: o.currency, status: o.status, created_at: o.created_at,
    products: normProd(o.products),
  }));

  const assignedProducts = ((rawAssigned ?? []) as unknown as RawAssigned[]).map((ap) => ({
    id: ap.id, name: ap.name, type: ap.type, status: ap.status,
    prices: Array.isArray(ap.prices) ? ap.prices : [],
  }));

  return (
    <UserDetailClient
      user={{
        id,
        email: authUser.user.email ?? "",
        full_name: profile?.full_name ?? null,
        company_name: profile?.company_name ?? null,
        phone: profile?.phone ?? null,
        role: profile?.role ?? "customer",
        stripe_customer_id: profile?.stripe_customer_id ?? null,
        created_at: authUser.user.created_at,
      }}
      subscriptions={subs}
      orders={orders}
      assignedProducts={assignedProducts}
    />
  );
}
