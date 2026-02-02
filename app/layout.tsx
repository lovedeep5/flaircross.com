import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { ThemeProvider } from "@/components/theme-provider";


const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FlairCross Consultants | Automation & Web Development",
  description: "Expert n8n, Zapier, and OpenCall automation services. Modern web design and development for scalable businesses.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flarecross.com",
    title: "FlairCross Consultants",
    description: "Expert n8n, Zapier, and OpenCall automation services.",
    siteName: "FlairCross Consultants",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlairCross Consultants",
    description: "Expert n8n, Zapier, and OpenCall automation services.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FlairCross Consultants",
  "url": "https://flarecross.com",
  "logo": "https://flarecross.com/logo.png",
  "sameAs": [
    "https://twitter.com/flarecross",
    "https://linkedin.com/company/flarecross"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "",
    "contactType": "customer service",
    "email": "contact@flarecross.com"
  }
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cn(
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
