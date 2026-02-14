import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { blogPosts } from "@/lib/blogPosts";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function BlogPreview() {
  const featuredPosts = [...blogPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);

  return (
    <section id="blog" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-widest text-primary mb-2">
              Insights
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Practical playbooks from the automation floor
            </h2>
            <p className="text-muted-foreground text-lg">
              We document what works as we ship workflow systems, AI agents, and
              voice automation. Expect frameworks you can reuse, not recycled
              press releases.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-primary"
          >
            Visit the blog <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <article
              key={post.slug}
              className="group border rounded-2xl p-6 h-full bg-card shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                <span>{post.category}</span>
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {formatter.format(new Date(post.publishedAt))}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground mb-6">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-6">
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
                className="inline-flex items-center text-sm font-semibold text-primary"
              >
                Read article <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
