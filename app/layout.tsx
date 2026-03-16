import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://flarecross.com"),
  title: {
    default: "FlairCross — n8n Automation, AI Agents & Workflow Development Agency",
    template: "%s | FlairCross",
  },
  description:
    "FlairCross builds custom n8n workflows, AI agents, voice AI pipelines, and modern web applications that eliminate manual work and save 20+ hours per week. Expert Zapier, HubSpot, OpenCall, and CRM automation consultants serving businesses worldwide.",
  keywords: [
    "n8n automation agency",
    "n8n workflow developer",
    "business process automation",
    "AI agent development",
    "Zapier consultant",
    "workflow automation services",
    "OpenCall voice AI",
    "HubSpot automation",
    "self-hosted n8n",
    "custom AI agents",
    "automation consulting",
    "CRM integration",
    "no-code automation",
    "AI workflow builder",
    "n8n developer for hire",
  ],
  authors: [{ name: "FlairCross Consultants", url: "https://flarecross.com" }],
  creator: "FlairCross Consultants",
  alternates: {
    canonical: "https://flarecross.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flarecross.com",
    title: "FlairCross — n8n Automation, AI Agents & Workflow Development",
    description:
      "Custom n8n workflows, AI agents, and voice AI pipelines that eliminate manual work and save 20+ hours/week. Serving businesses worldwide.",
    siteName: "FlairCross Consultants",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlairCross Consultants — Automation & AI Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@flarecross",
    creator: "@flarecross",
    title: "FlairCross — n8n Automation, AI Agents & Workflow Development",
    description:
      "Custom n8n workflows, AI agents, and voice AI pipelines that eliminate manual work and save 20+ hours/week.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FlairCross Consultants",
  url: "https://flarecross.com",
  logo: "https://flarecross.com/logo.png",
  description:
    "FlairCross builds custom n8n automation workflows, AI agents, and voice AI pipelines for growing businesses.",
  sameAs: [
    "https://twitter.com/flarecross",
    "https://linkedin.com/company/flarecross",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "contact@flarecross.com",
    availableLanguage: "English",
  },
  areaServed: "Worldwide",
  knowsAbout: [
    "n8n workflow automation",
    "Zapier automation",
    "AI agent development",
    "business process automation",
    "voice AI pipelines",
    "OpenCall",
    "HubSpot automation",
    "CRM integration",
    "Next.js development",
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "FlairCross Consultants",
  url: "https://flarecross.com",
  priceRange: "$$",
  description:
    "Custom automation, AI agent, and web development services for businesses that want to eliminate manual work.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Automation & Development Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "n8n Workflow Automation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Agent Development" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Voice AI Pipelines (OpenCall)" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Zapier Automation Consulting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "HubSpot CRM Automation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Next.js Web Application Development" } },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
