"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BundleItem = { description: string };

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    type: string;
    status: string;
    is_public: boolean;
    unit_amount: number;
    currency: string;
    interval: string;
    bundle_items: BundleItem[];
  };
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [shortDesc, setShortDesc] = useState(initialData?.short_description ?? "");
  const [type, setType] = useState(initialData?.type ?? "one_time");
  const [status, setStatus] = useState(initialData?.status ?? "active");
  const [isPublic, setIsPublic] = useState(initialData?.is_public ?? true);
  const [amount, setAmount] = useState(initialData?.unit_amount ? String(initialData.unit_amount / 100) : "");
  const [currency, setCurrency] = useState(initialData?.currency ?? "usd");
  const [interval, setIntervalVal] = useState(initialData?.interval ?? "month");
  const [bundleItems, setBundleItems] = useState<BundleItem[]>(initialData?.bundle_items ?? [{ description: "" }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function autoSlug(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function addBundleItem() {
    setBundleItems([...bundleItems, { description: "" }]);
  }

  function updateBundleItem(idx: number, val: string) {
    const updated = [...bundleItems];
    updated[idx].description = val;
    setBundleItems(updated);
  }

  function removeBundleItem(idx: number) {
    setBundleItems(bundleItems.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      name, slug, description, short_description: shortDesc, type, status,
      is_public: isPublic,
      unit_amount: Math.round(parseFloat(amount) * 100),
      currency,
      interval: type === "subscription" ? interval : null,
      bundle_items: type === "bundle" ? bundleItems.filter((b) => b.description.trim()) : [],
    };

    const url = isEditing ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to save product");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border rounded-xl p-6 bg-card space-y-4">
        <h2 className="font-semibold">Basic Info</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">Product name *</label>
          <input required value={name} onChange={(e) => { setName(e.target.value); if (!isEditing) setSlug(autoSlug(e.target.value)); }}
            className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Starter Website Build" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Slug (URL) *</label>
          <input required value={slug} onChange={(e) => setSlug(autoSlug(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            placeholder="starter-website-build" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Short description (shown on cards)</label>
          <input value={shortDesc} onChange={(e) => setShortDesc(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="One-line summary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Full description</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Detailed description shown on the product page" />
        </div>
      </div>

      <div className="border rounded-xl p-6 bg-card space-y-4">
        <h2 className="font-semibold">Product Type</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "one_time", label: "One-time", desc: "Single payment" },
            { value: "subscription", label: "Subscription", desc: "Recurring billing" },
            { value: "bundle", label: "Bundle", desc: "Package of services" },
          ].map((t) => (
            <label key={t.value} className={`border rounded-xl p-4 cursor-pointer transition-colors ${type === t.value ? "border-primary bg-primary/5" : "hover:border-muted-foreground/50"}`}>
              <input type="radio" name="type" value={t.value} checked={type === t.value} onChange={() => setType(t.value)} className="sr-only" />
              <p className="font-medium text-sm">{t.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
            </label>
          ))}
        </div>

        {type === "bundle" && (
          <div>
            <label className="block text-sm font-medium mb-2">What&apos;s included</label>
            <div className="space-y-2">
              {bundleItems.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input value={item.description} onChange={(e) => updateBundleItem(idx, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Item ${idx + 1}, e.g. Custom Next.js website`} />
                  {bundleItems.length > 1 && (
                    <button type="button" onClick={() => removeBundleItem(idx)} className="px-3 py-2 border rounded-lg text-sm text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors">✕</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addBundleItem} className="mt-2 text-sm text-primary hover:underline">+ Add item</button>
          </div>
        )}
      </div>

      <div className="border rounded-xl p-6 bg-card space-y-4">
        <h2 className="font-semibold">Pricing</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-1.5">Price *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <input required type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-6 pr-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="99.00" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="gbp">GBP</option>
              <option value="inr">INR</option>
            </select>
          </div>
          {type === "subscription" && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Billing interval</label>
              <select value={interval} onChange={(e) => setIntervalVal(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
                <option value="week">Weekly</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="border rounded-xl p-6 bg-card space-y-4">
        <h2 className="font-semibold">Visibility & Status</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1.5">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Visibility</label>
            <select value={isPublic ? "public" : "private"} onChange={(e) => setIsPublic(e.target.value === "public")}
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="public">Public (visible in shop)</option>
              <option value="private">Private (user-specific only)</option>
            </select>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">{error}</p>}

      <div className="flex gap-3 justify-between">
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            {saving ? "Saving…" : isEditing ? "Update Product" : "Create Product"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
            Cancel
          </button>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={async () => {
              if (!confirm("Delete this product? This cannot be undone.")) return;
              const res = await fetch(`/api/admin/products/${initialData!.id}`, { method: "DELETE" });
              if (res.ok) { router.push("/admin/products"); router.refresh(); }
              else { const d = await res.json(); setError(d.error ?? "Delete failed"); }
            }}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}
