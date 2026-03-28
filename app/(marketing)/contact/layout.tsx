import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | FlairCross Consultants",
  description:
    "Get in touch with FlairCross for automation, AI agent development, and web application projects. Free 30-minute strategy call available.",
  alternates: {
    canonical: "https://flarecross.com/contact",
  },
  openGraph: {
    title: "Contact | FlairCross Consultants",
    description:
      "Get in touch for automation, AI agents, and web app projects. Free strategy call available.",
    url: "https://flarecross.com/contact",
    siteName: "FlairCross Consultants",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact FlairCross",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | FlairCross Consultants",
    description:
      "Get in touch for automation, AI agents, and web app projects. Free strategy call available.",
    images: ["/og-image.png"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
