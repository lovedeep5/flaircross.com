import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CalendarClock } from "lucide-react";

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
    return {
      title: "FlairCross Blog",
    };
  }

  return {
    title: `${post.title} | FlairCross Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="py-12 md:py-20">
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
                  <p key={idx} className="text-lg leading-relaxed text-muted-foreground mb-4">
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
      </div>
    </main>
  );
}
