import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | FlairCross Consultants",
  description:
    "Simple, transparent pricing for automation, AI agent development, and web application projects. One-time engagements from $499 or monthly retainers from $1,499.",
  alternates: {
    canonical: "https://flarecross.com/pricing",
  },
  openGraph: {
    title: "Pricing | FlairCross Consultants",
    description:
      "Simple, transparent pricing for automation and AI projects. One-time from $499 or monthly from $1,499.",
    url: "https://flarecross.com/pricing",
    siteName: "FlairCross Consultants",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlairCross Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | FlairCross Consultants",
    description:
      "Simple, transparent pricing for automation and AI projects. One-time from $499 or monthly from $1,499.",
    images: ["/og-image.png"],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
