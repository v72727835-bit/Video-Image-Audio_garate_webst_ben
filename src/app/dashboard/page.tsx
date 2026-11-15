"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Clapperboard,
  ImageIcon,
  AudioLines,
  Zap,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Cpu,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGenerations } from "@/store/slices/studioSlice";
import { GenerationCard } from "@/components/dashboard/GenerationCard";
import { Gauge } from "@/components/charts/Gauge";
import { Sparkline } from "@/components/charts/Sparkline";
import { Bars } from "@/components/charts/Bars";
import { Donut } from "@/components/charts/Donut";
import { GenerationFlow } from "@/components/charts/GenerationFlow";

const weekly = [
  { label: "Mon", value: 32 },
  { label: "Tue", value: 48 },
  { label: "Wed", value: 41 },
  { label: "Thu", value: 67 },
  { label: "Fri", value: 58 },
  { label: "Sat", value: 74 },
  { label: "Sun", value: 52 },
];
const spend = [120, 180, 150, 240, 210, 300, 280, 360, 410];
const activity = [40, 55, 48, 72, 66, 90, 84, 110, 102];

const engines = [
  { name: "Leonardo · Lightning XL", tag: "Images", health: "Operational", ok: 2, warn: 0, load: 72, color: "#22d3ee" },
  { name: "Leonardo · Motion 2.0", tag: "Video", health: "Operational", ok: 2, warn: 0, load: 58, color: "#8b5cf6" },
  { name: "Director AI · Planner", tag: "Routing", health: "High demand", ok: 1, warn: 1, load: 91, color: "#fbbf24" },
  { name: "Voice Engine", tag: "Audio", health: "Connecting", ok: 0, warn: 1, load: 12, color: "#fb7185" },
];

export default function OverviewPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { items, loading } = useAppSelector((s) => s.studio);

  useEffect(() => {
    dispatch(fetchGenerations("all"));
  }, [dispatch]);

  const firstName = user?.name?.split(" ")[0] || "there";
  const videos = items.filter((i) => i.kind === "video").length;
  const images = items.filter((i) => i.kind === "image").length;
  const donut = [
    { label: "Video", value: Math.max(videos, 3), color: "#8b5cf6" },
    { label: "Image", value: Math.max(images, 6), color: "#22d3ee" },
    { label: "Audio", value: 1, color: "#fb7185" },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Here&apos;s your creative studio at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-1.5 text-xs text-teal">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-teal" /> Live system health
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card flex items-center justify-between p-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Activity className="h-4 w-4 text-brand-light" /> Creative score
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-ink">86</p>
            <p className="mt-1 text-xs text-teal">▲ 4.2 vs last week</p>
          </div>
          <Gauge value={86} size={130} />
        </div>

        <StatSpark
          icon={<Zap className="h-4 w-4 text-accent" />}
          label="Credits used"
          value={(user ? 1500 - user.credits : 320).toLocaleString()}
          delta="▲ 12.4%"
          data={spend}
          color="#a78bfa"
        />
        <StatSpark
          icon={<TrendingUp className="h-4 w-4 text-cyan" />}
          label="Render success rate"
          value="97.3%"
          delta="▲ 1.8%"
          data={activity}
          color="#22d3ee"
        />
      </div>

      {/* Flow + bars */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-ink">Generation flow</h2>
              <p className="text-xs text-muted">How your prompts move through the engine</p>
            </div>
            <span className="rounded-lg border border-line px-2.5 py-1 text-xs text-muted">
              This month
            </span>
          </div>
          <GenerationFlow />
        </div>

        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-ink">Weekly output</h2>
              <p className="text-xs text-muted">Renders per day</p>
            </div>
            <span className="font-display text-xl font-bold text-ink">372</span>
          </div>
          <Bars data={weekly} height={190} />
        </div>
      </div>

      {/* Donut + engines */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-semibold text-ink">Output mix</h2>
          <Donut data={donut} />
        </div>

        <div className="card p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink">Engine status</h2>
            <Link href="/dashboard/billing" className="text-xs text-brand-light hover:text-brand">
              Manage
            </Link>
          </div>
          <div className="space-y-2.5">
            {engines.map((e) => (
              <div
                key={e.name}
                className="flex items-center gap-3 rounded-xl border border-line bg-base/40 px-3.5 py-3"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: `${e.color}22`, color: e.color }}
                >
                  <Cpu className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{e.name}</p>
                  <p className="text-xs text-faint">{e.tag}</p>
                </div>
                <div className="hidden w-28 sm:block">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${e.load}%`, background: e.color }}
                    />
                  </div>
                  <p className="mt-1 text-right text-[10px] text-faint">{e.load}% load</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] ${
                    e.warn ? "bg-amber/10 text-amber" : "bg-teal/10 text-teal"
                  }`}
                >
                  {e.warn ? (
                    <AlertTriangle className="h-3 w-3" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                  {e.health}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <ActionTile href="/dashboard/video" icon={<Clapperboard className="h-5 w-5" />} title="Text to Video" desc={`${videos} created`} />
        <ActionTile href="/dashboard/image" icon={<ImageIcon className="h-5 w-5" />} title="Text to Image" desc={`${images} created`} />
        <ActionTile href="/dashboard/audio" icon={<AudioLines className="h-5 w-5" />} title="Voice & Music" desc="Coming soon" soon />
      </div>

      {/* Recent */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">
            Recent creations
          </h2>
          <Link href="/dashboard/gallery" className="inline-flex items-center gap-1 text-sm text-brand-light hover:text-brand">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton aspect-[4/3] rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="card px-6 py-10 text-center text-sm text-muted">
            No creations yet — start with Text to Video or Text to Image.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 6).map((g) => (
              <GenerationCard key={g._id} gen={g} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatSpark({
  icon,
  label,
  value,
  delta,
  data,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  data: number[];
  color: string;
}) {
  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-center gap-2 text-xs text-muted">
        {icon} {label}
      </div>
      <div className="mt-2 flex items-end justify-between">
        <p className="font-display text-3xl font-bold text-ink">{value}</p>
        <p className="text-xs text-teal">{delta}</p>
      </div>
      <div className="mt-3">
        <Sparkline data={data} color={color} height={56} />
      </div>
    </div>
  );
}

function ActionTile({
  href,
  icon,
  title,
  desc,
  soon,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  soon?: boolean;
}) {
  return (
    <Link
      href={href}
      className="card group flex items-center justify-between p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand-light">
          {icon}
        </span>
        <div>
          <p className="font-medium text-ink">{title}</p>
          <p className="text-xs text-muted">{desc}</p>
        </div>
      </div>
      {soon ? (
        <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">Soon</span>
      ) : (
        <ArrowUpRight className="h-4 w-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-brand-light" />
      )}
    </Link>
  );
}
