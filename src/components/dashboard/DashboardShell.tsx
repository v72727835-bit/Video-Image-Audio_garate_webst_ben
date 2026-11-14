"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMe } from "@/store/slices/authSlice";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/cn";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.auth.status);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    if (status === "idle") dispatch(fetchMe());
  }, [status, dispatch]);

  return (
    <div className="min-h-screen bg-base">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-line bg-surface/40 lg:block">
        <Sidebar />
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
            "absolute inset-y-0 left-0 w-72 border-r border-line bg-surface transition-transform duration-300",
            drawer ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <button
            onClick={() => setDrawer(false)}
            className="absolute right-3 top-4 rounded-lg p-1.5 text-ink-soft hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
          <Sidebar onNavigate={() => setDrawer(false)} />
        </aside>
      </div>

      {/* Main */}
      <div className="lg:pl-72">
        <Topbar onMenu={() => setDrawer(true)} />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
