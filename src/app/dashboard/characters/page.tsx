"use client";

import { Plus, Sparkles, Layers, Clock, MoreHorizontal, Wand2 } from "lucide-react";
import { artGradient } from "@/lib/art";
import { Button } from "@/components/ui/Button";

const characters = [
  { name: "Elara", version: "v4.2", traits: ["Dramatic", "20s", "Cyberpunk"], scenes: 18, tone: "#8b5cf6" },
  { name: "Kai Renn", version: "v2.1", traits: ["Stoic", "30s", "Noir"], scenes: 11, tone: "#22d3ee" },
  { name: "Mira", version: "v1.0", traits: ["Warm", "Portrait", "Natural"], scenes: 7, tone: "#f472b6" },
  { name: "Orion", version: "v3.3", traits: ["Heroic", "Sci-fi", "Rugged"], scenes: 14, tone: "#2dd4bf" },
  { name: "Lumen", version: "v1.4", traits: ["Ethereal", "Fantasy", "Soft"], scenes: 5, tone: "#fbbf24" },
  { name: "Vex", version: "v2.8", traits: ["Edgy", "Anime", "Bold"], scenes: 9, tone: "#fb7185" },
];

export default function CharactersPage() {
  const featured = characters[0];
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Characters
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Reusable identities that stay consistent across every scene.
          </p>
        </div>
        <Button size="md">
          <Plus className="h-4 w-4" /> Create character
        </Button>
      </div>

      {/* Featured */}
      <div className="card relative overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[320px_1fr]">
          <div className="relative h-56 md:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={artGradient("elara-portrait", 640, 640)} alt="Elara" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface md:bg-gradient-to-l" />
          </div>
          <div className="p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[11px] text-brand-light">
              <Sparkles className="h-3 w-3" /> Featured identity
            </span>
            <h2 className="font-display mt-3 text-2xl font-bold text-ink">
              {featured.name} <span className="text-base font-normal text-muted">{featured.version}</span>
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted">
              A dramatic cyberpunk lead locked across 18 scenes. Identity, wardrobe and
              lighting stay consistent every render.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {featured.traits.map((t) => (
                <span key={t} className="rounded-lg border border-line bg-base/50 px-2.5 py-1 text-xs text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <Button size="sm">
                <Wand2 className="h-4 w-4" /> Use in a scene
              </Button>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                <Layers className="h-3.5 w-3.5" /> {featured.scenes} scenes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-faint">All characters</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {characters.map((c) => (
            <div
              key={c.name}
              className="card group overflow-hidden transition-all hover:-translate-y-1 hover:border-brand/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artGradient(c.name + "-char", 480, 360)}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent" />
                <span className="absolute left-3 top-3 rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
                  {c.version}
                </span>
                <button className="absolute right-3 top-3 rounded-lg bg-black/40 p-1.5 text-white/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-ink">{c.name}</h3>
                  <span className="inline-flex items-center gap-1 text-xs text-faint">
                    <Clock className="h-3 w-3" /> {c.scenes}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.traits.map((t) => (
                    <span
                      key={t}
                      className="rounded-md px-2 py-0.5 text-[11px]"
                      style={{ background: `${c.tone}1a`, color: c.tone }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
