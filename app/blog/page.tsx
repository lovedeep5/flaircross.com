import Link from "next/link";
import { blogPosts } from "@/lib/blogPosts";
import { ArrowRight, CalendarClock } from "lucide-react";
import type { Metadata } from "next";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export const metadata: Metadata = {
  title: "Insights & Playbooks | FlairCross",
  description:
    "Articles on automation strategy, AI agents, and modern web delivery from the FlairCross team.",
};

export default function BlogPage() {
  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <main className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-sm uppercase tracking-widest text-primary mb-3">
            Blog
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Field notes from automation and AI builds
          </h1>
          <p className="text-lg text-muted-foreground">
            We turn client work into reusable frameworks—covering orchestration,
            AI agent design, and the web platforms that hold it all together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group border rounded-3xl p-8 bg-card shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span>{post.category}</span>
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {formatter.format(new Date(post.publishedAt))}
                </span>
              </div>
              <h2 className="text-2xl font-semibold mt-5 mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground mb-6">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center font-semibold text-primary"
              >
                Read post <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
