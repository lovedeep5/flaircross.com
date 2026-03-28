import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PortalNav } from "@/components/portal/PortalNav";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email:id")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-background flex">
      <PortalNav user={{ name: profile?.full_name || user.email || "Account", email: user.email || "" }} />
      <main className="flex-1 lg:pl-64">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
