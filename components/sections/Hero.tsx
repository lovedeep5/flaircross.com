"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, RefreshCw, Cpu, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-28 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border bg-background/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8"
                >
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Accepting New Automation Projects
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 leading-tight"
                >
                    Stop Doing Busy Work. <br />
                    <span className="text-primary">Start Automating.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    We build custom <span className="font-semibold text-foreground">AI agents</span> and intelligent <span className="font-semibold text-foreground">n8n workflows</span> that replace manual data entry, handle customer support, and save you 20+ hours every week.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all" asChild>
                        <Link href="/contact">
                            Book a Strategy Call <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 px-8 text-base" asChild>
                        <Link href="/services">Explore Our Services</Link>
                    </Button>
                </motion.div>

                {/* Trust/Metric Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-12 flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-muted-foreground"
                >
                    <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <span>24/7 Operations</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span>40% Cost Reduction</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-primary" />
                        <span>Custom AI Models</span>
                    </div>
                </motion.div>

                {/* Tech Stack Icons Floating */}
                <div className="mt-16 flex justify-center gap-8 md:gap-16 grayscale opacity-60 hover:grayscale-0 transition-all duration-500">
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="flex flex-col items-center gap-2"
                    >
                        <Zap className="h-8 w-8 md:h-10 md:w-10" />
                        <span className="text-xs font-medium">Zapier</span>
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <RefreshCw className="h-8 w-8 md:h-10 md:w-10 text-orange-500" />
                        <span className="text-xs font-medium">n8n</span>
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <Cpu className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />
                        <span className="text-xs font-medium">AI Agents</span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
