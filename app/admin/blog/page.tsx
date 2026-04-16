"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  status: "draft" | "published";
  featured: boolean;
  published_at: string | null;
  created_at: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function loadPosts() {
    const res = await fetch("/api/admin/blog");
    if (res.ok) {
      setPosts(await res.json());
    } else {
      setError("Failed to load posts");
    }
    setLoading(false);
  }

  useEffect(() => { loadPosts(); }, []);

  async function toggleStatus(post: BlogPost) {
    const newStatus = post.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, status: newStatus }),
    });
    if (res.ok) {
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, status: newStatus } : p));
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + New Post
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by title or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="border rounded-xl overflow-hidden bg-card">
        {loading ? (
          <p className="text-sm text-muted-foreground p-6">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground p-6">
            {search ? "No posts match your search." : "No blog posts yet. Create your first post!"}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Published</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Featured</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="font-medium hover:text-primary transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {post.category || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {post.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {post.featured ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Featured
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(post)}
                        className="text-xs px-2 py-1 border rounded hover:bg-accent transition-colors"
                      >
                        {post.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="text-xs px-2 py-1 border rounded hover:bg-accent transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-xs px-2 py-1 border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
