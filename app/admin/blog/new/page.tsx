"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        title,
        description: description || null,
        excerpt: excerpt || null,
        content: content || null,
        category: category || null,
        reading_time: readingTime || null,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        featured,
        status,
      }),
    });

    if (res.ok) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create post");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Blog
        </Link>
        <h1 className="text-2xl font-bold">New Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium">Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slug) setSlug(generateSlug(e.target.value));
            }}
            placeholder="Post title"
            className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Slug *</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="url-friendly-slug"
              className="flex-1 px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
            />
            <button
              type="button"
              onClick={() => setSlug(generateSlug(title))}
              className="px-3 py-2 border rounded-lg text-sm hover:bg-accent transition-colors"
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Will appear as /blog/{slug || "your-slug"}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Automation Strategy"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Reading Time</label>
            <input
              type="text"
              value={readingTime}
              onChange={(e) => setReadingTime(e.target.value)}
              placeholder="e.g. 7 min read"
              className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Automation, n8n, AI (comma-separated)"
            className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">SEO Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description for search engines (155 chars recommended)"
            className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Excerpt</label>
          <textarea
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short teaser shown on the blog listing card"
            className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Content</label>
          <p className="text-xs text-muted-foreground">
            Supports Markdown — headings, bold, lists, blockquotes, and code blocks all render on the public blog.
          </p>
          <textarea
            rows={24}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="## Introduction&#10;&#10;Write your post in Markdown..."
            className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono resize-y"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded"
            />
            Featured post
          </label>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="px-3 py-1.5 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Post"}
          </button>
          <Link
            href="/admin/blog"
            className="px-5 py-2 border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
