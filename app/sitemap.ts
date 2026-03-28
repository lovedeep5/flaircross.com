import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blogPosts";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `https://flarecross.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  let products: { slug: string; updated_at: string }[] | null = null;
  try {
    const result = await supabaseAdmin
      .from("products")
      .select("slug, updated_at")
      .eq("status", "active")
      .eq("is_public", true);
    products = result.data;
  } catch {
    // Skip shop entries if DB not configured yet
  }

  const shopEntries: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `https://flarecross.com/shop/${p.slug}`,
    lastModified: new Date(p.updated_at ?? new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://flarecross.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://flarecross.com/services",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://flarecross.com/shop",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://flarecross.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://flarecross.com/pricing",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://flarecross.com/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://flarecross.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
    ...shopEntries,
  ];
}
