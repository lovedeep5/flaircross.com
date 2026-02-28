"use client";

import { motion } from "framer-motion";
import {
    Code,
    Workflow,
    Bot,
    Zap,
    Phone,
    Server,
    Database,
    LineChart
} from "lucide-react";


const services = [
    {
        icon: <Workflow className="h-8 w-8 text-primary" />,
        title: "End-to-End Automation",
        description: "Replace manual data entry with intelligent n8n and Zapier workflows that run 24/7 without intervention."
    },
    {
        icon: <Bot className="h-8 w-8 text-primary" />,
        title: "Custom AI Agents",
        description: "Deploy autonomous AI employees that handle customer support, sales qualification, and complex data processing."
    },
    {
        icon: <Phone className="h-8 w-8 text-primary" />,
        title: "Voice AI Pipelines",
        description: "Automate outbound and inbound calls with OpenCall. Qualify leads and book appointments while you sleep."
    },
    {
        icon: <Code className="h-8 w-8 text-primary" />,
        title: "Modern Web Apps",
        description: "High-performance client portals and internal dashboards built with Next.js, React, and Tailwind CSS."
    },
    {
        icon: <Server className="h-8 w-8 text-primary" />,
        title: "Self-Hosted Infrastructure",
        description: "We set up and manage your own n8n, Supabase, and AI instances to cut SaaS costs by up to 70%."
    },
    {
        icon: <Database className="h-8 w-8 text-primary" />,
        title: "API Integration",
        description: "Connect disconnected tools. We build custom API bridges to make your CRM, ERP, and marketing tools talk to each other."
    }
];


export function Services() {
    return (
        <section id="services" className="py-24 bg-secondary/5">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full"
                    >
                        What We Do
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
                    >
                        Specialized Automation Services
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        We don't just build websites. We build systems that run your business for you.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-8 rounded-2xl border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="mb-6 bg-primary/10 w-14 h-14 flex items-center justify-center rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
