"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Workflow,
  Bot,
  Phone,
  Code,
  Server,
  Database,
  Globe,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    icon: <Workflow className="h-8 w-8" />,
    title: "End-to-End Automation",
    description:
      "Replace manual data entry with intelligent n8n and Zapier workflows that run 24/7 without intervention.",
    features: [
      "n8n and Zapier workflow design",
      "Multi-step data pipelines",
      "Error handling and retry logic",
      "Slack, email, and webhook notifications",
    ],
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: "Custom AI Agents",
    description:
      "Deploy autonomous AI employees that handle support, sales qualification, and complex data processing.",
    features: [
      "GPT / Claude agent orchestration",
      "RAG pipelines with your data",
      "Tool-calling and function execution",
      "Human-in-the-loop escalation",
    ],
  },
  {
    icon: <Phone className="h-8 w-8" />,
    title: "Voice AI Pipelines",
    description:
      "Automate outbound and inbound calls with OpenCall. Qualify leads and book appointments while you sleep.",
    features: [
      "OpenCall and Twilio integration",
      "Real-time call transcription",
      "CRM auto-updates post-call",
      "Appointment booking flows",
    ],
  },
  {
    icon: <Code className="h-8 w-8" />,
    title: "Modern Web Applications",
    description:
      "High-performance client portals and internal dashboards built with Next.js, React, and Tailwind CSS.",
    features: [
      "Next.js and React development",
      "Admin dashboards and portals",
      "API design and integration",
      "Responsive, accessible UI",
    ],
  },
  {
    icon: <Server className="h-8 w-8" />,
    title: "Self-Hosted Infrastructure",
    description:
      "We set up and manage your own n8n, Supabase, and AI instances to cut SaaS costs by up to 70%.",
    features: [
      "n8n self-hosted deployment",
      "Supabase and Postgres setup",
      "Docker and VPS management",
      "Monitoring and uptime alerts",
    ],
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: "API & CRM Integration",
    description:
      "Connect disconnected tools. We build custom API bridges to make your CRM, ERP, and marketing stack talk.",
    features: [
      "HubSpot, Salesforce, Pipedrive",
      "Stripe and billing automation",
      "Custom REST and GraphQL APIs",
      "Data sync and deduplication",
    ],
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Website Design & Development",
    description:
      "Fast, beautiful websites that convert. We design and build from scratch — no page builders, no bloat, just clean Next.js.",
    features: [
      "Custom design (no templates)",
      "Next.js + Tailwind CSS build",
      "SEO-optimised from day one",
      "Hosting, domain, and SSL setup",
    ],
    cta: { label: "View packages", href: "/shop" },
  },
  {
    icon: <Layers className="h-8 w-8" />,
    title: "WordPress → Next.js Migration",
    description:
      "Escape slow WordPress sites. We migrate your content and rebuild in Next.js — same URLs, faster load times, lower hosting cost.",
    features: [
      "Full content migration (posts, pages, media)",
      "Zero broken links — all URLs preserved",
      "Managed hosting included",
      "Ongoing maintenance plan available",
    ],
    cta: { label: "Get a quote", href: "/contact" },
  },
];

export default function ServicesPage() {
  return (
    <main className="pt-28 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Hero */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full"
          >
            Services
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Everything you need to stop doing busy work
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            From workflow automation to AI agents to full-stack web apps — we
            handle the build so you can focus on growth.
          </motion.p>
        </div>

        {/* Ecosystem image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mb-20 rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/10 blur-3xl scale-95 opacity-50" />
          <Image
            src="/services-ecosystem.jpg"
            alt="FlairCross automation services ecosystem"
            width={1200}
            height={500}
            className="relative w-full object-cover rounded-2xl border border-border shadow-2xl max-h-[420px]"
          />
        </motion.div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group"
            >
              <div className="mb-6 bg-primary/10 w-14 h-14 flex items-center justify-center rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {service.icon}
              </div>
              <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {"cta" in service && service.cta && (
                <div className="mt-6">
                  <Link href={service.cta.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                    {service.cta.label} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border bg-primary/5 p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Not sure which service fits?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Book a free 30-minute strategy call. We&apos;ll map out exactly what
            can be automated in your business and give you a clear plan.
          </p>
          <Button size="lg" className="h-12 px-8 text-base font-semibold" asChild>
            <Link href="/contact">
              Book a Free Strategy Call <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
