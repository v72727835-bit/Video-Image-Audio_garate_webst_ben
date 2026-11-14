"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const links = [
  { label: "Features", href: "#features" },
  { label: "Tools", href: "#tools" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2.5" : "py-4"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 sm:px-5 h-14 transition-all duration-300",
            scrolled
              ? "glass shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
              : "bg-transparent border border-transparent"
          )}
        >
          <Logo />

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3.5 py-2 text-sm text-muted hover:text-ink transition-colors rounded-lg"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button href="/login" variant="ghost" size="sm">
              Sign in
            </Button>
            <Button href="/signup" size="sm">
              Start free
            </Button>
          </div>

          <button
            className="md:hidden text-ink-soft p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-2 glass rounded-2xl p-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm text-ink-soft hover:text-ink rounded-lg hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Button href="/login" variant="outline" size="sm" className="flex-1">
                Sign in
              </Button>
              <Button href="/signup" size="sm" className="flex-1">
                Start free
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
