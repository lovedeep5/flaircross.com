import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

import { blogPosts, getPostBySlug } from "@/lib/blogPosts";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "FlairCross Blog" };
  }

  const publishedTime = new Date(post.publishedAt).toISOString();

  return {
    title: `${post.title} | FlairCross Blog`,
    description: post.description,
    alternates: {
      canonical: `https://flarecross.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime,
      url: `https://flarecross.com/blog/${post.slug}`,
      siteName: "FlairCross Consultants",
      tags: post.tags,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt ?? post.publishedAt).toISOString(),
    author: {
      "@type": "Organization",
      name: "FlairCross Consultants",
      url: "https://flarecross.com",
    },
    publisher: {
      "@type": "Organization",
      name: "FlairCross Consultants",
      url: "https://flarecross.com",
      logo: {
        "@type": "ImageObject",
        url: "https://flarecross.com/logo.png",
      },
    },
    image: "https://flarecross.com/og-image.png",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://flarecross.com/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
  };

  // Other posts for suggested reading
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 2);

  return (
    <main className="pt-28 pb-12 md:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-semibold text-primary mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to blog
        </Link>

        <article>
          <p className="text-sm uppercase tracking-widest text-primary mb-3">
            {post.category}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {post.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-b py-4 mb-10">
            <span className="inline-flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              {formatter.format(new Date(post.publishedAt))}
            </span>
            <span>{post.readingTime}</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            {post.content.map((block, index) => (
              <div key={`${post.slug}-${index}`}>
                {block.heading && (
                  <h2 className="text-2xl font-semibold mb-4">
                    {block.heading}
                  </h2>
                )}
                {block.body?.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-lg leading-relaxed text-muted-foreground mb-4"
                  >
                    {paragraph}
                  </p>
                ))}
                {block.list && (
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                    {block.list.map((item, idx) => (
                      <li key={idx} className="text-lg leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {block.highlight && (
                  <div className="mt-6 border-l-4 border-primary/60 bg-primary/5 p-4 rounded-r-xl text-base font-semibold">
                    {block.highlight}
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>

        {/* Lead-gen CTA */}
        <div className="mt-16 rounded-3xl border bg-primary/5 p-8 md:p-10 text-center">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
            Work with FlairCross
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to put this into practice?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            We design and build the automation systems described in our playbooks — for real businesses, on predictable timelines. Book a free 30-minute strategy call and we&apos;ll map out exactly what&apos;s possible for your workflow.
          </p>
          <Button size="lg" className="h-12 px-8 text-base font-semibold" asChild>
            <Link href="/#contact">
              Book a Free Strategy Call <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-6">Continue reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group block rounded-2xl border bg-card p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-2">
                    {related.category}
                  </p>
                  <h3 className="font-semibold text-lg leading-snug group-hover:text-primary transition-colors mb-2">
                    {related.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {related.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
