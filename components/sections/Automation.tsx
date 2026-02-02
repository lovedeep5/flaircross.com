"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
    "Custom n8n workflow development and hosting",
    "Zapier automation strategy and implementation",
    "OpenCall voice AI configuration",
    "Seamless API integrations across platforms",
    "Automated lead qualification and follow-up",
    "Data synchronization and processing pipelines"
];

export function Automation() {
    return (
        <section id="automation" className="py-24 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4 font-medium">
                                Automation First
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                                Work Smarter, Not Harder
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                We specialize in building sophisticated automation systems that handle repetitive tasks, allowing you to focus on high-value strategic work. Our expertise in n8n and Zapier enables us to connect virtually any software tools you use.
                            </p>
                        </motion.div>

                        <motion.ul
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid gap-4"
                        >
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span className="text-base">{feature}</span>
                                </li>
                            ))}
                        </motion.ul>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Button size="lg" asChild>
                                <Link href="#contact">
                                    Consult an Expert <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                    <div className="flex-1 relative w-full h-[400px] lg:h-[500px]">
                        {/* Abstract visual representation of automation */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-2xl blur-3xl" />
                        <div className="absolute inset-0 border border-border/50 bg-background/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-8 opacity-80">
                                {/* Simplified node graph visualization */}
                                <div className="h-16 w-16 bg-card border rounded-xl shadow-sm flex items-center justify-center animate-pulse">
                                    <div className="h-8 w-8 bg-blue-500 rounded-md" />
                                </div>
                                <div className="flex items-center justify-center">
                                    <div className="h-1 w-full bg-border relative">
                                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-[ping_1.5s_infinite]" />
                                    </div>
                                </div>
                                <div className="h-16 w-16 bg-card border rounded-xl shadow-sm flex items-center justify-center">
                                    <div className="h-8 w-8 bg-orange-500 rounded-md" />
                                </div>

                                <div className="col-span-3 flex justify-center h-16">
                                    <div className="w-1 h-full bg-border relative">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-[ping_2s_infinite]" />
                                    </div>
                                </div>

                                <div className="h-16 w-16 bg-card border rounded-xl shadow-sm flex items-center justify-center">
                                    <div className="h-8 w-8 bg-green-500 rounded-md" />
                                </div>
                                <div className="flex items-center justify-center">
                                    <div className="h-1 w-full bg-border" />
                                </div>
                                <div className="h-16 w-16 bg-card border rounded-xl shadow-sm flex items-center justify-center">
                                    <div className="h-8 w-8 bg-purple-500 rounded-md" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
