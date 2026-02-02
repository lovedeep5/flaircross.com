"use client";

import { motion } from "framer-motion";
import {
    Palette,
    Code,
    Workflow,
    Bot,
    Zap,
    Phone,
    PenTool
} from "lucide-react";


const services = [
    {
        icon: <Workflow className="h-8 w-8 text-primary" />,
        title: "Business Automation",
        description: "Streamline operations with n8n and Zapier workflows that run 24/7 without manual intervention."
    },
    {
        icon: <Code className="h-8 w-8 text-primary" />,
        title: "Web Development",
        description: "Custom, high-performance web applications built with Next.js, React, and modern technologies."
    },
    {
        icon: <Bot className="h-8 w-8 text-primary" />,
        title: "AI Agents",
        description: "Intelligent AI assistants that handle customer support, data processing, and complex tasks."
    },
    {
        icon: <Phone className="h-8 w-8 text-primary" />,
        title: "OpenCall Integration",
        description: "Advanced voice AI systems for automated outbound and inbound calling campaigns."
    },
    {
        icon: <Palette className="h-8 w-8 text-primary" />,
        title: "Web Design",
        description: "Ultra-modern, minimalistic designs that prioritize user experience and conversion."
    },
    {
        icon: <Zap className="h-8 w-8 text-primary" />,
        title: "Zapier / Make Expert",
        description: "Seamless integration between thousands of apps to create a unified ecosystem."
    },
    {
        icon: <PenTool className="h-8 w-8 text-primary" />,
        title: "Graphic Design",
        description: "Professional Adobe Photoshop services, branding materials, and visual assets including logos and marketing collaterals."
    }
];


export function Services() {
    return (
        <section id="services" className="py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
                    >
                        Our Expertise
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Comprehensive digital solutions designed to modernize your business infrastructure.
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
                            className="p-6 rounded-2xl border bg-card hover:bg-accent/5 transition-colors group"
                        >
                            <div className="mb-4 bg-primary/10 w-fit p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                            <p className="text-muted-foreground">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
