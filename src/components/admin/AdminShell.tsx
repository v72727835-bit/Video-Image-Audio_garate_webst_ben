"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ShieldCheck, Loader2 } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { cn } from "@/lib/cn";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setEmail(d.admin.email))
      .catch(() => {
        router.push("/admin");
      })
      .finally(() => setReady(true));
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <Loader2 className="h-6 w-6 animate-spin text-brand-light" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-surface/40 lg:block">
        <AdminSidebar />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          drawer ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            drawer ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setDrawer(false)}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-64 border-r border-line bg-surface transition-transform duration-300",
            drawer ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <button
            onClick={() => setDrawer(false)}
            className="absolute right-3 top-4 rounded-lg p-1.5 text-ink-soft hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
          <AdminSidebar onNavigate={() => setDrawer(false)} />
        </aside>
      </div>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-base/80 px-4 backdrop-blur-xl sm:px-6">
          <button
            onClick={() => setDrawer(true)}
            className="rounded-lg p-2 text-ink-soft hover:bg-white/5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand-light">
            <ShieldCheck className="h-3.5 w-3.5" /> Super Admin
          </span>
          <div className="flex-1" />
          <span className="hidden text-sm text-muted sm:block">{email}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-indigo text-xs font-bold text-white">
            SA
          </span>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
