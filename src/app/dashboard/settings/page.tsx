"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMe, logoutUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await dispatch(fetchMe());
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

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
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Manage your profile and account.
        </p>
      </div>

      {/* Profile */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Profile</h2>
        <div className="mt-5 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-light to-indigo text-lg font-bold text-white">
            {initials}
          </span>
          <div>
            <p className="font-medium text-ink">{user?.name}</p>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:max-w-md">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              Display name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-line bg-base/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand/50 focus:ring-2 focus:ring-brand/15"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              Email
            </label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm text-muted"
            />
          </div>
          <div>
            <Button onClick={save} disabled={saving} className="w-fit">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" /> Saved
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Account</h2>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-base/40 p-4">
          <div>
            <p className="text-sm font-medium text-ink">Sign out</p>
            <p className="text-xs text-muted">
              End your session on this device.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
