"use client";

import { useState } from "react";
import { Plus, Film, Clock, Camera, GripVertical, Play, Wand2 } from "lucide-react";
import { artGradient } from "@/lib/art";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const scenes = [
  { id: "s1", name: "Neon Alley", time: "Night", shots: 3, tone: "#8b5cf6" },
  { id: "s2", name: "Rooftop Chase", time: "Dusk", shots: 2, tone: "#22d3ee" },
  { id: "s3", name: "Safehouse", time: "Interior", shots: 2, tone: "#f472b6" },
];

const allShots = [
  { id: "1", scene: "s1", type: "Close-up", label: "Elara — face", dur: "4s", cam: "85mm", status: "Rendered" },
  { id: "2", scene: "s1", type: "Medium", label: "Walk into alley", dur: "6s", cam: "35mm", status: "Rendered" },
  { id: "3", scene: "s1", type: "Wide", label: "Alley establishing", dur: "8s", cam: "24mm", status: "Queued" },
  { id: "4", scene: "s2", type: "Medium", label: "Rooftop sprint", dur: "5s", cam: "35mm", status: "Rendered" },
  { id: "5", scene: "s2", type: "Wide", label: "Skyline leap", dur: "6s", cam: "16mm", status: "Draft" },
  { id: "6", scene: "s3", type: "Close-up", label: "Hands on console", dur: "3s", cam: "50mm", status: "Rendered" },
  { id: "7", scene: "s3", type: "Medium", label: "Reveal the map", dur: "5s", cam: "35mm", status: "Queued" },
];

const statusTone: Record<string, string> = {
  Rendered: "bg-teal/15 text-teal",
  Queued: "bg-amber/15 text-amber",
  Draft: "bg-faint/15 text-muted",
};

export default function StoryboardPage() {
  const [scene, setScene] = useState<string>("all");
  const shots = scene === "all" ? allShots : allShots.filter((s) => s.scene === scene);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Storyboard
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Plan your sequence shot by shot, then render the whole cut.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md">
            <Play className="h-4 w-4" /> Preview cut
          </Button>
          <Button size="md">
            <Wand2 className="h-4 w-4" /> Render sequence
          </Button>
        </div>
      </div>

      {/* Scene strip */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        <button
          onClick={() => setScene("all")}
          className={cn(
            "shrink-0 rounded-xl border px-4 py-3 text-left transition-colors",
            scene === "all" ? "border-brand/50 bg-brand/10" : "border-line bg-surface hover:border-brand/30"
          )}
        >
          <p className="text-sm font-semibold text-ink">All scenes</p>
          <p className="text-xs text-faint">{allShots.length} shots</p>
        </button>
        {scenes.map((s) => (
          <button
            key={s.id}
            onClick={() => setScene(s.id)}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
              scene === s.id ? "border-brand/50 bg-brand/10" : "border-line bg-surface hover:border-brand/30"
            )}
          >
            <span className="h-9 w-1 rounded-full" style={{ background: s.tone }} />
            <span>
              <span className="block text-sm font-semibold text-ink">{s.name}</span>
              <span className="block text-xs text-faint">
                {s.time} · {s.shots} shots
              </span>
            </span>
          </button>
        ))}
        <button className="flex shrink-0 items-center gap-2 rounded-xl border border-dashed border-line px-4 py-3 text-sm text-muted transition-colors hover:border-brand/40 hover:text-ink">
          <Plus className="h-4 w-4" /> Scene
        </button>
      </div>

      {/* Shot grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shots.map((shot, i) => (
          <div key={shot.id} className="card group overflow-hidden transition-all hover:border-brand/40">
            <div className="relative aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={artGradient("shot-" + shot.id, 480, 270)} alt={shot.label} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
                <Film className="h-3 w-3" /> {shot.type}
              </span>
              <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-black/55 px-2 py-0.5 text-[11px] text-white backdrop-blur">
                <Clock className="h-3 w-3" /> {shot.dur}
              </span>
              <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand/80 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <Play className="h-4 w-4" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 shrink-0 text-faint" />
                <p className="flex-1 truncate text-sm font-medium text-ink">
                  <span className="text-faint">{String(i + 1).padStart(2, "0")}</span> · {shot.label}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs text-muted">
                  <Camera className="h-3.5 w-3.5" /> {shot.cam}
                </span>
                <span className={cn("rounded-md px-2 py-0.5 text-[11px]", statusTone[shot.status])}>
                  {shot.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* add shot tile */}
        <button className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line text-muted transition-colors hover:border-brand/40 hover:text-ink">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand-light">
            <Plus className="h-5 w-5" />
          </span>
          <span className="text-sm font-medium">Add shot</span>
        </button>
      </div>

      {/* Timeline */}
      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink">Timeline</h2>
          <span className="text-xs text-faint">Total ~37s</span>
        </div>
        <div className="flex h-12 gap-1 overflow-hidden rounded-xl">
          {allShots.map((s, i) => {
            const tone = scenes.find((sc) => sc.id === s.scene)?.tone || "#8b5cf6";
            const span = parseInt(s.dur);
            return (
              <div
                key={s.id}
                className="flex items-center justify-center rounded-md text-[10px] font-medium text-white/90"
                style={{ flex: span, background: `linear-gradient(135deg, ${tone}cc, ${tone}77)` }}
                title={`${s.label} · ${s.dur}`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
