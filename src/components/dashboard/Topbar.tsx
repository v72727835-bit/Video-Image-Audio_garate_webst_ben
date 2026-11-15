"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Zap, LogOut, User as UserIcon, ChevronDown, Search, Bell } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await dispatch(logoutUser());
    router.push("/login");
    router.refresh();
  }

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-base/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-ink-soft hover:bg-white/5 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative hidden flex-1 max-w-md sm:block">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
        <input
          placeholder="Search creations, characters, assets…"
          className="h-10 w-full rounded-xl border border-line bg-surface/60 pl-10 pr-16 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-brand/50 focus:ring-2 focus:ring-brand/15"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-line bg-base px-1.5 py-0.5 text-[10px] text-faint">
          ⌘K
        </kbd>
      </div>

      <div className="flex-1 sm:hidden" />

      {/* Notifications */}
      <button className="relative hidden rounded-xl border border-line bg-surface p-2.5 text-ink-soft transition-colors hover:border-brand/40 sm:block">
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink ring-2 ring-base" />
      </button>

      {/* Credits */}
      <Link
        href="/dashboard/billing"
        className="flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-sm transition-colors hover:border-brand/40"
      >
        <Zap className="h-4 w-4 text-accent" />
        <span className="font-semibold text-ink">
          {user ? user.credits.toLocaleString() : "—"}
        </span>
        <span className="hidden text-muted sm:inline">credits</span>
      </Link>

      {/* User */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 transition-colors hover:border-brand/40"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-indigo text-xs font-bold text-white">
            {initials}
          </span>
          <ChevronDown className="h-4 w-4 text-muted" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-elevated shadow-2xl">
              <div className="border-b border-line p-4">
                <p className="truncate text-sm font-semibold text-ink">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-muted">{user?.email}</p>
              </div>
              <div className="p-1.5">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-white/5"
                >
                  <UserIcon className="h-4 w-4" /> Profile & settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger/10"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
