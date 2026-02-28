"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        quote: "FlairCross transformed our lead process. We went from manually copying data to a fully automated n8n pipeline. It saves us 20+ hours every week.",
        author: "Sarah J.",
        role: "COO, Logistics Firm"
    },
    {
        quote: "The AI Support Agent they built handles 80% of our incoming queries instantly. Our support team can finally focus on high-value tickets.",
        author: "Michael T.",
        role: "Founder, SaaS Startup"
    },
    {
        quote: "We were drowning in Zapier bills. FlairCross migrated us to a self-hosted n8n infrastructure that cut our automation costs by 60%.",
        author: "Elena R.",
        role: "Agency Owner"
    }
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-muted/20">
            <div className="container px-4 md:px-6 mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-16">
                    Real Results, Real ROI
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-card p-8 rounded-2xl border relative hover:shadow-md transition-shadow"
                        >
                            <Quote className="h-10 w-10 text-primary/20 absolute top-6 left-6" />
                            <p className="relative z-10 text-lg text-muted-foreground mb-6 pt-6 italic">
                                &ldquo;{item.quote}&rdquo;
                            </p>
                            <div className="border-t pt-4">
                                <div className="font-semibold text-foreground">{item.author}</div>
                                <div className="text-sm text-primary font-medium">{item.role}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
