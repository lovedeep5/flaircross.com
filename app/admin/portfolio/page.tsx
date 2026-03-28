"use client";

import { useEffect, useState } from "react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  url: string | null;
  image_url: string | null;
  tags: string[] | null;
  is_active: boolean;
  sort_order: number;
}

const blank = (): Omit<PortfolioItem, "id"> => ({
  title: "", description: null, category: null, url: null, image_url: null, tags: [], is_active: true, sort_order: 0,
});

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioItem | undefined>(undefined);
  const [form, setForm] = useState(blank());
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const r = await fetch("/api/admin/portfolio");
    const d = await r.json();
    setItems(d ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing(undefined); setForm(blank()); setTagsInput(""); setError(""); setShowForm(true); }
  function openEdit(p: PortfolioItem) {
    setEditing(p);
    setForm({ title: p.title, description: p.description, category: p.category, url: p.url, image_url: p.image_url, tags: p.tags ?? [], is_active: p.is_active, sort_order: p.sort_order });
    setTagsInput((p.tags ?? []).join(", "));
    setError("");
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const url = editing ? `/api/admin/portfolio/${editing.id}` : "/api/admin/portfolio";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, tags }) });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Failed to save"); return; }
    await load();
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this portfolio item?")) return;
    await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">+ Add</button>
      </div>

      {showForm && (
        <div className="border rounded-xl p-6 bg-card space-y-4">
          <h2 className="font-semibold">{editing ? "Edit Project" : "New Project"}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <input value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Web Development" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Live URL</label>
                <input type="url" value={form.url ?? ""} onChange={(e) => setForm({ ...form, url: e.target.value || null })}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Image URL</label>
              <input type="url" value={form.image_url ?? ""} onChange={(e) => setForm({ ...form, image_url: e.target.value || null })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/image.jpg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value || null })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tags (comma-separated)</label>
              <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Next.js, Automation, n8n" />
            </div>
            <div className="flex items-center gap-4">
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
                {saving ? "Saving…" : editing ? "Update" : "Add Project"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border rounded-lg text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No portfolio items yet. Add one above.</p>
        ) : items.map((p) => (
          <div key={p.id} className="border rounded-xl p-5 bg-card flex items-start gap-4">
            {p.image_url && (
              <img src={p.image_url} alt={p.title} className="w-20 h-14 object-cover rounded-lg shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{p.title}</p>
                  {p.category && <p className="text-xs text-muted-foreground">{p.category}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${p.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-muted text-muted-foreground"}`}>
                    {p.is_active ? "Active" : "Hidden"}
                  </span>
                  <button onClick={() => openEdit(p)} className="text-xs text-primary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
              {p.description && <p className="text-xs text-muted-foreground mt-1 truncate">{p.description}</p>}
              {p.tags && p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tags.map((tag) => <span key={tag} className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-xs">{tag}</span>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
