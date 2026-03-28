"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, CreditCard, ShoppingBag, FileText, Settings, LogOut, Menu, X, Globe } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/portal/overview", icon: LayoutDashboard },
  { label: "Subscriptions", href: "/portal/subscriptions", icon: CreditCard },
  { label: "Orders", href: "/portal/orders", icon: ShoppingBag },
  { label: "Invoices", href: "/portal/invoices", icon: FileText },
  { label: "Settings", href: "/portal/settings", icon: Settings },
];

export function PortalNav({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tighter">
          <Globe className="h-5 w-5 text-primary" />
          FlairCross
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Client Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r bg-card">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b bg-card">
        <Link href="/" className="text-lg font-bold tracking-tighter">FlairCross</Link>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-accent">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-card border-r flex flex-col pt-16">
            <NavContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Mobile top padding */}
      <div className="lg:hidden h-16" />
    </>
  );
}
