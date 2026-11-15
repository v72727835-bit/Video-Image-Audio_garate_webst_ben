"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Film,
  Zap,
  UserPlus,
  TrendingUp,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Donut } from "@/components/charts/Donut";
import { HBars } from "@/components/charts/HBars";
import { Bars } from "@/components/charts/Bars";

interface Stats {
  totalUsers: number;
  totalGen: number;
  newUsers24h: number;
  creditsInCirculation: number;
  creditsSpent: number;
  kind: { image: number; video: number; audio: number };
  plan: { free: number; starter: number; premium: number; business: number };
  signups: { date: string; count: number }[];
}

export default function AdminDashboard() {
  const [s, setS] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setS(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !s) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-light" />
      </div>
    );
  }

  const kpis = [
    { label: "Total users", value: s.totalUsers, icon: Users, tone: "#8b5cf6", sub: `+${s.newUsers24h} today` },
    { label: "Total renders", value: s.totalGen, icon: Film, tone: "#22d3ee", sub: "all time" },
    { label: "Credits in circulation", value: s.creditsInCirculation, icon: Zap, tone: "#fbbf24", sub: `${s.creditsSpent} spent` },
    { label: "New users (24h)", value: s.newUsers24h, icon: UserPlus, tone: "#2dd4bf", sub: "last 24 hours" },
  ];

  const signupBars = s.signups.slice(-7).map((d) => ({
    label: d.date.slice(5),
    value: d.count,
  }));

  const planBars = [
    { label: "Free", value: s.plan.free, color: "#8b5cf6" },
    { label: "Starter", value: s.plan.starter, color: "#22d3ee" },
    { label: "Premium", value: s.plan.premium, color: "#f472b6" },
    { label: "Business", value: s.plan.business, color: "#fbbf24" },
  ];

  const kindDonut = [
    { label: "Video", value: s.kind.video || 0, color: "#8b5cf6" },
    { label: "Image", value: s.kind.image || 0, color: "#22d3ee" },
    { label: "Audio", value: s.kind.audio || 0, color: "#fb7185" },
  ];
  const hasKind = kindDonut.some((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Platform overview
        </h1>
        <p className="mt-1.5 text-sm text-muted">Live metrics across the whole studio.</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card p-5">
            <div className="flex items-center justify-between">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${k.tone}22`, color: k.tone }}
              >
                <k.icon className="h-5 w-5" />
              </span>
              <TrendingUp className="h-4 w-4 text-teal" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-ink">
              {k.value.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-muted">{k.label}</p>
            <p className="mt-0.5 text-[11px] text-faint">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* charts row */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-3">
          <h2 className="mb-4 font-display text-base font-semibold text-ink">New sign-ups</h2>
          {signupBars.length ? (
            <Bars data={signupBars} height={200} />
          ) : (
            <p className="py-16 text-center text-sm text-muted">No sign-ups yet.</p>
          )}
        </div>
        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-semibold text-ink">Output mix</h2>
          {hasKind ? (
            <Donut data={kindDonut} />
          ) : (
            <p className="py-14 text-center text-sm text-muted">No renders yet.</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-semibold text-ink">Plan distribution</h2>
          <HBars data={planBars} />
        </div>
        <div className="card flex flex-col justify-between p-5 lg:col-span-3">
          <div>
            <h2 className="font-display text-base font-semibold text-ink">Manage</h2>
            <p className="text-xs text-muted">Jump into the areas you control.</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/admin/users" className="flex items-center justify-between rounded-xl border border-line bg-base/40 px-4 py-3 text-sm text-ink-soft transition-colors hover:border-brand/40">
              <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-brand-light" /> Manage users</span>
              <ArrowRight className="h-4 w-4 text-faint" />
            </Link>
            <Link href="/admin/content" className="flex items-center justify-between rounded-xl border border-line bg-base/40 px-4 py-3 text-sm text-ink-soft transition-colors hover:border-brand/40">
              <span className="inline-flex items-center gap-2"><Film className="h-4 w-4 text-cyan" /> Review content</span>
              <ArrowRight className="h-4 w-4 text-faint" />
            </Link>
            <Link href="/admin/plans" className="flex items-center justify-between rounded-xl border border-line bg-base/40 px-4 py-3 text-sm text-ink-soft transition-colors hover:border-brand/40">
              <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-amber" /> Plans & credits</span>
              <ArrowRight className="h-4 w-4 text-faint" />
            </Link>
            <Link href="/admin/settings" className="flex items-center justify-between rounded-xl border border-line bg-base/40 px-4 py-3 text-sm text-ink-soft transition-colors hover:border-brand/40">
              <span className="inline-flex items-center gap-2"><TrendingUp className="h-4 w-4 text-teal" /> Platform settings</span>
              <ArrowRight className="h-4 w-4 text-faint" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
