"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Clapperboard,
  ImageIcon,
  AudioLines,
  Zap,
  Sparkles,
  GalleryVerticalEnd,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGenerations } from "@/store/slices/studioSlice";
import { GenerationCard } from "@/components/dashboard/GenerationCard";

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

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Let&apos;s turn today&apos;s idea into something cinematic.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          label="Credits balance"
          value={user ? user.credits.toLocaleString() : "—"}
          accent="from-accent/20 to-brand/10 text-accent"
        />
        <StatCard
          icon={<GalleryVerticalEnd className="h-5 w-5" />}
          label="Total creations"
          value={String(items.length)}
          accent="from-brand/20 to-indigo/10 text-brand-light"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Current plan"
          value={cap(user?.plan) || "Free"}
          accent="from-indigo/20 to-brand/10 text-indigo"
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-faint">
          Start creating
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <ActionTile
            href="/dashboard/video"
            icon={<Clapperboard className="h-5 w-5" />}
            title="Text to Video"
            desc={`${videos} created`}
          />
          <ActionTile
            href="/dashboard/image"
            icon={<ImageIcon className="h-5 w-5" />}
            title="Text to Image"
            desc={`${images} created`}
          />
          <ActionTile
            href="/dashboard/audio"
            icon={<AudioLines className="h-5 w-5" />}
            title="Voice & Music"
            desc="Coming soon"
            soon
          />
        </div>
      </div>

      {/* Recent */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">
            Recent creations
          </h2>
          <Link
            href="/dashboard/gallery"
            className="inline-flex items-center gap-1 text-sm text-brand-light hover:text-brand"
          >
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
          <div className="card flex flex-col items-center px-6 py-14 text-center">
            <Sparkles className="h-8 w-8 text-brand-light" />
            <p className="mt-3 font-display text-lg font-semibold text-ink">
              Nothing here yet
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted">
              Your generated videos and images will show up here. Start with a
              prompt above.
            </p>
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

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent} ring-1 ring-white/5`}
      >
        {icon}
      </span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="font-display text-2xl font-bold text-ink">{value}</p>
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
        <span className="rounded-md bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
          Soon
        </span>
      ) : (
        <ArrowRight className="h-4 w-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-brand-light" />
      )}
    </Link>
  );
}

function cap(s?: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
