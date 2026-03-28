import { NextResponse } from "next/server";
import { requireAdmin, supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    await requireAdmin();

    // Get all auth users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    if (authError) throw authError;

    // Get all profiles
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, company_name, role");
    if (profileError) throw profileError;

    const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

    const users = authUsers.users.map((u) => {
      const profile = profileMap.get(u.id);
      return {
        id: u.id,
        email: u.email ?? "",
        full_name: profile?.full_name ?? null,
        company_name: profile?.company_name ?? null,
        role: profile?.role ?? "customer",
        created_at: u.created_at,
      };
    });

    return NextResponse.json(users);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" || msg === "Forbidden" ? 403 : 500 });
  }
}
