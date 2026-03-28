import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(id);
    if (authError || !authUser.user) throw new Error("User not found");

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, company_name, phone, role, stripe_customer_id")
      .eq("id", id)
      .single();

    const { data: subscriptions } = await supabaseAdmin
      .from("subscriptions")
      .select("*, products(name, slug)")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("*, products(name, slug)")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    const { data: assignedProducts } = await supabaseAdmin
      .from("products")
      .select("id, name, slug, type, status, prices(*)")
      .eq("assigned_user_id", id)
      .eq("is_public", false);

    return NextResponse.json({
      id,
      email: authUser.user.email ?? "",
      full_name: profile?.full_name ?? null,
      company_name: profile?.company_name ?? null,
      phone: profile?.phone ?? null,
      role: profile?.role ?? "customer",
      stripe_customer_id: profile?.stripe_customer_id ?? null,
      created_at: authUser.user.created_at,
      subscriptions: subscriptions ?? [],
      orders: orders ?? [],
      assigned_products: assignedProducts ?? [],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const updates: Record<string, unknown> = {};
    if (body.role !== undefined) updates.role = body.role;
    if (body.full_name !== undefined) updates.full_name = body.full_name;
    if (body.company_name !== undefined) updates.company_name = body.company_name;

    const { error } = await supabaseAdmin.from("profiles").update(updates).eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}
