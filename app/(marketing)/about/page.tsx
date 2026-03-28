"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Check,
  Users,
  Zap,
  Globe,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Automation-First Thinking",
    description:
      "Every engagement starts with the question: what can we eliminate, automate, or accelerate?",
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Client-Centric Delivery",
    description:
      "We embed into your team, learn your ops, and build systems that fit how you actually work.",
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" />,
    title: "Full-Stack Capability",
    description:
      "From n8n workflows to Next.js dashboards to voice AI pipelines — one team handles the lot.",
  },
];

const strengths = [
  "Deep n8n, Zapier, and Make expertise",
  "AI agent design and deployment",
  "Voice AI with OpenCall and Twilio",
  "Production Next.js and React applications",
  "Self-hosted infrastructure management",
  "CRM and ERP integration specialists",
];

export default function AboutPage() {
  return (
    <main className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Hero */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full"
          >
            About Us
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            We build the systems that run your business
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            FlairCross is a consulting studio that designs and deploys custom
            automation, AI agents, and modern web applications for businesses
            that refuse to stay manual.
          </motion.p>
        </div>

        {/* Story */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 mb-24"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                FlairCross started with a simple observation: most businesses
                are drowning in repetitive work that software should be handling.
                CRM updates, invoice processing, lead follow-ups, reporting —
                hours lost every week to tasks that a well-built workflow can do
                in seconds.
              </p>
              <p>
                We set out to fix that. Today we design end-to-end automation
                systems using n8n, Zapier, AI agents, and custom code — paired
                with modern web apps that give teams real-time visibility into
                everything that&apos;s running.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { stat: "100+", label: "Projects Delivered" },
              { stat: "50+", label: "Active Automations" },
              { stat: "24/7", label: "Systems Running" },
              { stat: "12+", label: "Countries Served" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border bg-card text-center"
              >
                <h3 className="text-3xl font-bold text-primary mb-1">
                  {item.stat}
                </h3>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Values */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              How We Work
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three principles guide every project we take on.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-4 bg-primary/10 w-12 h-12 flex items-center justify-center rounded-xl">
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Strengths */}
        <section className="mb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                What We Bring to the Table
              </h2>
              <div className="space-y-4">
                {strengths.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="p-8 rounded-2xl border bg-primary/5">
              <h3 className="text-xl font-semibold mb-4">
                Built for businesses that move fast
              </h3>
              <p className="text-muted-foreground mb-6">
                Whether you&apos;re a 5-person agency or a 200-person SaaS company,
                we scope, build, and ship automation systems on predictable
                timelines — no bloated retainers, no scope creep.
              </p>
              <Button asChild>
                <Link href="/contact">
                  Work With Us <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
