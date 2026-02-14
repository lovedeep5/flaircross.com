"use client";

export function Footer() {
    return (
        <footer className="bg-background border-t py-12">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold tracking-tighter mb-2">FlairCross</h3>
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} FlairCross Consultants. All rights reserved.
                        </p>
                    </div>

                    {/* <nav className="flex items-center gap-6">
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">LinkedIn</span>
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                    </nav> */}
                </div>
            </div>
        </footer>
    );
}
