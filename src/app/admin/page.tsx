"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 aurora" />
      <div className="absolute inset-0 -z-10 grid-noise opacity-50" />
      <div className="absolute left-1/2 top-24 -z-10 h-72 w-[520px] -translate-x-1/2 rounded-full bg-brand/15 blur-[120px]" />

      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>

        <div className="card p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-light via-brand to-indigo text-white shadow-[0_8px_24px_-8px_rgba(139,92,246,0.9)]">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-xl font-bold text-ink">Super Admin</h1>
              <p className="text-xs text-muted">Restricted control panel</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-soft">Admin email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aivideocreat.live"
                  autoComplete="username"
                  required
                  className="w-full rounded-xl border border-line bg-base/60 py-3 pl-10 pr-4 text-sm text-ink placeholder:text-faint outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-soft">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-line bg-base/60 py-3 pl-10 pr-11 text-sm text-ink placeholder:text-faint outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-ink-soft"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-sheen flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-light via-brand to-indigo text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgba(139,92,246,0.9)] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Enter control panel
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-faint">
          Protected area · all actions are logged
        </p>
      </div>
    </div>
  );
}
