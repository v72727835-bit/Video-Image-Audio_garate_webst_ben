"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck, ExternalLink, LogOut } from "lucide-react";
import { adminNav } from "./adminNav";
import { cn } from "@/lib/cn";

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-2.5 px-2 pt-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-light via-brand to-indigo text-white">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-sm font-bold leading-tight text-ink">aivideocreat</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-light">
            Super Admin
          </p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pt-2">
        {adminNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
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
                  "h-[18px] w-[18px]",
                  active ? "text-brand-light" : "text-faint group-hover:text-ink-soft"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-line pt-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-white/[0.04] hover:text-ink"
        >
          <ExternalLink className="h-[18px] w-[18px] text-faint" /> View live site
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-danger hover:bg-danger/10"
        >
          <LogOut className="h-[18px] w-[18px]" /> Sign out
        </button>
      </div>
    </div>
  );
}
