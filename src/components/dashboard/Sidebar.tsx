"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ChevronsUpDown, Clapperboard } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { navGroups, type NavItem } from "./navItems";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

function badgeClass(badge: string) {
  switch (badge) {
    case "New":
      return "bg-teal/15 text-teal";
    case "Pro":
      return "bg-gradient-to-r from-amber/20 to-pink/20 text-amber";
    case "Beta":
      return "bg-cyan/15 text-cyan";
    default:
      return "bg-accent/15 text-accent";
  }
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useAppSelector((s) => s.auth.user);

  const isActive = (item: NavItem) =>
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href);

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="px-2 pt-2">
        <Logo />
      </div>

      {/* Workspace switcher */}
      <button className="group flex items-center gap-2.5 rounded-xl border border-line bg-base/50 px-3 py-2.5 text-left transition-colors hover:border-brand/40">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-indigo text-white">
          <Clapperboard className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ink">Cyber-Punk</span>
          <span className="block text-[11px] text-faint">Studio workspace</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 text-faint transition-colors group-hover:text-ink-soft" />
      </button>

      {/* Grouped nav */}
      <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-1.5 text-sm transition-all",
                      active
                        ? "bg-gradient-to-r from-brand/20 to-indigo/5 text-ink"
                        : "text-muted hover:bg-white/[0.04] hover:text-ink"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand-light" />
                    )}
                    <item.icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0",
                        active ? "text-brand-light" : "text-faint group-hover:text-ink-soft"
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold", badgeClass(item.badge))}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Upgrade card */}
      <div className="rounded-2xl border border-brand/25 bg-gradient-to-br from-brand/15 to-indigo/5 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-light" />
          <p className="text-sm font-semibold text-ink">
            {user?.plan === "free" ? "You're on Free" : `${cap(user?.plan)} plan`}
          </p>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-base">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-light to-indigo"
            style={{ width: `${Math.min(100, ((user?.credits ?? 0) / 1500) * 100)}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-muted">
          {user ? user.credits.toLocaleString() : "—"} credits left
        </p>
        <Button href="/dashboard/billing" size="sm" className="mt-3 w-full">
          Upgrade plan
        </Button>
      </div>
    </div>
  );
}

function cap(s?: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
