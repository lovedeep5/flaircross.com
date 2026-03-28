import { createClient as createServerClient } from "./server";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — avoids build failures when env vars are not yet set
let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_adminClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().replace(/\s*#.*$/, "");
    if (!url || !key) throw new Error("Missing Supabase admin credentials");
    _adminClient = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  }
  return _adminClient;
}

// Proxy — preserves supabaseAdmin.from("table") call syntax across all files
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getSupabaseAdmin() as any)[prop];
  },
});

// Use in API routes to verify the caller is an admin
export async function requireAdmin() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((profile as any)?.role !== "admin") {
    throw new Error("Forbidden");
  }

  return user;
}
