"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BundleItem = { description: string };

interface User {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  role: string;
  stripe_customer_id: string | null;
  created_at: string;
}

interface Subscription {
  id: string;
  status: string;
  current_period_end: string | null;
  products: { name: string } | null;
}

interface Order {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  products: { name: string } | null;
}

interface AssignedProduct {
  id: string;
  name: string;
  type: string;
  status: string;
  prices: { unit_amount: number; currency: string; interval: string | null }[];
}

interface Props {
  user: User;
  subscriptions: Subscription[];
  orders: Order[];
  assignedProducts: AssignedProduct[];
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  trialing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  past_due: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  canceled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

export function UserDetailClient({ user, subscriptions, orders, assignedProducts: initAssigned }: Props) {
  const router = useRouter();
  const [role, setRole] = useState(user.role);
  const [savingRole, setSavingRole] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [assigned, setAssigned] = useState(initAssigned);

  // Assign form state
  const [aName, setAName] = useState("");
  const [aDesc, setADesc] = useState("");
  const [aShortDesc, setAShortDesc] = useState("");
  const [aType, setAType] = useState("subscription");
  const [aAmount, setAAmount] = useState("");
  const [aCurrency, setACurrency] = useState("usd");
  const [aInterval, setAInterval] = useState("month");
  const [aBundleItems, setABundleItems] = useState<BundleItem[]>([{ description: "" }]);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");

  async function saveRole(newRole: string) {
    setSavingRole(true);
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setRole(newRole);
    setSavingRole(false);
    router.refresh();
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    setAssignError("");
    setAssigning(true);

    const res = await fetch(`/api/admin/users/${user.id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: aName,
        description: aDesc,
        short_description: aShortDesc,
        type: aType,
        unit_amount: Math.round(parseFloat(aAmount) * 100),
        currency: aCurrency,
        interval: aType === "subscription" ? aInterval : null,
        bundle_items: aType === "bundle" ? aBundleItems.filter((b) => b.description.trim()) : [],
      }),
    });

    const data = await res.json();
    setAssigning(false);

    if (!res.ok) {
      setAssignError(data.error ?? "Failed to assign product");
      return;
    }

    setAssigned((prev) => [...prev, { id: data.id, name: data.name, type: data.type, status: data.status, prices: [] }]);
    setShowAssign(false);
    setAName(""); setADesc(""); setAShortDesc(""); setAAmount(""); setABundleItems([{ description: "" }]);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
        <h1 className="text-2xl font-bold">{user.full_name || user.email}</h1>
      </div>

      {/* Profile card */}
      <div className="border rounded-xl p-6 bg-card space-y-3">
        <h2 className="font-semibold">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div><span className="text-muted-foreground">Email</span><p className="mt-0.5">{user.email}</p></div>
          <div><span className="text-muted-foreground">Company</span><p className="mt-0.5">{user.company_name || "—"}</p></div>
          <div><span className="text-muted-foreground">Phone</span><p className="mt-0.5">{user.phone || "—"}</p></div>
          <div><span className="text-muted-foreground">Joined</span><p className="mt-0.5">{new Date(user.created_at).toLocaleDateString()}</p></div>
          {user.stripe_customer_id && (
            <div><span className="text-muted-foreground">Stripe ID</span><p className="mt-0.5 font-mono text-xs">{user.stripe_customer_id}</p></div>
          )}
        </div>
        <div className="flex items-center gap-3 pt-2">
          <label className="text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => saveRole(e.target.value)}
            disabled={savingRole}
            className="px-3 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          >
            <option value="customer">customer</option>
            <option value="admin">admin</option>
          </select>
          {savingRole && <span className="text-xs text-muted-foreground">Saving…</span>}
        </div>
      </div>

      {/* Subscriptions */}
      <div className="border rounded-xl p-6 bg-card space-y-3">
        <h2 className="font-semibold">Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No subscriptions</p>
        ) : (
          <div className="divide-y text-sm">
            {subscriptions.map((s) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between gap-2">
                <span>{s.products?.name ?? "—"}</span>
                <div className="flex items-center gap-2">
                  {s.current_period_end && (
                    <span className="text-xs text-muted-foreground">until {new Date(s.current_period_end).toLocaleDateString()}</span>
                  )}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s.status] ?? "bg-muted text-muted-foreground"}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders */}
      <div className="border rounded-xl p-6 bg-card space-y-3">
        <h2 className="font-semibold">Orders</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders</p>
        ) : (
          <div className="divide-y text-sm">
            {orders.map((o) => (
              <div key={o.id} className="py-2.5 flex items-center justify-between gap-2">
                <span>{o.products?.name ?? "—"}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{new Intl.NumberFormat("en-US", { style: "currency", currency: o.currency.toUpperCase() }).format(o.amount / 100)}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] ?? "bg-muted text-muted-foreground"}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assigned private products */}
      <div className="border rounded-xl p-6 bg-card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Private / Assigned Products</h2>
          <button onClick={() => setShowAssign(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            + Assign Product
          </button>
        </div>
        {assigned.length === 0 ? (
          <p className="text-sm text-muted-foreground">No private products assigned to this user</p>
        ) : (
          <div className="divide-y text-sm">
            {assigned.map((p) => {
              const price = p.prices?.[0];
              return (
                <div key={p.id} className="py-2.5 flex items-center justify-between gap-2">
                  <span>{p.name}</span>
                  <div className="flex items-center gap-2">
                    {price && (
                      <span className="text-muted-foreground">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: price.currency.toUpperCase() }).format(price.unit_amount / 100)}
                        {price.interval ? `/${price.interval}` : ""}
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">{p.type}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Assign Product Modal */}
      {showAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Assign Custom Product</h3>
                <button onClick={() => setShowAssign(false)} className="text-muted-foreground hover:text-foreground text-xl leading-none">✕</button>
              </div>
              <p className="text-sm text-muted-foreground">This product will be created in Stripe and will only be visible to this user in their portal.</p>

              <form onSubmit={handleAssign} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Product name *</label>
                  <input required value={aName} onChange={(e) => setAName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. Custom Maintenance Plan" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Short description</label>
                  <input value={aShortDesc} onChange={(e) => setAShortDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="One-line summary shown to client" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full description</label>
                  <textarea rows={3} value={aDesc} onChange={(e) => setADesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Detailed description" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "one_time", label: "One-time" },
                      { value: "subscription", label: "Subscription" },
                      { value: "bundle", label: "Bundle" },
                    ].map((t) => (
                      <label key={t.value} className={`border rounded-lg p-2.5 cursor-pointer text-center text-sm transition-colors ${aType === t.value ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"}`}>
                        <input type="radio" name="aType" value={t.value} checked={aType === t.value} onChange={() => setAType(t.value)} className="sr-only" />
                        {t.label}
                      </label>
                    ))}
                  </div>
                </div>

                {aType === "bundle" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">What&apos;s included</label>
                    <div className="space-y-2">
                      {aBundleItems.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input value={item.description} onChange={(e) => { const u = [...aBundleItems]; u[idx].description = e.target.value; setABundleItems(u); }}
                            className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder={`Item ${idx + 1}`} />
                          {aBundleItems.length > 1 && (
                            <button type="button" onClick={() => setABundleItems(aBundleItems.filter((_, i) => i !== idx))} className="px-3 border rounded-lg text-sm text-muted-foreground hover:text-red-500 hover:border-red-300">✕</button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => setABundleItems([...aBundleItems, { description: "" }])} className="mt-2 text-sm text-primary hover:underline">+ Add item</button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Price *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <input required type="number" min="0" step="0.01" value={aAmount} onChange={(e) => setAAmount(e.target.value)}
                        className="w-full pl-6 pr-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="149.00" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Currency</label>
                    <select value={aCurrency} onChange={(e) => setACurrency(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                      <option value="gbp">GBP</option>
                      <option value="inr">INR</option>
                    </select>
                  </div>
                </div>

                {aType === "subscription" && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Billing interval</label>
                    <select value={aInterval} onChange={(e) => setAInterval(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="month">Monthly</option>
                      <option value="year">Yearly</option>
                      <option value="week">Weekly</option>
                    </select>
                  </div>
                )}

                {assignError && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">{assignError}</p>}

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={assigning} className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {assigning ? "Creating…" : "Create & Assign"}
                  </button>
                  <button type="button" onClick={() => setShowAssign(false)} className="px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
