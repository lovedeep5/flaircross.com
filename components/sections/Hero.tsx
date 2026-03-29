"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, RefreshCw, Cpu, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-28 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="container relative z-10 px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                {/* Left: Text content */}
                <div className="flex flex-col items-start text-left">
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
                        className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 leading-tight"
                    >
                        Stop Doing Busy Work. <br />
                        <span className="text-primary">Start Automating.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-muted-foreground mb-10 leading-relaxed"
                    >
                        We build custom <span className="font-semibold text-foreground">AI agents</span> and intelligent <span className="font-semibold text-foreground">n8n workflows</span> that replace manual data entry, handle customer support, and save you 20+ hours every week.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
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
                        className="mt-12 flex flex-wrap gap-6 text-sm text-muted-foreground"
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
                </div>

                {/* Right: Hero image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="hidden md:block relative"
                >
                    <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl scale-90 opacity-50" />
                    <Image
                        src="/hero-automation.jpg"
                        alt="AI automation workflow visualization"
                        width={600}
                        height={600}
                        className="relative rounded-3xl shadow-2xl border border-primary/20 w-full"
                        priority
                    />
                </motion.div>
            </div>
        </section>
    );
}
