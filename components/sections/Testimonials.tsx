"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        quote: "FlairCross completely transformed our internal operations. The n8n workflows they built are saving us 20 hours a week.",
        author: "Sarah J.",
        role: "COO, Logistics Firm"
    },
    {
        quote: "The web design is stunning and the performance is incredible. Our conversion rate jumped by 40% after the relaunch.",
        author: "Michael T.",
        role: "Founder, Tech Startup"
    },
    {
        quote: "Professional, responsive, and truly expert in automation. They solved problems we didn’t even know we had.",
        author: "Elena R.",
        role: "Marketing Director"
    }
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-muted/20">
            <div className="container px-4 md:px-6 mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-16">
                    Client Success Stories
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-card p-8 rounded-2xl border relative"
                        >
                            <Quote className="h-10 w-10 text-primary/20 absolute top-6 left-6" />
                            <p className="relative z-10 text-lg text-muted-foreground mb-6 pt-6">
                                &ldquo;{item.quote}&rdquo;
                            </p>
                            <div>
                                <div className="font-semibold">{item.author}</div>
                                <div className="text-sm text-primary">{item.role}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
