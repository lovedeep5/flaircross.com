import { supabaseAdmin } from "@/lib/supabase/admin";
import { StripeToggle } from "@/components/admin/StripeToggle";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { data } = await supabaseAdmin
    .from("app_settings")
    .select("value")
    .eq("key", "stripe_test_mode")
    .single();

  const testMode = data?.value === "true";

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="border rounded-xl p-6 bg-card space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Stripe</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Switch between live and test mode without redeploying. Takes effect within 30 seconds across all server instances.
          </p>
        </div>
        <div className="border-t pt-4">
          <StripeToggle initialTestMode={testMode} />
        </div>
        <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1">
          <p className="font-medium">Active keys</p>
          <p className="text-muted-foreground font-mono text-xs">
            {testMode
              ? "sk_test_51TMv0iF… / pk_test_51TMv0iF…"
              : "sk_live_51TMuyr… / pk_live_51TMuyr…"}
          </p>
        </div>
      </div>
    </div>
  );
}
