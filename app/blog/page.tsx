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
  title: "Automation & AI Blog | FlairCross Consultants",
  description:
    "Practical guides, playbooks, and case studies on n8n automation, AI agents, voice AI, HubSpot workflows, and business process automation — from the FlairCross team.",
  alternates: {
    canonical: "https://flarecross.com/blog",
  },
  openGraph: {
    title: "Automation & AI Blog | FlairCross Consultants",
    description:
      "Practical guides on n8n, Zapier, AI agents, voice AI, and business process automation.",
    url: "https://flarecross.com/blog",
    siteName: "FlairCross Consultants",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlairCross Automation & AI Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automation & AI Blog | FlairCross Consultants",
    description:
      "Practical guides on n8n, Zapier, AI agents, voice AI, and business process automation.",
    images: ["/og-image.png"],
  },
};

const blogListJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "FlairCross Automation & AI Blog",
  description:
    "Practical guides and playbooks on business process automation, n8n workflows, AI agents, and voice AI.",
  url: "https://flarecross.com/blog",
  publisher: {
    "@type": "Organization",
    name: "FlairCross Consultants",
    url: "https://flarecross.com",
  },
};

export default function BlogPage() {
  const posts = [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const featured = posts.filter((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <main className="py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }}
      />

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-16">
          <p className="text-sm uppercase tracking-widest text-primary mb-3">
            Blog
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Automation playbooks and AI field notes
          </h1>
          <p className="text-lg text-muted-foreground">
            We turn client work into reusable frameworks — covering n8n
            orchestration, AI agent design, voice AI pipelines, and the
            web platforms that hold it all together.
          </p>
        </div>

        {featured.length > 0 && (
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
              Featured
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {featured.map((post) => (
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
        )}

        {rest.length > 0 && (
          <>
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
              All posts
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {rest.map((post) => (
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
          </>
        )}
      </div>
    </main>
  );
}
