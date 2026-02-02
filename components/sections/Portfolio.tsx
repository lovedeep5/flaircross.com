"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Note: User needs to provide images, using placeholders if none

const projects = [
    {
        title: "E-Commerce Automation Suite",
        category: "Automation • n8n",
        description: "Full-scale order processing and inventory management automation for a Shopify store, reducing manual work by 80%.",
        image: "/placeholder-project-1.jpg" // Placeholder
    },
    {
        title: "SaaS Dashboard Redesign",
        category: "Web Design • Next.js",
        description: "Modern, dark-mode dashboard for a fintech startup with real-time data visualization and smooth interactions.",
        image: "/placeholder-project-2.jpg" // Placeholder
    },
    {
        title: "AI Customer Support Agent",
        category: "AI • OpenCall",
        description: "Voice-enabled AI assistant for a healthcare provider, handling appointment scheduling and FAQs.",
        image: "/placeholder-project-3.jpg" // Placeholder
    }
];

export function Portfolio() {
    return (
        <section id="portfolio" className="py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                            Featured Work
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            A selection of projects where design meets automation.
                        </p>
                    </div>
                    {/* <Button variant="outline" asChild>
            <Link href="/portfolio">View All Projects</Link>
          </Button> */}
                </div>

                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-2xl bg-muted/20 border-dashed">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <ExternalLink className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Projects Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md">
                        We are currently curating our latest work to showcase. Check back soon for updates.
                    </p>
                </div>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl border bg-card"
                        >
                            <div className="aspect-video bg-muted relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-6xl font-black select-none">
                                    {index + 1}
                                </div>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Link href="#" className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-background text-foreground transition-transform hover:scale-110">
                                        <ExternalLink className="h-5 w-5" />
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
                                    {project.category}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {project.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div> */}
            </div>
        </section>
    );
}
