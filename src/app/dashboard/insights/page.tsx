"use client";

import { TrendingUp, TrendingDown, Download, Sparkles } from "lucide-react";
import { LineArea } from "@/components/charts/LineArea";
import { HBars } from "@/components/charts/HBars";
import { Heatmap } from "@/components/charts/Heatmap";
import { Donut } from "@/components/charts/Donut";

const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
const series = [
  { name: "video", color: "#8b5cf6", data: [120, 180, 150, 240, 310, 372] },
  { name: "image", color: "#22d3ee", data: [220, 260, 300, 280, 360, 430] },
];

const models = [
  { label: "Leonardo Lightning XL", value: 1840, color: "#22d3ee" },
  { label: "Leonardo Motion 2.0", value: 1210, color: "#8b5cf6" },
  { label: "Phoenix Realism", value: 760, color: "#f472b6" },
  { label: "Anime Pastel", value: 430, color: "#fbbf24" },
  { label: "Director AI planner", value: 2150, color: "#2dd4bf" },
];

const prompts = [
  { text: "neon tokyo street, rain reflections, cinematic", runs: 142 },
  { text: "product shot, studio light, marble surface", runs: 118 },
  { text: "portrait, golden hour, 35mm film grain", runs: 96 },
  { text: "cyberpunk alley, volumetric fog, dolly shot", runs: 74 },
  { text: "minimal logo reveal, soft gradient bg", runs: 61 },
];

const stats = [
  { label: "Total renders", value: "4,218", delta: "+18.2%", up: true },
  { label: "Avg. render time", value: "8.4s", delta: "-1.1s", up: true },
  { label: "Credits spent", value: "38,640", delta: "+12.4%", up: false },
  { label: "Failed jobs", value: "0.7%", delta: "-0.3%", up: true },
];

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Analytics
          </h1>
          <p className="mt-1.5 text-sm text-muted">Deep insight into your creative output.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink-soft outline-none">
            <option>Last 6 months</option>
            <option>Last 30 days</option>
            <option>This year</option>
          </select>
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink-soft hover:border-brand/40">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* stat row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-xs text-muted">{s.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-ink">{s.value}</p>
            <p className={`mt-1 inline-flex items-center gap-1 text-xs ${s.up ? "text-teal" : "text-amber"}`}>
              {s.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      {/* big line chart */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-ink">Output over time</h2>
            <p className="text-xs text-muted">Renders per month by type</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5 text-ink-soft">
              <span className="h-2 w-2 rounded-full bg-brand" /> Video
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-soft">
              <span className="h-2 w-2 rounded-full bg-cyan" /> Image
            </span>
          </div>
        </div>
        <LineArea series={series} labels={months} height={250} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 font-display text-base font-semibold text-ink">Model usage</h2>
          <HBars data={models} />
        </div>
        <div className="card p-5">
          <h2 className="mb-1 font-display text-base font-semibold text-ink">Activity heatmap</h2>
          <p className="mb-4 text-xs text-muted">When you create, by hour and day</p>
          <Heatmap />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-3">
          <h2 className="mb-4 font-display text-base font-semibold text-ink">Top prompts</h2>
          <div className="space-y-2.5">
            {prompts.map((p, i) => (
              <div key={p.text} className="flex items-center gap-3 rounded-xl border border-line bg-base/40 px-4 py-3">
                <span className="font-display text-sm font-bold text-faint">{String(i + 1).padStart(2, "0")}</span>
                <Sparkles className="h-4 w-4 shrink-0 text-brand-light" />
                <p className="min-w-0 flex-1 truncate text-sm text-ink-soft">{p.text}</p>
                <span className="shrink-0 rounded-md bg-brand/10 px-2 py-0.5 text-xs text-brand-light">
                  {p.runs} runs
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-semibold text-ink">Aspect ratios</h2>
          <Donut
            data={[
              { label: "16:9", value: 46, color: "#8b5cf6" },
              { label: "9:16", value: 31, color: "#22d3ee" },
              { label: "1:1", value: 18, color: "#f472b6" },
              { label: "4:3", value: 5, color: "#fbbf24" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
