"use client";

import { motion } from "framer-motion";

const technologies = [
    "Next.js", "React", "Tailwind CSS", "TypeScript",
    "n8n", "Zapier", "OpenCall", "Python",
    "Node.js", "PostgreSQL", "OpenAI", "Supabase"
];

export function TechStack() {
    return (
        <section className="py-16 border-y bg-background/50 backdrop-blur-sm">
            <div className="container px-4 md:px-6 mx-auto">
                <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
                    Powered by Modern Technologies
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 md:gap-x-12">
                    {technologies.map((tech, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="text-lg md:text-xl font-bold text-foreground/80 hover:text-primary transition-colors cursor-default"
                        >
                            {tech}
                        </motion.span>
                    ))}
                </div>
            </div>
        </section>
    );
}
