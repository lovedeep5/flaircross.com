"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, RefreshCw, Cpu } from "lucide-react";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
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
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                    Accelerating Business with Automation & AI
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
                >
                    Streamline Your Workflow, <br />
                    <span className="text-primary">Amplify Your Growth</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
                >
                    We build custom web applications and intelligent automation systems using n8n, Zapier, and AI agents to save you time and scale your operations.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Button size="lg" className="h-12 px-8 text-base" asChild>
                        <Link href="#contact">
                            Start Automating <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 px-8 text-base" asChild>
                        <Link href="#portfolio">View Our Work</Link>
                    </Button>
                </motion.div>

                {/* Tech Stack Icons Floating */}
                <div className="mt-20 flex justify-center gap-8 md:gap-16 grayscale opacity-70">
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="flex flex-col items-center gap-2"
                    >
                        <Zap className="h-8 w-8 md:h-12 md:w-12" />
                        <span className="text-xs font-semibold">Zapier</span>
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <RefreshCw className="h-8 w-8 md:h-12 md:w-12" />
                        <span className="text-xs font-semibold">n8n</span>
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <Cpu className="h-8 w-8 md:h-12 md:w-12" />
                        <span className="text-xs font-semibold">AI Agents</span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
