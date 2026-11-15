"use client";

import { useState } from "react";
import { Upload, Search, Image as ImageIcon, Film, Music, Download, MoreVertical, HardDrive } from "lucide-react";
import { artGradient } from "@/lib/art";
import { cn } from "@/lib/cn";

type Kind = "image" | "video" | "audio";
const assets: { id: string; kind: Kind; name: string; size: string }[] = [
  { id: "a1", kind: "image", name: "elara_closeup_01", size: "2.4 MB" },
  { id: "a2", kind: "video", name: "neon_alley_wide", size: "18.1 MB" },
  { id: "a3", kind: "image", name: "product_bottle_marble", size: "1.9 MB" },
  { id: "a4", kind: "image", name: "rooftop_dusk_v3", size: "3.1 MB" },
  { id: "a5", kind: "video", name: "skyline_leap", size: "24.6 MB" },
  { id: "a6", kind: "audio", name: "ambient_rain_loop", size: "4.8 MB" },
  { id: "a7", kind: "image", name: "portrait_golden_hour", size: "2.2 MB" },
  { id: "a8", kind: "video", name: "logo_reveal_soft", size: "9.3 MB" },
  { id: "a9", kind: "image", name: "cyberpunk_alley_fog", size: "2.7 MB" },
  { id: "a10", kind: "audio", name: "synth_score_01", size: "6.1 MB" },
  { id: "a11", kind: "image", name: "safehouse_console", size: "2.0 MB" },
  { id: "a12", kind: "video", name: "map_reveal_cut", size: "12.9 MB" },
];

const tabs: { key: Kind | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "image", label: "Images" },
  { key: "video", label: "Videos" },
  { key: "audio", label: "Audio" },
];

const kindIcon = { image: ImageIcon, video: Film, audio: Music };
const kindTone = { image: "#22d3ee", video: "#8b5cf6", audio: "#fb7185" };

export default function AssetsPage() {
  const [tab, setTab] = useState<Kind | "all">("all");
  const list = tab === "all" ? assets : assets.filter((a) => a.kind === tab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Assets</h1>
          <p className="mt-1.5 text-sm text-muted">Every file you&apos;ve created or uploaded, organised.</p>
        </div>
        <button className="btn-sheen inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-brand-light via-brand to-indigo px-5 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgba(139,92,246,0.9)]">
          <Upload className="h-4 w-4" /> Upload
        </button>
      </div>

      {/* storage */}
      <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand-light">
            <HardDrive className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted">Storage used</p>
            <p className="font-display text-lg font-bold text-ink">
              12.4 GB <span className="text-sm font-normal text-faint">/ 50 GB</span>
            </p>
          </div>
        </div>
        <div className="flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full w-[25%] rounded-full bg-gradient-to-r from-brand-light to-indigo" />
          </div>
          <div className="mt-2 flex gap-4 text-[11px] text-faint">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan" /> Images 5.1 GB</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" /> Videos 6.6 GB</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose" /> Audio 0.7 GB</span>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-full border border-line bg-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                tab === t.key ? "bg-gradient-to-r from-brand-light to-indigo text-white" : "text-muted hover:text-ink"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            placeholder="Search assets…"
            className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-faint outline-none focus:border-brand/50"
          />
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((a) => {
          const Icon = kindIcon[a.kind];
          return (
            <div key={a.id} className="card group overflow-hidden transition-all hover:-translate-y-0.5 hover:border-brand/40">
              <div className="relative aspect-square overflow-hidden">
                {a.kind === "audio" ? (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose/20 to-brand/10">
                    <Music className="h-10 w-10 text-rose/70" />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={artGradient(a.id, 360, 360)} alt={a.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                <span
                  className="absolute left-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-md bg-black/50 backdrop-blur"
                  style={{ color: kindTone[a.kind] }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded-lg bg-white/15 p-1.5 text-white backdrop-blur hover:bg-white/25">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded-lg bg-white/15 p-1.5 text-white backdrop-blur hover:bg-white/25">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-ink">{a.name}</p>
                <p className="text-xs text-faint">{a.size}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
