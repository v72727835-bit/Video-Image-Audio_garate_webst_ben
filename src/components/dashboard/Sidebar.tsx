"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { navItems } from "./navItems";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="px-2 py-3">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-gradient-to-r from-brand/20 to-indigo/10 text-ink ring-1 ring-brand/25"
                  : "text-muted hover:bg-white/[0.04] hover:text-ink"
              )}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  active ? "text-brand-light" : "text-faint group-hover:text-ink-soft"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div className="rounded-2xl border border-brand/25 bg-gradient-to-br from-brand/15 to-indigo/5 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-light" />
          <p className="text-sm font-semibold text-ink">
            {user?.plan === "free" ? "You're on Free" : `${cap(user?.plan)} plan`}
          </p>
        </div>
        <p className="mt-1 text-xs text-muted">
          Unlock premium models and higher credits.
        </p>
        <Button href="/dashboard/billing" size="sm" className="mt-3 w-full">
          Upgrade
        </Button>
      </div>
    </div>
  );
}

function cap(s?: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
