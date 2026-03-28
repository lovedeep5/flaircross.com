import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About FlairCross | Automation & AI Consultants",
  description:
    "FlairCross is a consulting studio that designs and deploys custom automation, AI agents, and modern web applications for businesses that refuse to stay manual.",
  alternates: {
    canonical: "https://flarecross.com/about",
  },
  openGraph: {
    title: "About FlairCross | Automation & AI Consultants",
    description:
      "Custom automation, AI agents, and modern web apps — built by a team that lives and breathes workflow engineering.",
    url: "https://flarecross.com/about",
    siteName: "FlairCross Consultants",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About FlairCross Consultants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About FlairCross | Automation & AI Consultants",
    description:
      "Custom automation, AI agents, and modern web apps — built by a team that lives and breathes workflow engineering.",
    images: ["/og-image.png"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
