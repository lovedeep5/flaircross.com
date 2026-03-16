import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | FlairCross Consultants",
  description:
    "Workflow automation, AI agent development, voice AI pipelines, modern web apps, self-hosted infrastructure, and API integration — all from one team.",
  alternates: {
    canonical: "https://flarecross.com/services",
  },
  openGraph: {
    title: "Services | FlairCross Consultants",
    description:
      "Workflow automation, AI agents, voice AI, web apps, and infrastructure — all from one team.",
    url: "https://flarecross.com/services",
    siteName: "FlairCross Consultants",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlairCross Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | FlairCross Consultants",
    description:
      "Workflow automation, AI agents, voice AI, web apps, and infrastructure — all from one team.",
    images: ["/og-image.png"],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
