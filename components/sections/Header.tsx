"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

const navItems = [
    { name: "Services", href: "/services" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
];

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleSignOut() {
        await supabase.auth.signOut();
        setUserMenuOpen(false);
        window.location.href = "/";
    }

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300",
                scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
            )}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold tracking-tighter">
                        FlairCross
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                        {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border hover:bg-accent transition-colors"
                                >
                                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                        {(user.email?.[0] ?? "U").toUpperCase()}
                                    </span>
                                    Portal
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-44 bg-background border rounded-xl shadow-lg py-1 text-sm z-50">
                                        <Link href="/portal/overview" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-accent transition-colors">My Portal</Link>
                                        <Link href="/portal/subscriptions" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-accent transition-colors">Subscriptions</Link>
                                        <Link href="/portal/settings" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-accent transition-colors">Settings</Link>
                                        <hr className="my-1 border-border" />
                                        <button onClick={handleSignOut} className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-red-500">Sign Out</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button variant="outline" asChild>
                                <Link href="/auth/login">Sign In</Link>
                            </Button>
                        )}
                        <Button asChild>
                            <Link href="/contact">Get Started</Link>
                        </Button>
                        <ModeToggle />
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-lg font-medium py-2 border-b border-border/50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {user ? (
                                <>
                                    <Link href="/portal/overview" className="text-lg font-medium py-2 border-b border-border/50" onClick={() => setIsOpen(false)}>My Portal</Link>
                                    <button onClick={() => { handleSignOut(); setIsOpen(false); }} className="text-left text-lg font-medium py-2 text-red-500">Sign Out</button>
                                </>
                            ) : (
                                <Link href="/auth/login" className="text-lg font-medium py-2 border-b border-border/50" onClick={() => setIsOpen(false)}>Sign In</Link>
                            )}
                            <Button asChild className="w-full mt-2">
                                <Link href="/contact" onClick={() => setIsOpen(false)}>
                                    Get Started
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
