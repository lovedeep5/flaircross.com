"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$499",
    period: "one-time",
    description: "A single automation or integration project, delivered fast.",
    features: [
      "1 automation workflow (n8n or Zapier)",
      "Up to 5 connected apps",
      "Error handling and logging",
      "Documentation and handoff",
      "7 days of post-launch support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$1,499",
    period: "per month",
    description:
      "Ongoing automation and development for teams scaling operations.",
    features: [
      "Unlimited workflow requests",
      "AI agent development",
      "Priority Slack support",
      "Weekly strategy calls",
      "Infrastructure management",
      "CRM and API integrations",
    ],
    cta: "Book a Call",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored",
    description:
      "Dedicated team for large-scale automation and AI transformation.",
    features: [
      "Everything in Growth",
      "Dedicated project lead",
      "Voice AI pipeline setup",
      "Custom web app development",
      "SLA and uptime guarantees",
      "On-call weekend support",
    ],
    cta: "Talk to Us",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "Do you offer one-time projects or only retainers?",
    a: "Both. The Starter plan is a one-time engagement. Growth and Enterprise are monthly retainers with predictable output.",
  },
  {
    q: "What if I need something not listed here?",
    a: "We scope every engagement individually. Book a call and we'll put together a plan that fits your exact needs.",
  },
  {
    q: "How fast do you deliver?",
    a: "Starter projects ship in 1-2 weeks. Growth retainer requests are turned around in 2-5 business days depending on complexity.",
  },
  {
    q: "Can I pause or cancel the monthly plan?",
    a: "Yes. Monthly plans can be paused or cancelled at any time with 30 days notice. No lock-in contracts.",
  },
];

export default function PricingPage() {
  return (
    <main className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full"
          >
            Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Simple, transparent pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            No hidden fees. No surprise invoices. Pick a plan or book a call to
            discuss a custom scope.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-24 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-2xl border transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                  : "bg-card hover:shadow-lg"
              }`}
            >
              {plan.highlighted && (
                <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                  Most Popular
                </span>
              )}
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2 text-sm">
                  {plan.period}
                </span>
              </div>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
                asChild
              >
                <Link href="/contact">
                  {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl border bg-card"
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
