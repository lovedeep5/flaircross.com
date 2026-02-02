"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export function About() {
    return (
        <section id="about" className="py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex-1"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                            Why Choose FlairCross?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6">
                            We don't just build websites; we build digital engines for growth. Our unique blend of high-end design and complex automation expertise sets us apart.
                        </p>
                        <div className="space-y-4 mb-8">
                            {[
                                "Expertise in both Code and No-Code solutions",
                                "Focus on ROI and Operation Efficiency",
                                "Production-ready, scalable architecture",
                                "Dedicated support and maintenance"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Check className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="#contact">Let's Talk Business</Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex-1 w-full"
                    >
                        <div className="relative aspect-square md:aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-secondary border flex items-center justify-center">
                            <div className="text-center p-8">
                                <h3 className="text-4xl font-bold text-primary mb-2">100+</h3>
                                <p className="text-muted-foreground">Projects Delivered</p>

                                <div className="my-8 h-px w-full bg-border" />

                                <h3 className="text-4xl font-bold text-primary mb-2">24/7</h3>
                                <p className="text-muted-foreground">Automated Systems Running</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
