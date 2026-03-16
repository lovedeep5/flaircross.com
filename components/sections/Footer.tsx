"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-background border-t py-12">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">

                    <div>
                        <h3 className="text-xl font-bold tracking-tighter mb-2">FlairCross</h3>
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} FlairCross Consultancy. All rights reserved.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">Company</span>
                        <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                            About
                        </Link>
                        <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                            Services
                        </Link>
                        <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                            Pricing
                        </Link>
                        <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                            Contact
                        </Link>
                        <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                            Blog
                        </Link>
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">Our Products</span>
                        <a href="https://n8nautomation.cloud" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            n8nautomation.cloud
                        </a>
                        <a href="https://vidtoreels.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            vidtoreels.com
                        </a>
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                        <span className="font-medium">Legal</span>
                        <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
