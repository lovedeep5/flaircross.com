"use client";

import { useEffect, useState } from "react";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  async function loadKeys() {
    const res = await fetch("/api/admin/api-keys");
    if (res.ok) setKeys(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadKeys(); }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setGenerating(true);

    const res = await fetch("/api/admin/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: keyName }),
    });

    if (res.ok) {
      const data = await res.json();
      setRevealedKey(data.rawKey);
      setKeyName("");
      setShowForm(false);
      await loadKeys();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to generate key");
    }
    setGenerating(false);
  }

  async function handleRevoke(id: string, name: string) {
    if (!confirm(`Revoke API key "${name}"? Any integrations using this key will stop working.`)) return;
    const res = await fetch(`/api/admin/api-keys/${id}`, { method: "DELETE" });
    if (res.ok) {
      setKeys((prev) => prev.map((k) => k.id === id ? { ...k, is_active: false } : k));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Use these keys to publish blog posts via HTTP — e.g. from AI workflows or automation tools.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            + Generate Key
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleGenerate} className="border rounded-xl p-5 bg-card space-y-4 max-w-md">
          <h2 className="text-sm font-semibold">New API Key</h2>
          <div className="space-y-1">
            <label className="text-sm font-medium">Key Name *</label>
            <input
              type="text"
              required
              autoFocus
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g. n8n Workflow Bot, Claude Agent"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={generating}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {generating ? "Generating..." : "Generate Key"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(""); }}
              className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* One-time key reveal modal */}
      {revealedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border rounded-xl p-6 max-w-lg w-full mx-4 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold">API Key Generated</h2>
                <p className="text-sm text-red-500 font-medium mt-0.5">
                  Copy this key now. It will not be shown again.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <code className="text-xs break-all font-mono select-all">{revealedKey}</code>
            </div>
            <p className="text-xs text-muted-foreground">
              Use this as the <code className="bg-muted px-1 py-0.5 rounded">X-API-Key</code> header when calling{" "}
              <code className="bg-muted px-1 py-0.5 rounded">POST /api/blog/publish</code>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(revealedKey)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Copy Key
              </button>
              <button
                onClick={() => setRevealedKey(null)}
                className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                I&apos;ve saved it — Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border rounded-xl overflow-hidden bg-card">
        {loading ? (
          <p className="text-sm text-muted-foreground p-6">Loading...</p>
        ) : keys.length === 0 ? (
          <p className="text-sm text-muted-foreground p-6">
            No API keys yet. Generate one to start publishing via HTTP.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Key Prefix</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Last Used</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Created</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {keys.map((key) => (
                <tr key={key.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{key.name}</td>
                  <td className="px-4 py-3">
                    <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
                      {key.key_prefix}…
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        key.is_active
                          ? "bg-green-500/10 text-green-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {key.is_active ? "Active" : "Revoked"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                    {key.last_used_at
                      ? new Date(key.last_used_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "Never"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                    {new Date(key.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {key.is_active ? (
                      <button
                        onClick={() => handleRevoke(key.id, key.name)}
                        className="text-xs px-2 py-1 border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors"
                      >
                        Revoke
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="border rounded-xl p-5 bg-muted/30 space-y-3 max-w-2xl">
        <h2 className="text-sm font-semibold">HTTP API Usage</h2>
        <p className="text-xs text-muted-foreground">Publish a post via HTTP request:</p>
        <pre className="text-xs bg-card border rounded-lg p-4 overflow-x-auto font-mono whitespace-pre-wrap">
{`POST /api/blog/publish
X-API-Key: <your-key>
Content-Type: application/json

{
  "slug": "my-post-slug",
  "title": "Post Title",
  "description": "SEO meta description",
  "excerpt": "Short teaser for listing cards",
  "content": "# Heading\\n\\nMarkdown content here...",
  "category": "Automation Strategy",
  "readingTime": "6 min read",
  "tags": ["AI", "Automation"],
  "featured": false,
  "status": "published"
}`}
        </pre>
        <p className="text-xs text-muted-foreground">
          Posting the same <code className="bg-card px-1 py-0.5 rounded border">slug</code> again updates the existing post (upsert).
        </p>
      </div>
    </div>
  );
}
