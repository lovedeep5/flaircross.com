"use client";

import { useEffect, useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  role: string | null;
  body: string;
  rating: number;
  is_active: boolean;
  sort_order: number;
}

const blank = (): Omit<Testimonial, "id"> => ({ name: "", company: null, role: null, body: "", rating: 5, is_active: true, sort_order: 0 });

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(blank());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const r = await fetch("/api/admin/testimonials");
    const d = await r.json();
    setItems(d ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing(null); setForm(blank()); setError(""); }
  function openEdit(t: Testimonial) { setEditing(t); setForm({ name: t.name, company: t.company, role: t.role, body: t.body, rating: t.rating, is_active: t.is_active, sort_order: t.sort_order }); setError(""); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const url = editing ? `/api/admin/testimonials/${editing.id}` : "/api/admin/testimonials";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Failed to save"); return; }
    await load();
    setEditing(undefined as unknown as Testimonial);
    setForm(blank());
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    await load();
  }

  const showForm = editing !== undefined;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">+ Add</button>
      </div>

      {showForm && (
        <div className="border rounded-xl p-6 bg-card space-y-4">
          <h2 className="font-semibold">{editing ? "Edit Testimonial" : "New Testimonial"}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Company</label>
                <input value={form.company ?? ""} onChange={(e) => setForm({ ...form, company: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Role/Title</label>
                <input value={form.role ?? ""} onChange={(e) => setForm({ ...form, role: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Rating</label>
                <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Testimonial *</label>
              <textarea required rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4" />
                Active (visible on site)
              </label>
              <div className="ml-auto flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Sort order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                  className="w-20 px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                {saving ? "Saving…" : editing ? "Update" : "Add Testimonial"}
              </button>
              <button type="button" onClick={() => setEditing(undefined as unknown as Testimonial)} className="px-5 py-2.5 border rounded-lg text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No testimonials yet. Add one above.</p>
        ) : items.map((t) => (
          <div key={t.id} className="border rounded-xl p-5 bg-card space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                {(t.role || t.company) && <p className="text-xs text-muted-foreground">{[t.role, t.company].filter(Boolean).join(" · ")}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${t.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-muted text-muted-foreground"}`}>
                  {t.is_active ? "Active" : "Hidden"}
                </span>
                <button onClick={() => openEdit(t)} className="text-xs text-primary hover:underline">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">&ldquo;{t.body}&rdquo;</p>
          </div>
        ))}
      </div>
    </div>
  );
}
